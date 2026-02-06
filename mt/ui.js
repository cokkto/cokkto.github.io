// ======================= ui.js =======================
export function makeChip(text, onClick, isSelectedFn, refreshSelections) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.textContent = text;
  b.addEventListener("click", () => {
    onClick();
    refreshSelections();
  });
  b._isSelectedFn = isSelectedFn;
  return b;
}

export function refreshSelection(container) {
  const btns = Array.from(container.querySelectorAll("button.chip"));
  for (const b of btns) {
    if (typeof b._isSelectedFn === "function" && b._isSelectedFn())
      b.classList.add("selected");
    else b.classList.remove("selected");
  }
}

export function refreshAllSelections(containers) {
  for (const c of containers) refreshSelection(c);
}

export function fillChips(container, items, makeBtn) {
  container.innerHTML = "";
  for (const it of items) container.appendChild(makeBtn(it));
}
