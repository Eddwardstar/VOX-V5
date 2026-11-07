import { state } from "./state.js";
import { renderStats, toast } from "./ui.js";
import { saveCloudProfile } from "./database.js";

export function initProfile() {
  const input = document.querySelector("#setting-username");
  if (input) input.value = state.profile.username;
  document.querySelector("#save-settings")?.addEventListener("click", async ()=>{
    const name = input?.value.trim();
    if (name && name.length >= 3) state.profile.username = name.slice(0,24);
    document.body.classList.toggle("reduce-motion",!!document.querySelector("#reduce-motion")?.checked);
    try { await saveCloudProfile(); toast("Preferências salvas."); } catch(e) { toast("Falha ao salvar na nuvem: "+e.message); }
    renderStats();
  });
}
