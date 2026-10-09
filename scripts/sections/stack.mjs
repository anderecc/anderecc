// Stack: teclado mecânico 3D — só o que eu domino de verdade. Cada tecla afunda numa onda contínua
// e a barra de espaço cobre o resto (com IA, nada é impossível).
import { doc, frame, frameCss, icon, esc, r1, mix } from '../lib/core.mjs';

const W = 860;
// [coluna, linha]: [rótulo, teclas]. Minúsculo = ícone do simple-icons; Maiúsculo = tecla de texto.
const LAYOUT = [
  [['LANG', ['typescript', 'javascript', 'go']], ['DATA', ['mysql', 'mongodb', 'firebase', 'redis', 'BullMQ']], ['AI', ['claude', 'googlegemini', 'OpenAI', 'modelcontextprotocol', 'OpenClaw']]],
  [['WEB', ['react', 'nextdotjs', 'nodedotjs', 'express']], ['OPS', ['linux', 'gnubash', 'docker', 'nginx', 'githubactions', 'VPS']], ['SPACE', []]],
];
const LABEL = {
  typescript: 'TS', javascript: 'JS', go: 'Go', react: 'React', nextdotjs: 'Next', nodedotjs: 'Node', express: 'Express',
  mysql: 'MySQL', mongodb: 'Mongo', firebase: 'Firebase', redis: 'Redis', docker: 'Docker', nginx: 'Nginx', linux: 'Linux',
  githubactions: 'Actions', gnubash: 'Bash', claude: 'Claude', googlegemini: 'Gemini', modelcontextprotocol: 'MCP',
};

export function stack(t) {
  const KW = 52, KH = 48, DEPTH = 7, GAP = 7, ROWH = KH + DEPTH + 18, LABW = 56;
  const top = 56, colW = (W - 40) / 2;
  const H = top + 3 * ROWH + 24;
  let keys = '', idx = 0;

  const key = (x, y, w, face, d) => `<g>
<rect x="${x + 2}" y="${y + DEPTH + 4}" width="${w - 4}" height="${KH}" rx="9" fill="${t.c1}" class="glow" style="animation-delay:${d}s"/>
<rect x="${x}" y="${y + DEPTH}" width="${w}" height="${KH}" rx="8" fill="${t.keySide}" stroke="${t.keyEdge}"/>
<g class="key" style="animation-delay:${d}s"><rect x="${x}" y="${y}" width="${w}" height="${KH}" rx="8" fill="url(#cap)" stroke="${t.keyEdge}"/>
<rect x="${x + 4}" y="${y + 3}" width="${w - 8}" height="${KH - 10}" rx="6" fill="${t.keyTop}" opacity=".7"/>${face}</g></g>`;

  LAYOUT.forEach((col, ci) => {
    const x0 = 24 + ci * colW;
    col.forEach(([label, items], ri) => {
      const y = top + ri * ROWH;
      if (label === 'SPACE') {
        // barra de espaço: pressionada por último, depois da onda
        const x = x0 + LABW, w = colW - LABW - 18, ic = icon('claude', t);
        const face = `<g transform="translate(${x + 16} ${y + 14}) scale(${18 / 24})"><path d="${ic.d}" fill="${t.c1}"/></g>
<text x="${x + 44}" y="${y + 22}" font-size="11.5" font-weight="700">o resto?</text>
<text x="${x + 44}" y="${y + 37}" font-size="10" class="dim">nada é impossível pra quem tem um Claude</text>`;
        keys += `<text x="${x0}" y="${y + KH / 2 + 4}" font-size="10.5" font-weight="700" class="dim" letter-spacing="1">+ IA</text>`;
        keys += key(x, y, w, face, r1(idx * 0.11 + 0.3));
        idx++;
        return;
      }
      keys += `<text x="${x0}" y="${y + KH / 2 + 4}" font-size="10.5" font-weight="700" class="c1" letter-spacing="1">${label}</text>`;
      items.forEach((name, k) => {
        const x = x0 + LABW + k * (KW + GAP);
        const isIcon = name === name.toLowerCase();
        const d = r1(idx * 0.11);
        idx++;
        const face = isIcon
          ? `<g transform="translate(${x + KW / 2 - 10} ${y + 8}) scale(${20 / 24})"><path d="${icon(name, t).d}" fill="${t.text}"/></g>
<text x="${x + KW / 2}" y="${y + KH - 7}" font-size="8" text-anchor="middle" class="dim">${LABEL[name] ?? name}</text>`
          : `<text x="${x + KW / 2}" y="${y + KH / 2 + 4}" font-size="${name.length > 6 ? 8.5 : 10}" font-weight="700" text-anchor="middle">${esc(name)}</text>`;
        keys += key(x, y, KW, face, d);
      });
    });
  });

  const cycle = Math.max(8, r1(idx * 0.11 + 3));
  const css = `${frameCss}
.key{animation:press ${cycle}s cubic-bezier(.3,.7,.4,1) infinite both}
@keyframes press{0%,7%,100%{transform:translateY(0)}2.5%{transform:translateY(${DEPTH - 1}px)}}
.glow{opacity:0;filter:blur(6px);animation:glow ${cycle}s ease-out infinite both}
@keyframes glow{0%,10%,100%{opacity:0}3%{opacity:${t.name === 'dark' ? 0.45 : 0.3}}}`;
  const defs = `<linearGradient id="cap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.keyTop, t.text, 0.05)}"/><stop offset="1" stop-color="${t.keyTop}"/></linearGradient>`;
  const body = `${frame({ w: W, h: H, t, label: 'stack — o que eu domino' })}
${keys}`;
  return doc({ w: W, h: H, t, title: 'Tech stack', css, defs, body, fonts: ['mono', 'monoBold'] });
}
