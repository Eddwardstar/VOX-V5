import { state, addJournal } from "./state.js";
import { addItem } from "./inventory.js";
import { renderStats, toast } from "./ui.js";
import { saveCloudProgress } from "./database.js";

const dimensions = {
  forest:{title:"Floresta Encantada",description:"Árvores antigas cercam um portal que pulsa em silêncio. Você sente que algo observa de longe.",caption:"BIOMA: FLORESTA / SINAL ESTÁVEL",fragment:"Semente luminosa",icon:"✧"},
  corrupted:{title:"Mundo Corrompido",description:"O ambiente parece uma cópia quebrada de outro lugar. As estruturas estão distorcidas e o ar vibra.",caption:"BIOMA: CORROMPIDO / CUIDADO",fragment:"Fragmento corrompido",icon:"◈"}
};
let searches=0;
export function initExploration() {
  document.querySelectorAll(".dimension-enter").forEach(btn=>btn.addEventListener("click",()=>enterDimension(btn.dataset.dimension)));
  document.querySelector("#leave-dimension")?.addEventListener("click",leaveDimension);
  document.querySelector("#search-dimension")?.addEventListener("click",searchDimension);
}
function enterDimension(id) {
  const dimension=dimensions[id]; if(!dimension)return;
  state.currentDimension=id; searches=0;
  document.querySelector("#exploration-panel")?.classList.remove("hidden");
  document.querySelector("#exploration-title").textContent=dimension.title;
  document.querySelector("#exploration-description").textContent=dimension.description;
  document.querySelector("#scene-caption").textContent=dimension.caption;
  document.querySelector("#exploration-result").textContent="";
  addJournal(`Entrou na dimensão: ${dimension.title}`);
  document.querySelector("#exploration-panel").scrollIntoView({behavior:"smooth",block:"start"});
  toast(`Acesso iniciado: ${dimension.title}`);
}
function leaveDimension() {
  state.currentDimension=null;
  document.querySelector("#exploration-panel")?.classList.add("hidden");
  toast("Você saiu da dimensão.");
}
async function searchDimension() {
  const id=state.currentDimension,dimension=dimensions[id]; if(!dimension)return;
  searches++;
  const result=document.querySelector("#exploration-result");
  if(searches===1){
    addItem({id:`fragment-${id}`,name:dimension.fragment,description:`Fragmento encontrado em ${dimension.title}.`,icon:dimension.icon});
    state.progress.xp+=20;state.progress.credits+=8;
    addJournal(`Fragmento recuperado: ${dimension.fragment}`);
    result.textContent=`✦ Evidência recuperada: ${dimension.fragment}. +20 XP e +8 créditos.`;
    renderStats();
    try{await saveCloudProgress()}catch(e){toast("Falha ao sincronizar progresso: "+e.message)}
  }else{
    result.textContent="Nenhum novo fragmento nesta busca. Os sensores continuam monitorando o local.";
  }
}
