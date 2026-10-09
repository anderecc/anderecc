// Sec lab: radar com varredura que "detecta" os alvos + terminal com hardening, recon e CTF.
import { doc, frame, frameCss, esc, r1 } from '../lib/core.mjs';

const W = 860, H = 290;
const BLIPS = [['ssh', 28, 0.55], ['ufw', 95, 0.8], ['tls', 150, 0.4], ['nmap', 205, 0.75], ['pcap', 260, 0.5], ['ctf', 320, 0.85]];
const TERM = [
  ['cmd', 'sudo ufw status verbose'],
  ['out', 'Status: active · default deny (incoming)'],
  ['cmd', 'sudo fail2ban-client status sshd'],
  ['out', 'jail ativo · ssh só com chave · root off'],
  ['cmd', 'nmap -sV --top-ports 100 lab.local'],
  ['out', '22/tcp ssh · 443/tcp https (TLS 1.3)'],
  ['cmd', './ctf --mode practice'],
  ['out', 'flag capturada → próxima sala'],
];

export function sec(t) {
  const cx = 160, cy = 150, R = 96, DUR = 4;
  const rings = [1, 0.66, 0.33].map((k) => `<circle cx="${cx}" cy="${cy}" r="${r1(R * k)}" stroke="${t.line2}"/>`).join('');
  const cross = `<path d="M${cx - R} ${cy}H${cx + R}M${cx} ${cy - R}V${cy + R}" stroke="${t.line}"/>`;
  // setor de 50° que gira; borda dianteira em 0°
  const a0 = (-50 * Math.PI) / 180;
  const wedge = `<path d="M${cx} ${cy}L${r1(cx + R * Math.cos(a0))} ${r1(cy + R * Math.sin(a0))}A${R} ${R} 0 0 1 ${cx + R} ${cy}Z" fill="url(#sweep)">
<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${DUR}s" repeatCount="indefinite"/></path>
<line x1="${cx}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="${t.c1}" stroke-width="1.5"><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${DUR}s" repeatCount="indefinite"/></line>`;
  const blips = BLIPS.map(([label, deg, k]) => {
    const a = (deg * Math.PI) / 180, x = r1(cx + R * k * Math.cos(a)), y = r1(cy + R * k * Math.sin(a));
    const begin = r1((deg / 360) * DUR);
    const anim = `<animate attributeName="opacity" values="1;.2" keyTimes="0;1" dur="${DUR}s" begin="${begin}s" repeatCount="indefinite"/>`;
    return `<g opacity=".2">${anim}<circle cx="${x}" cy="${y}" r="3.5" fill="${t.c1}"/><circle cx="${x}" cy="${y}" r="8" fill="${t.c1}" fill-opacity=".18"/>
<text x="${x + 10}" y="${y + 3.5}" font-size="9.5" class="dim">${label}</text></g>`;
  }).join('');

  // terminal: linhas aparecem uma a uma num loop de 12s (SMIL discreto)
  const tx = 330, ty = 64, LOOP = 12;
  const term = TERM.map(([kind, s], i) => {
    const y = ty + 22 + i * 19, on = ((0.4 + i * 0.9) / LOOP).toFixed(3), off = (11.4 / LOOP).toFixed(3);
    const txt = kind === 'cmd' ? `<tspan class="c1">❯ </tspan>${esc(s)}` : `<tspan class="dim">  ${esc(s)}</tspan>`;
    return `<text x="${tx + 16}" y="${y}" font-size="11.5"><animate attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes="0;${on};${off}" dur="${LOOP}s" repeatCount="indefinite"/>${txt}</text>`;
  }).join('');
  const tags = ['CTFs', 'hardening de servidor', 'redes & recon'];
  let tgx = tx;
  const tagEls = tags.map((s) => {
    const w = s.length * 10.5 * 0.6 + 26;
    const g = `<g transform="translate(${r1(tgx)} ${H - 40})"><rect width="${r1(w)}" height="22" rx="11" fill="${t.bg2}" stroke="${t.line2}"/><circle cx="12" cy="11" r="3" fill="${t.c1}"/><text x="21" y="15" font-size="10.5" class="dim">${esc(s)}</text></g>`;
    tgx += w + 8;
    return g;
  }).join('');

  const css = `${frameCss}.cur{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}`;
  const defs = `<linearGradient id="sweep" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${t.c1}" stop-opacity="0"/><stop offset="1" stop-color="${t.c1}" stop-opacity="${t.name === 'dark' ? 0.35 : 0.25}"/></linearGradient>`;
  const body = `${frame({ w: W, h: H, t, label: 'sec.lab — estudando todo dia' })}
<circle cx="${cx}" cy="${cy}" r="${R}" fill="${t.bg2}"/>${rings}${cross}${wedge}${blips}
<circle cx="${cx}" cy="${cy}" r="3" fill="${t.c1}"/>
<rect x="${tx}" y="${ty - 6}" width="${W - tx - 24}" height="${TERM.length * 19 + 26}" rx="10" fill="${t.bg2}" stroke="${t.line}"/>
${term}
<rect class="cur" x="${tx + 16}" y="${ty + 22 + TERM.length * 19 - 11}" width="7" height="13" fill="${t.c1}"/>
${tagEls}`;
  return doc({ w: W, h: H, t, title: 'Sec lab — cibersegurança', css, defs, body, fonts: ['mono', 'monoBold'] });
}
