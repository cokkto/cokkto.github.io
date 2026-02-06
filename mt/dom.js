// ======================= dom.js =======================
export function qs(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}

export function showOnly(active, allPanels) {
  for (const p of allPanels) p.classList.remove("active");
  active.classList.add("active");
}

export function setText(el, text) {
  el.textContent = text;
}
