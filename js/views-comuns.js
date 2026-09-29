"use strict";

/* ============================================================
   Aguid@Help — Telas comuns: login, cadastro, menu, LGPD
   ============================================================ */

let sessao = null;
let deferredInstallPrompt = null;

/* ---------- Instalação do PWA ---------- */
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

async function promptInstalar() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    try { await deferredInstallPrompt.userChoice; } catch (err) {}
    deferredInstallPrompt = null;
    return;
  }
  abrirModal(`
    <h3>📲 Instalar o Aguid@Help</h3>
    <p class="card-sub" style="margin-bottom:12px">Para a instalação o navegador precisa estar em uma conexão <b>HTTPS</b>.</p>
    <ol style="padding-left:18px;font-size:.88rem;line-height:1.8">
      <li><b>No celular:</b> rode o <b>tunel-celular.cmd</b> no notebook e abra no celular o link <b>https://...trycloudflare.com</b> que aparecer — depois toque em <b>Instalar</b> (ou ⋮ → <b>Adicionar à tela inicial</b>).</li>
      <li><b>No notebook (Chrome/Edge):</b> clique no ícone de instalar (⬇) na barra de endereço de <code>http://localhost:8933</code>.</li>
      <li>Ou use o menu ⋮ do navegador <b>→ Adicionar à tela inicial</b>.</li>
    </ol>
    <div class="modal-acoes"><button class="btn btn-pri btn-sm" id="instFecha">Entendi</button></div>`);
  $("#instFecha").onclick = fecharModal;
}

const ICONES = {
  home: "🏠", agenda: "📅", agendar: "➕", mural: "🗂️", servico: "🧽",
  financeiro: "💰", educacao: "🎓", perfil: "👤", enderecos: "📍",
  pagamentos: "💳", mensagens: "💬", admin: "🛡️", moderacao: "🔎",
  monitor: "🛰️", config: "⚙️", repasses: "🔄", sair: "🚪",
};

/* ---------- Login ---------- */
function viewLogin() {
  const app = $("#app");
  sessao = null;
  limparSessao();
  app.innerHTML = `
    <div class="login-wrap centro">
      <img src="icons/icon-192.png" alt="" class="login-logo" />
      <h1 style="font-size:1.7rem;letter-spacing:-0.03em">Aguid<span style="color:var(--pri)">@Help</span></h1>
      <p style="color:var(--texto-suave);font-size:0.9rem">Marketplace de limpeza profissional</p>

      <div class="login-papel">
        <button class="papel-btn ativo" data-papel="cliente"><span class="em">🧑‍💼</span>Cliente</button>
        <button class="papel-btn" data-papel="profissional"><span class="em">🧑‍🔧</span>Profissional</button>
        <button class="papel-btn" data-papel="admin"><span class="em">🛡️</span>Admin</button>
      </div>

      <div class="card" style="text-align:left">
        <h3 id="loginTitulo">Entrar como Cliente</h3>
        <div class="field">
          <label for="lEmail">E-mail</label>
          <input id="lEmail" type="email" placeholder="voce@email.com" autocomplete="username" />
        </div>
        <div class="field">
          <label for="lSenha">Senha</label>
          <input id="lSenha" type="password" placeholder="••••" autocomplete="current-password" />
        </div>
        <button class="btn btn-pri btn-lg" id="btnLogin">Entrar</button>
        <p style="text-align:center;font-size:0.8rem;margin-top:10px">
          Não tem conta? <a href="#/cadastro" style="color:var(--pri);font-weight:700">Criar cadastro</a>
        </p>
      </div>

      <div class="card" style="text-align:left">
        <p class="card-sub" style="margin-bottom:10px"><b>Acesso rápido de demonstração</b> (banca)</p>
        <button class="demo-btn" data-demo="ana"><b>🧑‍💼 Ana Souza — Cliente</b><span>ana@demo.com · senha 1234</span></button>
        <button class="demo-btn" data-demo="carlos"><b>🧑‍🔧 Carlos Lima — Profissional aprovado</b><span>carlos@demo.com · senha 1234</span></button>
        <button class="demo-btn" data-demo="maria"><b>🧑‍🔧 Maria Jesus — Profissional em análise</b><span>maria@demo.com · senha 1234</span></button>
        <button class="demo-btn" data-demo="admin"><b>🛡️ Administrador</b><span>admin@aguidhelp.com · senha admin123</span></button>
      </div>

      <p style="font-size:0.72rem;color:var(--texto-fraco);margin-top:14px">
        Projeto Integrador · Análise e Desenvolvimento de Sistemas · MVP de demonstração
      </p>

      <button class="btn btn-contorno btn-lg" id="btnInstalar" style="margin-top:10px">📲 Instalar o aplicativo</button>
    </div>`;

  let papel = "cliente";
  $$(".papel-btn").forEach((b) => b.onclick = () => {
    $$(".papel-btn").forEach((x) => x.classList.remove("ativo"));
    b.classList.add("ativo");
    papel = b.dataset.papel;
    $("#loginTitulo").textContent = papel === "cliente" ? "Entrar como Cliente" : papel === "profissional" ? "Entrar como Profissional" : "Entrar como Administrador";
  });

  $("#btnLogin").onclick = () => autenticar($("#lEmail").value.trim(), $("#lSenha").value, papel);
  $("#btnInstalar").onclick = () => promptInstalar();
  $$(".demo-btn").forEach((b) => b.onclick = () => {
    const mapa = {
      ana: ["cli-ana", "cliente"], carlos: ["prof-carlos", "profissional"],
      maria: ["prof-maria", "profissional"], admin: ["adm-1", "admin"],
    };
    const [id, perfil] = mapa[b.dataset.demo];
    entrar(id, perfil);
  });
}

function autenticar(email, senha, papel) {
  if (!email || !senha) { toast("Informe e-mail e senha.", "erro"); return; }
  const dados = DB.dados();
  let base, perfilEsperado;
  if (papel === "cliente") { base = dados.usuarios.clientes; perfilEsperado = "cliente"; }
  else if (papel === "profissional") { base = dados.usuarios.profissionais; perfilEsperado = "profissional"; }
  else { base = dados.admin; perfilEsperado = "admin"; }

  const u = base.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.senha === senha);
  if (!u) { toast("Credenciais inválidas para o perfil selecionado.", "erro"); return; }
  entrar(u.id, perfilEsperado);
}

function entrar(id, perfil) {
  const dados = DB.dados();
  let u = null;
  if (perfil === "cliente") u = dados.usuarios.clientes.find((x) => x.id === id);
  else if (perfil === "profissional") u = dados.usuarios.profissionais.find((x) => x.id === id);
  else u = dados.admin.find((x) => x.id === id);
  if (!u) { toast("Usuário não encontrado.", "erro"); return; }
  sessao = { id: u.id, perfil };
  salvarSessao();
  toast(`Bem-vindo(a), ${u.nome.split(" ")[0]}!`, "ok");
  navegar(homeDoPerfil(perfil));
}

function sair() {
  sessao = null;
  limparSessao();
  navegar("/login");
}

function homeDoPerfil(p) {
  return p === "cliente" ? "/cliente/home" : p === "profissional" ? "/profissional/home" : "/admin/dashboard";
}

function usuarioAtual() {
  if (!sessao) return null;
  const dados = DB.dados();
  if (sessao.perfil === "cliente") return dados.usuarios.clientes.find((x) => x.id === sessao.id) || null;
  if (sessao.perfil === "profissional") return dados.usuarios.profissionais.find((x) => x.id === sessao.id) || null;
  return dados.admin.find((x) => x.id === sessao.id) || null;
}

/* sessão sobrevive ao F5 (só nesta aba) */
const CHAVE_SESSAO = "aguidhelp:sessao";
function salvarSessao() { try { sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao)); } catch (e) {} }
function carregarSessao() { try { return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO)); } catch (e) { return null; } }
function limparSessao() { try { sessionStorage.removeItem(CHAVE_SESSAO); } catch (e) {} }

/* ---------- Cadastro ---------- */
function viewCadastro() {
  const app = $("#app");
  sessao = null;
  limparSessao();
  app.innerHTML = `
    <div class="login-wrap">
      <button class="btn btn-ghost btn-sm" onclick="navegar('/login')">← Voltar ao login</button>
      <div class="card">
        <h3>🆕 Criar conta no Aguid@Help</h3>
        <div class="login-papel" style="margin:12px 0 14px">
          <button class="papel-btn ativo" data-cp="cliente"><span class="em">🧑‍💼</span>Cliente</button>
          <button class="papel-btn" data-cp="profissional"><span class="em">🧑‍🔧</span>Profissional</button>
        </div>
        <div class="field"><label>Nome completo</label><input id="cNome" placeholder="Seu nome completo" /></div>
        <div class="grid-2">
          <div class="field"><label>E-mail</label><input id="cEmail" type="email" placeholder="voce@email.com" /></div>
          <div class="field"><label>Senha</label><input id="cSenha" type="password" placeholder="Mín. 4 dígitos" /></div>
        </div>
        <div class="grid-2">
          <div class="field"><label>Telefone (WhatsApp)</label><input id="cTel" placeholder="(11) 99999-9999" /></div>
          <div class="field"><label>CPF</label><input id="cCpf" placeholder="000.000.000-00" /></div>
        </div>
        <div class="field"><label>Data de nascimento</label><input id="cNasc" type="date" /></div>
        <div id="areaProf" hidden>
          <div class="field"><label>Áreas de atuação</label>
            <select id="cAreas">
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Pós-obra">Pós-obra</option>
            </select>
          </div>
          <div class="field"><label>Serviços que oferece</label>
            <select id="cServicos">
              <option>Faxina simples</option><option>Faxina pesada</option>
              <option>Limpeza pós-obra</option><option>Passadoria</option><option>Limpeza de escritórios</option>
            </select>
          </div>
        </div>
        <button class="btn btn-pri btn-lg" id="btnCadastrar">Criar conta</button>
        <p class="card-sub" style="margin-top:10px;text-align:center">
          Profissionais passam por verificação de documentos e análise da plataforma (RF02/RF03).
        </p>
      </div>
    </div>`;

  let tp = "cliente";
  $$(".papel-btn").forEach((b) => b.onclick = () => {
    $$(".papel-btn").forEach((x) => x.classList.remove("ativo"));
    b.classList.add("ativo");
    tp = b.dataset.cp;
    $("#areaProf").hidden = tp !== "profissional";
  });

  $("#btnCadastrar").onclick = () => {
    const nome = $("#cNome").value.trim();
    const email = $("#cEmail").value.trim();
    const senha = $("#cSenha").value;
    const tel = $("#cTel").value.trim();
    const cpf = $("#cCpf").value.trim();
    const nasc = $("#cNasc").value;
    if (!nome || !email || !senha || !tel || !cpf || !nasc) { toast("Preencha todos os campos.", "erro"); return; }
    if (senha.length < 4) { toast("Senha deve ter ao menos 4 caracteres.", "erro"); return; }

    const dados = DB.dados();
    const existe = [...dados.usuarios.clientes, ...dados.usuarios.profissionais].some((x) => x.email.toLowerCase() === email.toLowerCase());
    if (existe) { toast("Este e-mail já está cadastrado.", "erro"); return; }

    if (tp === "profissional") {
      dados.usuarios.profissionais.push({
        id: uid("prof"), nome, email, senha, perfil: "profissional",
        telefone: tel, cpf, nascimento: nasc, status: "pendente",
        areas: [$("#cAreas").value], servicosOferecidos: [$("#cServicos").value],
        experiencia: "", foto: null, perfilCompleto: 40,
        competencias: {}, documentos: [], avaliacaoMedia: 0, avaliacoesN: 0, servicosConcluidos: 0,
        saldoDisponivel: 0, saldoPendente: 0, extrato: [], selos: [],
        localizacao: { lat: -23.5505, lng: -46.6333, cidade: "São Paulo - SP" },
        cursos: [], biografia: "",
      });
    } else {
      dados.usuarios.clientes.push({
        id: uid("cli"), nome, email, senha, perfil: "cliente",
        telefone: tel, cpf, nascimento: nasc,
        enderecos: [], formasPagamento: [], assinaturas: [],
      });
      // Cliente novo já ganha o endereço principal padrão do demo para facilitar agendamentos
    }
    DB.salvar();
    toast("Cadastro criado com sucesso! Faça login.", "ok");
    navegar("/login");
  };
}

/* ---------- Menu (drawer) e topbar substituem por perfil ---------- */
let MENU_ITENS_SESSAO = [];
let DRAWER_EXTRA = "";

function montarMenus() {
  if (!sessao) return;
  const u = usuarioAtual();
  const ini = inicialNome(u ? u.nome : "");
  DRAWER_EXTRA = `
    <div class="flex" style="padding:8px 12px 16px;border-bottom:1px solid var(--borda);margin-bottom:10px">
      <span class="avatar">${ini}</span>
      <div><b>${u ? u.nome : ""}</b><div style="font-size:0.72rem;color:var(--texto-suave)">${u ? u.email : ""}</div></div>
    </div>`;

  if (sessao.perfil === "cliente") {
    MENU_ITENS_SESSAO = [
      { icone: ICONES.home, label: "Início", hash: "/cliente/home" },
      { icone: ICONES.agendar, label: "Agendar limpeza", hash: "/cliente/agendar" },
      { icone: ICONES.agenda, label: "Meus pedidos", hash: "/cliente/pedidos" },
      { icone: ICONES.enderecos, label: "Endereços", hash: "/cliente/enderecos" },
      { icone: ICONES.pagamentos, label: "Pagamentos", hash: "/cliente/pagamentos" },
      { icone: ICONES.mensagens, label: "Mensagens", hash: "/cliente/mensagens" },
      { icone: ICONES.perfil, label: "Minha conta · LGPD", hash: "/cliente/conta" },
      { icone: ICONES.sair, label: "Sair", hash: "/sair" },
    ];
  } else if (sessao.perfil === "profissional") {
    MENU_ITENS_SESSAO = [
      { icone: ICONES.home, label: "Início", hash: "/profissional/home" },
      { icone: ICONES.mural, label: "Mural de oportunidades", hash: "/profissional/mural" },
      { icone: ICONES.agenda, label: "Meus serviços", hash: "/profissional/servicos" },
      { icone: ICONES.financeiro, label: "Financeiro e saques", hash: "/profissional/financeiro" },
      { icone: ICONES.educacao, label: "Aguid@Educação", hash: "/profissional/educacao" },
      { icone: ICONES.mensagens, label: "Mensagens", hash: "/profissional/mensagens" },
      { icone: ICONES.perfil, label: "Meu perfil e competências", hash: "/profissional/perfil" },
      { icone: ICONES.perfil, label: "🛡️ Documentos e verificação", hash: "/profissional/documentos" },
      { icone: ICONES.sair, label: "Sair", hash: "/sair" },
    ];
  } else {
    MENU_ITENS_SESSAO = [
      { icone: ICONES.admin, label: "Dashboard", hash: "/admin/dashboard" },
      { icone: ICONES.moderacao, label: "Moderação de perfis", hash: "/admin/moderacao" },
      { icone: ICONES.monitor, label: "Monitoramento", hash: "/admin/monitoramento" },
      { icone: ICONES.repasses, label: "Repasses financeiros", hash: "/admin/repasses" },
      { icone: ICONES.config, label: "Configuração do negócio", hash: "/admin/config" },
      { icone: ICONES.sair, label: "Sair", hash: "/sair" },
    ];
  }
}

/* ---------- Topbar comum por perfil ---------- */
function renderTopbar() {
  const top = $("#topbar");
  top.hidden = false;
  const u = usuarioAtual();
  const rotulos = {
    cliente: ["Cliente", "Agende sua limpeza"],
    profissional: ["Profissional", "Seus serviços e ganhos"],
    admin: ["Administração", "Operação da plataforma"],
  };
  const [nomePerfil, sub] = rotulos[sessao.perfil] || ["", ""];
  $("#topbarSub").textContent = sub || "Limpeza profissional";
  const right = $("#topbarRight");
  right.innerHTML = `
    <span class="tag">${nomePerfil}</span>
    <button class="icon-btn" id="btnTopMenu" aria-label="Menu">☰</button>`;
  $("#btnTopMenu").onclick = () => renderDrawer(MENU_ITENS_SESSAO, DRAWER_EXTRA);
}

/* ---------- LGPD / Conta (Cliente e Profissional usam esta tela) ---------- */
function viewContaLGPD(perfilBase) {
  const app = $("#app");
  const u = usuarioAtual();
  app.innerHTML = `
    <h2>👤 Minha conta</h2>
    <p class="card-sub" style="margin-bottom:14px">Dados pessoais, privacidade e conformidade com a LGPD (RF25).</p>

    <div class="card">
      <h3 style="margin-bottom:12px">Dados da conta</h3>
      <div class="linha"><span>Nome</span><b>${u.nome}</b></div>
      <div class="linha"><span>E-mail</span><b>${u.email}</b></div>
      <div class="linha"><span>Telefone</span><b>${u.telefone || "—"}</b></div>
      <div class="linha"><span>CPF</span><b>${u.cpf || "—"}</b></div>
      <div class="linha"><span>Perfil</span><b>${perfilBase === "cliente" ? "Cliente" : "Profissional"}</b></div>
    </div>

    <div class="card">
      <h3 style="margin-bottom:12px">🛡️ Privacidade e LGPD</h3>
      <p class="card-sub" style="margin-bottom:12px">
        Você tem direito ao controle dos seus dados pessoais, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).
      </p>
      <button class="btn btn-contorno btn-sm" id="bExportar">⬇️ Exportar meus dados (JSON)</button>
      <p class="card-sub" style="margin-top:8px">Baixe uma cópia de tudo o que a plataforma possui sobre você.</p>
    </div>

    <div class="card" style="border-color:#fecaca">
      <h3 style="margin-bottom:12px;color:var(--vermelho)">⚠️ Zona de exclusão</h3>
      <p class="card-sub" style="margin-bottom:12px">Solicitar a exclusão da conta anonimiza seus dados na plataforma.</p>
      <button class="btn btn-vermelho btn-sm" id="bExcluir">Excluir minha conta</button>
    </div>`;

  $("#bExportar").onclick = () => {
    const blob = new Blob([JSON.stringify({ usuario: u, dadosGerais: "Exportação LGPD — Aguid@Help" }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `aguid-lgpd-${u.email}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Dados exportados.", "ok");
  };
  $("#bExcluir").onclick = () => confirmar(
    `<h3>Excluir conta?</h3><p class="card-sub">Seus dados serão anonimizados e você sairá do aplicativo. Esta ação simula o direito ao esquecimento (LGPD).</p>`,
    () => {
      const dados = DB.dados();
      const alvo = perfilBase === "cliente" ? dados.usuarios.clientes : dados.usuarios.profissionais;
      const i = alvo.findIndex((x) => x.id === u.id);
      if (i >= 0) alvo[i].nome = "(dados anonimizados)";
      if (i >= 0) alvo[i].excluido = true;
      if (i >= 0) alvo[i].email = "anonimizado@aguidhelp.local";
      DB.salvar();
      toast("Conta anonimizada. Obrigado por usar o Aguid@Help.", "ok");
      sair();
    });
}

/* ---------- Chat (modal) ---------- */
function abrirChat(s) {
  const eu = usuarioAtual();
  const euEhCliente = sessao.perfil === "cliente";
  abrirModal(`
    <h3>💬 Chat do serviço — ${s.tipo}</h3>
    <p class="card-sub">${s.endereco.rua}</p>
    <div class="chat-box" id="chatMsgs"></div>
    <div class="flex" style="margin-top:10px">
      <input id="chatInput" placeholder="Escreva sua mensagem..." style="flex:1;min-height:44px;border:1px solid var(--borda-forte);border-radius:12px;padding:10px 12px" />
      <button class="btn btn-pri" id="chatEnviar">➤</button>
    </div>`);
  const render = () => {
    const boxEl = $("#chatMsgs");
    boxEl.innerHTML = (s.chat || []).map((m) =>
      `<div class="msg ${(euEhCliente ? m.de === "cliente" : m.de === "profissional") ? "minha" : "deles"}">${m.texto}<span class="mt">${m.hora}</span></div>`).join("") ||
      `<div class="vazio">Nenhuma mensagem ainda. Inicie a conversa! 💬</div>`;
    boxEl.scrollTop = boxEl.scrollHeight;
  };
  render();
  $("#chatEnviar").onclick = () => {
    const inp = $("#chatInput");
    const txt = inp.value.trim();
    if (!txt) return;
    s.chat = s.chat || [];
    s.chat.push({ de: euEhCliente ? "cliente" : "profissional", texto: txt, hora: agoraHora() });
    inp.value = "";
    DB.salvar();
    render();
  };
}

/* ---------- Timeline de status do serviço ---------- */
function timelineServico(s) {
  const mapa = {
    "oportunidade": ["Aguardando profissional", "Serviço disponível para aceite no mural"],
    "aceito": ["Serviço aceito", "Profissional agendado (ou \"profissional a caminho\" no dia)"],
    "em_andamento": ["Check-in realizado", "Limpeza em execução no local"],
    "concluido": ["Check-out realizado", "Serviço concluído — aguardando avaliação"],
    "avaliado": ["Avaliação concluída", "Nota e comentário registrados"],
    "cancelado": ["Cancelado", "Serviço cancelado"],
  };
  const ordem = ["oportunidade", "aceito", "em_andamento", "concluido", "avaliado"];
  const idxAtual = ordem.indexOf(s.status);
  return ordem.map((st, i) => {
    const cls = i < idxAtual ? "feito" : i === idxAtual ? "atual" : "";
    const [tit, sub] = mapa[st];
    const de = st === "cancelado" ? "" : (s.timeline || []).find((t) => t.status === st);
    return `<div class="tl-item ${cls}">
      <span class="tl-ponto"></span>
      <div><div class="tl-titulo">${tit}</div>
      <div class="tl-sub">${sub}${de && de.hora ? " · " + de.hora : ""}</div></div>
    </div>`;
  }).join("");
}