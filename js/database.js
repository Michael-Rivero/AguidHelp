"use strict";

/* ============================================================
   Aguid@Help — Camada de dados
   Persistência: 
   1) Se a API do servidor local estiver disponível (notebook),
      usa ela (arquivo JSON fora do OneDrive — sem nuvem).
   2) Senão, usa localStorage do navegador (funciona offline).
   ============================================================ */

const DB = {
  _dados: null,
  _modo: "local",          // "local" | "api"
  _apiURL: null,           // ex.: http://localhost:8933/api/dados
  _syncTimer: null,

  get apiDisponivel() { return this._modo === "api"; },

  /* Detecta a API do servidor (mesmo host/porta que serviu a página) */
  async detectar() {
    if (!location.protocol.startsWith("http")) { this._modo = "local"; return; }
    const base = location.origin;
    this._apiURL = base + "/api/dados";
    try {
      const resp = await fetch(this._apiURL, { method: "GET" });
      if (resp.ok) {
        const dados = await resp.json();
        // Só usa a API se o arquivo realmente contiver o banco (não {})
        if (dados && dados.usuarios && dados.config && Array.isArray(dados.servicos)) {
          this._modo = "api";
          this._dados = dados;
          console.info("[AguidHelp] Dados carregados da API do notebook.");
          return;
        }
        // API respondeu mas ainda não há banco: cria o seed e salva no notebook
        // (migra dados antigos do localStorage, se existirem)
        this._modo = "api";
        this._dados = carregarLocal() || GROW_SEED();
        await this._salvarAgora();
        console.info("[AguidHelp] Banco inicial criado no notebook via API.");
        return;
      }
    } catch (e) { /* servidor indisponível → localStorage */ }
    this._modo = "local";
    this._dados = carregarLocal();
    console.info("[AguidHelp] Dados carregados do localStorage (offline).");
  },

  /* Retorna os dados (inicia com seed se vazio) */
  dados() {
    if (!this._dados) this._dados = carregarLocal() || GROW_SEED();
    return this._dados;
  },

  /* Salva com debounce; se API, envia; senão grava no localStorage */
  salvar() {
    if (this._syncTimer) clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this._salvarAgora(), 120);
  },
  async _salvarAgora() {
    if (this._modo === "api") {
      try {
        await fetch(this._apiURL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this._dados),
        });
      } catch (e) {
        salvarLocal(this._dados);
        console.warn("[AguidHelp] API indisponível, salvo no localStorage.", e);
      }
    } else {
      salvarLocal(this._dados);
    }
  },

  resetar() {
    this._dados = GROW_SEED();
    this.salvar();
    return this._dados;
  },
};

/* ---------- localStorage ---------- */
const CHAVE_DB = "aguidhelp:db:v1";
function carregarLocal() {
  try {
    const raw = localStorage.getItem(CHAVE_DB);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return d && typeof d === "object" ? d : null;
  } catch (e) { return null; }
}
function salvarLocal(dados) {
  try { localStorage.setItem(CHAVE_DB, JSON.stringify(dados)); }
  catch (e) { console.warn("Não foi possível salvar no localStorage", e); }
}

/* ---------- Utilidades de dados ---------- */
let _seq = 0;
function uid(prefixo) {
  return (prefixo || "id") + Date.now().toString(36) + (_seq++).toString(36);
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlSem = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function fmtBrl(v) { return brl.format(Number(v) || 0); }
function fmtPct(v) { return (Number(v) || 0).toFixed(1).replace(".", ",") + "%"; }
function hojeISO(offsetDias) {
  const d = new Date();
  d.setDate(d.getDate() + (offsetDias || 0));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fmtDataCurta(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
function fmtDataLonga(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function agoraHora() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
function inicialNome(nome) {
  return (nome || "?").trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}
function diasAte(iso) {
  const hoje = new Date(hojeISO() + "T12:00:00");
  const alvo = new Date(iso + "T12:00:00");
  return Math.round((alvo - hoje) / 86400000);
}
function distanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function horaHoras(durMin) {
  return durMin >= 60 ? (durMin / 60).toFixed(1).replace(".", ",") + "h" : durMin + " min";
}