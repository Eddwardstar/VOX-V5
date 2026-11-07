import { state, addJournal } from "./state.js";
import { toast } from "./ui.js";

export function initLaboratory() {
  const button=document.querySelector("#scan-button");
  button?.addEventListener("click",async()=>{
    const screen=document.querySelector(".scanner-screen");
    const title=document.querySelector("#scan-title");
    const result=document.querySelector("#scan-result");
    const log=document.querySelector("#scan-log");
    button.disabled=true;button.textContent="ANALISANDO...";
    screen?.classList.add("scanning");
    title.textContent="Varredura em andamento";
    result.textContent="Lendo frequências e comparando padrões...";
    await new Promise(resolve=>setTimeout(resolve,1900));
    screen?.classList.remove("scanning");
    const findings=state.inventory.length
      ? "Ressonância identificada em um artefato do inventário."
      : "Sinal fraco identificado. Nenhum artefato disponível para comparação.";
    title.textContent="Análise concluída";
    result.textContent=findings;
    log.textContent=`[${new Date().toLocaleTimeString("pt-BR")}] VARREDURA FINALIZADA\n[VOX] ${findings}`;
    addJournal("Varredura laboratorial concluída.");
    button.disabled=false;button.textContent="INICIAR NOVA VARREDURA";
    toast("Relatório laboratorial atualizado.");
  });
}
