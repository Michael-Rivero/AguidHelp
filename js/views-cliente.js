"use strict";

/* ============================================================
   Aguid@Help — Telas do Cliente (Contratante)
   RF08, RF09, RF10, RF11, RF12, RF13, RF14, RF15
   ============================================================ */

function viewClienteHome() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  const meus = dados.servicos.filter((s) => s.idCliente === u.id);
  const proximos = meus.filter((s) => ["oportunidade", "aceito", "em_andamento"].includes(s.status));
  const pagosMes = meus.filter((s) => ["concluido", "avaliado"].includes(s.status) && s.data.slice(0, 7) === hojeISO(0).slice(0, 7));
  const totalMes = pagosMes.reduce((t, s) => t + (Number(s.valor) || 0), 0);

  app.innerHTML = `
    <div class="hero">
      <h2>Olá, ${u.nome.split(" ")[0]}! 👋</h2>
      <p>Precisa de uma limpeza? Agende em poucos cliques e acompanhe tudo em tempo real.</p>
      <div style="margin-top:14px">
        <button class="btn btn-lg" style="background:#fff;color:var(--pri);box-shadow:none" id="hAgendar">🧽 Agendar limpeza</button>
      </div>
    </div>

    <div class="grid-3">
      <div class="card kpi-card"><div class="kpi-valor">${proximos.length}</div><div class="kpi-rotulo">Serviços ativos</div></div>
      <div class="card kpi-card"><div class="kpi-valor">${meus.length}</div><div class="kpi-rotulo">Pedidos no total</div></div>
      <div class="card kpi-card"><div class="kpi-valor montante">${fmtBrl(totalMes)}</div><div class="kpi-rotulo">Gasto no mês</div></div>
    </div>

    <div class="secao-titulo">Próximos serviços</div>
    <div class="lista">
      ${proximos.length ? proximos.map(cardServico).join("") : `<div class="card vazio">Nenhum serviço ativo. Agende agora! 🧹</div>`}
    </div>

    <div class="secao-titulo">Minha assinatura</div>
    <div class="card">
      ${u.assinaturas.length ? u.assinaturas.map((a) => `
        <div class="flex-between">
          <div><b>${a.tipo}</b> · ${a.frequencia.toLowerCase()}<br><span class="card-sub">${a.valor ? fmtBrl(a.valor) : ""} por ciclo · ativa</span></div>
          <span class="chip chip-verde">Ativa</span>
        </div>`).join("") : `<div class="vazio">Você ainda não tem assinatura. Na hora de agendar, escolha a frequência <b>semanal</b>, <b>quinzenal</b> ou <b>mensal</b> (RF15).</div>`}
    </div>`;

  $("#hAgendar").onclick = () => navegar("/cliente/agendar");
  $$(".item[data-servico]").forEach((el) => el.onclick = () => navegar(`/cliente/servico/${el.dataset.servico}`));
}

/* ---------- Agendamento (stepper + orçamento instantâneo) ---------- */
const AG = { passo: 1, tipo: null, comodos: 3, areaM2: 40, data: hojeISO(1), hora: "09:00", duracao: 240, adicionais: [], enderecoId: null, frequencia: "unica", profissionalId: null, pagamentoId: null };

function calcularOrcamento() {
  const cfg = DB.dados().config;
  let v = 0;
  if (AG.tipo === "Pós-obra") v = (AG.areaM2 || 0) * cfg.precoPosObraM2;
  else {
    const preco = AG.tipo === "Comercial" ? cfg.precoComercial : cfg.precoResidencial;
    v = (AG.comodos || 0) * preco;
  }
  for (const id of AG.adicionais) {
    const a = cfg.adicionais.find((x) => x.id === id);
    if (a) v += a.extra;
  }
  return Math.round(v);
}

function viewClienteAgendar() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  AG.passo = 1;
  AG.tipo = null; AG.adicionais = []; AG.frequencia = "unica"; AG.profissionalId = null;
  AG.enderecoId = (u.enderecos[0] || {}).id || null;
  AG.pagamentoId = (u.formasPagamento[0] || {}).id || null;

  const render = () => {
    const cfg = dados.config;
    const totalPassos = 4;
    const stepper = `<div class="stepper">${[1, 2, 3, 4].map((p) =>
      `<span class="passo ${p === AG.passo ? "on" : p < AG.passo ? "ok" : ""}"></span>`).join("")}</div>`;

    let corpo = "";
    if (AG.passo === 1) {
      corpo = `
        <h3>1 · Qual o tipo de serviço?</h3>
        <div class="lista" >
          ${[["Residencial", "🧹", "Apartamentos e casas", cfg.precoResidencial + "/cômodo"], ["Comercial", "🏢", "Escritórios e lojas", cfg.precoComercial + "/cômodo"], ["Pós-obra", "🏗️", "Limpeza pesada", cfg.precoPosObraM2 + "/m²"]].map(([t, ic, d, p]) => `
          <div class="item ${AG.tipo === t ? "ativo" : ""}" data-tipo="${t}">
            <span class="item-icone">${ic}</span>
            <div class="item-corpo"><div class="item-titulo">${t}</div><div class="item-sub">${d}</div></div>
            <span class="tag">${p}</span>
          </div>`).join("")}
        </div>`;
    } else if (AG.passo === 2) {
      const endOpts = (u.enderecos || []).map((e) => `<option value="${e.id}" ${e.id === AG.enderecoId ? "selected" : ""}>${e.apelido} — ${e.rua}</option>`).join("");
      corpo = `
        <h3>2 · Detalhes da limpeza</h3>
        <div class="field"><label>Local do serviço</label><select id="aEnd">${endOpts || '<option value="">Cadastre um endereço primeiro</option>'}</select></div>
        ${AG.tipo === "Pós-obra" ? `
        <div class="field"><label>Área aproximada (m²)</label><input id="aArea" type="number" min="10" value="${AG.areaM2}" /></div>` : `
        <div class="field"><label>Quantidade de cômodos</label><input id="aComodos" type="number" min="1" max="20" value="${AG.comodos}" /></div>`}
        <div class="grid-2">
          <div class="field"><label>Data</label><input id="aData" type="date" value="${AG.data}" min="${hojeISO(0)}" /></div>
          <div class="field"><label>Horário</label><select id="aHora">${["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"].map((h) => `<option ${h === AG.hora ? "selected" : ""}>${h}</option>`).join("")}</select></div>
        </div>
        <div class="field"><label>Duração estimada</label>
          <select id="aDura">
            ${[[120,"2 horas"],[180,"3 horas"],[240,"4 horas"],[300,"5 horas"],[360,"6 horas"]].map(([v, t]) => `<option value="${v}" ${v === AG.duracao ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Adicionais</label><div id="aAdds"></div></div>
        <div class="field"><label>Frequência (assinatura — RF15)</label>
          <select id="aFreq">
            <option value="unica">Serviço avulso</option>
            <option value="semanal">Semanal (recorrente)</option>
            <option value="quinzenal">Quinzenal (recorrente)</option>
            <option value="mensal">Mensal (recorrente)</option>
          </select>
        </div>`;
    } else if (AG.passo === 3) {
      const profs = dados.usuarios.profissionais.filter((p) => p.status === "aprovado" && p.areas.includes(AG.tipo));
      corpo = `
        <h3>3 · Escolha o profissional</h3>
        <p class="card-sub" style="margin-bottom:10px">Profissionais próximos, avaliados e verificados pela plataforma (RF10/RF24).</p>
        <div class="lista">
          ${profs.length ? profs.map((p) => `
            <div class="item ${AG.profissionalId === p.id ? "ativo" : ""}" data-prof="${p.id}">
              <span class="avatar">${inicialNome(p.nome)}</span>
              <div class="item-corpo">
                <div class="item-titulo">${p.nome} ${p.avaliacaoMedia ? estrelasHtml(p.avaliacaoMedia) : ""}</div>
                <div class="item-sub">${p.servicosConcluidos} serviços · ${p.selos[0] || "verificado"} · ~${distanciaKm(p.localizacao.lat, p.localizacao.lng, AG.enderecoLat || p.localizacao.lat, AG.enderecoLng || p.localizacao.lng).toFixed(1)} km</div>
              </div>
            </div>`).join("") : `<div class="card vazio">Nenhum profissional aprovado para ${AG.tipo} no momento.</div>`}
        </div>`;
    } else {
      const p = dados.usuarios.profissionais.find((x) => x.id === AG.profissionalId);
      const pag = (u.formasPagamento || []).find((x) => x.id === AG.pagamentoId);
      const end = (u.enderecos || []).find((x) => x.id === AG.enderecoId);
      const valor = calcularOrcamento();
      corpo = `
        <h3>4 · Confirme e pague</h3>
        <div class="card">
          <div class="linha"><span>Tipo</span><b>${AG.tipo}</b></div>
          <div class="linha"><span>Local</span><b>${end ? end.apelido : "—"}</b></div>
          <div class="linha"><span>Data/hora</span><b>${fmtDataCurta(AG.data)} às ${AG.hora}</b></div>
          <div class="linha"><span>Duração</span><b>${horaHoras(AG.duracao)}</b></div>
          <div class="linha"><span>Profissional</span><b>${p ? p.nome : "—"}</b></div>
          <div class="linha"><span>Frequência</span><b>${AG.frequencia === "unica" ? "Avulso" : AG.frequencia}</b></div>
          ${AG.adicionais.length ? `<div class="linha"><span>Adicionais</span><b>${AG.adicionais.length}</b></div>` : ""}
          <div class="linha" style="border-top:2px solid var(--borda);margin-top:6px;font-size:1.1rem"><span><b>Total</b></span><b class="montante">${fmtBrl(valor)}</b></div>
        </div>
        <div class="field"><label>Forma de pagamento</label>
          <select id="aPag">
            ${(u.formasPagamento || []).map((x) => `<option value="${x.id}" ${x.id === AG.pagamentoId ? "selected" : ""}>${x.tipo} — ${x.desc}</option>`).join("") || '<option value="">Cadastre um pagamento</option>'}
          </select>
        </div>
        <div class="aviso aviso-info">💳 O pagamento é processado por um gateway seguro (RF12 — simulado no MVP). O valor fica reservado e o serviço é publicado no mural do profissional.</div>
        <button class="btn btn-pri btn-lg" id="aConfirmar">Confirmar e pagar ✅</button>`;
    }

    app.innerHTML = `
      <h2 style="margin-bottom:4px">Agendar limpeza</h2>
      <p class="card-sub" style="margin-bottom:14px">Orçamento instantâneo em tempo real (RF14)</p>
      ${stepper}
      <div class="card">${corpo}</div>
      <div class="flex-between" style="margin-top:4px">
        ${AG.passo > 1 ? `<button class="btn btn-contorno" id="aVoltar">← Voltar</button>` : `<span></span>`}
        ${AG.passo < 4 ? `<button class="btn btn-pri" id="aAvancar">Continuar →</button>` : ""}
      </div>
      <div class="card" style="margin-top:10px;background:var(--pri-claro);border-color:#bfdbfe">
        <div class="flex-between">
          <span style="color:#1e40af;font-weight:700">Orçamento instantâneo</span>
          <b class="montante" style="font-size:1.4rem;color:#1e40af" id="aOrc">${fmtBrl(calcularOrcamento())}</b>
        </div>
      </div>`;

    // eventos — dependem do passo
    $$(".item[data-tipo]").forEach((el) => el.onclick = () => { AG.tipo = el.dataset.tipo; render(); });
    if (AG.passo === 2) {
      const refrescarOrcamento = () => { $("#aOrc").textContent = fmtBrl(calcularOrcamento()); };
      $("#aEnd").onchange = (e) => { AG.enderecoId = e.target.value; const en = u.enderecos.find((x) => x.id === AG.enderecoId); if (en) { AG.enderecoLat = en.lat; AG.enderecoLng = en.lng; } };
      if ($("#aComodos")) $("#aComodos").oninput = (e) => { AG.comodos = Math.max(1, Number(e.target.value) || 1); refrescarOrcamento(); };
      if ($("#aArea")) $("#aArea").oninput = (e) => { AG.areaM2 = Math.max(10, Number(e.target.value) || 10); refrescarOrcamento(); };
      $("#aData").onchange = (e) => { AG.data = e.target.value; refrescarOrcamento(); };
      $("#aHora").onchange = (e) => { AG.hora = e.target.value; };
      $("#aDura").onchange = (e) => { AG.duracao = Number(e.target.value); refrescarOrcamento(); };
      $("#aFreq").onchange = (e) => { AG.frequencia = e.target.value; };
      $("#aAdds").innerHTML = cfg.adicionais.map((a) => `
        <label class="checklist-item" style="cursor:pointer">
          <input type="checkbox" class="chk" data-add="${a.id}" ${AG.adicionais.includes(a.id) ? "checked" : ""} />
          <span style="flex:1">${a.nome}</span><b class="montante">+${fmtBrl(a.extra)}</b>
        </label>`).join("");
      $$("#aAdds input").forEach((cb) => cb.onchange = (e) => {
        if (e.target.checked) AG.adicionais.push(e.target.dataset.add);
        else AG.adicionais = AG.adicionais.filter((x) => x !== e.target.dataset.add);
        refrescarOrcamento();
      });
    }
    if (AG.passo === 3) {
      $$(".item[data-prof]").forEach((el) => el.onclick = () => { AG.profissionalId = el.dataset.prof; render(); });
    }
    if (AG.passo === 4) {
      $("#aPag").onchange = (e) => { AG.pagamentoId = e.target.value; };
      $("#aConfirmar").onclick = () => confirmarServico();
    }
    const av = $("#aAvancar"); if (av) av.onclick = () => {
      if (AG.passo === 1 && !AG.tipo) { toast("Escolha um tipo de serviço.", "erro"); return; }
      if (AG.passo === 2 && !AG.enderecoId) { toast("Cadastre um endereço para o serviço.", "erro"); return; }
      if (AG.passo === 3 && !AG.profissionalId) { toast("Escolha um profissional.", "erro"); return; }
      AG.passo++; render();
    };
    const vb = $("#aVoltar"); if (vb) vb.onclick = () => { AG.passo--; render(); };
  };
  render();
}

function confirmarServico() {
  const u = usuarioAtual();
  const dados = DB.dados();
  const end = u.enderecos.find((x) => x.id === AG.enderecoId);
  const pag = u.formasPagamento.find((x) => x.id === AG.pagamentoId);
  if (!end || !pag) { toast("Cadastre endereço e forma de pagamento.", "erro"); return; }

  const valor = calcularOrcamento();
  const s = {
    id: uid("svc"), idCliente: u.id, nomeCliente: u.nome, idProfissional: AG.profissionalId,
    tipo: AG.tipo, endereco: { apelido: end.apelido, rua: end.rua, cidade: end.cidade, lat: end.lat, lng: end.lng },
    data: AG.data, hora: AG.hora, duracaoMin: AG.duracao,
    comodos: AG.tipo === "Pós-obra" ? null : AG.comodos, areaM2: AG.tipo === "Pós-obra" ? AG.areaM2 : null,
    adicionais: AG.adicionais.map((id) => dados.config.adicionais.find((a) => a.id === id)?.nome || ""),
    valor, status: "oportunidade", recorrencia: AG.frequencia,
    timeline: [{ status: "oportunidade", data: hojeISO(0), hora: agoraHora() }],
    checkinAt: null, checkoutAt: null, checklist: [], evidencias: [], observacoes: "",
    avaliacao: null, chat: [],
  };
  dados.servicos.push(s);
  if (AG.frequencia !== "unica") {
    u.assinaturas = u.assinaturas || [];
    u.assinaturas.push({ id: uid("ass"), tipo: AG.tipo, frequencia: AG.frequencia === "semanal" ? "Semanal" : AG.frequencia === "quinzenal" ? "Quinzenal" : "Mensal", valor, ativa: true });
  }
  dados.logs.unshift({ id: uid("log"), data: `${hojeISO(0)} ${agoraHora()}`, msg: `Novo serviço de ${AG.tipo} (${fmtBrl(valor)}) agendado por ${u.nome}.` });
  DB.salvar();
  toast(`Serviço agendado e pago (${pag.tipo})! 🎉`, "ok");
  navegar("/cliente/pedidos");
}

/* ---------- Pedidos do cliente ---------- */
function viewClientePedidos() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  const meus = dados.servicos.filter((s) => s.idCliente === u.id)
    .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));

  app.innerHTML = `
    <h2>Meus pedidos</h2>
    <p class="card-sub" style="margin-bottom:14px">Acompanhe o status de cada serviço em tempo real (RF11).</p>
    <div class="lista">
      ${meus.length ? meus.map(cardServico).join("") : `<div class="card vazio">Nenhum pedido ainda. Agende sua primeira limpeza! 🧹</div>`}
    </div>`;
  $$(".item[data-servico]").forEach((el) => el.onclick = () => navegar(`/cliente/servico/${el.dataset.servico}`));
}

function viewClienteServico(id) {
  const app = $("#app");
  const dados = DB.dados();
  const s = dados.servicos.find((x) => x.id === id);
  if (!s) { toast("Serviço não encontrado.", "erro"); navegar("/cliente/pedidos"); return; }
  const u = usuarioAtual();
  const prof = dados.usuarios.profissionais.find((x) => x.id === s.idProfissional);

  app.innerHTML = `
    <button class="btn btn-ghost btn-sm" onclick="navegar('/cliente/pedidos')">← Meus pedidos</button>
    <h2 style="margin:8px 0 4px">${s.tipo} — ${fmtDataCurta(s.data)} às ${s.hora}</h2>
    <div style="margin-bottom:12px">${chipStatus(s.status)} ${s.recorrencia !== "unica" ? `<span class="chip chip-pri">🔁 ${s.recorrencia}</span>` : ""}</div>

    <div class="grid-2">
      <div class="card">
        <h3 style="margin-bottom:12px">📍 Informações do serviço</h3>
        <div class="linha"><span>Local</span><b>${s.endereco.apelido}</b></div>
        <div class="linha"><span>Endereço</span><b>${s.endereco.rua}</b></div>
        <div class="linha"><span>Duração</span><b>${horaHoras(s.duracaoMin)}</b></div>
        <div class="linha"><span>Adicionais</span><b>${s.adicionais.length ? s.adicionais.join(", ") : "—"}</b></div>
        <div class="linha"><span>Valor pago</span><b class="montante">${fmtBrl(s.valor)}</b></div>
        ${prof ? `<div class="linha"><span>Profissional</span><b>${prof.nome} ${prof.avaliacaoMedia ? estrelasHtml(prof.avaliacaoMedia) : ""}</b></div>` : ""}
      </div>
      <div class="card">
        <h3 style="margin-bottom:12px">📦 Andamento</h3>
        ${timelineServico(s)}
      </div>
    </div>

    ${s.status === "concluido" ? `
      <div class="card" style="background:var(--verde-claro);border-color:#bbf7d0">
        <div class="flex-between">
          <div><b>Serviço concluído! 🎉</b><div class="card-sub">Conte como foi a experiência com ${prof ? prof.nome : "o profissional"}.</div></div>
          <button class="btn btn-verde" id="bAvaliar">⭐ Avaliar</button>
        </div>
      </div>` : ""}
    ${s.status === "avaliado" && s.avaliacao ? `
      <div class="card">
        <h3 style="margin-bottom:8px">Sua avaliação</h3>
        ${listarEstrelas(s.avaliacao.nota)} — <b>${s.avaliacao.nota}/5</b>
        <p class="card-sub" style="margin-top:6px">${s.avaliacao.comentario}</p>
      </div>` : ""}

    <div class="flex" style="margin-top:6px">
      ${s.chat !== undefined ? `<button class="btn btn-contorno" id="bChat">💬 Abrir chat</button>` : ""}
      <button class="btn btn-contorno" id="bSuporte">🛟 Suporte</button>
    </div>`;

  if ($("#bAvaliar")) $("#bAvaliar").onclick = () => abrirAvaliacao(s);
  if ($("#bChat")) $("#bChat").onclick = () => abrirChat(s);
  $("#bSuporte").onclick = () => toast("Suporte Aguid@Help: atendimento@aguidhelp.com (simulado).");
}

function abrirAvaliacao(s) {
  const prof = DB.dados().usuarios.profissionais.find((x) => x.id === s.idProfissional);
  let nota = 5;
  abrirModal(`
    <h3>⭐ Avalie o serviço</h3>
    <p class="card-sub">Profissional: <b>${prof ? prof.nome : "—"}</b> · ${s.tipo}</p>
    <div class="field"><label>Nota geral</label>
      <div class="estrelas" id="eaNota">
        ${[1,2,3,4,5].map((i) => `<button data-n="${i}" class="${i <= nota ? "marcada" : ""}">★</button>`).join("")}
      </div>
    </div>
    <div class="field"><label>Quais critérios evaluate bem? (RF13)</label>
      <span class="card-sub">Qualidade · Pontualidade · Comunicação</span>
    </div>
    <div class="field"><label>Comentário</label><textarea id="eaTexto" placeholder="Conte como foi a experiência..."></textarea></div>
    <div class="modal-acoes">
      <button class="btn btn-contorno btn-sm" id="eaCancela">Cancelar</button>
      <button class="btn btn-verde btn-sm" id="eaEnvia">Enviar avaliação</button>
    </div>`);

  $$("#eaNota button").forEach((b) => b.onclick = () => {
    nota = Number(b.dataset.n);
    $$("#eaNota button").forEach((x) => x.classList.toggle("marcada", Number(x.dataset.n) <= nota));
  });
  $("#eaCancela").onclick = fecharModal;
  $("#eaEnvia").onclick = () => {
    const coment = $("#eaTexto").value.trim();
    s.avaliacao = { nota, comentario: coment || "Sem comentário.", criterios: {} };
    s.status = "avaliado";
    s.timeline.push({ status: "avaliado", data: hojeISO(0), hora: agoraHora() });

    // Recalcula reputação do profissional (RF13 → RF10)
    const dados = DB.dados();
    const aval = dados.servicos.filter((x) => x.idProfissional === prof.id && x.avaliacao);
    if (prof) {
      prof.avaliacoesN = aval.length;
      prof.avaliacaoMedia = aval.reduce((t, x) => t + x.avaliacao.nota, 0) / (aval.length || 1);
      prof.servicosConcluidos = dados.servicos.filter((x) => x.idProfissional === prof.id && ["concluido", "avaliado"].includes(x.status)).length;
    }
    DB.salvar();
    fecharModal();
    toast("Avaliação enviada. Obrigado por ajudar a manter a qualidade! 🌟", "ok");
    navegar(`/cliente/servico/${s.id}`);
  };
}

/* ---------- Endereços (RF08) ---------- */
function viewClienteEnderecos() {
  const app = $("#app");
  const u = usuarioAtual();
  const render = () => {
    app.innerHTML = `
      <div class="flex-between" style="margin-bottom:12px">
        <div><h2>📍 Meus endereços</h2><p class="card-sub">Cadastre casa, escritório e outros locais (RF08).</p></div>
        <button class="btn btn-pri btn-sm" id="addEnd">+ Novo</button>
      </div>
      <div class="lista">
        ${u.enderecos.length ? u.enderecos.map((e, i) => `
          <div class="item">
            <span class="item-icone">${e.principal ? "🏠" : "🏢"}</span>
            <div class="item-corpo">
              <div class="item-titulo">${e.apelido} ${e.principal ? `<span class="chip chip-pri">principal</span>` : ""}</div>
              <div class="item-sub">${e.rua} · ${e.cidade}</div>
            </div>
            <div class="item-acoes">
              <button class="btn btn-ghost btn-sm" data-edit="${i}">Editar</button>
              <button class="btn btn-ghost btn-sm" data-del="${i}" style="color:var(--vermelho)">✕</button>
            </div>
          </div>`).join("") : `<div class="card vazio">Nenhum endereço cadastrado.</div>`}
      </div>`;

    $("#addEnd").onclick = () => modalEndereco(null);
    $$("[data-edit]").forEach((b) => b.onclick = () => modalEndereco(u.enderecos[Number(b.dataset.edit)]));
    $$("[data-del]").forEach((b) => b.onclick = () => {
      const i = Number(b.dataset.del);
      confirmar(`<h3>Excluir endereço?</h3><p class="card-sub">${u.enderecos[i].apelido} será removido.</p>`, () => {
        u.enderecos.splice(i, 1);
        DB.salvar(); render(); toast("Endereço removido.");
      });
    });
  };
  function modalEndereco(edit) {
    const e = edit || { apelido: "", rua: "", cidade: "São Paulo - SP", cep: "", principal: false };
    abrirModal(`
      <h3>${edit ? "Editar" : "Novo"} endereço</h3>
      <div class="field"><label>Apelido</label><input id="eAp" value="${e.apelido}" placeholder="Ex.: Minha casa" /></div>
      <div class="field"><label>Logradouro</label><input id="eRua" value="${e.rua}" placeholder="Rua, número — complemento" /></div>
      <div class="grid-2">
        <div class="field"><label>Cidade</label><input id="eCid" value="${e.cidade}" /></div>
        <div class="field"><label>CEP</label><input id="eCep" value="${e.cep}" placeholder="00000-000" /></div>
      </div>
      <label class="flex" style="margin-bottom:6px"><input type="checkbox" id="ePrin" ${e.principal ? "checked" : ""} /> Tornar endereço principal</label>
      <div class="modal-acoes">
        <button class="btn btn-contorno btn-sm" id="eCancela">Cancelar</button>
        <button class="btn btn-pri btn-sm" id="eSalva">Salvar</button>
      </div>`);
    $("#eCancela").onclick = fecharModal;
    $("#eSalva").onclick = () => {
      const ap = $("#eAp").value.trim(); const rua = $("#eRua").value.trim();
      if (!ap || !rua) { toast("Preencha apelido e logradouro.", "erro"); return; }
      const obj = { apelido: ap, rua, cidade: $("#eCid").value.trim() || "São Paulo - SP", cep: $("#eCep").value.trim(), lat: e.lat || -23.55, lng: e.lng || -46.63, principal: $("#ePrin").checked };
      if (edit) Object.assign(edit, obj);
      else u.enderecos.push(Object.assign({ id: uid("end") }, obj));
      if (obj.principal) u.enderecos.forEach((x, i) => { if (x !== (edit || u.enderecos[u.enderecos.length - 1])) x.principal = false; });
      DB.salvar(); fecharModal(); render(); toast("Endereço salvo!", "ok");
    };
  }
  render();
}

/* ---------- Formas de pagamento ---------- */
function viewClientePagamentos() {
  const app = $("#app");
  const u = usuarioAtual();
  const render = () => {
    app.innerHTML = `
      <div class="flex-between" style="margin-bottom:12px">
        <div><h2>💳 Formas de pagamento</h2><p class="card-sub">Cartão, PIX e débito processados por gateway seguro (RF12).</p></div>
        <button class="btn btn-pri btn-sm" id="addPag">+ Nova</button>
      </div>
      <div class="lista">
        ${u.formasPagamento.length ? u.formasPagamento.map((p, i) => `
          <div class="item">
            <span class="item-icone">${p.tipo === "PIX" ? "🔑" : "💳"}</span>
            <div class="item-corpo">
              <div class="item-titulo">${p.tipo} ${p.padrao ? `<span class="chip chip-pri">padrão</span>` : ""}</div>
              <div class="item-sub">${p.desc}</div>
            </div>
            <button class="btn btn-ghost btn-sm" data-del="${i}" style="color:var(--vermelho)">✕</button>
          </div>`).join("") : `<div class="card vazio">Nenhuma forma de pagamento cadastrada.</div>`}
      </div>`;
    $("#addPag").onclick = () => {
      abrirModal(`
        <h3>Nova forma de pagamento</h3>
        <div class="field"><label>Tipo</label>
          <select id="pTip"><option value="PIX">PIX</option><option value="Cartão de crédito">Cartão de crédito</option><option value="Débito">Débito</option></select>
        </div>
        <div class="field"><label>Descrição</label><input id="pDesc" placeholder="Ex.: chave PIX / final do cartão" /></div>
        <div class="modal-acoes">
          <button class="btn btn-contorno btn-sm" id="pCancela">Cancelar</button>
          <button class="btn btn-pri btn-sm" id="pSalva">Salvar</button>
        </div>`);
      $("#pCancela").onclick = fecharModal;
      $("#pSalva").onclick = () => {
        const desc = $("#pDesc").value.trim();
        if (!desc) { toast("Informe a descrição.", "erro"); return; }
        u.formasPagamento.push({ id: uid("pg"), tipo: $("#pTip").value, desc, padrao: u.formasPagamento.length === 0 });
        DB.salvar(); fecharModal(); render(); toast("Forma de pagamento salva!", "ok");
      };
    };
    $$("[data-del]").forEach((b) => b.onclick = () => {
      const i = Number(b.dataset.del);
      confirmar(`<h3>Remover?</h3><p class="card-sub">${u.formasPagamento[i].tipo} — ${u.formasPagamento[i].desc}</p>`, () => {
        u.formasPagamento.splice(i, 1); DB.salvar(); render(); toast("Removido.");
      });
    });
  };
  render();
}

/* ---------- Mensagens (RF23) ---------- */
function viewClienteMensagens() {
  const app = $("#app");
  const u = usuarioAtual();
  const dados = DB.dados();
  const meus = dados.servicos.filter((s) => s.idCliente === u.id && (s.chat || []).length >= 0).sort((a, b) => b.data.localeCompare(a.data));
  app.innerHTML = `
    <h2>💬 Mensagens</h2>
    <p class="card-sub" style="margin-bottom:14px">Chat interno protegido — sem expor seu número (RF23).</p>
    <div class="lista">
      ${meus.length ? meus.map((s) => `
        <div class="item" data-svc="${s.id}">
          <span class="item-icone">💬</span>
          <div class="item-corpo">
            <div class="item-titulo">${s.tipo} — ${s.endereco.apelido}</div>
            <div class="item-sub">${(s.chat || []).length ? "Última: " + s.chat[s.chat.length - 1].texto : "Nenhuma mensagem ainda"}</div>
          </div>
          <span class="tag">${(s.chat || []).length}</span>
        </div>`).join("") : `<div class="card vazio">Você ainda não tem conversas.</div>`}
    </div>`;
  $$("[data-svc]").forEach((el) => el.onclick = () => abrirChat(dados.servicos.find((x) => x.id === el.dataset.svc)));
}