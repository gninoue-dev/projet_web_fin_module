# Backend API - Système Examen Anti-Triche

## Installation

1. Copie le dossier `Backend_Final` dans `/var/www/html/`
2. Renomme en `exam-api`

```bash
cp -r Backend_Final /var/www/html/exam-api
```

## Structure

```
exam-api/
├─ index.php (routeur)
├─ db.php (connexion BD)
├─ .htaccess (URLs propres)
└─ api/
   ├─ register.php
   ├─ login.php
   ├─ start_exam.php
   ├─ save_answer.php
   ├─ log_anomaly.php
   ├─ end_exam.php
   └─ generate_report.php
```

## Endpoints

### 1. INSCRIPTION
```
POST http://localhost/exam-api/index.php?action=register
Body:
  matricule=MAT001
  nom=Ali
  prenom=Ahmed
  mdp=1234
  age=20
  filiere=Informatique
  sexe=M
  empreinte_faciale=base64_image_string
```

Réponse:
```json
{
  "success": true,
  "etudiant_id": 1
}
```

### 2. CONNEXION
```
POST http://localhost/exam-api/index.php?action=login
Body:
  matricule=MAT001
  mdp=1234
  empreinte_faciale=base64_image_string
```

Réponse:
```json
{
  "success": true,
  "etudiant_id": 1,
  "nom": "Ali"
}
```

### 3. DÉMARRER EXAMEN
```
POST http://localhost/exam-api/index.php?action=start-exam
Body:
  etudiant_id=1
  examen_id=1
```

Réponse:
```json
{
  "success": true,
  "session_id": 1,
  "examen": {
    "id": 1,
    "titre": "Math Examen",
    "date": "2025-01-15",
    "duree": 120,
    "filiere": "Informatique"
  }
}
```

### 4. SAUVEGARDER RÉPONSE
```
POST http://localhost/exam-api/index.php?action=save-answer
Body:
  session_id=1
  examen_id=1
  etudiant_id=1
  reponses={"q1": "réponse1", "q2": "réponse2"}
```

Réponse:
```json
{
  "success": true
}
```

### 5. SIGNALER ANOMALIE
```
POST http://localhost/exam-api/index.php?action=log-anomaly
Body:
  session_id=1
  examen_id=1
  etudiant_id=1
  anomalie=Absence de visage détectée
```

Réponse:
```json
{
  "success": true
}
```

### 6. TERMINER EXAMEN
```
POST http://localhost/exam-api/index.php?action=end-exam
Body:
  session_id=1
```

Réponse:
```json
{
  "success": true
}
```

### 7. GÉNÉRER RAPPORT
```
GET http://localhost/exam-api/index.php?action=report&session_id=1
```

Réponse:
```json
{
  "success": true,
  "score": 85,
  "anomalies": 2,
  "fiabilite": 80
}
```

## Erreurs Possibles

- `error: "Données manquantes"` → Envoie tous les paramètres requis
- `error: "Étudiant introuvable"` → Matricule n'existe pas
- `error: "Mot de passe incorrect"` → Vérife le mdp
- `error: "Empreinte faciale non reconnue"` → Empreinte < 70% similitude

## Base de Données Requise

Assure-toi que les tables existent:
- etudiants
- examens
- reponses
- surveillance
- rapports
- sessions_examen

Voir script SQL fourni.

## Connexion Frontend

JS (Frontend):
```javascript
async function register(matricule, nom, prenom, mdp, age, filiere, sexe, photoBase64) {
  const response = await fetch('http://localhost/exam-api/index.php?action=register', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `matricule=${matricule}&nom=${nom}&prenom=${prenom}&mdp=${mdp}&age=${age}&filiere=${filiere}&sexe=${sexe}&empreinte_faciale=${photoBase64}`
  });
  const data = await response.json();
  console.log(data);
}
```

## Problèmes Courants

### Erreur CORS
→ Fichier db.php a les headers CORS. Assure-toi que Apache2 active mod_rewrite.

### Erreur 404
→ Renomme .htaccess et assure-toi qu'il existe à la racine.

### Erreur BD
→ Vérifie que MySQL tourne et que examens_db existe.

Tout bon? 👍
