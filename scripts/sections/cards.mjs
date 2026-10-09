// Cards de projetos reais: cada um é um SVG separado (pra poder ser um link) com mini animação própria.
import { doc, frame, frameCss, icon, esc, r1, CHAR, DISPLAY } from '../lib/core.mjs';

const W = 420, H = 236;

const PROJECTS = {
  ldx: {
    title: 'LDX Capital', sub: 'ecossistema completo', status: ['em produção', 'c1'],
    desc: ['Portal web, API, workers com filas, IA', 'e app mobile iOS/Android com push e', 'login social. Do banco à loja de apps.'],
    chips: ['laravel', 'nodedotjs', 'redis', 'flutter', 'googlegemini', 'firebase'],
    link: 'privado · produção', viz: 'network',
  },
  gatuzii: {
    title: 'Gatuzii', sub: 'editor de estampas', status: ['beta', 'c2'],
    desc: ['Crie estampas de camiseta no browser:', 'canvas com texto e imagens e remoção', 'de fundo com IA rodando no client.'],
    chips: ['nextdotjs', 'react', 'redux', 'mui', 'vitest'],
    link: '↗ gatuzii.vercel.app · beta', viz: 'shirt',
  },
  insta: {
    title: 'instaReport', sub: 'inteligência de perfis', status: ['uso interno', 'c3'],
    desc: ['Coleta e análise de perfis do Instagram', 'com pool de browsers headless, sessões', 'persistentes, score e export p/ Excel.'],
    chips: ['typescript', 'express', 'puppeteer', 'mysql', 'instagram'],
    link: 'privado', viz: 'bars',
  },
  bots: {
    title: 'Agentes & Bots', sub: 'automação com IA', status: ['rodando 24/7', 'c1'],
    desc: ['Agentes com LLM e bots de WhatsApp', 'e Instagram: webhooks, filas e fluxos', 'de atendimento que rodam sozinhos.'],
    chips: ['whatsapp', 'claude', 'googlegemini', 'redis', 'docker'],
    link: 'privado', viz: 'chat',
  },
};

const VIZ = {
  network(t, x, y) {
    const n = [[0, 0], [62, -18], [62, 30], [118, 6]], lbl = ['app', 'api', 'queue', 'ai'];
    const e = [[0, 1], [0, 2], [1, 3], [2, 3], [1, 2]];
    let s = e.map(([a, b], i) => {
      const p = `M${x + n[a][0]} ${y + n[a][1]}L${x + n[b][0]} ${y + n[b][1]}`;
      return `<path d="${p}" stroke="${t.line2}"/><circle r="2.4" fill="${t.c1}"><animateMotion dur="${1.6 + i * 0.3}s" repeatCount="indefinite" path="${p}"/></circle>`;
    }).join('');
    s += n.map(([a, b], i) => `<circle cx="${x + a}" cy="${y + b}" r="9" fill="${t.panel}" stroke="${[t.c1, t.c2, t.c3, t.ok][i]}"/><text x="${x + a}" y="${y + b + 21}" font-size="8" text-anchor="middle" class="dim">${lbl[i]}</text>
<circle cx="${x + a}" cy="${y + b}" r="3" fill="${[t.c1, t.c2, t.c3, t.ok][i]}" class="blink" style="animation-delay:${i * 0.4}s"/>`).join('');
    return s;
  },
  shirt(t, x, y) {
    const p = 'M0 10 L22 0 Q35 10 48 0 L70 10 L64 30 L56 27 L56 72 L14 72 L14 27 L6 30 Z';
    return `<g transform="translate(${x + 22} ${y - 30})"><clipPath id="sc"><path d="${p}"/></clipPath>
<path d="${p}" fill="${t.bg2}" stroke="${t.line2}"/>
<g clip-path="url(#sc)"><g class="pat">${[...Array(7)].map((_, i) => `<circle cx="${35}" cy="${42}" r="${6 + i * 7}" stroke="url(#grad)" stroke-width="2.2" fill="none" opacity="${1 - i * 0.12}"/>`).join('')}</g></g>
<rect x="18" y="20" width="34" height="34" rx="2" stroke="${t.c1}" stroke-dasharray="3 3" class="sel"/>
${[[18, 20], [52, 20], [18, 54], [52, 54]].map(([a, b]) => `<rect x="${a - 2.5}" y="${b - 2.5}" width="5" height="5" fill="${t.panel}" stroke="${t.c1}"/>`).join('')}</g>`;
  },
  bars(t, x, y) {
    const hs = [26, 44, 18, 52, 34, 60, 40];
    return hs.map((h, i) => `<rect x="${x + i * 17}" y="${y + 40 - h}" width="11" height="${h}" rx="2" fill="${i % 2 ? t.c2 : t.c1}" class="bar" style="animation-delay:${r1(i * 0.18)}s"/>`).join('') +
      `<path d="M${x - 4} ${y + 42}H${x + 120}" stroke="${t.line2}"/>`;
  },
  chat(t, x, y) {
    const bw = (s) => r1(s.length * 9 * 0.6 + 22);
    const q = 'oi, tem horário?', r = 'sim! amanhã às 14h', right = W - 26;
    return `<g class="b1"><rect x="${x}" y="${y - 30}" width="${bw(q)}" height="22" rx="10" fill="${t.bg2}" stroke="${t.line2}"/><text x="${x + 11}" y="${y - 15}" font-size="9" class="dim">${q}</text></g>
<g class="b2"><rect x="${right - bw(r)}" y="${y}" width="${bw(r)}" height="22" rx="10" fill="${t.c1}" fill-opacity=".12" stroke="${t.c1}" stroke-opacity=".45"/><text x="${right - bw(r) + 11}" y="${y + 15}" font-size="9" fill="${t.c1}">${r}</text></g>
<g class="b3"><rect x="${x}" y="${y + 30}" width="44" height="20" rx="10" fill="${t.bg2}" stroke="${t.line2}"/>
${[0, 1, 2].map((i) => `<circle cx="${x + 13 + i * 9}" cy="${y + 40}" r="2.4" fill="${t.dim}" class="dot" style="animation-delay:${i * 0.18}s"/>`).join('')}</g>`;
  },
};

function card(t, p) {
  const [stLabel, stKey] = p.status;
  // chips monocromáticos
  const sc = t[stKey];
  const sw = stLabel.length * 10 * CHAR + 26;
  const chips = p.chips.map((c, i) => {
    const ic = icon(c, t);
    return `<g transform="translate(${24 + i * 30} ${H - 52})"><rect width="24" height="24" rx="6" fill="${t.bg2}" stroke="${t.line}"/><g transform="translate(5 5) scale(${14 / 24})"><path d="${ic.d}" fill="${ic.color}"/></g></g>`;
  }).join('');
  const css = `${frameCss}
.blink{animation:bl 1.6s ease-in-out infinite}@keyframes bl{50%{opacity:.2}}
.pat{transform-box:view-box;transform-origin:35px 42px;animation:pat 6s ease-in-out infinite}@keyframes pat{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(.55) rotate(40deg)}}
.sel{animation:dash 1s linear infinite}@keyframes dash{to{stroke-dashoffset:-12}}
.bar{transform-box:fill-box;transform-origin:bottom;animation:bar 2.4s ease-in-out infinite}@keyframes bar{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.35)}}
.b1,.b2,.b3{animation:msg 6s ease-out infinite}.b2{animation-delay:1.2s}.b3{animation-delay:2.4s}
@keyframes msg{0%{opacity:0;transform:translateY(6px)}8%,80%{opacity:1;transform:none}95%,100%{opacity:0}}
.dot{animation:dot 1s ease-in-out infinite}@keyframes dot{50%{transform:translateY(-3px);opacity:.4}}
.st{transform-box:fill-box;transform-origin:center;animation:ping 2.2s ease-out infinite}@keyframes ping{0%{transform:scale(1);opacity:.9}80%,100%{transform:scale(3);opacity:0}}`;
  const body = `${frame({ w: W, h: H, t })}
<g transform="translate(24 30)"><rect width="${r1(sw)}" height="20" rx="10" fill="${sc}" fill-opacity=".1" stroke="${sc}" stroke-opacity=".45"/>
<circle cx="11" cy="10" r="3" fill="${sc}"/><circle cx="11" cy="10" r="3" fill="none" stroke="${sc}" class="st"/>
<text x="20" y="14" font-size="10" fill="${sc}">${esc(stLabel)}</text></g>
<text x="24" y="84" font-size="21" font-weight="800" fill="${t.text}" style="font-family:${DISPLAY}">${esc(p.title)}</text>
<text x="24" y="104" font-size="11" class="c2">// ${esc(p.sub)}</text>
${p.desc.map((l, i) => `<text x="24" y="${130 + i * 16}" font-size="11.5" class="dim">${esc(l)}</text>`).join('')}
${VIZ[p.viz](t, 268, 62)}
${chips}
<text x="${W - 22}" y="${H - 35}" font-size="10" text-anchor="end" class="c1">${esc(p.link)}</text>`;
  return doc({ w: W, h: H, t, title: p.title, css, body, fonts: ['mono', 'monoBold', 'display'] });
}

export const cards = Object.fromEntries(Object.entries(PROJECTS).map(([k, p]) => [`card-${k}`, (t) => card(t, p)]));
