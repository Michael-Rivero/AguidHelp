"use strict";

/* ============================================================
   Aguid@Help — Roteador e inicialização
   ============================================================ */

const ROTAS = {
  "/login": { fn: () => viewLogin(), publico: true },
  "/cadastro": { fn: () => viewCadastro(), publico: true },
  "/sair": { fn: () => sair() },

  // Cliente
  "/cliente/home": { fn: () => viewClienteHome(), perfil: "cliente" },
  "/cliente/agendar": { fn: () => viewClienteAgendar(), perfil: "cliente" },
  "/cliente/pedidos": { fn: () => viewClientePedidos(), perfil: "cliente" },
  "/cliente/enderecos": { fn: () => viewClienteEnderecos(), perfil: "cliente" },
  "/cliente/pagamentos": { fn: () => viewClientePagamentos(), perfil: "cliente" },
  "/cliente/mensagens": { fn: () => viewClienteMensagens(), perfil: "cliente" },
  "/cliente/conta": { fn: () => viewContaLGPD("cliente"), perfil: "cliente" },

  // Profissional
  "/profissional/home": { fn: () => viewProfHome(), perfil: "profissional" },
  "/profissional/perfil": { fn: () => viewProfPerfil(), perfil: "profissional" },
  "/profissional/documentos": { fn: () => viewProfDocumentos(), perfil: "profissional" },
  "/profissional/mural": { fn: () => viewProfMural(), perfil: "profissional" },
  "/profissional/servicos": { fn: () => viewProfServicos(), perfil: "profissional" },
  "/profissional/financeiro": { fn: () => viewProfFinanceiro(), perfil: "profissional" },
  "/profissional/educacao": { fn: () => viewProfEducacao(), perfil: "profissional" },
  "/profissional/mensagens": { fn: () => viewProfMensagens(), perfil: "profissional" },
  "/profissional/conta": { fn: () => viewContaLGPD("profissional"), perfil: "profissional" },

  // Admin
  "/admin/dashboard": { fn: () => viewAdminDashboard(), perfil: "admin" },
  "/admin/moderacao": { fn: () => viewAdminModeracao(), perfil: "admin" },
  "/admin/monitoramento": { fn: () => viewAdminMonitoramento(), perfil: "admin" },
  "/admin/repasses": { fn: () => viewAdminRepasses(), perfil: "admin" },
  "/admin/config": { fn: () => viewAdminConfig(), perfil: "admin" },

  // Telas com parâmetro (id)
  "/cliente/servico": { fn: (id) => viewClienteServico(id), perfil: "cliente" },
  "/profissional/servico": { fn: (id) => viewProfServico(id), perfil: "profissional" },
};

const TABS = {
  cliente: [
    { icone: ICONES.home, label: "Início", hash: "/cliente/home" },
    { icone: ICONES.agendar, label: "Agendar", hash: "/cliente/agendar" },
    { icone: ICONES.agenda, label: "Pedidos", hash: "/cliente/pedidos" },
    { icone: ICONES.mensagens, label: "Msg", hash: "/cliente/mensagens" },
    { icone: ICONES.perfil, label: "Conta", hash: "/cliente/conta" },
  ],
  profissional: [
    { icone: ICONES.home, label: "Início", hash: "/profissional/home" },
    { icone: ICONES.mural, label: "Mural", hash: "/profissional/mural" },
    { icone: ICONES.agenda, label: "Serviços", hash: "/profissional/servicos" },
    { icone: ICONES.financeiro, label: "Finanças", hash: "/profissional/financeiro" },
    { icone: ICONES.educacao, label: "Cursos", hash: "/profissional/educacao" },
  ],
  admin: [
    { icone: ICONES.admin, label: "Dashboard", hash: "/admin/dashboard" },
    { icone: ICONES.moderacao, label: "Moderação", hash: "/admin/moderacao" },
    { icone: ICONES.monitor, label: "Monitor.", hash: "/admin/monitoramento" },
    { icone: ICONES.repasses, label: "Repasses", hash: "/admin/repasses" },
    { icone: ICONES.config, label: "Config", hash: "/admin/config" },
  ],
};

function mostrarBarra(sel) {
  const el = $(sel);
  el.hidden = false;
  el.style.display = sel === "#topbar" || sel === "#tabbar" ? "flex" : "block";
}
function ocultarBarra(sel) {
  const el = $(sel);
  el.hidden = true;
  el.style.display = "none";
}

function rotear() {
  if (!window.DB_CARREGADO) return;
  fecharDrawer();
  fecharModal();
  const raw = hashAtual();
  const partes = raw.split("/").filter(Boolean); // ex.: ["cliente","servico","svc-1"]
  const base = "/" + partes.join("/");
  let rota = ROTAS[base];
  let param = null;
  if (!rota && partes.length >= 3) {
    const chave = "/" + partes.slice(0, 2).join("/");
    rota = ROTAS[chave];
    param = partes[2];
  }
  if (!rota) { rota = ROTAS["/login"]; param = null; }

  // Guarda de perfil
  if (!rota.publico) {
    if (!sessao) { navegar("/login"); return; }
    if (rota.perfil && sessao.perfil !== rota.perfil) {
      toast("Acesso restrito ao seu perfil.", "erro");
      navegar(homeDoPerfil(sessao.perfil));
      return;
    }
  }

  // Atualiza UI comum
  if (rota.publico || raw === "/sair" || raw === "") {
    ocultarBarra("#topbar");
    ocultarBarra("#tabbar");
  } else {
    mostrarBarra("#topbar");
    mostrarBarra("#tabbar");
    montarMenus();
    renderTopbar();
    const tabs = TABS[sessao.perfil] || [];
    renderTabbar(tabs.map((t) => ({ ...t })), base);
  }

  // Executa a tela
  rota.fn(param);
  $("#app").scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ---------- Registro de service worker (PWA) ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

/* ---------- Inicialização ---------- */
async function iniciar() {
  await DB.detectar();
  window.DB_CARREGADO = true;

  // restaura sessão da aba (login via sessionStorage)
  const s = carregarSessao();
  if (s && s.id && s.perfil) {
    const dados = DB.dados();
    const existe =
      (s.perfil === "cliente" && dados.usuarios.clientes.find((x) => x.id === s.id)) ||
      (s.perfil === "profissional" && dados.usuarios.profissionais.find((x) => x.id === s.id)) ||
      (s.perfil === "admin" && dados.admin.find((x) => x.id === s.id));
    if (existe) sessao = s;
    else limparSessao();
  }

  window.addEventListener("hashchange", rotear);
  aoPrimeiroUso();
  if (!location.hash) navegar(sessao ? homeDoPerfil(sessao.perfil) : "/login");
  else rotear();
}

/* Aviso rápido na primeira visita */
function aoPrimeiroUso() {
  try {
    if (localStorage.getItem("aguidhelp:visitado")) return;
    localStorage.setItem("aguidhelp:visitado", "1");
    setTimeout(() => {
      if (!sessao) toast("👋 Bem-vindo ao Aguid@Help! Use os botões de demonstração para explorar os 3 perfis.", "ok");
    }, 600);
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", iniciar);