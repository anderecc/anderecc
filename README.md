<!--
  Este README é 100% gerado por código: SVGs animados (CSS + SMIL, zero JS) feitos em scripts/.
  Rode `node scripts/build.mjs` pra regenerar. O Actions atualiza a atividade todo dia.
  Curtiu? Fork à vontade — troque os dados em scripts/sections/*.mjs.
-->

<div align="center">

<a href="https://github.com/anderecc"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/hero-dark.svg"><img alt="Anderson — Full Stack Developer · IA · Cibersegurança" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/hero-light.svg" width="100%"></picture></a>

<a href="https://www.linkedin.com/in/andersondb06/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/btn-linkedin-dark.svg"><img alt="LinkedIn" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/btn-linkedin-light.svg" width=""></picture></a>
<a href="mailto:andersondbl06@gmail.com"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/btn-email-dark.svg"><img alt="Email" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/btn-email-light.svg" width=""></picture></a>
<a href="https://instagram.com/anderecs"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/btn-instagram-dark.svg"><img alt="Instagram" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/btn-instagram-light.svg" width=""></picture></a>
<a href="https://github.com/anderecc?tab=followers"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/btn-github-dark.svg"><img alt="Seguir no GitHub" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/btn-github-light.svg" width=""></picture></a>

</div>

<br/>

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/whoami-dark.svg"><img alt="whoami: Full Stack Developer na LDX Capital, Engenharia de Software na UCS, sites, CRMs, apps, integrações, agentes de IA e cibersegurança" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/whoami-light.svg" width="100%"></picture>

### `▸ o que eu construo`

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/builds-dark.svg"><img alt="Sites, CRMs, apps Android/iOS/PWA, integrações (Google Agenda, Sheets, WhatsApp, APIs), agentes de IA (OpenClaw, MCP) e automações" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/builds-light.svg" width="100%"></picture>

### `▸ stack`

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/stack-dark.svg"><img alt="Stack: TypeScript, JavaScript, Go, React, Next.js, Node, Express, MySQL, MongoDB, Firebase, Redis, BullMQ, Docker, Nginx, Linux, GitHub Actions, VPS, Claude, Gemini, OpenAI, MCP, OpenClaw" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/stack-light.svg" width="100%"></picture>

### `▸ sec lab`

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/sec-dark.svg"><img alt="Cibersegurança: CTFs, hardening de servidor (ufw, fail2ban, SSH, TLS), redes e recon (nmap)" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/sec-light.svg" width="100%"></picture>

### `▸ como eu trabalho`

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/flow-dark.svg"><img alt="Fluxo: entender, especificar, construir com agentes de IA, testar, entregar via CI/CD em VPS/Vercel e observar" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/flow-light.svg" width="100%"></picture>

Spec antes de código, IA como par de programação, teste no pipeline e deploy automatizado no **GitHub Actions** pra **VPS** que eu mesmo configuro (Docker + Nginx + TLS). Segurança desde o começo.

### `▸ projetos reais`

<p align="center">
<a href="https://ldxcapital.vercel.app"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/card-ldx-dark.svg"><img alt="LDX Capital — portal, API, workers, IA e app mobile" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/card-ldx-light.svg" width="49%"></picture></a>
<a href="https://gatuzii.vercel.app"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/card-gatuzii-dark.svg"><img alt="Gatuzii — editor de estampas no browser" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/card-gatuzii-light.svg" width="49%"></picture></a>
<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/card-insta-dark.svg"><img alt="instaReport — inteligência de perfis do Instagram" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/card-insta-light.svg" width="49%"></picture>
<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/card-bots-dark.svg"><img alt="Agentes e bots com IA" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/card-bots-light.svg" width="49%"></picture>
</p>

<details>
<summary><b>🗺️ arquitetura do ecossistema LDX</b> <sub>(diagrama interativo: arraste e dê zoom)</sub></summary>
<br/>

```mermaid
flowchart LR
  subgraph clientes[" clientes "]
    app["📱 App Flutter<br/>iOS · Android"]
    web["🌐 Frontend web"]
    portal["🧭 Portal Laravel"]
  end
  api["⚙️ API · Express 5<br/>REST + Socket.io"]
  q[("Redis<br/>BullMQ")]
  w["👷 Workers<br/>jobs · ffmpeg"]
  ai{"🤖 LLMs<br/>OpenAI · Gemini"}
  fb[("Firebase<br/>Firestore · Storage")]
  sec["🔐 AWS Secrets Manager"]
  app & web & portal --> api
  api --> q --> w --> ai
  api --> fb
  api -. segredos .-> sec
  fb -. push FCM .-> app
```

<sub>visão simplificada · repositórios privados</sub>
</details>

### `▸ formação & certificados`

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/edu-dark.svg"><img alt="Engenharia de Software na UCS (cursando), +11 certificados e +1.000 horas de cursos e projetos" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/edu-light.svg" width="100%"></picture>

<details>
<summary><b>📜 ver certificados</b> <sub>(+1.000h somando cursos e projetos sem certificado)</sub></summary>
<br/>

<!-- certs:start -->
| curso | instrutor | horas | |
|:--|:--|--:|:-:|
| React e Redux | Leonardo Moura Leitão | 54,5h | [ver ↗](https://www.udemy.com/certificate/UC-0075e93e-db81-4423-8403-2ec34b56bcd6/) |
| HTML5, CSS3 e JS | Daniel Tapias Morales | 54,5h | [ver ↗](https://www.udemy.com/certificate/UC-a442931f-f2e9-4102-98c9-7edff9b5db8f/) |
| Node.js | Guia do Programador | 50h | [ver ↗](https://www.udemy.com/certificate/UC-06134f8b-38ce-435d-b387-f94540a1674f/) |
| JavaScript | Hcode Treinamentos | 38,5h | [ver ↗](https://www.udemy.com/certificate/UC-c201d74b-6ff0-4445-b433-ac9b4618883e/) |
| Next.js e React | Leonardo Moura Leitão | 28,5h | [ver ↗](https://www.udemy.com/certificate/UC-c6c563d8-d3af-469b-9191-24bba705e675/) |
| Algoritmo e Lógica | Leonardo Moura Leitão | 18h | [ver ↗](https://www.udemy.com/certificate/UC-b2f3524f-1d3e-4c0e-b81e-3983f30aea3f/) |
| JS Funcional e Reativo | Leonardo Moura Leitão | 17h | [ver ↗](https://www.udemy.com/certificate/UC-07b943da-4392-4fb1-8bbf-f7606a69a5c1/) |
| SASS e SCSS | Matheus Battisti | 12,5h | [ver ↗](https://www.udemy.com/certificate/UC-04a99e14-f7a5-4424-8e71-1116af7e36d1/) |
| Git e GitHub | Matheus Battisti | 8,5h | [ver ↗](https://www.udemy.com/certificate/UC-d28bae80-353d-4a2d-9dea-63460d5d87f4/) |
| MySQL 8 | Hcode Treinamentos | 8,5h | [ver ↗](https://www.udemy.com/certificate/UC-77b591d7-5314-4e52-a240-7373ed80c9ae/) |
| LGPD | Cláudio Dodt | 4h | [ver ↗](https://www.udemy.com/certificate/UC-3175fa50-b084-4a40-a38f-f8768e410412/) |
<!-- certs:end -->

</details>

### `▸ atividade`

<picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/activity-dark.svg"><img alt="Calendário de contribuições do GitHub animado" src="https://raw.githubusercontent.com/anderecc/anderecc/main/assets/activity-light.svg" width="100%"></picture>


<div align="center">
<sub>tudo aqui é SVG gerado por código em <a href="https://github.com/anderecc/anderecc/tree/main/scripts"><code>scripts/</code></a> · zero JS · atualizado todo dia pelo GitHub Actions · curtiu? fork à vontade ✦</sub>
</div>
