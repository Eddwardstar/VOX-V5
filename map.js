import { investigate } from "./anomalies.js";
import { state } from "./state.js";

const reports = [
  {id:"iceland",name:"Sinal de Reykjavík",region:"Islândia",coords:[64.1466,-21.9426],description:"Interferência violeta detectada nos sensores fictícios do VOX.",xp:25,credits:10},
  {id:"sahara",name:"Fragmento do Saara",region:"Deserto do Saara",coords:[23.4162,25.6628],description:"Um fragmento dimensional aparece nos registros da região.",xp:30,credits:15},
  {id:"pacific",name:"O Observador",region:"Oceano Pacífico",coords:[0,-150],description:"Um sinal desconhecido surge no oceano. Ocorrência fictícia.",xp:40,credits:20},
  {id:"amazon",name:"Eco Verde",region:"Floresta Amazônica",coords:[-3.4653,-62.2159],description:"Uma sequência de pulsos foi registrada pela rede de pesquisa fictícia.",xp:25,credits:12}
];
let map;
export function initMap() {
  const el=document.querySelector("#earth-map");
  if (!el || !window.L) return;
  if (map) { setTimeout(()=>map.invalidateSize(),100); return; }
  map=L.map(el,{worldCopyJump:true,minZoom:2}).setView([12,-25],2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; OpenStreetMap'}).addTo(map);
  reports.forEach(report=>{
    const icon=L.divIcon({className:"",html:'<div class="map-marker">✦</div>',iconSize:[22,22],iconAnchor:[11,11]});
    const marker=L.marker(report.coords,{icon}).addTo(map);
    marker.bindTooltip(report.name);
    marker.on("click",()=>showReport(report));
  });
  setTimeout(()=>map.invalidateSize(),200);
}
function showReport(report) {
  const box=document.querySelector("#map-details");
  if (!box) return;
  const done=state.completedAnomalies.includes(report.id);
  box.innerHTML=`<p class="eyebrow">RELATÓRIO DE CAMPO / ${report.region.toUpperCase()}</p><h3>${report.name}</h3><p class="muted">${report.description}</p><p class="reward">RECOMPENSA: ${report.xp} XP · ${report.credits} CRÉDITOS</p><button class="button primary" id="investigate-report" ${done?"disabled":""}>${done?"JÁ REGISTRADA":"INVESTIGAR OCORRÊNCIA"}</button>`;
  box.querySelector("#investigate-report")?.addEventListener("click",async()=>{
    const ok=await investigate(report);
    if(ok) showReport(report);
  });
}
