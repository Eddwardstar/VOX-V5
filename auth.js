import { supabase, supabaseReady } from "./database.js";
import { state } from "./state.js";
import { showApp, showAuth, setText, toast } from "./ui.js";
import { loadCloudData } from "./database.js";

function form(id, handler) {
  document.querySelector(id)?.addEventListener("submit", async e => {
    e.preventDefault();
    try { await handler(e); } catch (err) { setText("#auth-message", err.message || "Falha na autenticação."); }
  });
}

export function initAuth(onReady) {
  const login = document.querySelector("#login-form");
  const register = document.querySelector("#register-form");
  const recovery = document.querySelector("#recovery-form");
  const newPassword = document.querySelector("#new-password-form");

  form("#login-form", async () => {
    if (!supabaseReady) throw new Error("Configure o Supabase em js/config.js ou use o modo demonstração.");
    const {error} = await supabase.auth.signInWithPassword({email:login.querySelector("#login-email").value.trim(),password:login.querySelector("#login-password").value});
    if (error) throw error;
  });

  form("#register-form", async () => {
    if (!supabaseReady) throw new Error("Configure o Supabase em js/config.js para criar contas.");
    const username = register.querySelector("#register-username").value.trim();
    const {data,error} = await supabase.auth.signUp({email:register.querySelector("#register-email").value.trim(),password:register.querySelector("#register-password").value,options:{data:{username}}});
    if (error) throw error;
    if (!data.session) setText("#auth-message","Conta criada! Confira seu e-mail para confirmar o cadastro.");
  });

  form("#recovery-form", async () => {
    if (!supabaseReady) throw new Error("Recuperação exige conexão com Supabase.");
    const email = recovery.querySelector("#recovery-email").value.trim();
    const {error} = await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin + location.pathname});
    if (error) throw error;
    setText("#auth-message","Se o e-mail estiver cadastrado, você receberá as instruções.");
  });

  form("#new-password-form", async () => {
    const password = newPassword.querySelector("#new-password").value;
    const {error} = await supabase.auth.updateUser({password});
    if (error) throw error;
    setText("#auth-message","Senha atualizada. Entre novamente.");
  });

  document.querySelector("#show-register")?.addEventListener("click",()=>showForm("#register-form"));
  document.querySelector("#show-login")?.addEventListener("click",()=>showForm("#login-form"));
  document.querySelector("#show-recovery")?.addEventListener("click",()=>showForm("#recovery-form"));

  document.querySelector("#demo-login")?.addEventListener("click",()=>{
    state.demo = true;
    state.user = null;
    state.profile.username = "Pesquisador";
    showApp();
    onReady();
    toast("Modo demonstração iniciado. Progresso salvo neste navegador.");
  });

  if (supabaseReady) {
    supabase.auth.onAuthStateChange((event,session)=>{
      if (event === "PASSWORD_RECOVERY") { showAuth(); showForm("#new-password-form"); return; }
      if (session?.user) finishLogin(session.user,onReady);
      else if (event === "SIGNED_OUT") { state.user=null; showAuth(); }
    });
    supabase.auth.getSession().then(({data})=>{
      if (data.session?.user) finishLogin(data.session.user,onReady);
    });
  }
}

async function finishLogin(user,onReady) {
  try {
    await loadCloudData(user);
    state.demo = false;
    showApp();
    onReady();
  } catch (error) {
    setText("#auth-message",`Falha ao carregar dados: ${error.message}`);
  }
}

function showForm(id) {
  ["#login-form","#register-form","#recovery-form","#new-password-form"].forEach(sel=>document.querySelector(sel)?.classList.toggle("hidden",sel!==id));
  document.querySelector("#show-register")?.classList.toggle("hidden",id!=="#login-form");
  document.querySelector("#show-recovery")?.classList.toggle("hidden",id!=="#login-form");
  document.querySelector("#show-login")?.classList.toggle("hidden",id==="#login-form");
  setText("#auth-message","");
}
