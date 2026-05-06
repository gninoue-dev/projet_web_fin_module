<?php
$session_id = $_POST['session_id'] ?? '';
$examen_id = $_POST['examen_id'] ?? '';
$etudiant_id = $_POST['etudiant_id'] ?? '';
$anomalie = $_POST['anomalie'] ?? '';

if (!$session_id || !$examen_id || !$etudiant_id || !$anomalie) {
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

try {
    $sql = "INSERT INTO surveillance (etudiant_id, examen_id, anomalie)
            VALUES (:etudiant_id, :examen_id, :anomalie)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':etudiant_id' => $etudiant_id,
        ':examen_id' => $examen_id,
        ':anomalie' => $anomalie
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
