// Atividade: busca o calendário de contribuições (GraphQL), desenha uma cidade isométrica 3D
// animada com contadores em odômetro e gera um STL que o GitHub renderiza com órbita no mouse.
import { execSync } from 'node:child_process';
import { doc, frame, frameCss, esc, r1, mix, darken, DISPLAY } from '../lib/core.mjs';

const USER = process.env.PROFILE_USER || 'anderecc';

export async function fetchContrib() {
  let token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
  if (!token) try { token = execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch {}
  if (!token) return null;
  const query = `query($u:String!){user(login:$u){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{contributionCount date weekday}}}}}}`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': USER },
    body: JSON.stringify({ query, variables: { u: USER } }),
  });
  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) { console.warn('! sem dados de contribuição:', JSON.stringify(json).slice(0, 200)); return null; }
  return summarize(cal);
}

function summarize(cal) {
  const weeks = cal.weeks.map((w) => w.contributionDays);
  const days = weeks.flat();
  const counts = days.map((d) => d.contributionCount);
  let longest = 0, run = 0;
  for (const c of counts) { run = c > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  let i = counts.length - 1, current = 0;
  if (counts[i] === 0) i--; // hoje ainda pode não ter commit
  for (; i >= 0 && counts[i] > 0; i--) current++;
  const best = days.reduce((a, b) => (b.contributionCount > a.contributionCount ? b : a));
  return {
    total: cal.totalContributions, weeks, max: best.contributionCount, best,
    active: counts.filter((c) => c > 0).length, current, longest,
  };
}

// ---------- odômetro: cada dígito é uma coluna 0-9 que rola até o valor
function odometer(t, x, y, value, size, delay0 = 0) {
  const str = value.toLocaleString('pt-BR'), cw = size * 0.6, lh = size * 1.15;
  let out = '', css = '', cx = x;
  [...str].forEach((ch, i) => {
    if (/\d/.test(ch)) {
      const d = +ch, id = `od${Math.round(x)}_${i}`;
      out += `<clipPath id="${id}"><rect x="${cx}" y="${y - size}" width="${cw + 1}" height="${lh}"/></clipPath>
<g clip-path="url(#${id})"><g class="roll${d}" style="animation-delay:${r1(delay0 + i * 0.12)}s">${[...Array(10)].map((_, k) => `<text x="${cx}" y="${r1(y + k * lh)}" font-size="${size}" font-weight="700">${k}</text>`).join('')}</g></g>`;
    } else out += `<text x="${cx}" y="${y}" font-size="${size}" font-weight="700" class="dim">${ch}</text>`;
    cx += cw;
  });
  for (let d = 1; d < 10; d++) css += `.roll${d}{transform:translateY(-${r1(d * lh)}px);animation:r${d} 1.6s cubic-bezier(.15,.85,.25,1) backwards}@keyframes r${d}{from{transform:translateY(0)}}`;
  return { out, css };
}

export function activity(t, data) {
  const W = 860, H = 440;
  const { weeks, max } = data;
  const fmtDate = (s) => s.split('-').reverse().slice(0, 2).join('/');
  const today = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // tiles
  const tiles = [[data.total, 'contribuições', 'em 12 meses'], [data.active, 'dias ativos', `de ${weeks.flat().length}`], [data.current, 'streak atual', 'dias'], [data.longest, 'maior streak', 'dias']];
  let odCss = '', tileEls = '';
  tiles.forEach(([v, a, b], i) => {
    const x = 24 + i * 206, c = [t.c1, t.c2, t.c3, t.ok][i];
    const od = odometer(t, x + 18, 98, v, 28, 0.2 + i * 0.15);
    odCss = od.css;
    tileEls += `<rect x="${x}" y="48" width="194" height="82" rx="10" fill="${t.bg2}" stroke="${t.line}"/>
<rect x="${x}" y="48" width="3" height="82" rx="1.5" fill="${c}"/>
${od.out}
<text x="${x + 18}" y="116" font-size="11" fill="${c}">${a} <tspan class="dim">${b}</tspan></text>`;
  });

  // cidade isométrica
  const WX = [12.6, 1.5], DY = [-5.6, 6.6], ox = 92, oy = 232;
  const P = (w, d, z = 0) => [r1(ox + w * WX[0] + d * DY[0]), r1(oy + w * WX[1] + d * DY[1] - z)];
  const pts = (...a) => a.map((p) => p.join(',')).join(' ');
  const cells = [];
  weeks.forEach((wk, w) => wk.forEach((day) => cells.push({ w, d: day.weekday, c: day.contributionCount, date: day.date })));
  cells.sort((a, b) => a.w + a.d - (b.w + b.d) || a.w - b.w);
  const shade = t.name === 'dark' ? [0.35, 0.55] : [0.12, 0.26];
  const g = 0.1;
  let bars = '';
  let bestPos = null;
  for (const { w, d, c, date } of cells) {
    const k = c ? Math.sqrt(c / max) : 0;
    const h = c ? 5 + k * 70 : 1.2;
    const col = c ? (k < 0.5 ? mix(t.c1, t.c2, k * 2) : mix(t.c2, t.c3, (k - 0.5) * 2)) : t.name === 'dark' ? t.line2 : t.line;
    const a = [w + g, d + g], b = [w + 1 - g, d + g], cc = [w + 1 - g, d + 1 - g], dd = [w + g, d + 1 - g];
    const T = (p) => P(p[0], p[1], h), B = (p) => P(p[0], p[1], 0);
    const top = `<polygon points="${pts(T(a), T(b), T(cc), T(dd))}" fill="${col}"/>`;
    const right = `<polygon points="${pts(T(b), T(cc), B(cc), B(b))}" fill="${darken(col, shade[1])}"/>`;
    const front = `<polygon points="${pts(T(dd), T(cc), B(cc), B(dd))}" fill="${darken(col, shade[0])}"/>`;
    const sweep = c ? `<polygon points="${pts(T(a), T(b), T(cc), T(dd))}" fill="#fff" class="sw" style="animation-delay:${r1(w * 0.07)}s"/>` : '';
    bars += `<g class="b" style="animation-delay:${r1(0.4 + w * 0.025 + d * 0.04)}s">${right}${front}${top}${sweep}</g>`;
    if (date === data.best.date) bestPos = T([w + 0.5, d + 0.5]);
  }
  // meses ao longo da borda
  let months = '', last = '';
  weeks.forEach((wk, w) => {
    const m = new Date(wk[0].date + 'T12:00:00Z').toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
    if (m !== last && w < weeks.length - 1) { const [x, y] = P(w, 7.9); months += `<text x="${x}" y="${y + 12}" font-size="9.5" class="dim">${m}</text>`; last = m; }
  });
  const best = bestPos ? `<g class="pin"><line x1="${bestPos[0]}" y1="${bestPos[1] - 4}" x2="${bestPos[0]}" y2="${bestPos[1] - 34}" stroke="${t.c3}" stroke-dasharray="2 2"/>
<rect x="${bestPos[0] - 58}" y="${bestPos[1] - 56}" width="116" height="22" rx="11" fill="${t.panel}" stroke="${t.c3}"/>
<text x="${bestPos[0]}" y="${bestPos[1] - 41}" font-size="10" text-anchor="middle" fill="${t.c3}">recorde: ${data.best.contributionCount} em ${fmtDate(data.best.date)}</text></g>` : '';
  const legend = [0, 0.2, 0.45, 0.7, 1].map((k, i) => `<rect x="${W - 140 + i * 16}" y="${H - 30}" width="12" height="12" rx="3" fill="${i === 0 ? t.line : k < 0.5 ? mix(t.c1, t.c2, k * 2) : mix(t.c2, t.c3, (k - 0.5) * 2)}"/>`).join('');

  const css = `${frameCss}${odCss}
.b{transform-box:fill-box;transform-origin:50% 100%;animation:rise .9s cubic-bezier(.2,1.2,.4,1) backwards}
@keyframes rise{from{transform:scaleY(0);opacity:0}}
.sw{opacity:0;animation:sw 6s ease-in-out infinite}@keyframes sw{0%,100%{opacity:0}4%{opacity:${t.name === 'dark' ? 0.55 : 0.6}}10%{opacity:0}}
.pin{animation:pin 3s ease-in-out infinite}@keyframes pin{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`;
  const body = `${frame({ w: W, h: H, t, label: `activity — atualizado em ${today}` })}
${tileEls}
${bars}${months}${best}
<text x="${W - 150}" y="${H - 20}" font-size="9.5" text-anchor="end" class="dim">menos</text>${legend}<text x="${W - 54}" y="${H - 20}" font-size="9.5" class="dim">mais</text>
<text x="24" y="${H - 20}" font-size="9.5" class="dim">cada prédio = 1 dia · altura = contribuições · gerado diariamente via GitHub Actions</text>`;
  return doc({ w: W, h: H, t, title: 'Atividade no GitHub em 3D', css, body, fonts: ['mono', 'monoBold'] });
}

// ---------- STL: o GitHub renderiza blocos ```stl com um viewer 3D interativo
export function skylineStl(data) {
  const { weeks, max } = data;
  const NW = weeks.length;
  const H = [...Array(NW)].map(() => Array(7).fill(0));
  weeks.forEach((wk, w) => wk.forEach((d) => { const c = d.contributionCount; H[w][d.weekday] = c ? Math.round((1 + Math.sqrt(c / max) * 17) * 2) / 2 : 0; }));
  const hAt = (w, d) => (w < 0 || w >= NW || d < 0 || d > 6 ? 0 : H[w][d]);
  const f = [];
  const tri = (n, a, b, c) => f.push(`facet normal ${n.join(' ')}\nouter loop\nvertex ${a.join(' ')}\nvertex ${b.join(' ')}\nvertex ${c.join(' ')}\nendloop\nendfacet`);
  const quad = (n, a, b, c, d) => { tri(n, a, b, c); tri(n, a, c, d); };
  // y invertido: domingo fica no fundo
  const Y = (d) => 6 - d;
  for (let w = 0; w < NW; w++) for (let d = 0; d < 7; d++) {
    const h = H[w][d];
    if (!h) continue;
    const x0 = w, x1 = w + 1, y0 = Y(d), y1 = Y(d) + 1;
    quad([0, 0, 1], [x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h]);
    // laterais: só a parte que fica acima do vizinho
    let n = hAt(w + 1, d); if (h > n) quad([1, 0, 0], [x1, y0, n], [x1, y1, n], [x1, y1, h], [x1, y0, h]);
    n = hAt(w - 1, d); if (h > n) quad([-1, 0, 0], [x0, y1, n], [x0, y0, n], [x0, y0, h], [x0, y1, h]);
    n = hAt(w, d - 1); if (h > n) quad([0, 1, 0], [x1, y1, n], [x0, y1, n], [x0, y1, h], [x1, y1, h]);
    n = hAt(w, d + 1); if (h > n) quad([0, -1, 0], [x0, y0, n], [x1, y0, n], [x1, y0, h], [x0, y0, h]);
  }
  // base
  const bx0 = -1, bx1 = NW + 1, by0 = -1, by1 = 8, bz = -2;
  quad([0, 0, 1], [bx0, by0, 0], [bx1, by0, 0], [bx1, by1, 0], [bx0, by1, 0]);
  quad([0, 0, -1], [bx0, by0, bz], [bx0, by1, bz], [bx1, by1, bz], [bx1, by0, bz]);
  quad([0, -1, 0], [bx0, by0, bz], [bx1, by0, bz], [bx1, by0, 0], [bx0, by0, 0]);
  quad([0, 1, 0], [bx1, by1, bz], [bx0, by1, bz], [bx0, by1, 0], [bx1, by1, 0]);
  quad([-1, 0, 0], [bx0, by1, bz], [bx0, by0, bz], [bx0, by0, 0], [bx0, by1, 0]);
  quad([1, 0, 0], [bx1, by0, bz], [bx1, by1, bz], [bx1, by1, 0], [bx1, by0, 0]);
  return { stl: `solid skyline\n${f.join('\n')}\nendsolid skyline`, triangles: f.length };
}
