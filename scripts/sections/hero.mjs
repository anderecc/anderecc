// Hero: icosfera 3D em wireframe girando (projeção perspectiva calculada aqui e
// animada com SMIL), anel orbital com satélites, chão em grade synthwave e nome com glitch.
import { doc, frame, frameCss, esc, r1, rng, DISPLAY, MONO, CHAR } from '../lib/core.mjs';

const W = 860, H = 380;
const HORIZON = 292;

// ---------- geometria: icosaedro subdividido 1x (42 vértices, 120 arestas)
function icosphere() {
  const p = (1 + Math.sqrt(5)) / 2;
  let v = [[-1, p, 0], [1, p, 0], [-1, -p, 0], [1, -p, 0], [0, -1, p], [0, 1, p], [0, -1, -p], [0, 1, -p], [p, 0, -1], [p, 0, 1], [-p, 0, -1], [-p, 0, 1]];
  let f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const norm = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
  v = v.map(norm);
  const cache = {};
  const mid = (a, b) => {
    const k = a < b ? `${a}_${b}` : `${b}_${a}`;
    if (cache[k] == null) { v.push(norm(v[a].map((x, i) => (x + v[b][i]) / 2))); cache[k] = v.length - 1; }
    return cache[k];
  };
  f = f.flatMap(([a, b, c]) => { const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]]; });
  const edges = new Set();
  for (const [a, b, c] of f) for (const [x, y] of [[a, b], [b, c], [c, a]]) edges.add(x < y ? `${x}_${y}` : `${y}_${x}`);
  // alinha o vértice 0 (eixo de simetria de 5 dobras) com o eixo Y:
  // assim girar 72° devolve a mesma figura e o loop fica perfeito com poucos quadros
  const a = v[0], target = [0, 1, 0];
  const axis = norm([a[1] * target[2] - a[2] * target[1], a[2] * target[0] - a[0] * target[2], a[0] * target[1] - a[1] * target[0]]);
  const ang = Math.acos(a[1]);
  v = v.map((pt) => rotAxis(pt, axis, ang));
  return { v, e: [...edges].map((k) => k.split('_').map(Number)) };
}
function rotAxis([x, y, z], [ux, uy, uz], t) {
  const c = Math.cos(t), s = Math.sin(t), d = (ux * x + uy * y + uz * z) * (1 - c);
  return [x * c + (uy * z - uz * y) * s + ux * d, y * c + (uz * x - ux * z) * s + uy * d, z * c + (ux * y - uy * x) * s + uz * d];
}

function sphere(t, { cx, cy, R }) {
  const { v, e } = icosphere();
  const FRAMES = 12, D = 3.4, tiltX = -0.38, tiltZ = 0.22;
  const proj = (pt, th) => {
    let [x, y, z] = pt;
    [x, z] = [x * Math.cos(th) + z * Math.sin(th), -x * Math.sin(th) + z * Math.cos(th)];
    [y, z] = [y * Math.cos(tiltX) - z * Math.sin(tiltX), y * Math.sin(tiltX) + z * Math.cos(tiltX)];
    [x, y] = [x * Math.cos(tiltZ) - y * Math.sin(tiltZ), x * Math.sin(tiltZ) + y * Math.cos(tiltZ)];
    const k = D / (D - z);
    return [cx + x * R * k, cy - y * R * k, (z + 1) / 2];
  };
  const frames = [...Array(FRAMES + 1)].map((_, i) => (i / FRAMES) * ((2 * Math.PI) / 5));
  const P = frames.map((th) => v.map((pt) => proj(pt, th)));
  const dur = '7s';
  const paths = P.map((pts) => e.map(([a, b]) => `M${r1(pts[a][0])} ${r1(pts[a][1])}L${r1(pts[b][0])} ${r1(pts[b][1])}`).join('')).join(';');
  const edges = `<path stroke="url(#sph)" stroke-width="1" stroke-opacity=".75" d="${paths.split(';')[0]}"><animate attributeName="d" dur="${dur}" repeatCount="indefinite" values="${paths}"/></path>`;
  const dots = v.map((_, i) => {
    const cxs = P.map((f) => r1(f[i][0])).join(';'), cys = P.map((f) => r1(f[i][1])).join(';');
    const rs = P.map((f) => r1(1 + f[i][2] * 2.6)).join(';'), op = P.map((f) => r1(0.15 + f[i][2] * 0.85)).join(';');
    return `<circle r="2" fill="${i % 7 === 0 ? t.c3 : t.c1}"><animate attributeName="cx" dur="${dur}" repeatCount="indefinite" values="${cxs}"/><animate attributeName="cy" dur="${dur}" repeatCount="indefinite" values="${cys}"/><animate attributeName="r" dur="${dur}" repeatCount="indefinite" values="${rs}"/><animate attributeName="opacity" dur="${dur}" repeatCount="indefinite" values="${op}"/></circle>`;
  }).join('');
  return `<circle cx="${cx}" cy="${cy}" r="${R * 1.55}" fill="url(#halo)"/>${edges}<g filter="url(#bloom)">${dots}</g>`;
}

function orbit(t, { cx, cy }) {
  const rx = 172, ry = 42, rot = -14;
  const ell = `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}`;
  const back = `M${cx - rx} ${cy}A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
  const front = `M${cx + rx} ${cy}A${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`;
  const sats = ['TS', 'GO', 'AI', 'SEC'].map((s, i) => {
    const dur = 14, begin = -(dur / 4) * i;
    // primeira metade do caminho = frente (opaco), segunda = atrás da esfera (apagado)
    return `<g><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${ell}"/>
<animate attributeName="opacity" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" values="1;1;.18;.18;1" keyTimes="0;.42;.55;.95;1"/>
<circle r="11" fill="${t.panel}" stroke="${[t.c1, t.c2, t.c3, t.ok][i]}" stroke-width="1.2"/>
<text text-anchor="middle" y="3.4" font-size="${s.length > 2 ? 7.5 : 9}" font-weight="700" fill="${[t.c1, t.c2, t.c3, t.ok][i]}">${s}</text></g>`;
  }).join('');
  return {
    back: `<g transform="rotate(${rot} ${cx} ${cy})"><path d="${back}" stroke="${t.c2}" stroke-opacity=".35" stroke-dasharray="2 6" class="spin"/></g>`,
    front: `<g transform="rotate(${rot} ${cx} ${cy})"><path d="${front}" stroke="url(#grad)" stroke-opacity=".9" stroke-dasharray="2 6" class="spin"/>${sats}</g>`,
  };
}

function floor(t) {
  const vx = 430, bottom = H, C = bottom - HORIZON;
  let v = '';
  for (let i = -16; i <= 16; i++) v += `<line x1="${vx}" y1="${HORIZON}" x2="${vx + i * 70}" y2="${bottom + 40}"/>`;
  const N = 9, dur = 3.2, zN = 0.9, zF = 14, S = 14;
  let h = '';
  for (let i = 0; i < N; i++) {
    const ys = [...Array(S + 1)].map((_, k) => r1(HORIZON + C / (zF - (zF - zN) * (k / S)))).join(';');
    h += `<line x1="0" x2="${W}" y1="${HORIZON}" y2="${HORIZON}"><animate attributeName="y1" values="${ys}" dur="${dur}s" begin="${-(dur / N) * i}s" repeatCount="indefinite"/><animate attributeName="y2" values="${ys}" dur="${dur}s" begin="${-(dur / N) * i}s" repeatCount="indefinite"/></line>`;
  }
  return `<g mask="url(#floorMaskX)"><g mask="url(#floorMask)" stroke="${t.c2}" stroke-width="1" stroke-opacity="${t.name === 'dark' ? 0.55 : 0.4}">${v}${h}</g></g>
<line x1="0" x2="${W}" y1="${HORIZON}" y2="${HORIZON}" stroke="url(#horizon)" stroke-width="1.5"/>`;
}

function typer(t, x, y, lines, size = 15) {
  // digitação com SMIL discreto (funciona em Chrome, Firefox e Safari dentro de <img>)
  const step = 4, T = lines.length * step, cw = size * CHAR;
  let out = '';
  lines.forEach((s, i) => {
    const n = s.length, t0 = i * step, pts = [[0, 0]];
    for (let k = 1; k <= n; k++) pts.push([t0 + (1.3 * k) / n, k]);
    const t1 = t0 + step - 0.8;
    for (let k = n - 1; k >= 0; k--) pts.push([t1 + (0.5 * (n - k)) / n, k]);
    const kt = pts.map(([tt]) => (tt / T).toFixed(4)).join(';');
    const wv = pts.map(([, k]) => r1(k * cw)).join(';');
    const xv = pts.map(([, k]) => r1(x + 2 + k * cw)).join(';');
    const vis = `values="0;1;0" keyTimes="0;${(t0 / T).toFixed(4)};${((t0 + step) / T).toFixed(4)}"`;
    out += `<clipPath id="tc${i}"><rect x="${x}" y="${y - size}" height="${size * 1.5}" width="0"><animate attributeName="width" calcMode="discrete" dur="${T}s" repeatCount="indefinite" keyTimes="${kt}" values="${wv}"/></rect></clipPath>
<g opacity="0"><animate attributeName="opacity" calcMode="discrete" dur="${T}s" repeatCount="indefinite" ${vis}/>
<text x="${x}" y="${y}" font-size="${size}" clip-path="url(#tc${i})">${esc(s)}</text>
<rect x="${x + 2}" y="${y - size + 2}" width="${r1(cw)}" height="${size}" fill="${t.c1}" opacity=".85"><animate attributeName="x" calcMode="discrete" dur="${T}s" repeatCount="indefinite" keyTimes="${kt}" values="${xv}"/></rect></g>`;
  });
  return { css: '', out };
}

export function hero(t) {
  const R = rng(42);
  const cx = 672, cy = 156;
  const o = orbit(t, { cx, cy });
  const ty = typer(t, 66, 214, [
    'construindo SaaS e agentes de IA',
    'bots, filas e automações rodando 24/7',
    'CI/CD, VPS e deploy configurados na mão',
    'Engenharia de Software @ UCS',
    'estudando cibersegurança (muito)',
  ]);
  const stars = [...Array(46)].map(() => {
    const x = r1(R() * W), y = r1(R() * (HORIZON - 30) + 12), d = r1(2 + R() * 4), b = r1(-R() * 6);
    return `<circle cx="${x}" cy="${y}" r="${r1(0.4 + R() * 0.9)}" fill="${t.text}" style="animation:tw ${d}s ease-in-out ${b}s infinite"/>`;
  }).join('');
  const name = 'ANDERSON';
  const chips = [['building @ LDX Capital', t.ok], ['open source & IA', t.c1], ['sec student', t.c3]];
  let cxp = 40;
  const chipEls = chips.map(([s, c], i) => {
    const w = s.length * 11 * CHAR + 30;
    const g = `<g transform="translate(${r1(cxp)} 246)"><rect width="${r1(w)}" height="24" rx="12" fill="${c}" fill-opacity=".08" stroke="${c}" stroke-opacity=".45"/>
<circle cx="13" cy="12" r="3.2" fill="${c}"/><circle cx="13" cy="12" r="3.2" fill="none" stroke="${c}" style="animation:ping 2.4s ease-out ${i * 0.6}s infinite;transform-origin:13px 12px;transform-box:view-box"/>
<text x="23" y="16" font-size="11" fill="${c}">${esc(s)}</text></g>`;
    cxp += w + 8;
    return g;
  }).join('');

  const css = `${frameCss}
.spin{animation:dash 3s linear infinite}@keyframes dash{to{stroke-dashoffset:-32}}
@keyframes tw{0%,100%{opacity:.08}50%{opacity:.7}}
@keyframes ping{0%{transform:scale(1);opacity:.9}80%,100%{transform:scale(3.2);opacity:0}}
.gl1,.gl2{opacity:0}
.gl1{animation:gl1 5s steps(1,end) infinite}.gl2{animation:gl2 5s steps(1,end) infinite}
@keyframes gl1{0%,86%,100%{opacity:0;transform:none}87%{opacity:.8;transform:translate(-4px,0)}89%{opacity:.8;transform:translate(3px,-1px)}91%{opacity:0}94%{opacity:.6;transform:translate(-2px,1px)}95%{opacity:0}}
@keyframes gl2{0%,86%,100%{opacity:0;transform:none}87%{opacity:.8;transform:translate(4px,1px)}89%{opacity:.8;transform:translate(-3px,0)}91%{opacity:0}94%{opacity:.6;transform:translate(2px,-1px)}95%{opacity:0}}
.scan{animation:scan 7s linear infinite}@keyframes scan{0%{transform:translateY(-40px)}100%{transform:translateY(${H + 40}px)}}
.shadow{animation:sh 7s ease-in-out infinite;transform-origin:${cx}px 318px;transform-box:view-box}@keyframes sh{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(.82);opacity:.3}}
.float{animation:fl 7s ease-in-out infinite}@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
${ty.css}`;

  const defs = `
<linearGradient id="nameG" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="420" y2="0" spreadMethod="reflect">
<stop offset="0" stop-color="${t.c1}"/><stop offset=".5" stop-color="${t.c2}"/><stop offset="1" stop-color="${t.c3}"/>
<animateTransform attributeName="gradientTransform" type="translate" values="0 0;420 0;0 0" dur="10s" repeatCount="indefinite"/></linearGradient>
<linearGradient id="sph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.c1}"/><stop offset="1" stop-color="${t.c2}"/></linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="${t.c2}" stop-opacity="${t.glow * 0.5}"/><stop offset=".55" stop-color="${t.c1}" stop-opacity="${t.glow * 0.12}"/><stop offset="1" stop-color="${t.c1}" stop-opacity="0"/></radialGradient>
<radialGradient id="shadowG"><stop offset="0" stop-color="${t.c2}" stop-opacity=".6"/><stop offset="1" stop-color="${t.c2}" stop-opacity="0"/></radialGradient>
<linearGradient id="horizon" x1="0" x2="1"><stop offset="0" stop-color="${t.c1}" stop-opacity="0"/><stop offset=".5" stop-color="${t.c2}"/><stop offset="1" stop-color="${t.c3}" stop-opacity="0"/></linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff"/></linearGradient>
<linearGradient id="fadeX" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".25" stop-color="#fff"/><stop offset=".75" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="floorMask"><rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#fade)"/></mask>
<mask id="floorMaskX"><rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#fadeX)"/></mask>
<linearGradient id="scanG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.c1}" stop-opacity="0"/><stop offset="1" stop-color="${t.c1}" stop-opacity="${t.name === 'dark' ? 0.07 : 0.05}"/></linearGradient>
<filter id="bloom" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<clipPath id="panel"><rect width="${W}" height="${H}" rx="14"/></clipPath>`;

  const body = `${frame({ w: W, h: H, t, label: 'anderecc — zsh — 860×380' })}
<g clip-path="url(#panel)">
${stars}
${floor(t)}
<ellipse class="shadow" cx="${cx}" cy="318" rx="120" ry="12" fill="url(#shadowG)"/>
<g class="float">${o.back}${sphere(t, { cx, cy, R: 96 })}${o.front}</g>
<rect class="scan" x="0" y="0" width="${W}" height="40" fill="url(#scanG)"/>
</g>
<text x="40" y="78" font-size="13"><tspan class="c1">~/anderecc</tspan><tspan class="dim"> on </tspan><tspan class="c2">main</tspan><tspan class="dim"> ❯ </tspan>whoami</text>
<g font-family="${DISPLAY}" font-size="56" font-weight="800" letter-spacing="1">
<text x="38" y="146" fill="${t.c1}" class="gl1" style="font-family:${DISPLAY}">${name}</text>
<text x="38" y="146" fill="${t.c3}" class="gl2" style="font-family:${DISPLAY}">${name}</text>
<text x="38" y="146" fill="url(#nameG)" style="font-family:${DISPLAY}">${name}</text>
</g>
<text x="40" y="180" font-size="15" font-weight="700">Full Stack Developer <tspan class="dim">·</tspan> IA <tspan class="dim">·</tspan> Cibersegurança</text>
<text x="40" y="214" font-size="15" class="c1">❯</text>
${ty.out}
${chipEls}
<text x="${W - 16}" y="${H - 12}" font-size="9.5" text-anchor="end" class="dim" opacity=".7">rendered by scripts/build.mjs · pure SVG, zero JS</text>`;
  return doc({ w: W, h: H, t, title: 'Anderson — Full Stack Developer', css, defs, body, fonts: ['mono', 'monoBold', 'display'] });
}
