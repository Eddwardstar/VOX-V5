import { state } from "./state.js";

export function addItem(item) {
  const existing = state.inventory.find(x=>x.id===item.id);
  if (existing) existing.quantity += 1;
  else state.inventory.push({...item,quantity:1});
  renderInventory();
}

export function renderInventory() {
  const root = document.querySelector("#inventory-grid");
  if (!root) return;
  root.innerHTML = "";
  if (!state.inventory.length) {
    root.innerHTML = '<article class="item-card panel"><div class="item-icon">◇</div><h3>Inventário vazio</h3><p>Explore as dimensões para encontrar seus primeiros itens.</p></article>';
    return;
  }
  state.inventory.forEach(item=>{
    const card=document.createElement("article");card.className="item-card panel";
    card.innerHTML=`<div class="item-icon">${item.icon||"◇"}</div><h3>${item.name}</h3><p>${item.description||"Objeto recuperado."}</p><span class="tag">QUANTIDADE: ${item.quantity}</span>`;
    root.append(card);
  });
}
