"use strict";

/* ============================================================
   Aguid@Help — Dados de demonstração (seed)
   Datas relativas ao dia atual para o MVP parecer "vivo".
   ============================================================ */

function GROW_SEED() {
  const hoje = hojeISO(0);
  const ontem = hojeISO(-1);
  const amanha = hojeISO(1);
  const d2 = hojeISO(2);
  const d6 = hojeISO(6);
  const d10 = hojeISO(-10);
  const hAgora = agoraHora();

  /* ---------- Configuração do negócio (RF19) ---------- */
  const config = {
    precoResidencial: 45,      // por cômodo
    precoComercial: 60,        // por cômodo
    precoPosObraM2: 18,        // por m²
    comissaoPct: 0.15,
    descricaoPlataforma: "Marketplace de limpeza profissional: residencial, comercial e pós-obra.",
    adicionais: [
      { id: "win", nome: "Limpeza de janelas", extra: 25 },
      { id: "arm", nome: "Interior de armários", extra: 20 },
      { id: "gel", nome: "Limpeza de geladeira", extra: 15 },
      { id: "est", nome: "Aspiração de estofados", extra: 30 },
    ],
    checklist: {
      "Residencial": [
        "Varrer e passar pano nos pisos",
        "Limpar banheiros (pia, vaso e box)",
        "Limpar cozinha e pia",
        "Passar pano nos móveis e organizar",
        "Recolher o lixo",
      ],
      "Comercial": [
        "Limpar recepção e mesa de atendimento",
        "Varrer e passar pano no escritório",
        "Limpar banheiros",
        "Esvaziar lixeiras",
        "Repor insumos (toalha, papel)",
      ],
      "Pós-obra": [
        "Remover poeira de pisos e paredes",
        "Limpar vidros e esquadrias",
        "Aspirar carpetes e pisos",
        "Limpar rejuntes, cubas e bancadas",
        "Polimento final e inspeção",
      ],
    },
    cursos: [
      { id: "c1", titulo: "Fundamentos de limpeza profissional", desc: "Produtos, panos, diluições e boas práticas para cada superfície.", nivel: "Básico", aulas: 3, min: 12 },
      { id: "c2", titulo: "Faxina residencial e comercial na prática", desc: "Rotina de trabalho, checklist e organização do atendimento.", nivel: "Intermediário", aulas: 4, min: 18 },
      { id: "c3", titulo: "Pós-obra: como entregar um padrão impecável", desc: "Técnicas específicas para limpeza pesada e finalização.", nivel: "Avançado", aulas: 5, min: 22 },
      { id: "c4", titulo: "Atendimento, postura e segurança no local", desc: "Como se apresentar, se comunicar e agir com segurança.", nivel: "Básico", aulas: 2, min: 9 },
    ],
  };

  /* ---------- Profissionais (Prestadores) ---------- */
  const profissionais = [
    {
      id: "prof-carlos", nome: "Carlos Lima", email: "carlos@demo.com", senha: "1234", perfil: "profissional",
      telefone: "(11) 98811-2233", cpf: "412.359.870-05", nascimento: "1992-04-18",
      status: "aprovado",
      areas: ["Residencial", "Comercial"],
      servicosOferecidos: ["Faxina simples", "Faxina pesada", "Limpeza pós-obra"],
      experiencia: "10 anos de experiência com limpeza residencial e comercial. Especialista em pós-obra e atendimento a escritórios.",
      foto: null, perfilCompleto: 92,
      competencias: { "Residencial": 95, "Comercial": 85, "Pós-obra": 80 },
      documentos: [
        { tipo: "RG", nome: "rg-carlos.pdf", status: "aprovado" },
        { tipo: "CPF", nome: "cpf-carlos.pdf", status: "aprovado" },
        { tipo: "Comprovante de residência", nome: "comprovante-carlos.pdf", status: "aprovado" },
        { tipo: "Antecedentes criminais", nome: "antecedentes-carlos.pdf", status: "aprovado" },
      ],
      avaliacaoMedia: 4.8, avaliacoesN: 41, servicosConcluidos: 37,
      saldoDisponivel: 486.5, saldoPendente: 231.2,
      extrato: [
        { data: d10, desc: "Faxina residencial — Sra. Ana", valor: 382.5 },
        { data: ontem, desc: "Limpeza comercial — Escritório Vetor", valor: 544 },
        { data: ontem, desc: "Saque via PIX solicitado", valor: -500 },
      ],
      selos: ["Perfil verificado", "Qualificado Aguid"],
      localizacao: { lat: -23.5613, lng: -46.6559, cidade: "São Paulo - SP" },
      cursos: [
        { idCurso: "c1", progresso: 100, concluido: true },
        { idCurso: "c2", progresso: 66, concluido: false },
        { idCurso: "c4", progresso: 100, concluido: true },
      ],
      biografia: "Profissional dedicado, pontual e com foco na satisfação do cliente.",
    },
    {
      id: "prof-maria", nome: "Maria Jesus", email: "maria@demo.com", senha: "1234", perfil: "profissional",
      telefone: "(11) 97722-3344", cpf: "257.640.118-30", nascimento: "1988-11-02",
      status: "em_analise",
      areas: ["Residencial"],
      servicosOferecidos: ["Faxina simples", "Passadoria"],
      experiencia: "6 anos como diarista em residências. Cursando o módulo de qualificação Aguid.",
      foto: null, perfilCompleto: 78,
      competencias: { "Residencial": 88, "Comercial": 50, "Pós-obra": 30 },
      documentos: [
        { tipo: "RG", nome: "rg-maria.pdf", status: "aprovado" },
        { tipo: "CPF", nome: "cpf-maria.pdf", status: "aprovado" },
        { tipo: "Comprovante de residência", nome: "comprovante-maria.pdf", status: "em_analise" },
        { tipo: "Antecedentes criminais", nome: "antecedentes-maria.pdf", status: "pendente" },
      ],
      avaliacaoMedia: 0, avaliacoesN: 0, servicosConcluidos: 0,
      saldoDisponivel: 0, saldoPendente: 0,
      extrato: [],
      selos: [],
      localizacao: { lat: -23.5505, lng: -46.6333, cidade: "São Paulo - SP" },
      cursos: [],
      biografia: "",
    },
    {
      id: "prof-juliana", nome: "Juliana Rocha", email: "juliana@demo.com", senha: "1234", perfil: "profissional",
      telefone: "(11) 96611-2211", cpf: "388.910.442-71", nascimento: "1995-06-27",
      status: "reprovado",
      areas: ["Residencial"],
      servicosOferecidos: ["Faxina simples"],
      experiencia: "2 anos de experiência.",
      foto: null, perfilCompleto: 60,
      competencias: { "Residencial": 70, "Comercial": 40, "Pós-obra": 20 },
      documentos: [
        { tipo: "RG", nome: "rg-juliana.pdf", status: "aprovado" },
        { tipo: "CPF", nome: "cpf-juliana.pdf", status: "aprovado" },
        { tipo: "Antecedentes criminais", nome: "antecedentes-juliana.pdf", status: "recusado" },
      ],
      avaliacaoMedia: 0, avaliacoesN: 0, servicosConcluidos: 0,
      saldoDisponivel: 0, saldoPendente: 0,
      extrato: [],
      selos: [],
      localizacao: { lat: -23.5700, lng: -46.6400, cidade: "São Paulo - SP" },
      cursos: [],
      biografia: "",
      motivoRecusa: "Certidão de antecedentes criminais não enviada em até 7 dias.",
    },
  ];

  /* ---------- Cliente (Contratante) ---------- */
  const clientes = [
    {
      id: "cli-ana", nome: "Ana Souza", email: "ana@demo.com", senha: "1234", perfil: "cliente",
      telefone: "(11) 99912-8877", cpf: "122.583.660-08", nascimento: "1990-02-14",
      enderecos: [
        { id: "end1", apelido: "Minha casa", rua: "Rua das Flores, 123 — Apto 42", cidade: "São Paulo - SP", cep: "01310-100", lat: -23.5613, lng: -46.6559, principal: true },
        { id: "end2", apelido: "Escritório Vetor", rua: "Av. Paulista, 1000 — 8º andar", cidade: "São Paulo - SP", cep: "01310-100", lat: -23.5629, lng: -46.6544, principal: false },
        { id: "end3", apelido: "Casa da praia", rua: "Rua do Mar, 45", cidade: "Praia Grande - SP", cep: "11700-000", lat: -24.0060, lng: -46.4021, principal: false },
      ],
      formasPagamento: [
        { id: "pg1", tipo: "PIX", desc: "chave: * 999 * 12258366008", padrao: true },
        { id: "pg2", tipo: "Cartão de crédito", desc: "Visa •••• 4431", padrao: false },
      ],
      assinaturas: [
        { id: "ass1", tipo: "Residencial", frequencia: "Semanal", valor: 405, ativa: true },
      ],
    },
    {
      id: "cli-pedro", nome: "Pedro Martins", email: "pedro@demo.com", senha: "1234", perfil: "cliente",
      telefone: "(11) 98877-5522", cpf: "740.221.594-60", nascimento: "1985-09-30",
      enderecos: [
        { id: "endp1", apelido: "Consultório", rua: "Rua Augusta, 850", cidade: "São Paulo - SP", cep: "01305-100", lat: -23.5560, lng: -46.6550, principal: true },
      ],
      formasPagamento: [
        { id: "pgp1", tipo: "PIX", desc: "chave: pedro.martins@email.com", padrao: true },
      ],
      assinaturas: [],
    },
  ];

  /* ---------- Serviços ---------- */
  const servicos = [
    // Oportunidade aberta (para o mural do profissional)
    {
      id: "svc-op1", idCliente: "cli-pedro", nomeCliente: "Pedro Martins", idProfissional: null,
      tipo: "Comercial", endereco: { apelido: "Consultório", rua: "Rua Augusta, 850", cidade: "São Paulo - SP", lat: -23.5560, lng: -46.6550 },
      data: amanha, hora: "14:00", duracaoMin: 180, comodos: 4, areaM2: null,
      adicionais: ["Limpeza de janelas"],
      valor: 265, status: "oportunidade", recorrencia: "unica",
      timeline: [{ status: "oportunidade", data: hoje, hora: "09:12" }],
      checkinAt: null, checkoutAt: null, checklist: [], evidencias: [], observacoes: "",
      avaliacao: null, chat: [],
    },
    {
      id: "svc-op2", idCliente: "cli-ana", nomeCliente: "Ana Souza", idProfissional: null,
      tipo: "Pós-obra", endereco: { apelido: "Minha casa", rua: "Rua das Flores, 123 — Apto 42", cidade: "São Paulo - SP", lat: -23.5613, lng: -46.6559 },
      data: d6, hora: "08:30", duracaoMin: 360, comodos: null, areaM2: 62,
      adicionais: ["Limpeza de janelas", "Aspiração de estofados"],
      valor: 1241.6, status: "oportunidade", recorrencia: "unica",
      timeline: [{ status: "oportunidade", data: hoje, hora: "10:05" }],
      checkinAt: null, checkoutAt: null, checklist: [], evidencias: [], observacoes: "Imóvel recém-pintado, muita poeira fina.",
      avaliacao: null, chat: [],
    },
    // Aceito (agendado)
    {
      id: "svc-aceito", idCliente: "cli-ana", nomeCliente: "Ana Souza", idProfissional: "prof-carlos",
      tipo: "Residencial", endereco: { apelido: "Minha casa", rua: "Rua das Flores, 123 — Apto 42", cidade: "São Paulo - SP", lat: -23.5613, lng: -46.6559 },
      data: amanha, hora: "09:00", duracaoMin: 240, comodos: 5, areaM2: null,
      adicionais: ["Interior de armários"],
      valor: 245, status: "aceito", recorrencia: "unica",
      timeline: [{ status: "aceito", data: hoje, hora: "08:40" }],
      checkinAt: null, checkoutAt: null, checklist: [], evidencias: [], observacoes: "Chave com a portaria.",
      avaliacao: null, chat: [{ de: "cliente", texto: "Bom dia, Carlos! A chave está com a portaria. 🙏", hora: "08:45" }],
    },
    // Em andamento hoje
    {
      id: "svc-andamento", idCliente: "cli-ana", nomeCliente: "Ana Souza", idProfissional: "prof-carlos",
      tipo: "Residencial", endereco: { apelido: "Escritório Vetor", rua: "Av. Paulista, 1000 — 8º andar", cidade: "São Paulo - SP", lat: -23.5629, lng: -46.6544 },
      data: hoje, hora: "13:00", duracaoMin: 240, comodos: 4, areaM2: null,
      adicionais: [],
      valor: 180, status: "em_andamento", recorrencia: "quinzenal",
      timeline: [{ status: "aceito", data: ontem, hora: "16:20" }, { status: "em_andamento", data: hoje, hora: "13:02" }],
      checkinAt: `${hoje} 13:02`, checkoutAt: null,
      checklist: [ { tarefa: "Varrer e passar pano nos pisos", feita: true }, { tarefa: "Limpar banheiros (pia, vaso e box)", feita: true }, { tarefa: "Limpar cozinha e pia", feita: false }, { tarefa: "Passar pano nos móveis e organizar", feita: false }, { tarefa: "Recolher o lixo", feita: false } ],
      evidencias: [], observacoes: "",
      avaliacao: null,
      chat: [{ de: "profissional", texto: "Cheguei e já iniciei a limpeza. 👍", hora: "13:05" }, { de: "cliente", texto: "Perfeito, obrigada!", hora: "13:10" }],
    },
    // Concluído (aguardando avaliação)
    {
      id: "svc-concluido", idCliente: "cli-pedro", nomeCliente: "Pedro Martins", idProfissional: "prof-carlos",
      tipo: "Comercial", endereco: { apelido: "Consultório", rua: "Rua Augusta, 850", cidade: "São Paulo - SP", lat: -23.5560, lng: -46.6550 },
      data: ontem, hora: "18:00", duracaoMin: 180, comodos: 4, areaM2: null,
      adicionais: ["Aspiração de estofados"],
      valor: 270, status: "concluido", recorrencia: "unica",
      timeline: [{ status: "aceito", data: d2, hora: "11:00" }, { status: "em_andamento", data: ontem, hora: "18:05" }, { status: "concluido", data: ontem, hora: "21:10" }],
      checkinAt: `${ontem} 18:05`, checkoutAt: `${ontem} 21:10`,
      checklist: [
        { tarefa: "Limpar recepção e mesa de atendimento", feita: true },
        { tarefa: "Varrer e passar pano no escritório", feita: true },
        { tarefa: "Limpar banheiros", feita: true },
        { tarefa: "Esvaziar lixeiras", feita: true },
        { tarefa: "Repor insumos (toalha, papel)", feita: true },
      ],
      evidencias: [], observacoes: "",
      avaliacao: null,
      chat: [],
    },
    // Avaliado (histórico)
    {
      id: "svc-avaliado", idCliente: "cli-ana", nomeCliente: "Ana Souza", idProfissional: "prof-carlos",
      tipo: "Residencial", endereco: { apelido: "Minha casa", rua: "Rua das Flores, 123 — Apto 42", cidade: "São Paulo - SP", lat: -23.5613, lng: -46.6559 },
      data: d10, hora: "09:00", duracaoMin: 300, comodos: 6, areaM2: null,
      adicionais: ["Limpeza de janelas", "Interior de armários"],
      valor: 450, status: "avaliado", recorrencia: "unica",
      timeline: [{ status: "aceito", data: d6 + "T", hora: "" }, { status: "concluido", data: d10, hora: "14:00" }],
      checkinAt: `${d10} 09:05`, checkoutAt: `${d10} 14:10`,
      checklist: [],
      evidencias: [], observacoes: "",
      avaliacao: { nota: 5, comentario: "Carlos é excelente! Pontual, caprichoso e muito educado.", criterios: { qualidade: 5, pontualidade: 5, comunicacao: 5 } },
      chat: [],
    },
  ];

  return {
    versao: "1.0.0",
    criadoEm: new Date().toISOString(),
    config,
    usuarios: { clientes, profissionais },
    admin: [{ id: "adm-1", nome: "Administrador", email: "admin@aguidhelp.com", senha: "admin123", perfil: "admin" }],
    servicos,
    logs: [
      { id: uid("log"), data: `${hoje} ${agoraHora()}`, msg: "Novo serviço de pós-obra disponibilizado como oportunidade." },
      { id: uid("log"), data: `${hoje} ${agoraHora()}`, msg: "Cadastro de Maria Jesus enviado para análise." },
      { id: uid("log"), data: `${ontem} 18:20`, msg: "Serviço concluído (Consultório) — aguardando avaliação do cliente." },
    ],
  };
}