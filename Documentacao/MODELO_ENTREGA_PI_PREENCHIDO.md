# Aguid@Help — Aplicativo móvel responsivo para marketplace de serviços de limpeza profissional

## Projeto Integrador — Análise e Desenvolvimento de Sistemas (5º semestre)

### Capa

::capa::
**Tema:** Aplicativo WEB/PWA móvel responsivo
**Título:** Aguid@Help — Marketplace de serviços de limpeza profissional

**Integrantes:**
- [NOME DO INTEGRANTE 1] — RA: [RA]
- [NOME DO INTEGRANTE 2] — RA: [RA]
- [NOME DO INTEGRANTE 3] — RA: [RA]

**Instituição:** [NOME DA INSTITUIÇÃO]
**Curso:** Análise e Desenvolvimento de Sistemas
**Disciplina:** Projeto Integrador
**Orientação:** [NOME DO ORIENTADOR / PROFESSOR]
**Ano:** 2026

---

# 1. Abstract (Resumo executivo)

## Resumo

O presente projeto integrador apresenta o Aguid@Help, um aplicativo móvel responsivo (PWA — Progressive Web App) que atua como marketplace de serviços de limpeza profissional. A plataforma conecta contratantes — pessoas e empresas — a profissionais de limpeza qualificados e verificados, abrangendo serviços residenciais, comerciais e de pós-obra. O aplicativo oferece agendamento inteligente com orçamento instantâneo, seleção de profissionais por reputação e proximidade, pagamento digital seguro (simulado no MVP), acompanhamento de status em tempo real, avaliação 360°, planos de assinatura recorrente e um módulo de capacitação profissional (Aguid@Educação).

O desenvolvimento foi orientado pelas metodologias ágeis (Scrum) e priorizou um Minimo Produto Viável (MVP) que contempla os três perfis de usuário — Cliente, Profissional e Administrador — organizados em sete processos de negócio e quatorze telas funcionais. A solução foi construída com tecnologias web padrão (HTML5, CSS3 e JavaScript), permitindo execução em celulares, tablets e desktops com uma única base de código, e utiliza armazenamento local no computador do usuário (arquivo JSON), sem dependência de nuvem ou custos adicionais.

**Palavras-chave:** Limpeza Profissional, Marketplace, Aplicativo Móvel Responsivo, PWA, Agendamento, Formalização.

## Abstract

The present integrative project introduces Aguid@Help, a responsive mobile application (PWA — Progressive Web App) that works as a marketplace for professional cleaning services. The platform connects clients — individuals and companies — with qualified and verified cleaning professionals, covering residential, commercial and post-construction services. The application offers intelligent scheduling with instant budgeting, professional selection by reputation and proximity, secure digital payment (simulated in the MVP), real-time status tracking, 360° rating, recurring subscription plans and a professional training module (Aguid@Educação).

Development was guided by agile methodologies (Scrum) and prioritized a Minimum Viable Product (MVP) that covers the three user profiles — Client, Professional and Administrator — organized into seven business processes and fourteen functional screens. The solution was built with standard web technologies (HTML5, CSS3 and JavaScript), enabling execution on smartphones, tablets and desktops with a single codebase, and uses local storage on the user's computer (JSON file), with no cloud dependency or additional costs.

**Keywords:** Professional Cleaning, Marketplace, Responsive Mobile Application, PWA, Scheduling, Formalization.

---

# 2. Introdução

## 2.1 Desenvolvimento e funcionalidade

O projeto Aguid@Help está sendo desenvolvido como um marketplace digital para serviços de limpeza profissionais, atuando como intermediário eficiente entre a demanda crescente por limpeza profissional e a oferta de mão de obra qualificada. O objetivo geral envolve a oferta de serviços de limpeza (simples ou pesada), com facilidade nos agendamentos, credibilidade na qualidade dos serviços prestados e qualificação dos prestadores contratados.

A funcionalidade principal do aplicativo é a geolocalização combinada ao agendamento dinâmico: clientes encontram profissionais disponíveis em sua área e agendam serviços em tempo real, com transparência de preços e segurança nas transações.

## 2.2 Compromisso com a sociedade

O Aguid@Help se compromete a:

- **Valorizar o trabalho:** garantir que os profissionais recebam remuneração justa e transparente pelo seu trabalho, com painel financeiro, extratos e saques via PIX.
- **Segurança e confiança:** oferecer verificação de antecedentes e documentos para os profissionais, assegurando que clientes saibam quem está entrando em sua residência ou escritório.
- **Inclusão digital:** capacitar profissionais autônomos no uso da plataforma por meio do módulo Aguid@Educação, promovendo a inclusão no mercado digital de serviços.

---

# 3. Análise de Viabilidade

## 3.1 Público-alvo e segmento de mercado

A necessidade de uma aplicação como o Aguid@Help reside na fragmentação e informalidade do mercado de serviços de limpeza:

- **Comunidade (Clientes):** indivíduos e famílias buscam praticidade e segurança (saber quem está entrando em sua residência/escritório) e padronização da qualidade do serviço.
- **Empresas:** pequenos escritórios, coworkings, clínicas e startups demandam agendamentos flexíveis, sem os custos fixos de um funcionário CLT.
- **Setores (Profissionais):** diaristas e faxineiros autônomos enfrentam insegurança na busca por clientes, dificuldade na cobrança e falta de benefícios ou treinamento. Uma plataforma profissionaliza e centraliza a gestão de sua carreira.

## 3.2 Proposta de valor

- **Para o cliente:** contratação rápida, prática e segura, com orçamento instantâneo e profissionais verificados.
- **Para o profissional:** geração de renda digna, praticidade no agendamento, treinamentos e formalização do trabalho.
- **Para a sociedade:** fortalecimento da economia local, formalização do trabalho doméstico e verificação de antecedentes.

## 3.3 Viabilidade técnica e econômica

O desenvolvimento do aplicativo é viável com tecnologias web padrão abertas e gratuitas. O MVP foi construído a custo zero de software (HTML5, CSS3, JavaScript), executando localmente no computador do usuário por meio de um servidor simples em PowerShell, sem necessidade de servidores pagos ou licenças.

| Item | Descrição | Custo estimado |
|---|---|---|
| Desenvolvimento do app | Squad acadêmica; tecnologias abertas | R$ 0 (MVP acadêmico) |
| Infraestrutura | Nenhuma nuvem; servidor local no computador | R$ 0 |
| Marketing inicial | Campanhas de aquisição (fase futura) | R$ 10.000 (estimativa) |
| Legal/segurança | Verificação de antecedentes, LGPD | Variável (por serviço) |
| Total MVP | Mínimo para lançamento comercial futuro | escalável |

## 3.4 Análise SWOT

| Forças (Strengths) | Fraquezas (Weaknesses) |
|---|---|
| S1: Modelo de negócio escalável (marketplace) | W1: Dependência da qualidade do serviço de terceiros |
| S2: Foco em segurança e verificação de antecedentes | W2: Alto custo inicial de aquisição de usuários |
| S3: Transparência de preço e agendamento flexível | W3: Risco de "furar a plataforma" |

| Oportunidades (Opportunities) | Ameaças (Threats) |
|---|---|
| O1: Crescimento do mercado on-demand | T1: Concorrência estabelecida de grande porte |
| O2: Formalização do trabalho autônomo | T2: Mudanças regulatórias na legislação trabalhista |
| O3: Expansão para outras cidades rapidamente | T3: Avaliações negativas que prejudiquem a reputação |

---

# 4. Escopo Geral

O projeto desenvolve o Aguid@Help, um **aplicativo móvel responsivo (PWA)** cujo ponto central é o marketplace de serviços de limpeza, visando a integração de agendamento, formas seguras de pagamento e avaliação de perfil dos prestadores.

O escopo do MVP abrange **três perfis de usuário** e **sete processos de negócio**, entregues em **quatorze telas funcionais**:

1. **Processo 1 — Cadastro e Validação de Identidade:** gestão de perfil e competências, verificação de segurança (upload de documentos) e status de adesão.
2. **Processo 2 — Contratação e Oportunidades:** central de oportunidades do profissional e agendamento/contratação inteligente do cliente.
3. **Processo 3 — Execução e Acompanhamento:** check-in/check-out com geolocalização, checklist de qualidade, acompanhamento de status e chat interno.
4. **Processo 4 — Pós-serviço, Avaliação e Financeiro:** avaliação 360°, painel financeiro e saques, e repasses.
5. **Processo 5 — Capacitação:** módulo Aguid@Educação com treinamentos em vídeo, questionários e selos de qualificação.
6. **Processo 6 — Gestão da Plataforma:** dashboard administrativo (BI) e curadoria/monitoramento de perfis.
7. **Processo 7 — Segurança e Privacidade:** autenticação centralizada, conformidade LGPD e comunicação segura.

O aplicativo foi projetado para plataformas **mobile, tablet e desktop**, com interface responsiva e instalação como aplicativo nativo no Android (PWA).

---

# 5. Análise de Requisitos

## 5.1 Pesquisa de campo e necessidade social

Pesquisa exploratória aponta que a contratação informal de profissionais de limpeza gera insegurança (quem entra na residência), falta de padrão de qualidade e autônomos sem acesso a benefícios e treinamento. Um formulário digital pode ser aplicado para levantar: frequência de contratação, preço médio pago, principais medos (segurança, qualidade) e recursos mais desejados no aplicativo (pagamento, reagendamento, avaliação).

## 5.2 Soluções parecidas e aperfeiçoamento

Existem plataformas de serviços domésticos no mercado, porém o Aguid@Help diferencia-se por: **foco exclusivo em limpeza** com treinamento estruturado (Aguid@Educação), **transparência de preços** (cobrança por cômodo, por m² ou por hora, pré-estabelecida) e **feedback 360°** (avaliação mútua entre cliente e profissional).

## 5.3 Requisitos funcionais

A especificação foi consolidada em **25 requisitos funcionais (RF01–RF25)**, organizados conforme a orientação acadêmica por processos de negócio:

| Requisito | Descrição | Processo |
|---|---|---|
| RF01 | Gestão de perfil e competências (profissional) | Cadastro e Validação de Identidade |
| RF02 | Verificação de segurança (upload de documentos e antecedentes) | Cadastro e Validação de Identidade |
| RF03 | Status de adesão (aprovação do cadastro) | Cadastro e Validação de Identidade |
| RF04 | Central de oportunidades (aceitar/recusar serviços) | Solicitação, Orçamento e Contratação |
| RF05 | Registro de execução (check-in/out com geolocalização) | Execução e Acompanhamento Operacional |
| RF06 | Painel financeiro e saques (carteira do profissional) | Pós-Serviço, Avaliação e Financeiro |
| RF07 | Aguid@Educação (treinamentos e qualificação) | Pós-Serviço, Avaliação e Financeiro |
| RF08 | Gestão de conta e localidades (cliente) | Cadastro e Validação de Identidade |
| RF09 | Agendamento inteligente (detalhamento da limpeza) | Solicitação, Orçamento e Contratação |
| RF10 | Seleção de profissionais (vitrine com avaliações) | Solicitação, Orçamento e Contratação |
| RF11 | Acompanhamento de status (notificações em tempo real) | Execução e Acompanhamento Operacional |
| RF12 | Pagamento seguro digital (cartão, PIX, débito) | Solicitação, Orçamento e Contratação |
| RF13 | Avaliação 360° (notas e comentários) | Pós-Serviço, Avaliação e Financeiro |
| RF14 | Orçamento instantâneo (cálculo em tempo real) | Solicitação, Orçamento e Contratação |
| RF15 | Sistema de assinatura (serviços recorrentes) | Solicitação, Orçamento e Contratação |
| RF16 | Painel de controle gerencial (métricas e BI) | Governança, Configuração e Privacidade |
| RF17 | Curadoria e moderação (aprovação/reprovação de perfis) | Cadastro e Validação de Identidade |
| RF18 | Monitoramento em tempo real (mapa logístico) | Execução e Acompanhamento Operacional |
| RF19 | Configuração de negócio (preços, comissões, categorias) | Governança, Configuração e Privacidade |
| RF20 | Gestão de repasses (conciliação e pagamentos em lote) | Pós-Serviço, Avaliação e Financeiro |
| RF21 | Check-list de qualidade (tarefas obrigatórias) | Execução e Acompanhamento Operacional |
| RF22 | Autenticação centralizada (login seguro e recuperação) | Cadastro e Validação de Identidade |
| RF23 | Chat interno em tempo real (comunicação segura) | Execução e Acompanhamento Operacional |
| RF24 | Geolocalização integrada (validação de endereços e distâncias) | Cadastro e Validação de Identidade |
| RF25 | Conformidade LGPD (privacidade, exportação e exclusão de dados) | Governança, Configuração e Privacidade |

## 5.4 Requisitos não funcionais (resumo)

- **Usabilidade:** interface mobile-first, agendamento em menos de 4 passos, ícones claros e design limpo.
- **Segurança:** autenticação simulado com papéis (cliente, profissional, admin), proteção de dados conforme LGPD.
- **Desempenho:** aplicação leve (sem build), carregamento rápido e geolocalização precisa.
- **Portabilidade:** funciona em navegadores de celular, tablet e desktop; instalável como PWA no Android.
- **Acessibilidade:** alto contraste, navegação por teclado e respeito a `prefers-reduced-motion`.

---

# 6. Análise de Cenários

É fundamental simular cenários em que os resultados não sejam tão positivos, para adaptar o negócio:

- **Cenário: adesão abaixo do esperado.** Se poucos profissionais se cadastrarem, a plataforma pode fidelizar a base existente com prioridade de agendas e selos de destaque, além de campanhas de indicação.
- **Cenário: queda nas contratações.** O foco pode migrar para clientes B2B (escritórios, coworkings e clínicas) com pacotes de limpeza recorrente e contratos de assinatura.
- **Cenário: concorrência de grandes plataformas.** A diferenciação por especialização em limpeza, treinamento gratuito e preço pré-estabelecido é o principal escudo competitivo.
- **Cenário: avaliações negativas prejudicando a reputação.** A moderação administrativa (RF17) e o checklist de qualidade (RF21) atuam preventivamente; perfis com baixa avaliação podem ser despriorizados automaticamente.

---

# 7. Tecnologias Utilizadas

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | HTML5, CSS3 e JavaScript (PWA) | Uma única base de código para celular, tablet e desktop; roda em qualquer navegador; instalação como app Android |
| Armazenamento | LocalStorage + arquivo JSON (servidor local) | Sem nuvem e sem custo; os dados ficam no computador do usuário |
| Servidor local | PowerShell (TCP listener) | Entrega do app e API simples de dados na rede local, sem dependências externas |
| Geolocalização | API nativa do navegador (Geolocation) | Validação de presença no check-in e cálculo de distâncias |
| PWA | Manifest + Service Worker | Modo offline e instalação na tela inicial do dispositivo |
| Modelagem | UML (casos de uso, classes, processos) | Documentação e comunicação do projeto |

**Metodologia de desenvolvimento:** Scrum (metodologia ágil), com sprints curtos e entrega contínua de valor.

**Ferramentas:** editor de código (VS Code), controle de versão (Git/GitHub, opcional), navegador e ferramentas de desenvolvimento.

---

# 8. Plano Operacional

O plano operacional descreve, na prática, como o negócio funciona a partir dos seus principais processos:

1. **Onboarding do profissional:** o profissional cria o perfil com competências e áreas de atuação (RF01), envia documentos obrigatórios (RF02) e acompanha o status de adesão (RF03) até ser aprovado pela curadoria (RF17).
2. **Contratação:** o cliente cadastra endereços (RF08), agenda o serviço com detalhamento e orçamento instantâneo (RF09/RF14), seleciona o profissional (RF10), efetua o pagamento (RF12) e pode optar por assinatura recorrente (RF15). O serviço é publicado na central de oportunidades do profissional (RF04).
3. **Execução:** no dia, o profissional realiza check-in com geolocalização (RF05), segue o checklist de qualidade (RF21) e finaliza com check-out. O cliente acompanha o status em tempo real (RF11) e a comunicação ocorre via chat interno (RF23).
4. **Pós-serviço:** o cliente avalia a experiência (RF13), o sistema calcula os valores e a comissão da plataforma, liberando o repasse ao profissional (RF06/RF20). O profissional pode se capacitar no Aguid@Educação (RF07).
5. **Gestão:** o administrador acompanha indicadores (RF16), monitora serviços ativos (RF18) e configura preços, comissões e checklists (RF19).

A plataforma cobra uma comissão percentual por serviço (configurável, padrão 15%), que sustenta a operação e os repasses.

---

# 9. Protótipo

O protótipo foi desenhado como **aplicativo móvel responsivo** (mobile-first), organizado em **14 telas** distribuídas pelos 7 processos. Navegação inferior (tab bar) no celular e menu lateral no desktop.

| Tela | Processo | Requisitos |
|---|---|---|
| Tela 01 — Gestão de Perfil e Competências | 1 | RF01 |
| Tela 02 — Verificação de Segurança e Upload de Documentos | 1 | RF02 |
| Tela 03 — Status de Aprovação do Cadastro | 1 | RF03 |
| Tela 04 — Oportunidades Disponíveis | 2 | RF04 |
| Tela 05 — Serviço em Andamento (Check-in/out) | 3 | RF05, RF21 |
| Tela 06 — Acompanhamento do Serviço e Notificações | 3 | RF11, RF23 |
| Tela 07 — Avaliação do Serviço | 4 | RF13 |
| Tela 08 — Painel Financeiro e Saques | 4 | RF06, RF20 |
| Tela 09 — Aguid@Educação | 5 | RF07 |
| Tela 10 — Dashboard Administrativo | 6 | RF16, RF18, RF19 |
| Tela 11 — Aprovação e Moderação de Prestadores | 6 | RF17 |
| Tela 12 — Login, Segurança e Privacidade | 7 | RF22, RF24, RF25 |
| Tela 13 — Chat Interno e Suporte | 7 | RF23 |
| Tela 14 — Agendamento e Contratação Inteligente | 2 | RF08, RF09, RF10, RF12, RF15 |

---

# 10. Linguagem Utilizada (Software de Programação)

O aplicativo foi desenvolvido em **HTML5, CSS3 e JavaScript** — tecnologias universais da web, de fácil manutenção e compatíveis com qualquer navegador moderno — organizadas como uma **SPA (Single Page Application)** com roteamento por hash e arquitetura em camadas:

- `database.js` — camada de dados (localStorage e API JSON local).
- `seed.js` — dados de demonstração da banca.
- `ui.js` — utilitários de interface (toasts, modais, chips).
- `views-*.js` — telas por perfil (cliente, profissional, administrador e comuns).
- `app.js` — roteador, sessão e inicialização.

O **banco de dados** é representado por um arquivo JSON armazenado localmente no computador (fora do OneDrive, em `%LOCALAPPDATA%`), consumido e gravado por uma API simples do servidor local — eliminando custo de nuvem. A escolha do JavaScript puro (sem framework) atende ao caráter acadêmico e à portabilidade do projeto.

Para modelagem foram utilizados **diagramas UML** (casos de uso e processos), presentes na disciplina de Análise de Sistemas.

---

# 11. Usabilidade | Navegação (Experiência do Usuário — UX)

A experiência do usuário é centrada em três pilares: **simplicidade, confiança e feedback imediato**.

- **Útil:** o aplicativo oferece agendamento, orçamento instantâneo, extrato financeiro e saques.
- **Utilizável:** o processo de agendamento (do início ao pagamento) é concluído em 4 passos, com informações acuradas e pesquisáveis.
- **Desejável:** a interface torna gerenciar limpeza e finanças mais simples do que ligar para um atendimento.
- **Acessível:** alto contraste, navegação por teclado e respeito a `prefers-reduced-motion`.
- **Confiável:** acesso por perfil, autenticação simulada e proteção de dados (LGPD), com exportação e exclusão de conta.
- **Localizável:** filtros de busca por categoria, localização e avaliação facilitam encontrar o profissional ideal.
- **Valor:** o autosserviço reduz custos de atendimento e melhora a satisfação de clientes e profissionais.

No celular, a navegação usa uma **barra inferior (tab bar)** com acesso rápido; no desktop, o conteúdo é reorganizado para grades amplas. O aceite de um novo serviço pelo profissional é feito em um único toque.

---

# 12. Plano de Testes

O plano de testes contempla os fluxos principais de cada processo e usuário:

| Caso | Perfil | Cenário | Resultado esperado |
|---|---|---|---|
| CT-01 | Todos | Login com contas de demonstração e acesso rápido | Redireciona ao painel correto do perfil |
| CT-02 | Cliente | Agendamento completo (tipo → detalhes → profissional → pagamento) | Orçamento atualiza em tempo real e serviço é criado |
| CT-03 | Cliente | Acompanhar pedido e avaliar serviço concluído | Timeline atualiza e avaliação alimenta a reputação |
| CT-04 | Profissional | Aceitar oportunidade do mural | Serviço vinculado à agenda |
| CT-05 | Profissional | Check-in (geolocalização) e checklist | Bloqueia check-out até checklist 100% |
| CT-06 | Profissional | Solicitar saque via PIX | Saldo disponível diminui e extrato atualiza |
| CT-07 | Admin | Aprovar/reprovar profissional pendente | Status do profissional atualiza (RF03) |
| CT-08 | Admin | Liberar repasses em lote | Carteira do profissional recebe o valor líquido |
| CT-09 | Admin | Alterar preço/comissão | Próximo orçamento reflete o novo valor |
| CT-10 | Todos | LGPD — exportar e excluir conta | Arquivo JSON baixado e dados anonimizados |
| CT-11 | Todos | Responsividade (390px e 1280px) | Sem barras/sobreposições; telas se adaptam |
| CT-12 | Todos | Testes de persistência (servidor local) | Dados salvos no notebook e reabertos |

**Tipos de teste:** funcionais, usabilidade, responsividade, persistência e segurança básica (controle de acesso por perfil).

---

# 13. Resultados de Testes de Performance e Plataformas

Os testes executados no MVP apresentaram os seguintes resultados:

- **Funcionalidade:** as 14 telas renderizaram sem erros de script; validação executada em navegador no modo headless em resoluções de celular (390×844) e desktop (1280×800) para os três perfis.
- **Fluxos:** cadastro → aprovação (admin) → oportunidade → execução → avaliação → repasse funcionaram de ponta a ponta com os dados de demonstração.
- **Persistência:** o servidor local gravou e recuperou o banco em arquivo JSON no computador; fallback para localStorage funcionou sem o servidor.
- **Responsividade:** corrigidos casos de barra de sobreposição (elementos com atributo `hidden` e `display:flex/grid`) e corte de conteúdo no celular.
- **Plataformas:** testado em Chrome/Edge (desktop) e navegadores móveis via rede local; instalação PWA disponível.
- **Pendências:** pagamento real via gateway, mapa dinâmico (Google Maps), notificações push e autenticação JWT (próximas versões).

---

# 14. Manuais de Uso (Documentação)

## 14.1 Como executar

1. Dê dois cliques em **`abrir-app.bat`** (na pasta do app). Na primeira execução, permita o acesso no Controle de Conta de Usuário e no Firewall.
2. O navegador abre **`http://localhost:8933`**.
3. Para acessar pelo celular, abra o endereço exibido na janela "AguidHelp - Servidor" (mesma rede Wi-Fi), ex.: `http://192.168.0.16:8933`.

## 14.2 Acesso rápido (banca)

| Perfil | Usuário | Senha |
|---|---|---|
| Cliente | ana@demo.com | 1234 |
| Profissional aprovado | carlos@demo.com | 1234 |
| Profissional em análise | maria@demo.com | 1234 |
| Administrador | admin@aguidhelp.com | admin123 |

## 14.3 Fluxo de demonstração recomendado

1. Admin aprova o profissional pendente (Moderação).
2. Cliente agenda uma limpeza (orçamento instantâneo) e paga (simulado).
3. Profissional aceita a oportunidade, faz check-in, conclui o checklist e realiza o check-out.
4. Cliente avalia o serviço com estrelas.
5. Admin libera os repasses em lote.
6. Profissional solicita saque via PIX e acessa o Aguid@Educação.

---

# 15. Conclusões

O projeto Aguid@Help demonstrou a viabilidade técnica e pedagógica do desenvolvimento de um marketplace de serviços de limpeza no formato de aplicativo móvel responsivo (PWA). O MVP contempla os 25 requisitos funcionais, organizados em 7 processos e 14 telas, cobrindo a jornada completa do cliente, do profissional e do administrador — do cadastro e validação de identidade até o pós-serviço, avaliação e repasses financeiros.

Os principais resultados foram: agendamento com orçamento instantâneo, verificação documental com status de adesão transparente, execução com checklist de qualidade, painel financeiro com saques e capacitação contínua dos profissionais. A solução foi validada em múltiplas plataformas e resoluções, sem erros de execução.

Para versões futuras, prevê-se: integração com gateways de pagamento reais (Stripe/Asaas), mapas dinâmicos (Google Maps API), notificações push, autenticação com JWT e banco de dados relacional, além de novos módulos de fidelização. O projeto cumpre, assim, seu objetivo de formalizar e profissionalizar o trabalho autônomo de limpeza, gerando renda digna e segurança para clientes e profissionais.

---

# 16. Referências

- BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- MDN Web Docs. Progressive Web Apps. Disponível em: https://developer.mozilla.org/pt-BR/docs/Web/Progressive_web_apps
- MDN Web Docs. Navigation du Geofencing. Disponível em: https://developer.mozilla.org/ (API de Geolocalização)
- Scrum.org. O Guia do Scrum. Disponível em: https://scrumguides.org/
- W3C. Web App Manifest. Disponível em: https://www.w3.org/TR/appmanifest/
- AGENDOR, blog: Ferramenta de comunicação. 2022. Disponível em: https://www.agendor.com.br/blog/ferramentas-comunicacao-interna-online/
- Quindim, blog: O lado bom do ambiente digital. 2022. Disponível em: https://quindim.com.br/blog/o-lado-bom-da-internet/
- Rock Conect, blog: Comportamento do consumidor digital. Disponível em: https://rockcontent.com/br/blog/comportamento-do-consumidor-digital/

> Nota: ajuste e complete as referências conforme as normas ABNT da sua instituição.