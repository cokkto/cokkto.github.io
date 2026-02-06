// ======================= fx.js =======================
export function flashWrong(btn) {
  btn.style.transition = "opacity 0.5s ease";
  btn.style.background = "#D67373";
  void btn.offsetHeight; // reflow
  btn.style.opacity = "0";
  btn.disabled = true;
}

export function flashCorrect(btn) {
  btn.style.transition = "background 0.15s ease";
  btn.style.background = "#99D677";
  btn.disabled = true;
}

export function resetAnswerButtonVisuals(ansBtns) {
  for (const b of ansBtns) {
    b.style.opacity = "";
    b.style.transition = "";
    b.style.background = "";
    b.disabled = false;
  }
}
