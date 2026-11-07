import { state, addJournal } from "./state.js";
import { toast, renderStats, navigate, setText } from "./ui.js";
import { initAuth } from "./auth.js";
import { initMap } from "./map.js";
import { initExploration } from "./exploration.js";
import { initMissions, renderMissions } from "./missions.js";
import { renderInventory } from "./inventory.js";
import { initLaboratory } from "./laboratory.js";
import { renderJournal } from "./journal.js";
import { initSettings } from "./settings.js";
import { supabaseReady } from "./database.js";

function refreshAll() {
  renderStats(); renderMissions(); renderInventory(); renderJournal();
  setText("#connection-label",supabaseReady?"SUPABASE CONECTADO":"MODO LOCAL");
  setText("#settings-connection",supabaseReady?"CONFIGURADO":"MODO LOCAL");
  setText("#profile-email",state.user?.email||"Sessão local de demonstração");
  initMap();
}

document.querySelectorAll(".nav-button").forEach(btn=>btn.addEventListener("click",()=>navigate(btn.dataset.page)));
document.querySelectorAll("[data-go]").forEach(btn=>btn.addEventListener("click",()=>navigate(btn.dataset.go)));
window.addEventListener("vox:map-visible",()=>setTimeout(initMap,120));

document.querySelector("#logout-button")?.addEventListener("click",logout);
document.querySelector("#settings-logout")?.addEventListener("click",logout);

async function logout() {
  const {supabase}=await import("./database.js");
  if(supabase){await supabase.auth.signOut();}
  location.reload();
}

function start() {
  initExploration();
  initMissions();
  initLaboratory();
  initSettings();
  refreshAll();
  initAuth(refreshAll);
  addJournal("Sistema VOX V5 inicializado.");
  renderJournal();
  toast("VOX V5 pronto para operação.");
}
start();
