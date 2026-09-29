"use strict";

/* ============================================================
   Aguid@Help — Utilitários de interface
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function toast(msg, tipo) {
  const box = $("#toasts");
  const el = document.createElement("div");
  el.className = "toast " + (tipo || "");
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function abrirModal(html) {
  $("#modalBox").innerHTML = html;
  $("#modalBackdrop").hidden = false;
  $("#modalBackdrop").style.display = "grid";
  document.body.style.overflow = "hidden";
}
function fecharModal() {
  $("#modalBackdrop").hidden = true;
  $("#modalBackdrop").style.display = "none";
  $("#modalBox").innerHTML = "";
  document.body.style.overflow = "";
}
$("#modalBackdrop").addEventListener("click", (e) => {
  if (e.target === $("#modalBackdrop")) fecharModal();
});

function confirmar(html, onOk) {
  const box = $("#confirmBox");
  box.innerHTML = html + `
    <div class="modal-acoes">
      <button class="btn btn-contorno btn-sm" id="confNao">Cancelar</button>
      <button class="btn btn-pri btn-sm" id="confSim">Confirmar</button>
    </div>`;
  $("#confirmBackdrop").hidden = false;
  $("#confirmBackdrop").style.display = "grid";
  const fechar = () => { $("#confirmBackdrop").hidden = true; $("#confirmBackdrop").style.display = "none"; box.innerHTML = ""; };
  $("#confNao").onclick = fechar;
  $("#confSim").onclick = () => { fechar(); onOk && onOk(); };
}

function chipStatus(status) {
  const mapa = {
    "oportunidade": ["chip-ambar", "Oportunidade"],
    "aceito": ["chip-pri", "Aceito / agendado"],
    "em_andamento": ["chip-pri", "Em andamento"],
    "concluido": ["chip-verde", "Concluído"],
    "avaliado": ["chip-verde", "Avaliado"],
    "cancelado": ["chip-vermelho", "Cancelado"],
    "aprovado": ["chip-verde", "Aprovado"],
    "em_analise": ["chip-ambar", "Em análise"],
    "reprovado": ["chip-vermelho", "Reprovado"],
    "pendente": ["chip-ambar", "Pendente"],
    "recusado": ["chip-vermelho", "Recusado"],
    "pago": ["chip-verde", "Pago"],
    "em_confirmacao": ["chip-ambar", "A confirmar"],
  };
  const c = mapa[status] || ["chip-cinza", status];
  return `<span class="chip ${c[0]}">${c[1]}</span>`;
}

function avatar(nome, cls) {
  return `<span class="avatar${cls ? " " + cls : ""}">${inicialNome(nome)}</span>`;
}

function estrelasHtml(nota) {
  const n = Math.round(Number(nota) || 0);
  let s = "";
  for (let i = 1; i <= 5; i++) s += `<span style="color:${i <= n ? "var(--ambar)" : "var(--borda-forte)"}">★</span>`;
  return `<span class="estrelas">${s}</span> <b>${(Number(nota) || 0).toFixed(1).replace(".", ",")}</b>`;
}

function listarEstrelas(nota) {
  let s = "";
  for (let i = 1; i <= 5; i++) s += (i <= Math.round(nota || 0) ? "★" : "☆");
  return s;
}

/* ---------- Navegação (hash) ---------- */
function navegar(hash) {
  location.hash = hash;
}
function hashAtual() {
  return location.hash.replace(/^#/, "") || "/login";
}

/* ---------- Barra de navegação inferior + menu ---------- */
function renderTabbar(itens, ativo) {
  const tab = $("#tabbar");
  tab.hidden = false;
  tab.innerHTML = "";
  for (const it of itens) {
    const b = document.createElement("button");
    b.className = it.hash === ativo ? "ativo" : "";
    b.setAttribute("aria-label", it.label);
    b.innerHTML = `<span class="tab-icone">${it.icone}</span><span>${it.label}</span>`;
    b.onclick = () => navegar(it.hash);
    tab.appendChild(b);
  }
}

function renderDrawer(itens, extraHtml) {
  const d = $("#drawer");
  d.innerHTML = (extraHtml || "") + itens.map((it) =>
    `<button class="menu-item" data-goto="${it.hash}">${it.icone} ${it.label}</button>`).join("");
  d.querySelectorAll("[data-goto]").forEach((b) => b.onclick = () => { fecharDrawer(); navegar(b.dataset.goto); });
  $("#overlay").hidden = false;
  $("#overlay").style.display = "block";
  d.hidden = false;
  d.style.display = "block";
}
function fecharDrawer() {
  $("#overlay").hidden = true;
  $("#overlay").style.display = "none";
  $("#drawer").hidden = true;
  $("#drawer").style.display = "none";
}
$("#overlay").addEventListener("click", fecharDrawer);
$("#btnMenu").addEventListener("click", () => renderDrawer(MENU_ITENS_SESSAO, DRAWER_EXTRA));

/* ---------- Cartão de serviço (reuso) ---------- */
function cardServico(s) {
  const temProf = s.idProfissional;
  const sub = `${s.tipo} · ${s.endereco.apelido || s.endereco.rua}`;
  return `
  <div class="item" data-servico="${s.id}">
    <span class="item-icone">🧼</span>
    <div class="item-corpo">
      <div class="item-titulo">${s.tipo} — ${fmtDataCurta(s.data)} às ${s.hora}</div>
      <div class="item-sub">${sub}${temProf ? " · " + nomeProfissional(temProf) : ""}</div>
      <div style="margin-top:5px">${chipStatus(s.status)}</div>
    </div>
    <div class="item-valor montante">${fmtBrl(s.valor)}</div>
  </div>`;
}
function nomeProfissional(id) {
  const p = DB.dados().usuarios.profissionais.find((x) => x.id === id);
  return p ? p.nome : "";
}
function nomeCliente(id) {
  const c = DB.dados().usuarios.clientes.find((x) => x.id === id);
  return c ? c.nome : "";
}

/* ---------- Helpers de fluxo financeiro ---------- */
function brutoDe(s) { return Number(s.valor) || 0; }
function comissaoDe(s) { return brutoDe(s) * (DB.dados().config.comissaoPct || 0.15); }
function liquidoDe(s) { return brutoDe(s) - comissaoDe(s); }