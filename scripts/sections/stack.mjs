// Stack: teclado mecânico 3D — cada tecnologia é uma tecla que afunda numa onda contínua.
import { doc, frame, frameCss, icon, esc, r1, mix } from '../lib/core.mjs';

const W = 860;
const GROUPS = [
  [
    ['LANG', ['typescript', 'javascript', 'go', 'php', 'dart']],
    ['FRONT', ['react', 'nextdotjs', 'flutter', 'tailwindcss', 'mui', 'redux']],
    ['BACK', ['nodedotjs', 'express', 'laravel', 'socketdotio', 'puppeteer', 'BullMQ']],
    ['DATA', ['redis', 'mysql', 'mongodb', 'firebase', 'prisma']],
  ],
  [
    ['OPS', ['docker', 'nginx', 'linux', 'githubactions', 'vercel', 'AWS']],
    ['AI', ['claude', 'googlegemini', 'OpenAI', 'modelcontextprotocol', 'Agents']],
    ['BOTS', ['whatsapp', 'instagram', 'Evolution', 'Webhooks', 'Cron']],
    ['SEC*', ['kalilinux', 'owasp', 'wireshark', 'burpsuite', 'letsencrypt']],
  ],
];
const LABEL = {
  typescript: 'TS', javascript: 'JS', go: 'Go', php: 'PHP', dart: 'Dart', react: 'React', nextdotjs: 'Next',
  flutter: 'Flutter', tailwindcss: 'Tailwind', mui: 'MUI', redux: 'Redux', nodedotjs: 'Node', express: 'Express',
  laravel: 'Laravel', socketdotio: 'Socket', puppeteer: 'Pptr', redis: 'Redis', mysql: 'MySQL', mongodb: 'Mongo',
  firebase: 'Firebase', prisma: 'Prisma', docker: 'Docker', nginx: 'Nginx', linux: 'Linux', githubactions: 'Actions',
  vercel: 'Vercel', claude: 'Claude', googlegemini: 'Gemini', modelcontextprotocol: 'MCP', kalilinux: 'Kali',
  owasp: 'OWASP', wireshark: 'Shark', burpsuite: 'Burp', letsencrypt: 'TLS', whatsapp: 'WhatsApp', instagram: 'Insta',
};

export function stack(t) {
  const KW = 50, KH = 46, DEPTH = 7, GAP = 7, ROWH = KH + DEPTH + 16, LABW = 52;
  const top = 58, colW = (W - 40) / 2;
  const H = top + GROUPS[0].length * ROWH + 34;
  let keys = '', idx = 0;
  const glows = [];

  GROUPS.forEach((col, ci) => {
    const x0 = 24 + ci * colW;
    col.forEach(([label, items], ri) => {
      const y = top + ri * ROWH;
      const lc = [t.c1, t.c2, t.c3, t.ok][ri];
      keys += `<text x="${x0}" y="${y + KH / 2 + 4}" font-size="10.5" font-weight="700" fill="${lc}" letter-spacing="1">${label}</text>`;
      items.forEach((name, k) => {
        const x = x0 + LABW + k * (KW + GAP);
        const isIcon = name === name.toLowerCase();
        const ic = isIcon ? icon(name, t) : { color: t.c2 };
        const d = r1(idx * 0.11);
        idx++;
        const face = isIcon
          ? `<g transform="translate(${x + KW / 2 - 10} ${y + 8}) scale(${20 / 24})"><path d="${ic.d}" fill="${ic.color}"/></g>
<text x="${x + KW / 2}" y="${y + KH - 7}" font-size="8" text-anchor="middle" class="dim">${LABEL[name] ?? name}</text>`
          : `<text x="${x + KW / 2}" y="${y + KH / 2 + 4}" font-size="${name.length > 7 ? 8.5 : 10}" font-weight="700" text-anchor="middle" fill="${t.c2}">${esc(name)}</text>`;
        keys += `<g>
<rect x="${x + 2}" y="${y + DEPTH + 4}" width="${KW - 4}" height="${KH}" rx="9" fill="${ic.color}" class="glow" style="animation-delay:${d}s"/>
<rect x="${x}" y="${y + DEPTH}" width="${KW}" height="${KH}" rx="8" fill="${t.keySide}" stroke="${t.keyEdge}"/>
<g class="key" style="animation-delay:${d}s"><rect x="${x}" y="${y}" width="${KW}" height="${KH}" rx="8" fill="url(#cap)" stroke="${t.keyEdge}"/>
<rect x="${x + 4}" y="${y + 3}" width="${KW - 8}" height="${KH - 10}" rx="6" fill="${t.keyTop}" opacity=".7"/>${face}</g></g>`;
      });
    });
  });

  const n = idx, cycle = Math.max(8, r1(n * 0.11 + 2.5));
  const css = `${frameCss}
.key{animation:press ${cycle}s cubic-bezier(.3,.7,.4,1) infinite both}
@keyframes press{0%,7%,100%{transform:translateY(0)}2.5%{transform:translateY(${DEPTH - 1}px)}}
.glow{opacity:0;filter:blur(6px);animation:glow ${cycle}s ease-out infinite both}
@keyframes glow{0%,10%,100%{opacity:0}3%{opacity:${t.name === 'dark' ? 0.75 : 0.45}}}
.rgb{animation:rgb 6s linear infinite}@keyframes rgb{to{stroke-dashoffset:-200}}`;
  const defs = `<linearGradient id="cap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.keyTop, t.text, 0.05)}"/><stop offset="1" stop-color="${t.keyTop}"/></linearGradient>
<filter id="soft"><feGaussianBlur stdDeviation="3"/></filter>`;
  const ug = H - 22;
  const body = `${frame({ w: W, h: H, t, label: 'stack — keyboard.layout' })}
<line x1="40" x2="${W - 40}" y1="${ug}" y2="${ug}" stroke="url(#grad)" stroke-width="2" stroke-linecap="round" pathLength="200" stroke-dasharray="60 40" class="rgb"/>
<line x1="40" x2="${W - 40}" y1="${ug}" y2="${ug}" stroke="url(#grad)" stroke-width="6" stroke-opacity=".35" filter="url(#soft)" pathLength="200" stroke-dasharray="60 40" class="rgb"/>
${keys}
<text x="${W - 24}" y="${H - 34}" font-size="9.5" text-anchor="end" class="dim">* estudando</text>`;
  return doc({ w: W, h: H, t, title: 'Tech stack', css, defs, body, fonts: ['mono', 'monoBold'] });
}
