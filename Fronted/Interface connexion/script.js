const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const video = document.getElementById("video");
const startCameraBtn = document.getElementById("startCamera");

// Simulation connexion
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(email === "admin@test.com" && password === "1234") {
        message.style.color = "green";
        message.textContent = "Connexion réussie";
    } else {
        message.style.color = "red";
        message.textContent = "Identifiants incorrects";
    }
});

// Activation caméra
startCameraBtn.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        message.style.color = "green";
        message.textContent = "Caméra activée";
    } catch (error) {
        message.style.color = "red";
        message.textContent = "Erreur d'accès à la caméra";
    }
});