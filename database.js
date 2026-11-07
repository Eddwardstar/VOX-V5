import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, DEMO_MODE } from "./config.js";
import { state } from "./state.js";

export const supabaseReady = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY && !DEMO_MODE);
export const supabase = supabaseReady ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;

export async function loadCloudData(user) {
  if (!supabaseReady || !user) return;
  state.user = user;
  const username = user.user_metadata?.username || user.email?.split("@")[0] || "Pesquisador";
  const { error: pErr } = await supabase.from("vox_profiles").upsert({id:user.id, username}, {onConflict:"id", ignoreDuplicates:true});
  if (pErr) throw pErr;
  const { error: gErr } = await supabase.from("vox_progress").upsert({user_id:user.id}, {onConflict:"user_id", ignoreDuplicates:true});
  if (gErr) throw gErr;
  const [{data:profile,error:pe},{data:progress,error:ge}] = await Promise.all([
    supabase.from("vox_profiles").select("*").eq("id",user.id).single(),
    supabase.from("vox_progress").select("*").eq("user_id",user.id).single()
  ]);
  if (pe) throw pe;
  if (ge) throw ge;
  state.profile = { username: profile.username || username, character: profile.character_id || "Edward" };
  state.progress = { xp:progress.xp||0, credits:progress.credits||0, anomalies:progress.anomalies||0, missions:progress.missions||0 };
}

export async function saveCloudProgress() {
  if (!supabaseReady || !state.user) return;
  const {error} = await supabase.from("vox_progress").upsert({
    user_id:state.user.id, ...state.progress, updated_at:new Date().toISOString()
  }, {onConflict:"user_id"});
  if (error) throw error;
}

export async function saveCloudProfile() {
  if (!supabaseReady || !state.user) return;
  const {error} = await supabase.from("vox_profiles").upsert({
    id:state.user.id, username:state.profile.username, character_id:state.profile.character
  }, {onConflict:"id"});
  if (error) throw error;
}
