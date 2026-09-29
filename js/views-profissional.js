"use strict";

/* ============================================================
   Aguid@Help — Telas do Profissional (Prestador)
   RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF20, RF21
   ============================================================ */

function viewProfHome() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  const meus = dados.servicos.filter((s) => s.idProfissional === u.id);
  const hojeFlag = s => s.data === hojeISO(0);

  const statusCard = u.status !== "aprovado" ? `
    <div class="card" style="border-color:#fde68a;background:#fffbeb">
      <div class="flex-between">
        <div>
          <b>📋 Status da sua adesão (RF03)</b>
          <div class="card-sub" style="margin-top:4px">${statusAdesaoTexto(u)}</div>
        </div>
        ${chipStatus(u.status)}
      </div>
      <div class="barra" style="margin-top:12px"><span style="width:${barraAdesao(u)}%"></span></div>
      <div class="card-sub" style="margin-top:8px">${u.status === "pendente" ? "Complete o envio de documentos para iniciar a análise." : u.status === "em_analise" ? "A equipe administrativa está analisando seus documentos." : u.motivoRecusa || "Cadastro não liberado."}</div>
    </div>` : "";

  const pros = meus.filter((s) => ["aceito", "em_andamento"].includes(s.status)).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  const ganhos = meus.filter((s) => ["concluido", "avaliado"].includes(s.status)).reduce((t, s) => t + liquidoDe(s), 0);

  app.innerHTML = `
    <div class="hero">
      <h2>Olá, ${u.nome.split(" ")[0]}! 🧽</h2>
      <p>${u.status === "aprovado" ? "Veja suas oportunidades e serviços do dia." : "Complete seu cadastro para começar a receber oportunidades."}</p>
    </div>
    ${statusCard}

    <div class="grid-3">
      <div class="card kpi-card"><div class="kpi-valor" style="color:var(--verde)">${fmtBrl(u.saldoDisponivel)}</div><div class="kpi-rotulo">Disponível</div></div>
      <div class="card kpi-card"><div class="kpi-valor">${meus.filter((s) => hojeFlag(s)).length}</div><div class="kpi-rotulo">Serviços hoje</div></div>
      <div class="card kpi-card"><div class="kpi-valor montante">${fmtBrl(ganhos)}</div><div class="kpi-rotulo">Recebido (líquido)</div></div>
    </div>

    <div class="secao-titulo">Próximos serviços</div>
    <div class="lista">
      ${pros.length ? pros.map(cardServico).join("") : `<div class="card vazio">Nenhum serviço agendado. Veja o mural de oportunidades! 🗂️</div>`}
    </div>`;
  $$(".item[data-servico]").forEach((el) => el.onclick = () => navegar(`/profissional/servico/${el.dataset.servico}`));
}

function barraAdesao(u) {
  if (u.status === "aprovado") return 100;
  if (u.status === "pendente") return 45;
  if (u.status === "em_analise") return 75;
  return 30;
}
function statusAdesaoTexto(u) {
  if (u.status === "aprovado") return "Cadastro aprovado! Você já pode receber oportunidades.";
  if (u.status === "em_analise") return "Sua documentação está em análise pela equipe.";
  if (u.status === "pendente") return "Envie os documentos obrigatórios para liberar a análise.";
  return "Cadastro reprovado. Verifique o motivo e corrija os dados.";
}

/* ---------- Perfil e competências (RF01) ---------- */
function viewProfPerfil() {
  const app = $("#app");
  const u = usuarioAtual();
  const render = () => {
    app.innerHTML = `
      <div class="flex-between" style="margin-bottom:12px">
        <div><h2>👤 Meu perfil e competências</h2><p class="card-sub">Gestão de perfil e competências profissionais (RF01)</p></div>
        ${chipStatus(u.status)}
      </div>

      <div class="card">
        <div class="flex-between" style="margin-bottom:8px">
          <div class="flex"><span class="avatar-grande">${inicialNome(u.nome)}</span>
            <div><b style="font-size:1.05rem">${u.nome}</b>
              <div class="card-sub">${u.email} · ${u.telefone}</div>
              <div class="card-sub">${u.avaliacaoMedia ? estrelasHtml(u.avaliacaoMedia) + " · " + u.avaliacoesN + " avaliações" : "Sem avaliações ainda"}</div>
            </div>
          </div>
        </div>
        <div class="barra" style="margin:10px 0 6px"><span style="width:${u.perfilCompleto}%"></span></div>
        <div class="card-sub">Perfil ${u.perfilCompleto}% completo</div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:10px">Informações pessoais</h3>
        <div class="grid-2">
          <div class="field"><label>Nome completo</label><input id="pNome" value="${u.nome}" /></div>
          <div class="field"><label>Telefone</label><input id="pTel" value="${u.telefone || ""}" /></div>
          <div class="field"><label>CPF</label><input id="pCpf" value="${u.cpf || ""}" disabled /></div>
          <div class="field"><label>Data de nascimento</label><input type="date" value="${u.nascimento || ""}" disabled /></div>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:10px">Áreas de atuação</h3>
        <div class="flex" style="flex-wrap:wrap;gap:8px">
          ${["Residencial", "Comercial", "Pós-obra"].map((a) => `
            <label class="chip" style="padding:8px 14px;border:2px solid ${u.areas.includes(a) ? "var(--pri)" : "var(--borda)"};background:${u.areas.includes(a) ? "var(--pri-claro)" : "#fff"};cursor:pointer;color:${u.areas.includes(a) ? "var(--pri)" : "var(--texto-suave)"}">
              <input type="checkbox" data-area="${a}" ${u.areas.includes(a) ? "checked" : ""} style="display:none"/> ${a}
            </label>`).join("")}
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:10px">Experiência profissional</h3>
        <div class="field"><textarea id="pExp" placeholder="Conte sua experiência e qualificações...">${u.experiencia || ""}</textarea></div>
        <div class="field"><label>Serviços oferecidos</label>
          <div class="flex" style="flex-wrap:wrap;gap:8px">
            ${["Faxina simples", "Faxina pesada", "Limpeza pós-obra", "Passadoria", "Limpeza de escritórios"].map((s) => `
              <label class="chip chip-cinza" style="cursor:pointer"><input type="checkbox" data-svc="${s}" ${u.servicosOferecidos.includes(s) ? "checked" : ""} style="display:none"/> ${s}</label>`).join("")}
          </div>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:10px">Competências (níveis de habilidade)</h3>
        ${["Residencial", "Comercial", "Pós-obra"].map((c) => `
          <div class="linha">
            <span>${c}</span>
            <div style="flex:1;max-width:180px"><div class="barra"><span style="width:${u.competencias[c] || 0}%"></span></div></div>
            <b>${u.competencias[c] || 0}%</b>
          </div>`).join("")}
      </div>

      <button class="btn btn-pri btn-lg" id="pSalvar">Salvar alterações</button>`;

    $$("input[data-area]").forEach((cb) => cb.onchange = (e) => {
      if (e.target.checked) u.areas.push(e.target.dataset.area);
      else u.areas = u.areas.filter((x) => x !== e.target.dataset.area);
    });
    $$("input[data-svc]").forEach((cb) => cb.onchange = (e) => {
      if (e.target.checked) u.servicosOferecidos.push(e.target.dataset.svc);
      else u.servicosOferecidos = u.servicosOferecidos.filter((x) => x !== e.target.dataset.svc);
    });
    $("#pSalvar").onclick = () => {
      u.nome = $("#pNome").value.trim() || u.nome;
      u.telefone = $("#pTel").value.trim();
      u.experiencia = $("#pExp").value.trim();
      u.perfilCompleto = Math.min(100, 45 + (u.documentos.length * 10) + (u.experiencia ? 15 : 0) + (u.servicosOferecidos.length * 4));
      DB.salvar();
      toast("Perfil atualizado com sucesso!", "ok");
      navegar("/profissional/perfil");
    };
  };
  render();
}

/* ---------- Documentos / verificação de segurança (RF02) ---------- */
function viewProfDocumentos() {
  const app = $("#app");
  const u = usuarioAtual();
  const render = () => {
    app.innerHTML = `
      <h2>🛡️ Verificação de segurança</h2>
      <p class="card-sub" style="margin-bottom:14px">Upload de documentos e antecedentes criminais — pilar de credibilidade (RF02).</p>

      ${u.status === "aprovado" ? `<div class="aviso aviso-ok">✅ Sua documentação foi aprovada. Você está liberado para atuar.</div>` : u.status === "em_analise" ? `<div class="aviso aviso-alerta">🕓 Documentação em análise pela equipe administrativa.</div>` : `<div class="aviso aviso-info">📤 Envie os documentos obrigatórios abaixo para dar início à análise.</div>`}

      <div class="card">
        <h3 style="margin-bottom:12px">Documentos obrigatórios</h3>
        ${["RG", "CPF", "Comprovante de residência", "Antecedentes criminais"].map((doc) => {
          const d = u.documentos.find((x) => x.tipo === doc);
          return `
            <div class="doc-item">
              <span>📄</span>
              <div class="nome">${doc}</div>
              ${d ? `<span class="status ${d.status === "aprovado" ? "pos" : d.status === "em_analise" ? "" : "neg"}">${d.status === "aprovado" ? "✓ aprovado" : d.status === "em_analise" ? "⏳ em análise" : "⇄ reenviar"}</span>`
                : `<span class="status" style="color:var(--texto-fraco)">não enviado</span>`}
              <button class="btn btn-ghost btn-sm" data-doc="${doc}">${d ? "Trocar" : "Enviar"}</button>
            </div>`;
        }).join("")}
        <div class="card-sub" style="margin-top:10px">🔒 Os arquivos são criptografados e tratados conforme a LGPD.</div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:12px">Barra de progresso do onboarding</h3>
        <div class="barra verde"><span style="width:${u.documentos.filter((d) => d.status === "aprovado").length * 25}%"></span></div>
        <div class="card-sub" style="margin-top:6px">${u.documentos.filter((d) => d.status === "aprovado").length} de 4 documentos aprovados</div>
      </div>`;

    $$("[data-doc]").forEach((b) => b.onclick = () => {
      const tipo = b.dataset.doc;
      abrirModal(`
        <h3>📄 Enviar — ${tipo}</h3>
        <div class="aviso aviso-info">Selecione um arquivo PDF ou imagem do seu dispositivo (simulado no MVP).</div>
        <input type="file" id="docFile" accept=".pdf,image/*" style="display:block;margin:12px 0" />
        <div class="modal-acoes">
          <button class="btn btn-contorno btn-sm" id="docCancela">Cancelar</button>
          <button class="btn btn-pri btn-sm" id="docEnvia">Enviar documento</button>
        </div>`);
      $("#docCancela").onclick = fecharModal;
      $("#docEnvia").onclick = () => {
        const fInput = $("#docFile");
        const nome = fInput.files[0] ? fInput.files[0].name : (tipo.toLowerCase() + ".pdf");
        const existente = u.documentos.find((x) => x.tipo === tipo);
        if (existente) { existente.nome = nome; existente.status = u.status === "reprovado" ? "em_analise" : "em_analise"; }
        else u.documentos.push({ tipo, nome, status: "em_analise" });
        if (u.status === "pendente" || u.status === "reprovado") u.status = "em_analise";
        DB.salvar();
        fecharModal();
        toast(`${tipo} enviado — em análise.`, "ok");
        render();
      };
    });
  };
  render();
}

/* ---------- Mural de oportunidades (RF04) ---------- */
function viewProfMural() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  if (u.status !== "aprovado") {
    app.innerHTML = `<div class="card vazio">🔒 O mural de oportunidades fica disponível após a aprovação do cadastro (RF03).</div>`;
    return;
  }
  const ops = dados.servicos.filter((s) => s.status === "oportunidade");
  const render = () => {
    app.innerHTML = `
      <h2>🗂️ Mural de oportunidades</h2>
      <p class="card-sub" style="margin-bottom:14px">Serviços disponíveis na sua região — aceite ou recuse (RF04).</p>
      <div class="lista">
        ${ops.length ? ops.map((s) => `
          <div class="card">
            <div class="flex-between" style="margin-bottom:8px">
              <b>${s.tipo}</b> ${chipStatus(s.status)}
            </div>
            <div class="linha"><span>📍 Local</span><b>${s.endereco.apelido} — ${s.endereco.rua}</b></div>
            <div class="linha"><span>📅 Quando</span><b>${fmtDataLonga(s.data)} às ${s.hora}</b></div>
            <div class="linha"><span>⏱ Duração</span><b>${horaHoras(s.duracaoMin)}</b></div>
            <div class="linha"><span>🧺 Escopo</span><b>${s.comodos ? s.comodos + " cômodos" : s.areaM2 + " m²"}${s.adicionais.length ? " + " + s.adicionais.join(", ") : ""}</b></div>
            <div class="linha"><span>🧑 Cliente</span><b>${s.nomeCliente}</b></div>
            <div class="linha" style="font-size:1.05rem"><span><b>Valor bruto</b></span><b class="montante">${fmtBrl(s.valor)}</b></div>
            <div class="linha"><span>Comissão (${Math.round(dados.config.comissaoPct * 100)}%)</span><b class="neg">−${fmtBrl(comissaoDe(s))}</b></div>
            <div class="linha" style="border-top:2px solid var(--borda)"><span><b>Valor líquido p/ você</b></span><b class="montante pos">${fmtBrl(liquidoDe(s))}</b></div>
            <div class="flex" style="margin-top:12px">
              <button class="btn btn-verde" style="flex:1" data-aceita="${s.id}">✓ Aceitar</button>
              <button class="btn btn-contorno" style="flex:1" data-recusa="${s.id}">✕ Recusar</button>
            </div>
          </div>`).join("") : `<div class="card vazio">Nenhuma oportunidade no momento. Novas ofertas chegam quando clientes agendam! 🧹</div>`}
      </div>`;

    $$("[data-aceita]").forEach((b) => b.onclick = () => {
      const s = ops.find((x) => x.id === b.dataset.aceita);
      s.status = "aceito"; s.idProfissional = u.id;
      s.timeline = s.timeline || []; s.timeline.push({ status: "aceito", data: hojeISO(0), hora: agoraHora() });
      DB.salvar();
      toast("Serviço aceito e vinculado à sua agenda! 📅", "ok");
      render();
    });
    $$("[data-recusa]").forEach((b) => b.onclick = () => {
      const s = ops.find((x) => x.id === b.dataset.recusa);
      confirmar(`<h3>Recusar oportunidade?</h3><p class="card-sub">O serviço será cancelado para todos os profissionais.</p>`, () => {
        s.status = "cancelado";
        s.timeline = s.timeline || []; s.timeline.push({ status: "cancelado", data: hojeISO(0), hora: agoraHora() });
        DB.salvar(); render(); toast("Oportunidade recusada.");
      });
    });
  };
  render();
}

/* ---------- Serviços do profissional ---------- */
function viewProfServicos() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  const meus = dados.servicos.filter((s) => s.idProfissional === u.id).sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
  app.innerHTML = `
    <h2>📅 Meus serviços</h2>
    <p class="card-sub" style="margin-bottom:14px">Agenda de serviços aceitos e histórico.</p>
    <div class="lista">
      ${meus.length ? meus.map(cardServico).join("") : `<div class="card vazio">Você ainda não aceitou serviços.</div>`}
    </div>`;
  $$(".item[data-servico]").forEach((el) => el.onclick = () => navegar(`/profissional/servico/${el.dataset.servico}`));
}

/* ---------- Serviço ativo: check-in/out + checklist + evidências (RF05/RF21) ---------- */
function viewProfServico(id) {
  const app = $("#app");
  const dados = DB.dados();
  const s = dados.servicos.find((x) => x.id === id);
  if (!s) { toast("Serviço não encontrado.", "erro"); navegar("/profissional/servicos"); return; }
  const u = usuarioAtual();
  const cfg = dados.config;
  const cheque = s.checklist && s.checklist.length ? s.checklist : cfg.checklist[s.tipo] ? cfg.checklist[s.tipo].map((t) => ({ tarefa: t, feita: false })) : [];
  const feitas = cheque.filter((c) => c.feita).length;
  const pctCheck = cheque.length ? Math.round((feitas / cheque.length) * 100) : 0;

  const render = () => {
    app.innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="navegar('/profissional/servicos')">← Meus serviços</button>
      <h2 style="margin:8px 0 4px">${s.tipo} — ${fmtDataCurta(s.data)} às ${s.hora}</h2>
      <div style="margin-bottom:12px">${chipStatus(s.status)} ${s.recorrencia !== "unica" ? `<span class="chip chip-pri">🔁 ${s.recorrencia}</span>` : ""}</div>

      <div class="grid-2">
        <div class="card">
          <h3 style="margin-bottom:10px">📍 Dados do atendimento</h3>
          <div class="linha"><span>Cliente</span><b>${s.nomeCliente}</b></div>
          <div class="linha"><span>Endereço</span><b>${s.endereco.rua}</b></div>
          <div class="linha"><span>Duração prevista</span><b>${horaHoras(s.duracaoMin)}</b></div>
          <div class="linha"><span>Valor bruto</span><b class="montante">${fmtBrl(s.valor)}</b></div>
          <div class="linha"><span>Você recebe (líq.)</span><b class="montante pos">${fmtBrl(liquidoDe(s))}</b></div>
          ${s.checkinAt ? `<div class="linha"><span>Check-in</span><b>${s.checkinAt}</b></div>` : ""}
          ${s.checkoutAt ? `<div class="linha"><span>Check-out</span><b>${s.checkoutAt}</b></div>` : ""}
          ${s.observacoes ? `<div class="aviso aviso-info" style="margin-top:8px">📝 ${s.observacoes}</div>` : ""}
        </div>
        <div class="card">
          <h3 style="margin-bottom:10px">🕐 Execução (RF05)</h3>
          <div class="center" style="margin:6px 0 12px">
            ${s.status === "em_andamento" ? `<div class="kpi-valor" style="font-size:2rem">${horaHoras(new Date() - new Date(s.checkinAt.replace(" ", "T")) > 0 ? Math.round((new Date() - new Date(s.checkinAt.replace(" ", "T"))) / 60000) : 0)}</div><div class="card-sub">tempo de serviço</div>`
              : `<div class="kpi-valor" style="color:var(--pri)">${s.status === "concluido" || s.status === "avaliado" ? "✅ Concluído" : "Aguardando início"}</div>`}
          </div>
          ${s.status === "aceito" ? `
            <button class="btn btn-pri btn-lg" id="bCheckin">📍 Realizar check-in</button>
            <p class="card-sub" style="text-align:center;margin-top:8px">Valida a presença via geolocalização do dispositivo (RF05/RF24).</p>` : ""}
          ${s.status === "em_andamento" ? `
            <div class="barra verde" style="margin-bottom:8px"><span style="width:${pctCheck}%"></span></div>
            <div class="card-sub" style="margin-bottom:10px">Checklist: ${feitas}/${cheque.length} tarefas (RF21)</div>
            <button class="btn btn-verde btn-lg" id="bCheckout" ${pctCheck < 100 ? "disabled" : ""}>✅ Finalizar (check-out)</button>
            ${pctCheck < 100 ? `<p class="card-sub" style="text-align:center;margin-top:6px">Complete o checklist de qualidade para liberar o check-out.</p>` : ""}` : ""}
        </div>
      </div>

      ${s.status === "em_andamento" || s.status === "concluido" || s.status === "avaliado" ? `
      <div class="card">
        <div class="flex-between"><h3 style="margin-bottom:10px">✅ Checklist de qualidade (RF21)</h3><span class="chip ${pctCheck === 100 ? "chip-verde" : "chip-ambar"}">${pctCheck}%</span></div>
        ${cheque.map((c, i) => `
          <label class="checklist-item"><input type="checkbox" class="chk" data-i="${i}" ${c.feita ? "checked" : ""} ${s.status === "concluido" || s.status === "avaliado" ? "disabled" : ""} /><span style="flex:1;${c.feita ? "text-decoration:line-through;color:var(--texto-fraco)" : ""}">${c.tarefa}</span></label>`).join("")}
      </div>

      <div class="card">
        <h3 style="margin-bottom:10px">📸 Evidências e observações</h3>
        <div class="flex" style="flex-wrap:wrap;gap:8px;margin-bottom:10px">
          ${(s.evidencias || []).map((e) => `<span class="tag">🖼 ${e}</span>`).join("") || '<span class="card-sub">Sem evidências anexadas.</span>'}
        </div>
        ${(s.status === "em_andamento") ? `
          <button class="btn btn-ghost btn-sm" id="bFoto">➕ Anexar foto/evidência</button>
          <div class="field" style="margin-top:10px"><label>Observações</label><textarea id="bObs">${s.observacoes || ""}</textarea></div>` : ""}
      </div>` : ""}

      <div class="flex" style="margin-top:6px">
        <button class="btn btn-contorno" id="bChat">💬 Chat com o cliente</button>
        <button class="btn btn-contorno" id="bSuporte">🛟 Suporte</button>
      </div>`;

    if ($("#bCheckin")) $("#bCheckin").onclick = () => fazerCheckin(s, render);
    if ($("#bCheckout")) $("#bCheckout").onclick = () => fazerCheckout(s, cheque, feitas, render);
    if ($("#bChat")) $("#bChat").onclick = () => abrirChat(s);
    if ($("#bFoto")) $("#bFoto").onclick = () => {
      s.evidencias = s.evidencias || [];
      s.evidencias.push("evidencia-" + (s.evidencias.length + 1) + ".jpg");
      DB.salvar(); render(); toast("Evidência anexada.");
    };
    if ($("#bObs")) $("#bObs").onchange = (e) => { s.observacoes = e.target.value; DB.salvar(); };
    $$("#app input[data-i]").forEach((cb) => cb.onchange = (e) => {
      cheque[Number(e.target.dataset.i)].feita = e.target.checked;
      s.checklist = cheque;
      DB.salvar();
      render();
    });
  };
  render();
}

function fazerCheckin(s, render) {
  const concluir = (info) => {
    s.status = "em_andamento";
    s.checkinAt = `${hojeISO(0)} ${agoraHora()}`;
    s.timeline = s.timeline || [];
    s.timeline.push({ status: "em_andamento", data: hojeISO(0), hora: agoraHora() });
    DB.salvar();
    toast(`${info ? info + " · " : ""}Check-in realizado! Serviço em andamento. 🧽`, "ok");
    render();
  };
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = distanciaKm(pos.coords.latitude, pos.coords.longitude, s.endereco.lat, s.endereco.lng);
        concluir(`GPS: ${d.toFixed(1)} km do local${d > 3 ? " (abaixo do raio previsto)" : ""}`);
      },
      () => concluir("Geolocalização indisponível — presença validada manualmente (simulação)."),
      { timeout: 5000 }
    );
  } else {
    concluir("Geolocalização indisponível — presença validada manualmente (simulação).");
  }
}

function fazerCheckout(s, cheque, feitas, render) {
  const pct = cheque.length ? Math.round((feitas / cheque.length) * 100) : 100;
  if (pct < 100) { toast("Complete o checklist de qualidade para finalizar.", "erro"); return; }
  confirmar(`<h3>Finalizar o serviço?</h3><p class="card-sub">O check-out dispara o fechamento financeiro: ${fmtBrl(liquidoDe(s))} ficarão pendentes de repasse (RF20).</p>`, () => {
    s.status = "concluido";
    s.checkoutAt = `${hojeISO(0)} ${agoraHora()}`;
    s.timeline = s.timeline || [];
    s.timeline.push({ status: "concluido", data: hojeISO(0), hora: agoraHora() });
    const u = usuarioAtual();
    u.saldoPendente = Math.round((Number(u.saldoPendente) + liquidoDe(s)) * 100) / 100;
    DB.dados().logs.unshift({ id: uid("log"), data: `${hojeISO(0)} ${agoraHora()}`, msg: `Serviço (${s.tipo}) concluído por ${u.nome} — ${fmtBrl(liquidoDe(s))} pendente de repasse.` });
    DB.salvar();
    toast("Serviço concluído! Aguardando avaliação do cliente. 💚", "ok");
    render();
  });
}

/* ---------- Financeiro e saques (RF06) ---------- */
function viewProfFinanceiro() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  const meus = dados.servicos.filter((s) => s.idProfissional === u.id);
  const totalBruto = meus.filter((s) => ["concluido", "avaliado"].includes(s.status)).reduce((t, s) => t + brutoDe(s), 0);
  const totalLiquido = meus.filter((s) => ["concluido", "avaliado"].includes(s.status)).reduce((t, s) => t + liquidoDe(s), 0);

  const render = () => {
    app.innerHTML = `
      <h2>💰 Painel financeiro e saques</h2>
      <p class="card-sub" style="margin-bottom:14px">Renda digna: ganhos, comissões e transferências via PIX (RF06).</p>

      <div class="grid-3">
        <div class="card kpi-card" style="border-color:#bbf7d0"><div class="kpi-valor pos montante">${fmtBrl(u.saldoDisponivel)}</div><div class="kpi-rotulo">Disponível p/ saque</div></div>
        <div class="card kpi-card"><div class="kpi-valor montante">${fmtBrl(u.saldoPendente)}</div><div class="kpi-rotulo">Pendente (repasse)</div></div>
        <div class="card kpi-card"><div class="kpi-valor montante">${fmtBrl(totalLiquido)}</div><div class="kpi-rotulo">Total recebido</div></div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:10px">Últimas movimentações</h3>
        ${u.extrato.length ? u.extrato.map((m) => `
          <div class="linha"><span>${fmtDataCurta(m.data)} · ${m.desc}</span><b class="montante ${Number(m.valor) >= 0 ? "pos" : "neg"}">${Number(m.valor) >= 0 ? "+" : ""}${fmtBrl(m.valor)}</b></div>`).join("")
          : `<div class="vazio">Ainda sem movimentações.</div>`}
      </div>

      <button class="btn btn-verde btn-lg" id="bSaque" ${u.saldoDisponivel <= 0 ? "disabled" : ""}>🔑 Solicitar saque via PIX</button>
      ${u.saldoDisponivel <= 0 ? `<p class="card-sub" style="text-align:center;margin-top:6px">Nenhum saldo disponível no momento.</p>` : ""}`;

    $("#bSaque").onclick = () => {
      abrirModal(`
        <h3>🔑 Solicitar saque</h3>
        <p class="card-sub" style="margin-bottom:10px">Saldo disponível: <b class="pos">${fmtBrl(u.saldoDisponivel)}</b></p>
        <div class="field"><label>Valor (R$)</label><input id="sQtd" type="number" min="1" max="${u.saldoDisponivel}" value="${u.saldoDisponivel}" /></div>
        <div class="field"><label>Chave PIX</label><input id="sPix" placeholder="CPF, e-mail, telefone ou chave aleatória" /></div>
        <div class="modal-acoes">
          <button class="btn btn-contorno btn-sm" id="sCancela">Cancelar</button>
          <button class="btn btn-verde btn-sm" id="sConfirma">Solicitar</button>
        </div>`);
      $("#sCancela").onclick = fecharModal;
      $("#sConfirma").onclick = () => {
        const qtd = Number($("#sQtd").value) || 0;
        const pix = $("#sPix").value.trim();
        if (qtd <= 0 || qtd > u.saldoDisponivel) { toast("Valor inválido.", "erro"); return; }
        if (!pix) { toast("Informe uma chave PIX.", "erro"); return; }
        u.saldoDisponivel = Math.round((u.saldoDisponivel - qtd) * 100) / 100;
        u.extrato.unshift({ data: hojeISO(0), desc: "Saque via PIX solicitado", valor: -qtd });
        DB.salvar();
        fecharModal();
        toast("Saque solicitado! O valor será enviado via PIX (simulado).", "ok");
        render();
      };
    };
  };
  render();
}

/* ---------- Aguid@Educação (RF07) ---------- */
const CURSOS_QUIZ = {
  c1: [
    { p: "Para superfícies lisas (mesa, bancada), o ideal é:", o: ["Pano seco", "Pano úmido com produto diluído", "Palha de aço"], r: 1 },
    { p: "Antes de usar um produto, o recomendado é:", o: ["Ler o rótulo e seguir a diluição", "Usar sempre puro", "Misturar com outro produto"], r: 0 },
    { p: "A ordem correta numa limpeza de cima para baixo evita:", o: ["Cheiro forte", "Retrabalho (sujeira voltar)", "Gastar mais água"], r: 1 },
  ],
  c2: [
    { p: "Qual rotina garante um atendimento padronizado?", o: ["Fazer de cabeça", "Seguir o checklist de qualidade", "Só o que o cliente pedir"], r: 1 },
    { p: "Ao chegar no local, o primeiro passo é:", o: ["Começar a limpar", "Apresentar-se e confirmar o escopo com o cliente", "Pedir o pagamento"], r: 1 },
  ],
  c3: [
    { p: "Em pós-obra, a poeira fina deve ser removida primeiro com:", o: ["Água em excesso", "Aspirador ou pano levemente úmido", "Vassoura seca"], r: 1 },
    { p: "Rejuntes e bancadas recém-instalados devem ser limpos com:", o: ["Ácido forte", "Produto neutro diluído", "Palha de aço"], r: 1 },
  ],
  c4: [
    { p: "A melhor postura ao entrar na casa do cliente é:", o: ["Ir direto ao serviço", "Ser cordial, apresentar-se e seguir o combinado", "Pedir folga"], r: 1 },
    { p: "Para segurança no atendimento, o profissional deve:", o: ["Ignorar riscos", "Usar EPI adequado (luvas, calçado fechado)", "Trabalhar rápido sem proteção"], r: 1 },
  ],
};

function viewProfEducacao() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  const render = () => {
    const selados = (u.cursos || []).filter((c) => c.concluido).length;
    app.innerHTML = `
      <h2>🎓 Aguid@Educação</h2>
      <p class="card-sub" style="margin-bottom:14px">Treinamentos em vídeo para padronizar a qualidade (RF07).</p>

      <div class="card" style="background:linear-gradient(140deg,#7c3aed,#2563eb);color:#fff;border:0">
        <div class="flex-between">
          <div><b>Seu progresso de capacitação</b><div style="opacity:.9;font-size:.8rem">${selados} de ${dados.config.cursos.length} cursos concluídos</div></div>
          <span style="font-size:1.8rem">🏅</span>
        </div>
        <div class="barra" style="background:rgba(255,255,255,.25);margin-top:10px"><span style="width:${dados.config.cursos.length ? Math.round((selados / dados.config.cursos.length) * 100) : 0}%;background:#fff"></span></div>
        ${selados >= 2 ? `<div class="chip" style="background:#fff;color:#7c3aed;margin-top:8px">Selo "Profissional Qualificado Aguid" concedido! 🎖️</div>` : ""}
      </div>

      <div class="lista">
        ${dados.config.cursos.map((c) => {
          const meu = (u.cursos || []).find((x) => x.idCurso === c.id);
          const prog = meu ? meu.progresso : 0;
          return `
          <div class="item" data-curso="${c.id}">
            <span class="item-icone">🎬</span>
            <div class="item-corpo">
              <div class="item-titulo">${c.titulo} ${prog === 100 ? "✅" : ""}</div>
              <div class="item-sub">${c.desc}</div>
              <div class="barra" style="margin-top:8px"><span style="width:${prog}%"></span></div>
              <div class="item-sub" style="margin-top:4px">${c.nivel} · ${c.aulas} aulas · ${c.min} min · ${prog}% concluído</div>
            </div>
            <button class="btn ${prog === 100 ? "btn-contorno" : "btn-pri"} btn-sm">${prog === 100 ? "Rever" : prog > 0 ? "Continuar" : "Iniciar"}</button>
          </div>`;
        }).join("")}
      </div>`;

    $$("[data-curso]").forEach((el) => el.onclick = () => abrirCurso(dados.config.cursos.find((x) => x.id === el.dataset.curso), u, render));
  };
  render();
}

function abrirCurso(curso, u, render) {
  const quiz = CURSOS_QUIZ[curso.id] || [];
  let respondidas = 0;
  abrirModal(`
    <h3>🎬 ${curso.titulo}</h3>
    <div class="aviso aviso-info">Apresentação do conteúdo (vídeo hospedado pela plataforma — simulado no MVP).</div>
    <div class="card" style="background:linear-gradient(140deg,#0f172a,#1e293b);color:#fff;min-height:120px;display:grid;place-items:center;font-size:2.2rem">▶️</div>
    <h3 style="margin:14px 0 6px">📝 Questionário rápido</h3>
    <div class="card-sub" style="margin-bottom:10px">Responda para concluir o curso e ganhar o selo de qualificação.</div>
    ${quiz.map((q, qi) => `
      <div style="margin-bottom:14px">
        <b style="font-size:.9rem">${qi + 1}. ${q.p}</b>
        <div class="flex-col" style="gap:6px;margin-top:6px">
          ${q.o.map((op, oi) => `<label class="checklist-item" style="cursor:pointer;margin-bottom:0"><input type="radio" name="q${qi}" data-q="${qi}" data-r="${oi}" /> <span>${op}</span></label>`).join("")}
        </div>
      </div>`).join("")}
    <div class="modal-acoes">
      <button class="btn btn-contorno btn-sm" id="cCancela">Fechar</button>
      <button class="btn btn-pri btn-sm" id="cConclui">Concluir curso</button>
    </div>`);

  $$("input[data-q]").forEach((r) => r.onchange = () => respondidas++);
  $("#cCancela").onclick = fecharModal;
  $("#cConclui").onclick = () => {
    let certas = 0;
    quiz.forEach((q, qi) => {
      const escolhida = document.querySelector(`input[name="q${qi}"]:checked`);
      if (escolhida && Number(escolhida.dataset.r) === q.r) certas++;
    });
    if (respondidas < quiz.length) { toast("Responda todas as perguntas.", "erro"); return; }
    if (certas < quiz.length) { toast(`Você acertou ${certas}/${quiz.length}. Reveja o conteúdo e tente de novo!`, "erro"); return; }
    u.cursos = u.cursos || [];
    const ex = u.cursos.find((x) => x.idCurso === curso.id);
    if (ex) { ex.progresso = 100; ex.concluido = true; } else u.cursos.push({ idCurso: curso.id, progresso: 100, concluido: true });
    DB.salvar();
    fecharModal();
    toast(`Curso "${curso.titulo}" concluído! 🎖️`, "ok");
    render();
  };
}

/* ---------- Mensagens do profissional ---------- */
function viewProfMensagens() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  const meus = dados.servicos.filter((s) => s.idProfissional === u.id).sort((a, b) => b.data.localeCompare(a.data));
  app.innerHTML = `
    <h2>💬 Mensagens</h2>
    <p class="card-sub" style="margin-bottom:14px">Chat interno com seus clientes — sem expor números (RF23).</p>
    <div class="lista">
      ${meus.length ? meus.map((s) => `
        <div class="item" data-svc="${s.id}">
          <span class="item-icone">💬</span>
          <div class="item-corpo">
            <div class="item-titulo">${s.nomeCliente} — ${s.tipo}</div>
            <div class="item-sub">${(s.chat || []).length ? "Última: " + s.chat[s.chat.length - 1].texto : "Nenhuma mensagem ainda"}</div>
          </div>
          <span class="tag">${(s.chat || []).length}</span>
        </div>`).join("") : `<div class="card vazio">Você ainda não tem conversas.</div>`}
    </div>`;
  $$("[data-svc]").forEach((el) => el.onclick = () => abrirChat(dados.servicos.find((x) => x.id === el.dataset.svc)));
}