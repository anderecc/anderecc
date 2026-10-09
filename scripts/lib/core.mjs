// Núcleo do gerador: temas, fontes embutidas, ícones e helpers de SVG.
// Tudo é SVG puro + CSS/SMIL: o GitHub não roda JS em README, mas anima SVG.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '..', '..');

// paleta: neutros + trio frio (cyan → índigo → roxo), usado com parcimônia
export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#07090D', bg2: '#0D1117', panel: '#0D1117', line: '#1F2630', line2: '#2B3440',
    text: '#E6EDF3', dim: '#8B949E', faint: '#3D4652',
    c1: '#22D3EE', c2: '#818CF8', c3: '#C084FC', ok: '#34D399', warn: '#FBBF24',
    glow: 0.5, keyTop: '#131922', keySide: '#090C11', keyEdge: '#252D38',
  },
  light: {
    name: 'light',
    bg: '#FFFFFF', bg2: '#F6F8FA', panel: '#FFFFFF', line: '#D8DEE4', line2: '#C3CBD4',
    text: '#1F2328', dim: '#59636E', faint: '#C9D1D9',
    c1: '#0891B2', c2: '#4F46E5', c3: '#9333EA', ok: '#059669', warn: '#B45309',
    glow: 0.18, keyTop: '#FFFFFF', keySide: '#D5DBE2', keyEdge: '#C3CBD4',
  },
};

// ---------- fontes (subset woff2 em base64, porque <img> não carrega fonte externa)
const fontCache = {};
function font64(file) {
  return (fontCache[file] ??= readFileSync(join(ROOT, 'scripts', 'fonts', file)).toString('base64'));
}
export function fontFaces(...which) {
  const map = {
    mono: [['FC', 'firacode-400.woff2', 400]],
    monoBold: [['FC', 'firacode-700.woff2', 700]],
    display: [['UB', 'unbounded-800.woff2', 800]],
    displayLight: [['UB', 'unbounded-400.woff2', 400]],
  };
  const faces = which.flatMap((k) => map[k]);
  // glifos que a Fira Code não tem (❯ ✦ ↺ ▸) vêm de um subset mínimo da JetBrains Mono
  if (which.some((k) => k.startsWith('mono'))) faces.push(['JBX', 'jbmono-sym.woff2', 400]);
  return faces
    .map(([fam, file, w]) => `@font-face{font-family:${fam};font-weight:${fam === 'JBX' ? '100 900' : w};src:url(data:font/woff2;base64,${font64(file)}) format('woff2')}`)
    .join('');
}
export const MONO = `FC,JBX,'Fira Code',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`;
export const DISPLAY = `UB,${MONO}`;
export const CHAR = 0.6; // largura de um caractere da Fira Code, em em

// ---------- ícones (simple-icons, CC0)
const BRAND = {
  typescript: '#3178C6', javascript: '#F7DF1E', go: '#00ADD8', php: '#777BB4', dart: '#0175C2',
  react: '#61DAFB', nextdotjs: null, flutter: '#02569B', nodedotjs: '#5FA04E', express: null,
  laravel: '#FF2D20', redis: '#FF4438', mysql: '#4479A1', postgresql: '#4169E1', firebase: '#FFCA28',
  docker: '#2496ED', anthropic: null, claude: '#D97757', googlegemini: '#8E75B2', nginx: '#009639',
  linux: '#FCC624', git: '#F05032', githubactions: '#2088FF', tailwindcss: '#06B6D4', vercel: null,
  mui: '#007FFF', redux: '#764ABC', socketdotio: null, puppeteer: '#40B5A4', prisma: null,
  mongodb: '#47A248', vitest: '#6E9F18', ffmpeg: '#007808', rabbitmq: '#FF6600', python: '#3776AB',
  vuedotjs: '#4FC08D', modelcontextprotocol: null, kalilinux: '#557C94', owasp: null,
  wireshark: '#1679A7', burpsuite: '#FF6633', letsencrypt: '#003A70', cloudflare: '#F38020',
  chartdotjs: '#FF6384', googlecalendar: '#4285F4', googlesheets: '#34A853', googledrive: '#4285F4', gmail: '#EA4335', telegram: '#26A5E4', android: '#34A853', gnubash: null, whatsapp: '#25D366', instagram: '#FF0069', ubuntu: '#E95420', hostinger: '#673DE6', digitalocean: '#0080FF',
};
export function icon(name, t, brand = true) {
  const svg = readFileSync(join(ROOT, 'scripts', 'icons', `${name}.svg`), 'utf8');
  const d = svg.match(/<path d="([^"]+)"/)[1];
  if (!brand) return { d, color: t.text };
  let color = BRAND[name] ?? t.text;
  // marcas muito escuras/claras somem no fundo: usa a cor do texto
  if (t.name === 'dark' && ['#003A70', '#764ABC', '#02569B', '#4479A1', '#3178C6'].includes(color)) color = lighten(color, 0.3);
  if (t.name === 'light' && ['#F7DF1E', '#FCC624', '#FFCA28', '#61DAFB'].includes(color)) color = darken(color, 0.25);
  return { d, color };
}

// ---------- cor
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = (c) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, k) => rgb2hex(hex2rgb(a).map((v, i) => v + (hex2rgb(b)[i] - v) * k));
export const lighten = (c, k) => mix(c, '#ffffff', k);
export const darken = (c, k) => mix(c, '#000000', k);

// ---------- helpers
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const r1 = (n) => Math.round(n * 10) / 10;
export const r2 = (n) => Math.round(n * 100) / 100;

// gerador pseudo-aleatório determinístico: o SVG só muda se o conteúdo mudar
export function rng(seed = 7) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function doc({ w, h, t, title, css = '', fonts = ['mono'], body, defs = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>${fontFaces(...fonts)}
text{font-family:${MONO}}:where(text:not([fill])){fill:${t.text}}
.dim{fill:${t.dim}}.faint{fill:${t.faint}}.c1{fill:${t.c1}}.c2{fill:${t.c2}}.c3{fill:${t.c3}}.ok{fill:${t.ok}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
${css}</style>
<defs>
<linearGradient id="grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.c1}"/><stop offset=".5" stop-color="${t.c2}"/><stop offset="1" stop-color="${t.c3}"/></linearGradient>
${defs}</defs>
${body}
</svg>`;
}

// moldura de "janela" com borda em gradiente animado, usada em todos os painéis
export function frame({ w, h, t, label = '', rx = 14 }) {
  return `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${rx}" fill="${t.panel}" stroke="${t.line}"/>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${rx}" stroke="url(#grad)" stroke-opacity=".85" pathLength="100" stroke-dasharray="12 88" class="trace"/>
${label ? `<g transform="translate(18 22)"><circle r="4" cx="4" cy="-4" fill="${t.faint}"/><circle r="4" cx="18" cy="-4" fill="${t.faint}"/><circle r="4" cx="32" cy="-4" fill="${t.faint}"/>
<text x="50" y="0" font-size="11" class="dim">${esc(label)}</text></g>` : ''}`;
}
export const frameCss = `.trace{animation:trace 14s linear infinite}@keyframes trace{to{stroke-dashoffset:-100}}`;
