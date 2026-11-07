import { state } from "./state.js";

export function renderJournal() {
  const root=document.querySelector("#journal-list");if(!root)return;
  root.innerHTML="";
  if(!state.journal.length){root.innerHTML='<p class="muted">Seu diário ainda está vazio. Explore o mapa, visite dimensões e execute análises.</p>';return;}
  state.journal.forEach(entry=>{
    const article=document.createElement("article");article.className="journal-entry";
    const time=new Date(entry.date).toLocaleString("pt-BR");
    const date=document.createElement("time");date.textContent=time;
    const p=document.createElement("p");p.textContent=entry.message;
    article.append(date,p);root.append(article);
  });
}
