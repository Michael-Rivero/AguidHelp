"use strict";

/* ============================================================
   Aguid@Help — Telas do Administrador (Gestão)
   RF16, RF17, RF18, RF19, RF20, RF21
   ============================================================ */

function viewAdminDashboard() {
  const app = $("#app");
  const dados = DB.dados();
  const profs = dados.usuarios.profissionais;
  const clis = dados.usuarios.clientes;
  const serv = dados.servicos;
  const concluidos = serv.filter((s) => ["concluido", "avaliado"].includes(s.status));
  const faturamento = concluidos.reduce((t, s) => t + brutoDe(s), 0);
  const comissoes = concluidos.reduce((t, s) => t + comissaoDe(s), 0);
  const ativos = serv.filter((s) => ["oportunidade", "aceito", "em_andamento"].includes(s.status)).length;
  const pendentes = profs.filter((p) => ["pendente", "em_analise"].includes(p.status)).length;

  // distribuição por status (mini gráfico)
  const porStatus = ["oportunidade", "aceito", "em_andamento", "concluido", "avaliado", "cancelado"]
    .map((st) => ({ st, qtd: serv.filter((s) => s.status === st).length }))
    .sort((a, b) => b.qtd - a.qtd);
  const maxSt = Math.max(1, ...porStatus.map((x) => x.qtd));

  app.innerHTML = `
    <h2>🛡️ Dashboard gerencial</h2>
    <p class="card-sub" style="margin-bottom:14px">Business intelligence da plataforma (RF16).</p>

    <div class="grid-3">
      <div class="card kpi-card"><div class="kpi-valor">${profs.length}</div><div class="kpi-rotulo">Profissionais (${pendentes} em análise)</div></div>
      <div class="card kpi-card"><div class="kpi-valor">${clis.length}</div><div class="kpi-rotulo">Clientes</div></div>
      <div class="card kpi-card"><div class="kpi-valor">${serv.length}</div><div class="kpi-rotulo">Serviços (${ativos} ativos)</div></div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 style="margin-bottom:8px">Faturamento</h3>
        <div class="kpi-valor montante">${fmtBrl(faturamento)}</div>
        <div class="card-sub">Comissões retidas: <b class="montante">${fmtBrl(comissoes)}</b> · Líquido repassável: <b class="montante">${fmtBrl(faturamento - comissoes)}</b></div>
      </div>
      <div class="card">
        <h3 style="margin-bottom:8px">Distribuição por status</h3>
        <div class="mini-grafico">
          ${porStatus.map((x) => `<div class="col"><div class="b" style="height:${Math.round((x.qtd / maxSt) * 70)}px"></div><span class="r">${x.qtd}</span><span class="r" style="font-size:.6rem">${x.st.split("_")[0]}</span></div>`).join("")}
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 style="margin-bottom:10px">Serviços em andamento</h3>
        ${serv.filter((s) => s.status === "em_andamento").length ? serv.filter((s) => s.status === "em_andamento").map(cardServico).join("") : `<div class="vazio">Nenhum serviço em execução agora.</div>`}
      </div>
      <div class="card">
        <h3 style="margin-bottom:10px">Feed de atividades</h3>
        <div class="flex-col" style="gap:8px">
          ${dados.logs.slice(0, 6).map((l) => `<div class="item" style="cursor:default;padding:8px"><span class="item-icone" style="font-size:1rem;width:32px;height:32px;flex-basis:32px">•</span><div class="item-corpo"><div class="item-sub">${l.msg}</div><div class="item-sub" style="font-size:.68rem">${l.data}</div></div></div>`).join("")}
        </div>
      </div>
    </div>`;

  $("#app .item[data-servico]").forEach((el) => el.onclick = () => navegar("/admin/monitoramento"));
}

/* ---------- Moderação (RF17) ---------- */
function viewAdminModeracao() {
  const app = $("#app");
  const dados = DB.dados();
  const render = () => {
    const lista = dados.usuarios.profissionais;
    app.innerHTML = `
      <h2>🔎 Curadoria e moderação</h2>
      <p class="card-sub" style="margin-bottom:14px">Analise documentos e aprove/reprove perfis (RF17).</p>
      <div class="card scroll-x">
        <table class="tabela">
          <thead><tr><th>Profissional</th><th>Áreas</th><th>Documentos</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${lista.map((p) => `
              <tr>
                <td>
                  <div class="flex" style="gap:8px">
                    <span class="avatar">${inicialNome(p.nome)}</span>
                    <div><b>${p.nome}</b><div class="card-sub">${p.email}</div></div>
                  </div>
                </td>
                <td>${p.areas.join(", ") || "—"}</td>
                <td><span class="tag">${p.documentos.length}/4</span></td>
                <td>${chipStatus(p.status)}</td>
                <td>
                  <div class="acoes">
                    <button class="btn btn-ghost btn-sm" data-docs="${p.id}">📄</button>
                    ${p.status !== "aprovado" ? `<button class="btn btn-verde btn-sm" data-aprov="${p.id}">Aprovar</button>` : ""}
                    ${p.status !== "reprovado" ? `<button class="btn btn-vermelho btn-sm" data-reprov="${p.id}">Reprovar</button>` : ""}
                  </div>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`;

    $$("[data-docs]").forEach((b) => b.onclick = () => {
      const p = lista.find((x) => x.id === b.dataset.docs);
      abrirModal(`
        <h3>📄 Documentos — ${p.nome}</h3>
        ${p.documentos.length ? `<div class="lista" style="margin-top:10px">
          ${p.documentos.map((d) => `<div class="doc-item"><span>📄</span><div class="nome">${d.tipo}</div><div class="status">${d.status === "aprovado" ? "✓" : d.status === "em_analise" ? "⏳" : "✕"}</div></div>`).join("")}
        </div>` : `<div class="vazio">Nenhum documento enviado.</div>`}
        ${p.documentos.filter((d) => d.status === "em_analise").length ? `<button class="btn btn-pri btn-sm btn-lg" id="dAprovaTodos">✓ Aprovar documentos em análise</button>` : ""}
        <div class="modal-acoes"><button class="btn btn-contorno btn-sm" id="dFecha">Fechar</button></div>`);
      $("#dFecha").onclick = fecharModal;
      if ($("#dAprovaTodos")) $("#dAprovaTodos").onclick = () => {
        p.documentos.forEach((d) => { if (d.status !== "aprovado") d.status = "aprovado"; });
        DB.salvar(); fecharModal(); render(); toast("Documentos aprovados.");
      };
    });

    $$("[data-aprov]").forEach((b) => b.onclick = () => {
      const p = lista.find((x) => x.id === b.dataset.aprov);
      confirmar(`<h3>Aprovar ${p.nome}?</h3><p class="card-sub">O profissional será liberado para receber oportunidades no mural (RF03/RF04).</p>`, () => {
        p.status = "aprovado";
        p.selos = ["Perfil verificado"];
        dados.logs.unshift({ id: uid("log"), data: `${hojeISO(0)} ${agoraHora()}`, msg: `${p.nome} aprovado(a) pela curadoria.` });
        DB.salvar(); render(); toast(`${p.nome} aprovado! ✅`);
      });
    });
    $$("[data-reprov]").forEach((b) => b.onclick = () => {
      const p = lista.find((x) => x.id === b.dataset.reprov);
      abrirModal(`
        <h3>Reprovar ${p.nome}?</h3>
        <div class="field"><label>Motivo da reprovação</label>
          <select id="rMotivo">
            <option>Documento de antecedentes criminais ausente</option>
            <option>Documento ilegível ou inválido</option>
            <option>Dados cadastrais inconsistentes</option>
            <option>Outro motivo</option>
          </select>
        </div>
        <div class="modal-acoes">
          <button class="btn btn-contorno btn-sm" id="rCancela">Cancelar</button>
          <button class="btn btn-vermelho btn-sm" id="rConfirma">Reprovar</button>
        </div>`);
      $("#rCancela").onclick = fecharModal;
      $("#rConfirma").onclick = () => {
        p.status = "reprovado";
        p.motivoRecusa = $("#rMotivo").value;
        dados.logs.unshift({ id: uid("log"), data: `${hojeISO(0)} ${agoraHora()}`, msg: `${p.nome} reprovado(a): ${p.motivoRecusa}` });
        DB.salvar(); fecharModal(); render(); toast("Cadastro reprovado.");
      };
    });
  };
  render();
}

/* ---------- Monitoramento (RF18) ---------- */
function viewAdminMonitoramento() {
  const app = $("#app");
  const dados = DB.dados();
  const ativos = dados.servicos.filter((s) => ["aceito", "em_andamento"].includes(s.status));
  app.innerHTML = `
    <h2>🛰️ Monitoramento em tempo real</h2>
    <p class="card-sub" style="margin-bottom:14px">Acompanhe a execução dos serviços ativos (RF18). Mapa logístico com Google Maps API (simulado).</p>
    <div class="card" style="background:var(--pri-claro);border-color:#bfdbfe;margin-bottom:14px">
      <div class="flex-between">
        <div><b>🗺️ Mapa operacional</b><div class="card-sub">Marcadores gerados a partir dos check-ins dos profissionais.</div></div>
        <button class="btn btn-pri btn-sm" id="bRecarregar">Recarregar</button>
      </div>
    </div>
    <div class="lista">
      ${ativos.length ? ativos.map((s) => `
        <div class="item">
          <span class="item-icone">${s.status === "em_andamento" ? "🧽" : "📅"}</span>
          <div class="item-corpo">
            <div class="item-titulo">${s.tipo} — ${s.nomeCliente}</div>
            <div class="item-sub">${s.endereco.rua} · ${s.endereco.cidade} <span class="tag">lat ${s.endereco.lat?.toFixed(4)} / lng ${s.endereco.lng?.toFixed(4)}</span></div>
          </div>
          <div>${chipStatus(s.status)}</div>
        </div>`).join("") : `<div class="card vazio">Nenhum serviço ativo no momento.</div>`}
    </div>`;
  $("#bRecarregar").onclick = () => { toast("Mapa atualizado (integração simulada).", "ok"); viewAdminMonitoramento(); };
}

/* ---------- Repasses (RF20) ---------- */
function viewAdminRepasses() {
  const app = $("#app");
  const dados = DB.dados();
  const render = () => {
    const profs = dados.usuarios.profissionais;
    const pend = profs.filter((p) => p.saldoPendente > 0);
    const totalPend = pend.reduce((t, p) => t + p.saldoPendente, 0);

    app.innerHTML = `
      <h2>🔄 Conciliação e repasses</h2>
      <p class="card-sub" style="margin-bottom:14px">Valores devidos a cada profissional após dedução de comissão (RF20).</p>
      <div class="card">
        <div class="flex-between">
          <div><b>Total pendente de repasse</b><div class="kpi-valor montante" style="color:var(--ambar)">${fmtBrl(totalPend)}</div></div>
          <button class="btn btn-pri btn-lg" id="bPagar" ${totalPend <= 0 ? "disabled" : ""}>Pagar todos (lote) ✅</button>
        </div>
      </div>
      <div class="card scroll-x">
        <table class="tabela">
          <thead><tr><th>Profissional</th><th>Serviços concluídos</th><th>Avaliação</th><th>Pendente</th><th>Disponível</th><th>Repassar</th></tr></thead>
          <tbody>
            ${profs.map((p) => {
              const nConclu = dados.servicos.filter((s) => s.idProfissional === p.id && ["concluido", "avaliado"].includes(s.status)).length;
              return `
              <tr>
                <td><b>${p.nome}</b><div class="card-sub">${p.email}</div></td>
                <td>${nConclu}</td>
                <td>${p.avaliacaoMedia ? estrelasHtml(p.avaliacaoMedia) : "—"}</td>
                <td class="montante">${fmtBrl(p.saldoPendente)}</td>
                <td class="montante pos">${fmtBrl(p.saldoDisponivel)}</td>
                <td><button class="btn btn-verde btn-sm" data-repasse="${p.id}" ${p.saldoPendente <= 0 ? "disabled" : ""}>Repassar</button></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`;

    const repassar = (p) => {
      p.saldoDisponivel = Math.round((p.saldoDisponivel + p.saldoPendente) * 100) / 100;
      p.extrato.unshift({ data: hojeISO(0), desc: "Repasse liberado pela plataforma (líquido)", valor: Math.round(p.saldoPendente * 100) / 100 });
      dados.logs.unshift({ id: uid("log"), data: `${hojeISO(0)} ${agoraHora()}`, msg: `Repasse de ${fmtBrl(p.saldoPendente)} liberado para ${p.nome}.` });
      p.saldoPendente = 0;
      DB.salvar();
      toast(`Repasse liberado para ${p.nome}! 💚`, "ok");
      render();
    };

    $("#bPagar").onclick = () => {
      confirmar(`<h3>Liberar todos os repasses?</h3><p class="card-sub">${fmtBrl(totalPend)} serão movidos para as carteiras dos profissionais (transação via gateway — simulada).</p>`,
        () => { pend.forEach(repassar); });
    };
    $$("[data-repasse]").forEach((b) => b.onclick = () => {
      const p = profs.find((x) => x.id === b.dataset.repasse);
      confirmar(`<h3>Repassar ${p.nome}?</h3><p class="card-sub">${fmtBrl(p.saldoPendente)} será liberado para a carteira dele(a).</p>`, () => repassar(p));
    });
  };
  render();
}

/* ---------- Configuração do negócio (RF19) + checklist (RF21) ---------- */
function viewAdminConfig() {
  const app = $("#app");
  const dados = DB.dados();
  const cfg = dados.config;
  const render = () => {
    app.innerHTML = `
      <h2>⚙️ Configuração do negócio</h2>
      <p class="card-sub" style="margin-bottom:14px">Preços, comissões e categorias — sem necessidade de programação (RF19).</p>

      <div class="card">
        <h3 style="margin-bottom:10px">💰 Preços e taxas</h3>
        <div class="grid-2">
          <div class="field"><label>Residencial (R$ / cômodo)</label><input id="cRes" type="number" value="${cfg.precoResidencial}" /></div>
          <div class="field"><label>Comercial (R$ / cômodo)</label><input id="cCom" type="number" value="${cfg.precoComercial}" /></div>
          <div class="field"><label>Pós-obra (R$ / m²)</label><input id="cPos" type="number" value="${cfg.precoPosObraM2}" /></div>
          <div class="field"><label>Comissão da plataforma (%)</label><input id="cComi" type="number" min="0" max="50" step="0.5" value="${Math.round(cfg.comissaoPct * 100 * 10) / 10}" /></div>
        </div>
        <div class="card-sub" style="margin-bottom:8px">Adicionais cobrados:</div>
        ${cfg.adicionais.map((a, i) => `
          <div class="linha"><span>${a.nome}</span><b class="montante">+${fmtBrl(a.extra)}</b></div>`).join("")}
        <button class="btn btn-pri" id="cSalva">Salvar configurações</button>
      </div>

      <div class="card">
        <h3 style="margin-bottom:10px">✅ Check-lists de qualidade (RF21)</h3>
        <p class="card-sub" style="margin-bottom:12px">Modelos de tarefas obrigatórias exibidas ao profissional durante a execução.</p>
        ${Object.keys(cfg.checklist).map((cat) => `
          <div style="margin-bottom:14px">
            <b>${cat}</b>
            ${cfg.checklist[cat].map((t, i) => `
              <div class="linha">
                <span style="flex:1">${t}</span>
                <button class="btn btn-ghost btn-sm" data-delchk="${cat}|${i}" style="color:var(--vermelho)">✕</button>
              </div>`).join("")}
            <div class="flex" style="margin-top:6px">
              <input id="novaTarefa_${cat}" placeholder="Nova tarefa..." style="flex:1;min-height:40px;border:1px solid var(--borda-forte);border-radius:10px;padding:8px 12px" />
              <button class="btn btn-ghost btn-sm" data-addchk="${cat}">+ Adicionar</button>
            </div>
          </div>`).join("")}
      </div>`;

    $("#cSalva").onclick = () => {
      cfg.precoResidencial = Number($("#cRes").value) || 45;
      cfg.precoComercial = Number($("#cCom").value) || 60;
      cfg.precoPosObraM2 = Number($("#cPos").value) || 18;
      cfg.comissaoPct = (Number($("#cComi").value) || 15) / 100;
      DB.salvar();
      toast("Configurações atualizadas! Os próximos orçamentos já refletem os valores. 💰", "ok");
    };
    $$("[data-delchk]").forEach((b) => b.onclick = () => {
      const [cat, i] = b.dataset.delchk.split("|");
      cfg.checklist[cat].splice(Number(i), 1);
      DB.salvar(); render();
    });
    $$("[data-addchk]").forEach((b) => b.onclick = () => {
      const cat = b.dataset.addchk;
      const inp = document.getElementById("novaTarefa_" + cat);
      const t = inp.value.trim();
      if (!t) { toast("Escreva a tarefa.", "erro"); return; }
      cfg.checklist[cat].push(t);
      DB.salvar(); render(); toast("Tarefa adicionada ao checklist.");
    });
  };
  render();
}