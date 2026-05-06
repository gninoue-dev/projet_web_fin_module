<?php
$matricule = $_POST['matricule'] ?? '';
$nom = $_POST['nom'] ?? '';
$prenom = $_POST['prenom'] ?? '';
$mdp = $_POST['mdp'] ?? '';
$age = $_POST['age'] ?? '';
$filiere = $_POST['filiere'] ?? '';
$sexe = $_POST['sexe'] ?? '';
$empreinte = $_POST['empreinte_faciale'] ?? '';

if (!$matricule || !$nom || !$prenom || !$mdp || !$age || !$filiere || !$sexe || !$empreinte) {
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

try {
    $mdp_hash = password_hash($mdp, PASSWORD_BCRYPT);
    
    $sql = "INSERT INTO etudiants (matricule, nom, prenom, age, filiere, sexe, empreinte_faciale, mdp_hash)
            VALUES (:matricule, :nom, :prenom, :age, :filiere, :sexe, :empreinte, :mdp_hash)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':matricule' => $matricule,
        ':nom' => $nom,
        ':prenom' => $prenom,
        ':age' => $age,
        ':filiere' => $filiere,
        ':sexe' => $sexe,
        ':empreinte' => $empreinte,
        ':mdp_hash' => $mdp_hash
    ]);

    echo json_encode(['success' => true, 'etudiant_id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
