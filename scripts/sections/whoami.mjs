// whoami: painel estilo neofetch — logo em pixel art que se monta e linhas que "carregam".
import { doc, frame, frameCss, esc, r1, mix } from '../lib/core.mjs';
import { CERTS } from './edu.mjs';

const W = 860, H = 420;

// "A" em pixel art (1 = pixel aceso, 2 = destaque)
const LOGO = [
  '....1111....',
  '...111111...',
  '..11122111..',
  '..111..111..',
  '.111....111.',
  '.111....111.',
  '.1111111111.',
  '111222222111',
  '111......111',
  '111......111',
  '111......111',
  '222......222',
];

export function whoami(t, data = {}) {
  const years = Math.floor((Date.now() - Date.parse('2022-04-23')) / (365.25 * 864e5));
  const contrib = data.total ? ` · ${data.total.toLocaleString('pt-BR')} contribuições/ano` : '';
  const rows = [
    ['role', 'Full Stack Developer @ LDX Capital'],
    ['edu', 'Engenharia de Software · UCS (cursando)'],
    ['builds', 'sites · CRMs · apps Android/iOS/PWA · integrações'],
    ['fin', 'mercado financeiro & investimentos · integrações XP e BTG'],
    ['langs', 'TypeScript · JavaScript · Go'],
    ['web', 'React · Next.js · Node · Express'],
    ['data', 'MySQL · MongoDB · Firebase · Redis/BullMQ'],
    ['shell', 'base forte em Linux e terminal · bash · ssh'],
    ['ops', 'Docker · Nginx · VPS · CI/CD (GitHub Actions)'],
    ['ai', 'agentes (OpenClaw, MCP) e bots — o resto, o Claude ajuda'],
    ['sec', 'CTFs · hardening de servidor · redes e recon'],
    ['certs', `+${CERTS.length} certificados · +1.000h de cursos e projetos`],
    ['uptime', `${years} anos no GitHub${contrib}`],
  ];

  // logo
  const cell = 13, gap = 2.5, ox = 40, oy = 110;
  let px = '';
  LOGO.forEach((line, y) => [...line].forEach((ch, x) => {
    if (ch === '.') return;
    const k = (x + y) / (LOGO.length + line.length);
    const c = ch === '2' ? t.c2 : mix(t.c1, t.c2, k * 0.6);
    px += `<rect x="${ox + x * (cell + gap)}" y="${oy + y * (cell + gap)}" width="${cell}" height="${cell}" rx="2" fill="${c}" style="animation-delay:${r1((x + y) * 0.05)}s,${r1(1.6 + (x + y) * 0.07)}s" class="px"/>`;
  }));

  const tx = 260, ty = 58, lh = 22;
  const kw = 9 * 8.4;
  let lines = `<g class="ln" style="animation-delay:.1s"><text x="${tx}" y="${ty}" font-size="15" font-weight="700"><tspan class="c1">anderson</tspan><tspan class="dim">@</tspan><tspan class="c2">github</tspan></text>
<text x="${tx}" y="${ty + 14}" font-size="12" class="faint">${'─'.repeat(54)}</text></g>`;
  rows.forEach(([k, v], i) => {
    const y = ty + 40 + i * lh;
    lines += `<g class="ln" style="animation-delay:${r1(0.35 + i * 0.16)}s"><text x="${tx}" y="${y}" font-size="14" font-weight="700" class="c1">${k}</text>
<text x="${tx + kw}" y="${y}" font-size="14">${esc(v)}</text></g>`;
  });
  const sy = ty + 40 + rows.length * lh;
  lines += `<g class="ln" style="animation-delay:${r1(0.35 + rows.length * 0.16)}s">
<text x="${tx}" y="${sy}" font-size="14" font-weight="700" class="c1">status</text>
<circle cx="${tx + kw + 5}" cy="${sy - 5}" r="4" fill="${t.ok}"/><circle cx="${tx + kw + 5}" cy="${sy - 5}" r="4" fill="none" stroke="${t.ok}" class="ping"/>
<text x="${tx + kw + 16}" y="${sy}" font-size="14" class="ok">shipping</text><text x="${tx + kw + 92}" y="${sy}" font-size="14" class="dim">— app LDX v1.1 + IA em produção</text></g>`;

  // paleta estilo neofetch
  const pal = [t.c1, mix(t.c1, t.c2, 0.5), t.c2, t.text, t.dim, t.c3, t.faint, t.line2];
  const palette = pal.map((c, i) => `<rect x="${40 + i * 23.4}" y="${oy + 12 * (cell + gap) + 18}" width="20" height="10" rx="2" fill="${c}" class="pal" style="animation-delay:${r1(i * 0.15)}s"/>`).join('');

  const css = `${frameCss}
.px{transform-box:fill-box;transform-origin:center;animation:pxIn .5s cubic-bezier(.2,1.4,.4,1) backwards,pxGlow 4.5s ease-in-out infinite}
@keyframes pxIn{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}
@keyframes pxGlow{0%,100%{opacity:1}8%{opacity:.55}16%{opacity:1}}
.ln{animation:lnIn .45s ease-out backwards}
@keyframes lnIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
.ping{transform-box:fill-box;transform-origin:center;animation:ping 2.2s ease-out infinite}
@keyframes ping{0%{transform:scale(1);opacity:.9}80%,100%{transform:scale(3);opacity:0}}
.pal{animation:pal 3.6s ease-in-out infinite}@keyframes pal{0%,100%{opacity:1}50%{opacity:.35}}
.cur{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}`;

  const body = `${frame({ w: W, h: H, t, label: 'neofetch --anderecc' })}
${px}${palette}${lines}
<rect class="cur" x="${tx}" y="${sy + 12}" width="8.4" height="15" fill="${t.c1}"/>`;
  return doc({ w: W, h: H, t, title: 'whoami — Anderson', css, body, fonts: ['mono', 'monoBold'] });
}
