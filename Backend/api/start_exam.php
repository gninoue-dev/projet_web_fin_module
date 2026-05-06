<?php
$etudiant_id = $_POST['etudiant_id'] ?? '';
$examen_id = $_POST['examen_id'] ?? '';

if (!$etudiant_id || !$examen_id) {
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

try {
    // Créer session examen
    $sql = "INSERT INTO sessions_examen (etudiant_id, examen_id, statut, date_debut)
            VALUES (:etudiant_id, :examen_id, 'active', NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':etudiant_id' => $etudiant_id,
        ':examen_id' => $examen_id
    ]);
    
    $session_id = $pdo->lastInsertId();
    
    // Récupère l'examen
    $stmt = $pdo->prepare("SELECT * FROM examens WHERE id = ?");
    $stmt->execute([$examen_id]);
    $examen = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'session_id' => $session_id,
        'examen' => $examen
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
