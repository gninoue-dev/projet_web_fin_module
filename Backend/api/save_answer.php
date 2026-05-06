<?php
$session_id = $_POST['session_id'] ?? '';
$examen_id = $_POST['examen_id'] ?? '';
$etudiant_id = $_POST['etudiant_id'] ?? '';
$reponses = $_POST['reponses'] ?? '';

if (!$session_id || !$examen_id || !$etudiant_id || !$reponses) {
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

try {
    $sql = "INSERT INTO reponses (etudiant_id, examen_id, reponses)
            VALUES (:etudiant_id, :examen_id, :reponses)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':etudiant_id' => $etudiant_id,
        ':examen_id' => $examen_id,
        ':reponses' => $reponses
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
