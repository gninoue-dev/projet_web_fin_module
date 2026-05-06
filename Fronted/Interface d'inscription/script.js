// ============================================
// script.js - Plateforme d'Examen Moderne
// Système d'évaluation hybride anti-triche
// Gestion de l'inscription avec empreinte faciale
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Références DOM ----------
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');

    // Champs
    const matriculeInput = document.getElementById('matricule');
    const nomInput = document.getElementById('nom');
    const prenomInput = document.getElementById('prenom');
    const ageInput = document.getElementById('age');
    const sexeSelect = document.getElementById('sexe');
    const filiereSelect = document.getElementById('filiere');
    const motDePasseInput = document.getElementById('motDePasse');
    const confirmerMotDePasseInput = document.getElementById('confirmerMotDePasse');
    const empreinteHidden = document.getElementById('empreinteFaciale');

    // Messages d'erreur
    const errorSpans = {
        matricule: document.getElementById('matriculeError'),
        nom: document.getElementById('nomError'),
        prenom: document.getElementById('prenomError'),
        age: document.getElementById('ageError'),
        sexe: document.getElementById('sexeError'),
        filiere: document.getElementById('filiereError'),
        motDePasse: document.getElementById('motDePasseError'),
        confirmerMotDePasse: document.getElementById('confirmerMotDePasseError'),
        empreinte: document.getElementById('empreinteError'),
    };

    // Caméra
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const cameraContainer = document.getElementById('cameraContainer');
    const cameraPlaceholder = document.getElementById('cameraPlaceholder');
    const capturedPreview = document.getElementById('capturedPreview');
    const capturedImage = document.getElementById('capturedImage');
    const startCameraBtn = document.getElementById('startCameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const retakeBtn = document.getElementById('retakeBtn');

    // Mot de passe
    const strengthBar = document.getElementById('strengthBar');
    const togglePassword1 = document.getElementById('togglePassword1');
    const togglePassword2 = document.getElementById('togglePassword2');

    // Checklist sécurité
    const checkLength = document.getElementById('checkLength');
    const checkUpper = document.getElementById('checkUpper');
    const checkLower = document.getElementById('checkLower');
    const checkNumber = document.getElementById('checkNumber');
    const checkSpecial = document.getElementById('checkSpecial');

    // ---------- Variables d'état ----------
    let mediaStream = null;
    let faceCaptured = false;
    let faceDataURL = '';

    // ---------- Générateur de matricule automatique ----------
    function generateMatricule() {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(100 + Math.random() * 900); // 100-999
        return `ETU${year}-${randomNum}`;
    }

    // Pré-remplir le matricule avec une suggestion
    if (!matriculeInput.value) {
        matriculeInput.value = generateMatricule();
    }

    // ---------- Validation en temps réel ----------
    function clearError(fieldName) {
        if (errorSpans[fieldName]) {
            errorSpans[fieldName].textContent = '';
        }
        const input = document.getElementById(fieldName);
        if (input) {
            input.classList.remove('error');
        }
    }

    function setError(fieldName, message) {
        if (errorSpans[fieldName]) {
            errorSpans[fieldName].textContent = message;
        }
        const input = document.getElementById(fieldName);
        if (input) {
            input.classList.add('error');
        }
    }

    // Validation matricule
    matriculeInput.addEventListener('input', () => {
        const val = matriculeInput.value.trim();
        if (!val) {
            setError('matricule', 'Le matricule est requis.');
        } else if (!/^ETU\d{4}-\d{3,}$/.test(val)) {
            setError('matricule', 'Format attendu : ETU2024-001');
        } else {
            clearError('matricule');
        }
    });

    // Validation nom
    nomInput.addEventListener('input', () => {
        const val = nomInput.value.trim();
        if (!val) setError('nom', 'Le nom est requis.');
        else if (val.length < 2) setError('nom', 'Minimum 2 caractères.');
        else clearError('nom');
    });

    // Validation prénom
    prenomInput.addEventListener('input', () => {
        const val = prenomInput.value.trim();
        if (!val) setError('prenom', 'Le prénom est requis.');
        else if (val.length < 2) setError('prenom', 'Minimum 2 caractères.');
        else clearError('prenom');
    });

    // Validation âge
    ageInput.addEventListener('input', () => {
        const val = parseInt(ageInput.value, 10);
        if (!ageInput.value) setError('age', 'L\'âge est requis.');
        else if (isNaN(val) || val < 16 || val > 99) setError('age', 'Âge valide : 16 à 99 ans.');
        else clearError('age');
    });

    // Validation sexe
    sexeSelect.addEventListener('change', () => {
        if (!sexeSelect.value) setError('sexe', 'Veuillez choisir votre sexe.');
        else clearError('sexe');
    });

    // Validation filière
    filiereSelect.addEventListener('change', () => {
        if (!filiereSelect.value) setError('filiere', 'Veuillez choisir votre filière.');
        else clearError('filiere');
    });

    // ---------- Gestion du mot de passe ----------
    function evaluatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };

        if (checks.length) score++;
        if (checks.upper) score++;
        if (checks.lower) score++;
        if (checks.number) score++;
        if (checks.special) score++;

        // Mise à jour visuelle de la checklist
        checkLength.textContent = (checks.length ? '✅' : '❌') + ' 8 caractères minimum';
        checkUpper.textContent = (checks.upper ? '✅' : '❌') + ' Au moins une majuscule';
        checkLower.textContent = (checks.lower ? '✅' : '❌') + ' Au moins une minuscule';
        checkNumber.textContent = (checks.number ? '✅' : '❌') + ' Au moins un chiffre';
        checkSpecial.textContent = (checks.special ? '✅' : '❌') + ' Au moins un caractère spécial';

        // Colorer les items valides
        [checkLength, checkUpper, checkLower, checkNumber, checkSpecial].forEach((el, i) => {
            const keys = ['length', 'upper', 'lower', 'number', 'special'];
            if (checks[keys[i]]) {
                el.classList.add('valid');
            } else {
                el.classList.remove('valid');
            }
        });

        // Mise à jour de la barre de force
        strengthBar.classList.remove('weak', 'medium', 'strong', 'very-strong');
        if (score <= 1) strengthBar.classList.add('weak');
        else if (score === 2) strengthBar.classList.add('medium');
        else if (score === 3) strengthBar.classList.add('strong');
        else if (score >= 4) strengthBar.classList.add('very-strong');

        return { score, checks };
    }

    motDePasseInput.addEventListener('input', () => {
        const password = motDePasseInput.value;
        evaluatePasswordStrength(password);

        if (!password) {
            setError('motDePasse', 'Le mot de passe est requis.');
        } else if (password.length < 8) {
            setError('motDePasse', 'Minimum 8 caractères.');
        } else {
            clearError('motDePasse');
        }

        // Re-vérifier la confirmation
        if (confirmerMotDePasseInput.value) {
            checkPasswordMatch();
        }
    });

    function checkPasswordMatch() {
        const pass = motDePasseInput.value;
        const confirm = confirmerMotDePasseInput.value;
        if (!confirm) {
            setError('confirmerMotDePasse', 'Veuillez confirmer le mot de passe.');
        } else if (pass !== confirm) {
            setError('confirmerMotDePasse', 'Les mots de passe ne correspondent pas.');
        } else {
            clearError('confirmerMotDePasse');
        }
    }

    confirmerMotDePasseInput.addEventListener('input', checkPasswordMatch);

    // Toggle visibilité mot de passe
    togglePassword1.addEventListener('click', () => {
        const type = motDePasseInput.getAttribute('type') === 'password' ? 'text' : 'password';
        motDePasseInput.setAttribute('type', type);
        togglePassword1.textContent = type === 'password' ? '👁️' : '🙈';
    });

    togglePassword2.addEventListener('click', () => {
        const type = confirmerMotDePasseInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmerMotDePasseInput.setAttribute('type', type);
        togglePassword2.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // ---------- Gestion de la caméra (empreinte faciale) ----------
    async function startCamera() {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user',
                },
                audio: false,
            });

            video.srcObject = mediaStream;
            video.classList.add('active');
            cameraPlaceholder.style.display = 'none';
            capturedPreview.style.display = 'none';
            cameraContainer.classList.add('active');
            captureBtn.disabled = false;
            startCameraBtn.textContent = '📷 Caméra active';
            startCameraBtn.style.background = '#d4edda';
            startCameraBtn.style.borderColor = '#2ecc71';
            faceCaptured = false;
            faceDataURL = '';
            empreinteHidden.value = '';
            retakeBtn.style.display = 'none';
            clearError('empreinte');

        } catch (err) {
            console.error('Erreur caméra :', err);
            setError('empreinte', 'Impossible d\'accéder à la caméra. Vérifiez les permissions.');
            alert('⚠️ Accès à la caméra refusé ou impossible.\nVeuillez autoriser l\'accès dans les paramètres de votre navigateur.');
        }
    }

    function stopCamera() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
        video.srcObject = null;
        video.classList.remove('active');
        cameraContainer.classList.remove('active');
        cameraPlaceholder.style.display = 'flex';
        capturedPreview.style.display = 'none';
        captureBtn.disabled = true;
        startCameraBtn.textContent = '📷 Démarrer la caméra';
        startCameraBtn.style.background = '#eef3f9';
        startCameraBtn.style.borderColor = '#dce3ea';
        retakeBtn.style.display = 'none';
        faceCaptured = false;
        faceDataURL = '';
        empreinteHidden.value = '';
    }

    function captureFace() {
        if (!mediaStream || !video.videoWidth) {
            setError('empreinte', 'La caméra n\'est pas active.');
            return;
        }

        // Ajuster le canvas aux dimensions de la vidéo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Dessiner l'image actuelle de la vidéo sur le canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convertir en data URL (base64)
        faceDataURL = canvas.toDataURL('image/jpeg', 0.85);
        empreinteHidden.value = faceDataURL;
        faceCaptured = true;

        // Afficher la preview
        capturedImage.src = faceDataURL;
        capturedPreview.style.display = 'block';
        video.classList.remove('active');
        cameraPlaceholder.style.display = 'none';
        captureBtn.disabled = true;
        retakeBtn.style.display = 'inline-flex';
        startCameraBtn.textContent = '📷 Caméra active';
        startCameraBtn.style.background = '#d4edda';
        clearError('empreinte');

        // Arrêter le flux vidéo pour économiser les ressources
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
            video.srcObject = null;
        }
    }

    function retakeFace() {
        capturedPreview.style.display = 'none';
        faceCaptured = false;
        faceDataURL = '';
        empreinteHidden.value = '';
        retakeBtn.style.display = 'none';
        startCamera();
    }

    // Événements des boutons caméra
    startCameraBtn.addEventListener('click', () => {
        if (mediaStream && video.srcObject) {
            // Caméra déjà active
            stopCamera();
        } else if (faceCaptured) {
            // Reprendre après capture
            retakeFace();
        } else {
            startCamera();
        }
    });

    captureBtn.addEventListener('click', captureFace);
    retakeBtn.addEventListener('click', retakeFace);

    // Nettoyer la caméra si l'utilisateur quitte la page
    window.addEventListener('beforeunload', () => {
        stopCamera();
    });

    // ---------- Réinitialisation du formulaire ----------
    form.addEventListener('reset', () => {
        // Arrêter la caméra
        stopCamera();
        faceCaptured = false;
        faceDataURL = '';
        empreinteHidden.value = '';
        capturedPreview.style.display = 'none';
        retakeBtn.style.display = 'none';

        // Réinitialiser les erreurs
        Object.keys(errorSpans).forEach(key => {
            clearError(key);
        });

        // Réinitialiser les classes
        [matriculeInput, nomInput, prenomInput, ageInput, sexeSelect, filiereSelect,
            motDePasseInput, confirmerMotDePasseInput
        ].forEach(el => {
            if (el) el.classList.remove('error', 'success');
        });

        // Réinitialiser la force du mot de passe
        strengthBar.classList.remove('weak', 'medium', 'strong', 'very-strong');
        strengthBar.style.width = '0%';
        checkLength.textContent = '❌ 8 caractères minimum';
        checkUpper.textContent = '❌ Au moins une majuscule';
        checkLower.textContent = '❌ Au moins une minuscule';
        checkNumber.textContent = '❌ Au moins un chiffre';
        checkSpecial.textContent = '❌ Au moins un caractère spécial';
        [checkLength, checkUpper, checkLower, checkNumber, checkSpecial].forEach(el => el.classList.remove('valid'));

        // Régénérer le matricule
        matriculeInput.value = generateMatricule();

        // Masquer le message de succès
        successMessage.style.display = 'none';
        form.style.display = '';
        document.querySelector('.form-header').style.display = '';
        document.querySelector('.form-actions').style.display = '';
    });

    // ---------- Soumission du formulaire ----------
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Validation complète
        const validations = [
            { field: 'matricule', value: matriculeInput.value.trim(),
                rule: (v) => v && /^ETU\d{4}-\d{3,}$/.test(v),
                msg: 'Matricule invalide (format: ETU2024-001).' },
            { field: 'nom', value: nomInput.value.trim(), rule: (v) => v && v.length >= 2,
                msg: 'Nom invalide (min. 2 caractères).' },
            { field: 'prenom', value: prenomInput.value.trim(), rule: (v) => v && v.length >= 2,
                msg: 'Prénom invalide (min. 2 caractères).' },
            { field: 'age', value: ageInput.value, rule: (v) => v && parseInt(v) >= 16 && parseInt(v) <= 99,
                msg: 'Âge invalide (16-99 ans).' },
            { field: 'sexe', value: sexeSelect.value, rule: (v) => v !== '', msg: 'Sexe requis.' },
            { field: 'filiere', value: filiereSelect.value, rule: (v) => v !== '', msg: 'Filière requise.' },
            { field: 'motDePasse', value: motDePasseInput.value, rule: (v) => v && v.length >= 8,
                msg: 'Mot de passe invalide (min. 8 caractères).' },
            { field: 'confirmerMotDePasse', value: confirmerMotDePasseInput.value,
                rule: (v) => v === motDePasseInput.value, msg: 'Les mots de passe ne correspondent pas.' },
        ];

        validations.forEach(({ field, value, rule, msg }) => {
            if (!rule(value)) {
                setError(field, msg);
                isValid = false;
            } else {
                clearError(field);
            }
        });

        // Vérification empreinte faciale
        if (!faceCaptured || !faceDataURL) {
            setError('empreinte', 'Veuillez capturer votre empreinte faciale.');
            isValid = false;
        } else {
            clearError('empreinte');
        }

        if (!isValid) {
            // Faire défiler jusqu'à la première erreur
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // ---------- Soumission réussie : simulation ----------
        const formData = {
            matricule: matriculeInput.value.trim(),
            nom: nomInput.value.trim(),
            prenom: prenomInput.value.trim(),
            age: parseInt(ageInput.value, 10),
            sexe: sexeSelect.value,
            filiere: filiereSelect.value,
            motDePasse: '(caché)',
            empreinteFaciale: faceDataURL ? '✅ Capturée (' + Math.round(faceDataURL.length / 1024) + ' Ko)' :
            '❌ Non capturée',
        };

        console.log('📋 Données d\'inscription :', formData);
        console.log('🖼️ Empreinte faciale (base64) :', faceDataURL.substring(0, 80) + '...');

        // Afficher le message de succès
        form.style.display = 'none';
        document.querySelector('.form-header').style.display = 'none';
        document.querySelector('.form-actions').style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Animation de succès
        successMessage.style.animation = 'fadeInUp 0.5s ease';
    });

    // ---------- Animation CSS injectée dynamiquement ----------
    const styleAnimation = document.createElement('style');
    styleAnimation.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .success-message {
            animation: fadeInUp 0.5s ease;
        }
    `;
    document.head.appendChild(styleAnimation);

    console.log('✅ Plateforme d\'inscription initialisée - Système anti-triche prêt.');
});