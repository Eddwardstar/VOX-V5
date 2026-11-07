import { state, addJournal } from "./state.js";
import { renderStats, toast } from "./ui.js";
import { saveCloudProgress } from "./database.js";

const missions = [
  {id:"first-scan",title:"Primeiro contato",description:"Execute sua primeira varredura no laboratório.",xp:35,credits:15,check:()=>state.journal.some(x=>x.message.includes("Varredura"))},
  {id:"map-signal",title:"Sinal no mapa",description:"Investigue uma ocorrência no mapa mundial.",xp:50,credits:25,check:()=>state.progress.anomalies>=1},
  {id:"dimension-trip",title:"Além do portal",description:"Visite uma dimensão pela primeira vez.",xp:45,credits:20,check:()=>state.journal.some(x=>x.message.includes("Entrou na dimensão"))},
  {id:"collect-fragment",title:"Evidência material",description:"Recupere um fragmento dimensional.",xp:60,credits:30,check:()=>state.inventory.length>=1}
];

export function renderMissions() {
  const root = document.querySelector("#mission-list");
  if (!root) return;
  root.innerHTML = "";
  missions.forEach(m=>{
    const done = state.completedMissions.includes(m.id);
    const card = document.createElement("article");
    card.className = "mission-card panel";
    const info = document.createElement("div");
    info.innerHTML = `<h3>${m.title}</h3><p>${m.description}</p>`;
    const right = document.createElement("div");
    right.innerHTML = `<div class="reward">+${m.xp} XP · +${m.credits} CR</div>`;
    const btn = document.createElement("button");
    btn.className = "button "+(done?"ghost":"primary");
    btn.textContent = done?"CONCLUÍDA":"VERIFICAR OBJETIVO";
    btn.disabled = done;
    btn.addEventListener("click",async()=>{
      if (!m.check()) { toast("Objetivo ainda não concluído."); return; }
      state.completedMissions.push(m.id);
      state.progress.missions++;
      state.progress.xp+=m.xp;
      state.progress.credits+=m.credits;
      addJournal(`Missão concluída: ${m.title}`);
      renderMissions(); renderStats();
      try { await saveCloudProgress(); } catch(e) { toast("Não foi possível sincronizar: "+e.message); }
      toast(`Missão concluída: ${m.title}`);
    });
    right.append(btn); card.append(info,right); root.append(card);
  });
}
