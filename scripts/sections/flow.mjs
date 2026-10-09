// Como eu trabalho: pipeline com pacotes de dados correndo entre as etapas e loop de iteração.
import { doc, frame, frameCss, esc, r1 } from '../lib/core.mjs';

const W = 860, H = 250;
const STEPS = [
  ['01', 'entender', 'problema, regra', 'de negócio, dados'],
  ['02', 'especificar', 'spec + AGENTS.md', 'contexto p/ IA'],
  ['03', 'construir', 'eu + agentes', 'pareando no código'],
  ['04', 'testar', 'vitest, lint,', 'typecheck, review'],
  ['05', 'entregar', 'CI/CD no Actions', '→ VPS / Vercel'],
  ['06', 'observar', 'logs, filas,', 'métricas, ajustes'],
];

export function flow(t) {
  const y = 96, x0 = 100, x1 = W - 100, n = STEPS.length, sp = (x1 - x0) / (n - 1);
  const DUR = 6, PK = 3;
  const cols = [t.c1, t.c2, t.c3, t.c1, t.c2, t.ok];
  const main = `M${x0} ${y}H${x1}`;
  const lb = y + 122, ex = 68;
  const loop = `M${x1 + 24} ${y}H${x1 + ex - 12}Q${x1 + ex} ${y} ${x1 + ex} ${y + 12}V${lb - 12}Q${x1 + ex} ${lb} ${x1 + ex - 12} ${lb}H${x0 - ex + 12}Q${x0 - ex} ${lb} ${x0 - ex} ${lb - 12}V${y + 12}Q${x0 - ex} ${y} ${x0 - ex + 12} ${y}H${x0 - 24}`;

  const nodes = STEPS.map(([num, title, a, b], i) => {
    const x = x0 + i * sp, c = cols[i], delay = r1((i / (n - 1)) * DUR);
    return `<g>
<circle cx="${x}" cy="${y}" r="24" fill="none" stroke="${c}" class="ring" style="animation-delay:${delay}s"/>
<circle cx="${x}" cy="${y}" r="24" fill="${t.panel}" stroke="${c}" stroke-opacity=".6"/>
<circle cx="${x}" cy="${y}" r="18" fill="${c}" fill-opacity=".1" class="core" style="animation-delay:${delay}s"/>
<text x="${x}" y="${y + 4.5}" font-size="13" font-weight="700" text-anchor="middle" fill="${c}">${num}</text>
<text x="${x}" y="${y + 50}" font-size="13" font-weight="700" text-anchor="middle">${esc(title)}</text>
<text x="${x}" y="${y + 68}" font-size="10.5" text-anchor="middle" class="dim">${esc(a)}</text>
<text x="${x}" y="${y + 82}" font-size="10.5" text-anchor="middle" class="dim">${esc(b)}</text></g>`;
  }).join('');

  const packets = [...Array(PK)].map((_, i) => {
    const b = r1(-(DUR / PK) * i);
    return `<g filter="url(#pk)"><circle r="4" fill="${t.c1}"><animateMotion dur="${DUR}s" begin="${b}s" repeatCount="indefinite" path="${main}"/></circle>
<rect x="-14" y="-1" width="14" height="2" rx="1" fill="url(#tail)"><animateMotion dur="${DUR}s" begin="${b}s" repeatCount="indefinite" path="${main}"/></rect></g>`;
  }).join('');

  const css = `${frameCss}
.ring{transform-box:fill-box;transform-origin:center;opacity:0;animation:ring ${r1(DUR / PK)}s ease-out infinite}
@keyframes ring{0%{transform:scale(1);opacity:.9}70%,100%{transform:scale(1.7);opacity:0}}
.core{animation:core ${r1(DUR / PK)}s ease-out infinite}@keyframes core{0%{fill-opacity:.45}60%,100%{fill-opacity:.08}}
.flowline{animation:fl 1.2s linear infinite}@keyframes fl{to{stroke-dashoffset:-20}}
.loopline{animation:fl 1.6s linear infinite reverse}`;
  const defs = `<filter id="pk" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="tail" x1="0" x2="1"><stop offset="0" stop-color="${t.c1}" stop-opacity="0"/><stop offset="1" stop-color="${t.c1}"/></linearGradient>`;

  const body = `${frame({ w: W, h: H, t, label: 'workflow.yml — como eu trabalho' })}
<path d="${main}" stroke="${t.line2}" stroke-width="2"/>
<path d="${main}" stroke="url(#grad)" stroke-width="2" stroke-dasharray="4 16" class="flowline"/>
<path d="${loop}" stroke="${t.faint}" stroke-width="1.2" stroke-dasharray="3 7" class="loopline"/>
<circle r="3" fill="${t.c3}"><animateMotion dur="${DUR}s" repeatCount="indefinite" path="${loop}"/></circle>
<rect x="${W / 2 - 80}" y="${lb - 10}" width="160" height="20" rx="10" fill="${t.panel}" stroke="${t.c3}" stroke-opacity=".4"/>
<text x="${W / 2}" y="${lb + 4}" font-size="10.5" text-anchor="middle" class="c3">↺ itera até ficar bom</text>
${packets}${nodes}`;
  return doc({ w: W, h: H, t, title: 'Como eu trabalho', css, defs, body, fonts: ['mono', 'monoBold'] });
}
