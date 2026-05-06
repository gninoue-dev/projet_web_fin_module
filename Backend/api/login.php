<?php
$matricule = $_POST['matricule'] ?? '';
$mdp = $_POST['mdp'] ?? '';
$empreinte = $_POST['empreinte_faciale'] ?? '';

if (!$matricule || !$mdp || !$empreinte) {
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM etudiants WHERE matricule = ?");
    $stmt->execute([$matricule]);
    $etudiant = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$etudiant) {
        echo json_encode(['error' => 'Étudiant introuvable']);
        exit;
    }
    
    if (!password_verify($mdp, $etudiant['mdp_hash'])) {
        echo json_encode(['error' => 'Mot de passe incorrect']);
        exit;
    }
    
    // Comparaison empreinte faciale simple
    similar_text($etudiant['empreinte_faciale'], $empreinte, $percent);
    if ($percent < 70) {
        echo json_encode(['error' => 'Empreinte faciale non reconnue']);
        exit;
    }
    
    echo json_encode(['success' => true, 'etudiant_id' => $etudiant['id'], 'nom' => $etudiant['nom']]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
