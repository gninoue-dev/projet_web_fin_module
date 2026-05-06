<?php
$session_id = $_GET['session_id'] ?? '';

if (!$session_id) {
    echo json_encode(['error' => 'Session manquante']);
    exit;
}

try {
    // Récupère session
    $stmt = $pdo->prepare("SELECT examen_id, etudiant_id FROM sessions_examen WHERE id = ?");
    $stmt->execute([$session_id]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$session) {
        echo json_encode(['error' => 'Session introuvable']);
        exit;
    }
    
    // Compte réponses
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM reponses WHERE examen_id = ?");
    $stmt->execute([$session['examen_id']]);
    $total_questions = $stmt->fetch()['total'];
    
    // Compte anomalies
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM surveillance WHERE examen_id = ?");
    $stmt->execute([$session['examen_id']]);
    $anomalies = $stmt->fetch()['total'];
    
    // Calcul score et fiabilité
    $score = max(0, 100 - ($total_questions * 5));
    $fiabilite = max(0, 100 - ($anomalies * 10));
    
    // Sauvegarde rapport
    $sql = "INSERT INTO rapports (etudiant_id, examen_id, score_final, indice_fiabilite, resume_anomalies)
            VALUES (:etudiant_id, :examen_id, :score, :fiabilite, :resume)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':etudiant_id' => $session['etudiant_id'],
        ':examen_id' => $session['examen_id'],
        ':score' => $score,
        ':fiabilite' => $fiabilite,
        ':resume' => "Anomalies: $anomalies"
    ]);

    echo json_encode([
        'success' => true,
        'score' => $score,
        'anomalies' => $anomalies,
        'fiabilite' => $fiabilite
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
