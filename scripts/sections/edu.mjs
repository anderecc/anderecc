// Formação + certificados: card da UCS e gráfico de barras animado com as horas de cada curso.
import { doc, frame, frameCss, esc, r1, mix, DISPLAY } from '../lib/core.mjs';

const W = 860, H = 326;
export const CERTS = [
  ['React e Redux', 54.5, 'Leonardo Moura Leitão', 'UC-0075e93e-db81-4423-8403-2ec34b56bcd6'],
  ['HTML5, CSS3 e JS', 54.5, 'Daniel Tapias Morales', 'UC-a442931f-f2e9-4102-98c9-7edff9b5db8f'],
  ['Node.js', 50, 'Guia do Programador', 'UC-06134f8b-38ce-435d-b387-f94540a1674f'],
  ['JavaScript', 38.5, 'Hcode Treinamentos', 'UC-c201d74b-6ff0-4445-b433-ac9b4618883e'],
  ['Next.js e React', 28.5, 'Leonardo Moura Leitão', 'UC-c6c563d8-d3af-469b-9191-24bba705e675'],
  ['Algoritmo e Lógica', 18, 'Leonardo Moura Leitão', 'UC-b2f3524f-1d3e-4c0e-b81e-3983f30aea3f'],
  ['JS Funcional e Reativo', 17, 'Leonardo Moura Leitão', 'UC-07b943da-4392-4fb1-8bbf-f7606a69a5c1'],
  ['SASS e SCSS', 12.5, 'Matheus Battisti', 'UC-04a99e14-f7a5-4424-8e71-1116af7e36d1'],
  ['Git e GitHub', 8.5, 'Matheus Battisti', 'UC-d28bae80-353d-4a2d-9dea-63460d5d87f4'],
  ['MySQL 8', 8.5, 'Hcode Treinamentos', 'UC-77b591d7-5314-4e52-a240-7373ed80c9ae'],
  ['LGPD', 4, 'Cláudio Dodt', 'UC-3175fa50-b084-4a40-a38f-f8768e410412'],
];

export function edu(t) {
  const total = CERTS.reduce((s, c) => s + c[1], 0);
  const max = Math.max(...CERTS.map((c) => c[1]));

  // card UCS
  const ucs = `<g transform="translate(24 52)">
<rect width="300" height="${H - 76}" rx="12" fill="${t.bg2}" stroke="${t.line}"/>
<text x="20" y="34" font-size="10.5" class="c2" letter-spacing="1.5">FORMAÇÃO</text>
<text x="20" y="92" font-size="50" font-weight="800" fill="url(#ucsG)" style="font-family:${DISPLAY}">UCS</text>
<text x="20" y="120" font-size="13" font-weight="700">Engenharia de Software</text>
<text x="20" y="138" font-size="11" class="dim">Universidade de Caxias do Sul</text>
<text x="20" y="176" font-size="10" class="dim">status</text>
<text x="66" y="176" font-size="10" class="ok">● cursando</text>
<rect x="20" y="188" width="260" height="6" rx="3" fill="${t.line}"/>
<rect x="20" y="188" width="260" height="6" rx="3" fill="url(#shim)"/>
<text x="20" y="212" font-size="9.5" class="dim">compilando conhecimento...</text>
${[0, 1, 2].map((i) => `<circle cx="${230 + i * 18}" cy="62" r="${4 - i}" fill="${[t.c1, t.c2, t.c3][i]}" class="orb" style="animation-delay:${-i * 1.2}s"/>`).join('')}
</g>`;

  // gráfico de horas
  const bx = 352, lw = 168, bw = 250, rh = 19.5, by = 92;
  const bars = CERTS.map(([name, h], i) => {
    const y = by + i * rh, w = r1((h / max) * bw), c = mix(t.c1, t.c2, i / (CERTS.length - 1));
    return `<text x="${bx}" y="${y + 10}" font-size="11">${esc(name)}</text>
<rect x="${bx + lw}" y="${y + 1}" width="${bw}" height="11" rx="3" fill="${t.line}" opacity=".45"/>
<rect x="${bx + lw}" y="${y + 1}" width="${w}" height="11" rx="3" fill="${c}" class="bar" style="animation-delay:${r1(0.2 + i * 0.07)}s"/>
<text x="${bx + lw + w + 8}" y="${y + 10}" font-size="10" class="dim lbl" style="animation-delay:${r1(0.6 + i * 0.07)}s">${String(h).replace('.', ',')}h</text>`;
  }).join('');

  const css = `${frameCss}
.bar{transform-box:fill-box;transform-origin:left;animation:grow 1s cubic-bezier(.2,.9,.3,1) backwards}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.lbl{animation:fade .4s ease-out backwards}@keyframes fade{from{opacity:0}}
.orb{animation:orb 3.6s ease-in-out infinite}@keyframes orb{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`;
  const defs = `<linearGradient id="ucsG" x1="0" x2="1"><stop offset="0" stop-color="${t.c1}"/><stop offset="1" stop-color="${t.c3}"/></linearGradient>
<linearGradient id="shim" gradientUnits="userSpaceOnUse" x1="20" x2="120" spreadMethod="pad"><stop offset="0" stop-color="${t.c1}" stop-opacity="0"/><stop offset=".5" stop-color="${t.c2}"/><stop offset="1" stop-color="${t.c3}" stop-opacity="0"/>
<animateTransform attributeName="gradientTransform" type="translate" values="-100 0;260 0" dur="2.2s" repeatCount="indefinite"/></linearGradient>`;
  const body = `${frame({ w: W, h: H, t, label: 'education.log' })}
${ucs}
<text x="${bx}" y="70" font-size="10.5" class="c2" letter-spacing="1.5">CERTIFICADOS</text>
<text x="${W - 26}" y="70" font-size="12" text-anchor="end"><tspan font-weight="700" class="c1">${CERTS.length}</tspan><tspan class="dim"> cursos · </tspan><tspan font-weight="700" class="c1">${String(total).replace('.', ',')}h</tspan><tspan class="dim"> de estudo</tspan></text>
${bars}`;
  return doc({ w: W, h: H, t, title: 'Formação e certificados', css, defs, body, fonts: ['mono', 'monoBold', 'display'] });
}
