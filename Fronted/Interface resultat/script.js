let score = 0;
let target = 78; // score final simulé

let display = document.getElementById("score");
let grade = document.getElementById("grade");
let cheatStatus = document.getElementById("cheatStatus");

// ==========================
// ANIMATION DU SCORE
// ==========================
let interval = setInterval(() => {
  if (score < target) {
    score++;
    display.innerText = score;

    let percent = score;
    document.querySelector(".circle").style.background =
      `conic-gradient(#22c55e ${percent}%, #334155 ${percent}%)`;
  } else {
    clearInterval(interval);
    setGrade(score);
  }
}, 20);

// ==========================
// ATTRIBUTION DE LA NOTE
// ==========================
function setGrade(score) {
  if (score >= 80) {
    grade.innerText = "🎉 Excellent (A)";
  } else if (score >= 60) {
    grade.innerText = "👍 Bien (B)";
  } else if (score >= 50) {
    grade.innerText = "👌 Passable (C)";
  } else {
    grade.innerText = "❌ Échec";
  }
}

// ==========================
// SIMULATION IA ANTI-TRICHE
// ==========================
setTimeout(() => {
  cheatStatus.innerText = "✔ Aucun comportement suspect détecté";
}, 3000);

// ==========================
// LOGS IA (SIMULATION)
// ==========================
setInterval(() => {
  console.log("IA: analyse post-examen en cours...");
}, 4000);