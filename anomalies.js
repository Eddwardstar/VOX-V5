import { state, addJournal } from "./state.js";
import { renderStats, toast } from "./ui.js";
import { saveCloudProgress } from "./database.js";

export async function investigate(anomaly) {
  if (state.completedAnomalies.includes(anomaly.id)) {
    toast("Esta ocorrência já foi registrada nesta sessão.");
    return false;
  }
  state.completedAnomalies.push(anomaly.id);
  state.progress.anomalies++;
  state.progress.xp += anomaly.xp;
  state.progress.credits += anomaly.credits;
  addJournal(`Anomalia investigada: ${anomaly.name}`);
  renderStats();
  try { await saveCloudProgress(); } catch(e) { toast("Falha na sincronização: "+e.message); }
  toast(`Registro concluído: +${anomaly.xp} XP`);
  return true;
}
