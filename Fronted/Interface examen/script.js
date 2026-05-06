const video = document.getElementById("video");
const status = document.getElementById("faceStatus");

// ==========================
// CAMERA (BASE RECONNAISSANCE FACIALE)
// ==========================
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  video.srcObject = stream;
  status.innerText = "✅ Visage détecté - candidat validé";
})
.catch(err => {
  status.innerText = "❌ Caméra non accessible";
});

// ==========================
// TIMER D'EXAMEN
// ==========================
let time = 30 * 60; // 30 minutes

function updateTimer() {
  let min = Math.floor(time / 60);
  let sec = time % 60;

  document.getElementById("time").innerText =
    `${min}:${sec < 10 ? "0" + sec : sec}`;

  if (time > 0) time--;
}

setInterval(updateTimer, 1000);

// ==========================
// SIMULATION ANTI-TRICHE IA
// ==========================
setInterval(() => {
  console.log("Analyse IA du comportement étudiant...");

  // Simulation aléatoire de surveillance
  let alertChance = Math.random();

  if (alertChance > 0.95) {
    alert("⚠️ Comportement suspect détecté !");
  }

}, 5000);

// ==========================
// NAVIGATION QUESTIONS
// ==========================
function nextQuestion() {
  alert("➡ Question suivante chargée");
}

function prevQuestion() {
  alert("⬅ Question précédente");
}