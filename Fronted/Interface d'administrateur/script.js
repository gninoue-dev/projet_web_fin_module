
const startCameraBtn = document.getElementById("startCamera");
const video = document.getElementById("adminVideo");
const status = document.getElementById("status");

// Simulation compteur dynamique
let students = 120;
document.getElementById("studentsCount").textContent = students;

// Surveillance caméra (base pour reconnaissance faciale future)
startCameraBtn.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        status.style.color = "green";
        status.textContent = "Surveillance IA activée (caméra en cours)";

    } catch (err) {
        status.style.color = "red";
        status.textContent = "Accès caméra refusé";
    }
});

// Simulation d'alerte anti-triche (base IA future)
setInterval(() => {
    const alertChance = Math.random();

    if(alertChance > 0.95) {
        document.querySelector(".alert").textContent = "1 triche détectée ⚠️";
        document.querySelector(".alert").style.color = "red";
    }
}, 5000);