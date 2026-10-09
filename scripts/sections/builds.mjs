// O que eu construo: lista de entregas + hub de integrações com pacotes indo e voltando.
import { doc, frame, frameCss, icon, esc, r1 } from '../lib/core.mjs';

const W = 860, H = 330;
const ITEMS = [
  ['sites & landing pages', 'Next.js, SEO, performance'],
  ['CRMs & sistemas', 'painéis, permissões, relatórios'],
  ['apps', 'Android · iOS · PWA'],
  ['integrações', 'Google Agenda, Sheets, WhatsApp, APIs'],
  ['agentes de IA', 'OpenClaw, MCP, LLMs'],
  ['automações', 'filas, webhooks, cron, 24/7'],
];
// minúsculo = ícone; senão, texto
const NODES = ['googlecalendar', 'googlesheets', 'whatsapp', 'gmail', 'googledrive', 'telegram', 'claude', 'OpenClaw', 'REST'];

export function builds(t) {
  const list = ITEMS.map(([a, b], i) => {
    const y = 74 + i * 40;
    return `<g class="it" style="animation-delay:${r1(0.1 + i * 0.12)}s">
<rect x="24" y="${y - 16}" width="330" height="34" rx="8" fill="${t.bg2}" stroke="${t.line}"/>
<text x="38" y="${y + 5}" font-size="11" class="c1">${String(i + 1).padStart(2, '0')}</text>
<text x="64" y="${y - 1}" font-size="12.5" font-weight="700">${esc(a)}</text>
<text x="64" y="${y + 12}" font-size="10" class="dim">${esc(b)}</text></g>`;
  }).join('');

  const cx = 612, cy = 172, R = 118, n = NODES.length;
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
      ? `<g transform="translate(${x - 9} ${y - 9}) scale(${18 / 24})"><path d="${icon(name, t).d}" fill="${t.text}"/></g>`
      : `<text x="${x}" y="${y + 3.5}" font-size="${name.length > 5 ? 7.5 : 9}" font-weight="700" text-anchor="middle">${esc(name)}</text>`;
    nodes += `<circle cx="${x}" cy="${y}" r="22" fill="${t.panel}" stroke="${t.line2}"/>
<circle cx="${x}" cy="${y}" r="22" fill="none" stroke="${t.c1}" class="hit" style="animation-delay:${r1(i * 0.4)}s"/>${face}`;
  });

  const css = `${frameCss}
.it{animation:in .45s ease-out backwards}@keyframes in{from{opacity:0;transform:translateX(-10px)}}
.hit{opacity:0;transform-box:fill-box;transform-origin:center;animation:hit 3.6s ease-out infinite}
@keyframes hit{0%{opacity:.8;transform:scale(1)}30%,100%{opacity:0;transform:scale(1.35)}}
.orb{animation:orb 24s linear infinite;transform-origin:${cx}px ${cy}px;transform-box:view-box}@keyframes orb{to{transform:rotate(360deg)}}`;
  const body = `${frame({ w: W, h: H, t, label: 'o que eu construo' })}
${list}
<circle cx="${cx}" cy="${cy}" r="${R}" stroke="${t.line2}" stroke-dasharray="2 8" class="orb"/>
${spokes}${nodes}
<circle cx="${cx}" cy="${cy}" r="40" fill="${t.bg2}" stroke="${t.c1}" stroke-opacity=".6"/>
<text x="${cx}" y="${cy - 2}" font-size="11" font-weight="700" text-anchor="middle">seu sistema</text>
<text x="${cx}" y="${cy + 13}" font-size="8.5" text-anchor="middle" class="dim">integra c/ tudo</text>`;
  return doc({ w: W, h: H, t, title: 'O que eu construo', css, body, fonts: ['mono', 'monoBold'] });
}
