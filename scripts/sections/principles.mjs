// Princípios: como eu penso e construo — frase de efeito + o que/quando/pra que + 6 pilares animados.
import { doc, frame, frameCss, esc, r1, DISPLAY } from '../lib/core.mjs';

const W = 860, H = 300;
const PILLARS = [
  ['especialista em IA', 'agentes, LLMs, automação', 'spark'],
  ['seguro por padrão', 'menor privilégio', 'shield'],
  ['bonito & moderno', 'UI cuidada, stack atual', 'orbit'],
  ['organizado', 'arquitetura limpa', 'stack'],
  ['fundamentos fortes', 'conceitos e técnicas', 'code'],
  ['dados & deploy', 'SQL, NoSQL, VPS', 'db'],
];

const GLYPH = {
  spark: (t, x, y) => `<g class="g-spin" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y - 11}L${x + 3} ${y - 3}L${x + 11} ${y}L${x + 3} ${y + 3}L${x} ${y + 11}L${x - 3} ${y + 3}L${x - 11} ${y}L${x - 3} ${y - 3}Z" fill="${t.c3}"/></g>`,
  shield: (t, x, y) => `<path d="M${x} ${y - 11}L${x + 9} ${y - 7}V${y + 1}C${x + 9} ${y + 7} ${x + 4} ${y + 10} ${x} ${y + 12}C${x - 4} ${y + 10} ${x - 9} ${y + 7} ${x - 9} ${y + 1}V${y - 7}Z" stroke="${t.ok}" stroke-width="1.6"/>
<path d="M${x - 4} ${y + 1}L${x - 1} ${y + 4}L${x + 5} ${y - 3}" stroke="${t.ok}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" pathLength="10" stroke-dasharray="10" class="g-check"/>`,
  orbit: (t, x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="url(#grad)"/><ellipse cx="${x}" cy="${y}" rx="11" ry="5" stroke="${t.c2}" stroke-opacity=".7"/>
<circle r="2" fill="${t.c1}"><animateMotion dur="2.4s" repeatCount="indefinite" path="M${x + 11} ${y}A11 5 0 1 1 ${x - 11} ${y}A11 5 0 1 1 ${x + 11} ${y}"/></circle>`,
  stack: (t, x, y) => [0, 1, 2].map((i) => `<rect x="${x - 10}" y="${y - 9 + i * 7}" width="20" height="4" rx="2" fill="${[t.c1, t.c2, t.c3][i]}" class="g-al" style="animation-delay:${i * 0.25}s"/>`).join(''),
  code: (t, x, y) => `<text x="${x}" y="${y + 5}" font-size="15" font-weight="700" text-anchor="middle" fill="${t.c1}">{<tspan fill="${t.text}" class="g-blink">·</tspan>}</text>`,
  db: (t, x, y) => `<ellipse cx="${x}" cy="${y - 7}" rx="9" ry="3.5" stroke="${t.c2}" stroke-width="1.4"/><path d="M${x - 9} ${y - 7}V${y + 7}A9 3.5 0 0 0 ${x + 9} ${y + 7}V${y - 7}" stroke="${t.c2}" stroke-width="1.4"/>
<path d="M${x - 9} ${y}A9 3.5 0 0 0 ${x + 9} ${y}" stroke="${t.c2}" stroke-width="1.4" class="g-blink"/>`,
};

export function principles(t) {
  // pilares 2×3
  const px0 = 420, py0 = 48, tw = 202, th = 72, gap = 10;
  const pillars = PILLARS.map(([a, b, g], i) => {
    const x = px0 + (i % 2) * (tw + gap), y = py0 + Math.floor(i / 2) * (th + gap);
    return `<g class="pl" style="animation-delay:${r1(0.15 + i * 0.1)}s">
<rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="10" fill="${t.bg2}" stroke="${t.line}"/>
<circle cx="${x + 28}" cy="${y + th / 2}" r="17" fill="${t.panel}" stroke="${t.line2}"/>
${GLYPH[g](t, x + 28, y + th / 2)}
<text x="${x + 54}" y="${y + 31}" font-size="12" font-weight="700">${esc(a)}</text>
<text x="${x + 54}" y="${y + 47}" font-size="9.5" class="dim">${esc(b)}</text></g>`;
  }).join('');

  // o que → quando → pra que
  const steps = ['o que usar', 'quando usar', 'pra que usar'], sy = 232;
  let sx = 40;
  const chips = steps.map((s, i) => {
    const w = s.length * 11 * 0.6 + 24;
    const g = `<rect x="${r1(sx)}" y="${sy - 15}" width="${r1(w)}" height="26" rx="13" fill="${t.bg2}" stroke="${[t.c1, t.c2, t.c3][i]}" stroke-opacity=".6"/>
<text x="${r1(sx + w / 2)}" y="${sy + 2}" font-size="11" text-anchor="middle" fill="${[t.c1, t.c2, t.c3][i]}">${s}</text>`;
    sx += w + 28;
    return g;
  }).join('');
  const arrows = `<path d="M${r1(40 + 10 * 6.6 + 24 + 4)} ${sy - 2}h20M${r1(40 + 10 * 6.6 + 24 + 28 + 11 * 6.6 + 24 + 4)} ${sy - 2}h20" stroke="${t.line2}" stroke-dasharray="2 3"/>
<circle r="2.6" fill="${t.text}"><animateMotion dur="2.6s" repeatCount="indefinite" path="M${r1(40 + 10 * 6.6 + 24 + 2)} ${sy - 2}H${r1(40 + 10 * 6.6 + 24 + 28 + 11 * 6.6 + 24 + 26)}"/></circle>`;

  const css = `${frameCss}
.pl{animation:pl .5s ease-out backwards}@keyframes pl{from{opacity:0;transform:translateY(8px)}}
.g-spin{transform-box:view-box;animation:spin 6s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.g-check{animation:chk 3s ease-in-out infinite}@keyframes chk{0%{stroke-dashoffset:10}30%,80%{stroke-dashoffset:0}100%{stroke-dashoffset:10}}
.g-al{animation:al 2.4s ease-in-out infinite}@keyframes al{0%,100%{transform:translateX(0)}50%{transform:translateX(3px)}}
.g-blink{animation:gb 1.4s steps(1) infinite}@keyframes gb{50%{opacity:.15}}
.cur{animation:gb 1.1s steps(1) infinite}`;
  const defs = `<linearGradient id="qG" gradientUnits="userSpaceOnUse" x1="40" x2="400" spreadMethod="reflect"><stop offset="0" stop-color="${t.c1}"/><stop offset=".5" stop-color="${t.c2}"/><stop offset="1" stop-color="${t.c3}"/>
<animateTransform attributeName="gradientTransform" type="translate" values="0 0;360 0;0 0" dur="12s" repeatCount="indefinite"/></linearGradient>`;
  const body = `${frame({ w: W, h: H, t, label: 'principles.md — como eu penso' })}
<text x="40" y="96" font-size="27" font-weight="800" fill="url(#qG)" style="font-family:${DISPLAY}">sei o que faço</text>
<text x="40" y="134" font-size="27" font-weight="800" fill="url(#qG)" style="font-family:${DISPLAY}">e por que faço.</text>
<text x="40" y="168" font-size="12.5" class="dim">como funciona — e como <tspan fill="${t.text}">deve</tspan> funcionar.</text>
<rect class="cur" x="338" y="158" width="7" height="14" fill="${t.c1}"/>
<text x="40" y="204" font-size="10" class="dim" letter-spacing="1.5">CADA DECISÃO PASSA POR</text>
${arrows}${chips}
${pillars}`;
  return doc({ w: W, h: H, t, title: 'Princípios — como eu penso', css, defs, body, fonts: ['mono', 'monoBold', 'display'] });
}
