<?php
$session_id = $_POST['session_id'] ?? '';

if (!$session_id) {
    echo json_encode(['error' => 'Session manquante']);
    exit;
}

try {
    $sql = "UPDATE sessions_examen SET statut = 'completed', date_fin = NOW() WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$session_id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
