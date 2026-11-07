export const state = {
  user: null,
  profile: { username: "Pesquisador", character: "Edward" },
  progress: { xp: 0, credits: 0, anomalies: 0, missions: 0 },
  inventory: [],
  journal: [],
  completedMissions: [],
  completedAnomalies: [],
  currentDimension: null,
  demo: true
};

export function levelFromXP(xp) {
  return Math.floor((Number(xp) || 0) / 100) + 1;
}

export function addJournal(message) {
  state.journal.unshift({ message, date: new Date().toISOString() });
  state.journal = state.journal.slice(0, 60);
}
