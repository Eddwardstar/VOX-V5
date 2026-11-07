import { state, levelFromXP } from "./state.js";

export function toast(message) {
  const el = document.querySelector("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 3000);
}

export function renderStats() {
  const p = state.progress;
  const level = levelFromXP(p.xp);
  setText("#stat-xp", `${p.xp} XP`);
  setText("#stat-credits", p.credits);
  setText("#stat-anomalies", p.anomalies);
  setText("#stat-missions", p.missions);
  setText("#level-label", `NÍVEL ${level}`);
  const bar = document.querySelector("#xp-progress");
  if (bar) bar.style.width = `${p.xp % 100}%`;
  setText("#profile-name", state.profile.username);
  setText("#username-display", state.profile.username);
  setText("#profile-email", state.user?.email || "Sessão local de demonstração");
  setText("#profile-rank", level >= 5 ? "PESQUISADOR AVANÇADO" : "PESQUISADOR INICIANTE");
  setText("#profile-summary", `Nível ${level} • ${p.xp} XP • ${p.credits} créditos • ${p.anomalies} anomalias`);
}

export function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = String(value);
}

export function showApp() {
  document.querySelector("#auth-screen")?.classList.add("hidden");
  document.querySelector("#app")?.classList.remove("hidden");
}

export function showAuth() {
  document.querySelector("#app")?.classList.add("hidden");
  document.querySelector("#auth-screen")?.classList.remove("hidden");
}

export function navigate(page) {
  const target = document.querySelector(`#page-${page}`);
  if (!target) return;
  document.querySelectorAll(".page").forEach(el => el.classList.remove("active"));
  target.classList.add("active");
  document.querySelectorAll(".nav-button").forEach(el => el.classList.toggle("active", el.dataset.page === page));
  const labels = {dashboard:"Visão geral",map:"Mapa mundial",explore:"Exploração",missions:"Missões",inventory:"Inventário",laboratory:"Laboratório",journal:"Diário",profile:"Perfil",settings:"Configurações"};
  setText("#page-heading", labels[page] || "VOX V5");
  setText("#breadcrumb", page.toUpperCase());
  if (page === "map") window.dispatchEvent(new Event("vox:map-visible"));
}
