# 🧽 Aguid@Help — Marketplace de Limpeza Profissional

Projeto Integrador (Análise e Desenvolvimento de Sistemas — 5º semestre).

Aplicativo **mobile-first responsivo (PWA)** que conecta **clientes** a **profissionais de limpeza**
verificados e qualificados (residencial, comercial e pós-obra), com gestão completa pela **administração**.

> ✅ Instala como app no **Android** ("Adicionar à tela inicial") e funciona em **celular, tablet,
> notebook e desktop**, com a mesma base de código.

---

## 🧭 Os 3 perfis e o fluxo completo (MVP dos 7 processos)

| Perfil | O que faz |
|---|---|
| 🧑‍💼 **Cliente** | Agenda com orçamento instantâneo, escolhe profissional, paga (simulado), acompanha status em tempo real, avalia e assina planos recorrentes |
| 🧑‍🔧 **Profissional** | Monta perfil/competências, envia documentos, acompanha aprovação, aceita oportunidades, faz check-in/out com checklist de qualidade, recebe e saca (PIX) e treina na Aguid@Educação |
| 🛡️ **Administrador** | Dashboard gerencial (BI), curadoria/aprovação de perfis, monitoramento em tempo real, repasses financeiros e configuração de preços/comissões/checklists |

### Requisitos funcionais contemplados (RF01–RF25)

| Área | Requisitos |
|---|---|
| Profissional | RF01 Perfil e competências · RF02 Verificação de segurança · RF03 Status de adesão · RF04 Central de oportunidades · RF05 Check-in/out · RF06 Financeiro e saques · RF07 Aguid@Educação |
| Cliente | RF08 Conta e endereços · RF09 Agendamento · RF10 Seleção de profissionais · RF11 Acompanhamento · RF12 Pagamento · RF13 Avaliação 360° · RF14 Orçamento instantâneo · RF15 Assinatura |
| Admin | RF16 Dashboard BI · RF17 Curadoria · RF18 Monitoramento · RF19 Configuração de negócio · RF20 Repasses · RF21 Checklist de qualidade |
| Transversais | RF22 Autenticação · RF23 Chat interno · RF24 Geolocalização · RF25 LGPD |

### Processos de negócio (conforme organização do professor)

1. **Cadastro e Validação de Identidade** — RF22, RF01, RF02, RF17, RF03, RF08, RF24
2. **Solicitação, Orçamento e Contratação** — RF09, RF14, RF15, RF10, RF12, RF04
3. **Execução e Acompanhamento Operacional** — RF05, RF21, RF11, RF18, RF23
4. **Pós-Serviço, Avaliação e Financeiro** — RF13, RF06, RF20, RF07
5. **Governança, Configuração e Privacidade** — RF19, RF16, RF25

---

## ▶️ Como executar

### Opção 1 — Servidor local (recomendado para testar no telefone)
1. Dê **dois cliques em `abrir-app.bat`** (libera a porta no firewall e abre o navegador em `http://localhost:8933`).
2. Para usar o **celular**: mantenha o celular na **mesma rede Wi-Fi** do PC, abra a janela "AguidHelp - Servidor" e use o endereço `http://IP:8933` exibido.
3. Os dados ficam salvos **neste computador** (pasta `%LOCALAPPDATA%\AguidHelp`) — **sem nuvem e sem custo**.

### Opção 2 — Direto pelo arquivo
1. Abra `index.html` com dois cliques (funciona offline; os dados ficam no navegador via localStorage).

### Opção 3 — No Android como app
1. Abra o app no Chrome do celular, toque no menu ⋮ → **"Adicionar à tela inicial"**.
2. Ele abre em tela cheia como um aplicativo nativo.

---

## 🔑 Contas de demonstração (para a banca)

| Perfil | Usuário | Senha |
|---|---|---|
| 🧑‍💼 Cliente | `ana@demo.com` | `1234` |
| 🧑‍🔧 Profissional aprovado | `carlos@demo.com` | `1234` |
| 🧑‍🔧 Profissional em análise | `maria@demo.com` | `1234` |
| 🛡️ Administrador | `admin@aguidhelp.com` | `admin123` |

> Na tela de login existem botões de **acesso rápido** para entrar em cada perfil com um toque.

### Roteiro de demonstração sugerido
1. **Cliente (Ana)** → Agendar limpeza → escolher tipo/detalhes → ver **orçamento instantâneo** mudar → escolher profissional → pagar.
2. **Profissional (Carlos)** → Mural de oportunidades → aceitar → no serviço agendado fazer **check-in** (geolocalização) → marcar **checklist** → **check-out**.
3. **Cliente (Ana)** → Meus pedidos → avaliar o serviço (⭐).
4. **Profissional (Carlos)** → Financeiro: saldo pendente → solicitar saque PIX.
5. **Admin** → Dashboard (BI) → Moderação: aprovar **Maria Jesus** → Repasses: liberar em lote → Configuração: mudar preço/comissão e ver o efeito no orçamento.
6. **Maria** (após aprovada) → Mural liberado.

---

## 📁 Estrutura do projeto

```
AguidHelp/
├── index.html           # App shell (SPA)
├── manifest.webmanifest # PWA (instalação no Android)
├── sw.js                # Service worker (modo offline)
├── css/app.css          # Estilos mobile-first responsivos
├── js/
│   ├── database.js      # Camada de dados (API local ou localStorage)
│   ├── seed.js          # Dados de demonstração
│   ├── ui.js            # Utilitários de interface
│   ├── views-comuns.js  # Login, cadastro, menu, chat, LGPD
│   ├── views-cliente.js # Telas do cliente
│   ├── views-profissional.js # Telas do profissional
│   ├── views-admin.js   # Telas do administrador
│   └── app.js           # Roteador e inicialização
├── icons/               # Ícones do PWA
├── server.ps1           # Servidor + API de dados local
├── abrir-app.bat        # Lançador do servidor
└── README.md
```

---

## ⚙️ Arquitetura (MVP)

- **Frontend:** HTML + CSS + JavaScript puro (SPA com rotas por hash), **mobile-first** e PWA.
- **Persistência:** o app detecta o servidor local (`/api/dados`) e, se estiver offline, usa `localStorage`.
- **"Backend" simulado:** os dados de demonstração (clientes, profissionais, serviços, avaliações e repasses)
  permitem demonstrar todo o fluxo sem infraestrutura externa.
- **Próximos passos (v2):** API real (Node/Python), banco de dados, gateway de pagamento (Stripe/Asaas),
  Google Maps API e autenticação com JWT — conforme o capítulo 7 do modelo de entrega.

## 🔒 Observações acadêmicas

- Autenticação e pagamentos são **simulados** para fins de demonstração.
- A tela "Minha conta · LGPD" oferece **exportação de dados** e **exclusão/anonimização** (RF25).
- A geolocalização usa a API nativa do navegador, com **fallback manual** caso o usuário negue a permissão.