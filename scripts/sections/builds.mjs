// O que eu construo: lista de entregas + hub de integrações com pacotes indo e voltando.
import { doc, frame, frameCss, icon, esc, r1 } from '../lib/core.mjs';

const W = 860, H = 330;
const ITEMS = [
  ['sites & landing pages', 'Next.js, SEO, performance'],
  ['CRMs & sistemas', 'painéis, permissões, relatórios'],
  ['apps', 'Android · iOS · PWA'],
  ['integrações', 'Google Agenda, Sheets, WhatsApp, XP, BTG'],
  ['agentes de IA', 'OpenClaw, MCP, LLMs'],
  ['automações', 'filas, webhooks, cron, 24/7'],
];
// minúsculo = ícone; senão, texto
const NODES = ['googlecalendar', 'googlesheets', 'whatsapp', 'gmail', 'XP', 'BTG', 'googledrive', 'telegram', 'claude', 'OpenClaw', 'REST'];

export function builds(t) {
  // lista limpa: divisórias finas e um destaque que desliza de item em item
  const ly = 52, lh = 42, n0 = ITEMS.length, HOLD = 1.6, DUR = n0 * HOLD;
  const ys = [], kt = [];
  ITEMS.forEach((_, i) => { ys.push(ly + i * lh + 4, ly + i * lh + 4); kt.push((i * HOLD + (i ? 0.25 : 0)) / DUR, ((i + 1) * HOLD) / DUR); });
  ys.push(ly + 4); kt.push(1);
  const hl = `<rect x="24" y="${ly + 4}" width="330" height="${lh - 8}" rx="8" fill="${t.c1}" fill-opacity="${t.name === 'dark' ? 0.07 : 0.06}" stroke="${t.c1}" stroke-opacity=".25">
<animate attributeName="y" dur="${DUR}s" repeatCount="indefinite" values="${ys.join(';')}" keyTimes="${kt.map((k) => k.toFixed(3)).join(';')}"/></rect>`;
  const list = hl + ITEMS.map(([a, b], i) => {
    const y = ly + i * lh;
    const col = [t.c1, t.c2, t.c3][i % 3];
    return `<g class="it" style="animation-delay:${r1(0.1 + i * 0.12)}s">
${i ? `<line x1="36" x2="342" y1="${y}" y2="${y}" stroke="${t.line}"/>` : ''}
<text x="38" y="${y + 26}" font-size="10.5" font-weight="700" fill="${col}">${String(i + 1).padStart(2, '0')}</text>
<text x="66" y="${y + 20}" font-size="12.5" font-weight="700">${esc(a)}</text>
<text x="66" y="${y + 33}" font-size="10" class="dim">${esc(b)}</text></g>`;
  }).join('');

  const cx = 614, cy = 174, R = 124, n = NODES.length;
  let spokes = '', nodes = '';
  NODES.forEach((name, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const x = r1(cx + R * Math.cos(a)), y = r1(cy + R * Math.sin(a));
    const p = `M${cx} ${cy}L${x} ${y}`, back = `M${x} ${y}L${cx} ${cy}`;
    const dur = 2.4, b = r1(-(i * 0.37) % dur);
    spokes += `<path d="${p}" stroke="${t.line2}"/>
<circle r="2.6" fill="${t.c1}"><animateMotion dur="${dur}s" begin="${b}s" repeatCount="indefinite" path="${i % 2 ? back : p}"/></circle>`;
    const isIcon = name === name.toLowerCase();
    const face = isIcon
      ? `<g transform="translate(${x - 9} ${y - 9}) scale(${18 / 24})"><path d="${icon(name, t).d}" fill="${icon(name, t).color}"/></g>`
      : `<text x="${x}" y="${y + 3.5}" font-size="${name.length > 5 ? 7.5 : 9}" font-weight="700" text-anchor="middle">${esc(name)}</text>`;
    nodes += `<circle cx="${x}" cy="${y}" r="20" fill="${t.panel}" stroke="${t.line2}"/>
<circle cx="${x}" cy="${y}" r="20" fill="none" stroke="${t.c1}" class="hit" style="animation-delay:${r1(i * 0.4)}s"/>${face}`;
  });

  const css = `${frameCss}
.it{animation:in .45s ease-out backwards}@keyframes in{from{opacity:0;transform:translateX(-10px)}}
.hit{opacity:0;transform-box:fill-box;transform-origin:center;animation:hit 3.6s ease-out infinite}
@keyframes hit{0%{opacity:.8;transform:scale(1)}30%,100%{opacity:0;transform:scale(1.35)}}
.core-ring{transform-box:view-box;transform-origin:${cx}px ${cy}px;animation:orb 10s linear infinite}
.core-pulse{transform-box:fill-box;transform-origin:center;animation:cp 2.4s ease-out infinite}@keyframes cp{0%{transform:scale(1);opacity:.35}100%{transform:scale(1.6);opacity:0}}
.orb{animation:orb 24s linear infinite;transform-origin:${cx}px ${cy}px;transform-box:view-box}@keyframes orb{to{transform:rotate(360deg)}}`;
  const body = `${frame({ w: W, h: H, t, label: 'o que eu construo' })}
${list}
<circle cx="${cx}" cy="${cy}" r="${R}" stroke="${t.line2}" stroke-dasharray="2 8" class="orb"/>
${spokes}${nodes}
<circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="url(#grad)" stroke-width="1.2" stroke-dasharray="40 18" class="core-ring"/>
<circle cx="${cx}" cy="${cy}" r="38" fill="${t.c2}" class="core-pulse"/>
<circle cx="${cx}" cy="${cy}" r="38" fill="${t.panel}" stroke="${t.line2}"/>
<circle cx="${cx}" cy="${cy}" r="30" fill="url(#coreG)"/>
<text x="${cx}" y="${cy - 1}" font-size="9" font-weight="700" text-anchor="middle" letter-spacing="2" class="dim">SEU</text>
<text x="${cx}" y="${cy + 11}" font-size="10" font-weight="700" text-anchor="middle" letter-spacing="1.5">SISTEMA</text>
<text x="${W - 24}" y="22" font-size="10" text-anchor="end" class="dim">integra com o que tiver ↔</text>`;
  const defs = `<radialGradient id="coreG"><stop offset="0" stop-color="${t.c2}" stop-opacity=".28"/><stop offset="1" stop-color="${t.c1}" stop-opacity=".04"/></radialGradient>`;
  return doc({ w: W, h: H, t, title: 'O que eu construo', css, defs, body, fonts: ['mono', 'monoBold'] });
}
