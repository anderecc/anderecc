// Atividade: busca o calendário de contribuições (GraphQL) e desenha o calendário animado
// (entrada em onda + feixe varrendo) com contadores em odômetro.
import { execSync } from 'node:child_process';
import { doc, frame, frameCss, r1, mix, darken, rng } from '../lib/core.mjs';

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
  const out = summarize(cal);
  out.years = await fetchYears(token).catch(() => []);
  return out;
}

// total de contribuições por ano, desde a criação da conta
async function fetchYears(token) {
  const now = new Date().getUTCFullYear(), from = Number(process.env.PROFILE_SINCE || 2022);
  const parts = [];
  for (let y = from; y <= now; y++) parts.push(`y${y}:contributionsCollection(from:"${y}-01-01T00:00:00Z",to:"${y}-12-31T23:59:59Z"){contributionCalendar{totalContributions}}`);
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': USER },
    body: JSON.stringify({ query: `query($u:String!){user(login:$u){${parts.join(' ')}}}`, variables: { u: USER } }),
  });
  const u = (await res.json())?.data?.user ?? {};
  return Object.entries(u).map(([k, v]) => [Number(k.slice(1)), v.contributionCalendar.totalContributions]);
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

// Loop de T segundos: calendário monta → desmorona → cidade sobe → desaba → volta.
export function activity(t, data) {
  const W = 860, H = 610, T = 16;
  const { weeks, max } = data;
  const fmtDate = (s) => s.split('-').reverse().slice(0, 2).join('/');
  const today = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const R = rng(1337);
  const pct = (sec) => `${((sec / T) * 100).toFixed(2)}%`;

  // tiles com odômetro (sem barra lateral; um ponto colorido no rótulo)
  const tiles = [[data.total, 'contribuições', '12 meses'], [data.active, 'dias ativos', `de ${weeks.flat().length}`], [data.current, 'streak atual', 'dias'], [data.longest, 'maior streak', 'dias']];
  let odCss = '', tileEls = '';
  tiles.forEach(([v, a, b], i) => {
    const x = 24 + i * 206;
    const od = odometer(t, x + 18, 96, v, 28, 0.2 + i * 0.15);
    odCss = od.css;
    tileEls += `<rect x="${x}" y="48" width="194" height="80" rx="10" fill="${t.bg2}" stroke="${t.line}"/>
${od.out}
<circle cx="${x + 21}" cy="111" r="3" fill="${[t.c1, t.c2, t.c3, t.ok][i]}"/>
<text x="${x + 30}" y="115" font-size="11" class="dim">${a} · ${b}</text>`;
  });

  const cells = [];
  weeks.forEach((wk, w) => wk.forEach((d) => cells.push({ w, d: d.weekday, c: d.contributionCount, date: d.date })));
  // mesmos verdes do calendário do GitHub
  const GH = t.name === 'dark' ? ['#161B22', '#0E4429', '#006D32', '#26A641', '#39D353'] : ['#EBEDF0', '#9BE9A8', '#40C463', '#30A14E', '#216E39'];
  const ramp = (k) => (k < 0.33 ? mix(GH[1], GH[2], k / 0.33) : k < 0.66 ? mix(GH[2], GH[3], (k - 0.33) / 0.33) : mix(GH[3], GH[4], (k - 0.66) / 0.34));

  // ---- visão 1: calendário igual ao do GitHub
  const counts = cells.map((c) => c.c).filter(Boolean).sort((a, b) => a - b);
  const q = (p) => counts[Math.floor((counts.length - 1) * p)] ?? 1;
  const th = [q(0.25), q(0.5), q(0.75)];
  const level = (c) => (!c ? 0 : c <= th[0] ? 1 : c <= th[1] ? 2 : c <= th[2] ? 3 : 4);
  const shades = GH;
  const S = 11.5, G = 3, P = S + G, gx = 56, gy = 222;
  let flat = '', flatUi = '', last = '';
  weeks.forEach((wk, w) => {
    const m = new Date(wk[0].date + 'T12:00:00Z').toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
    if (m !== last && w < weeks.length - 2) { flatUi += `<text x="${r1(gx + w * P)}" y="${gy - 10}" font-size="10" class="dim">${m}</text>`; last = m; }
  });
  flatUi += [['seg', 1], ['qua', 3], ['sex', 5]].map(([s, d]) => `<text x="24" y="${r1(gy + d * P + 9)}" font-size="9.5" class="dim">${s}</text>`).join('');
  for (const { w, d, c, date } of cells) {
    const v = Math.floor(R() * 4), dl = r1(w * 0.014 + d * 0.025 + R() * 0.25);
    flat += `<rect x="${r1(gx + w * P)}" y="${r1(gy + d * P)}" width="${S}" height="${S}" rx="2.5" fill="${shades[level(c)]}" class="fc f${v}" style="animation-delay:${dl}s"><title>${c} em ${fmtDate(date)}</title></rect>`;
  }
  const gw = 53 * P, gh = 7 * P;

  // ---- visão 2: cidade isométrica
  const WX = [12.6, 1.5], DY = [-5.6, 6.6], ox = 92, oy = 262;
  const PJ = (w, d, z = 0) => [r1(ox + w * WX[0] + d * DY[0]), r1(oy + w * WX[1] + d * DY[1] - z)];
  const pts = (...a) => a.map((p) => p.join(',')).join(' ');
  const shade = t.name === 'dark' ? [0.35, 0.55] : [0.12, 0.26];
  const g = 0.1;
  let city = '', cityUi = '', bestPos = null;
  [...cells].sort((a, b) => a.w + a.d - (b.w + b.d) || a.w - b.w).forEach(({ w, d, c, date }) => {
    const k = c ? Math.sqrt(c / max) : 0, h = c ? 5 + k * 70 : 1.2;
    const col = c ? ramp(k) : t.name === 'dark' ? t.line2 : t.line;
    const a = [w + g, d + g], b = [w + 1 - g, d + g], cc = [w + 1 - g, d + 1 - g], dd = [w + g, d + 1 - g];
    const Tp = (p) => PJ(p[0], p[1], h), Bp = (p) => PJ(p[0], p[1], 0);
    const sweep = c ? `<polygon points="${pts(Tp(a), Tp(b), Tp(cc), Tp(dd))}" fill="#fff" class="sw" style="animation-delay:${r1(w * 0.06)}s"/>` : '';
    city += `<g class="bd" style="animation-delay:${r1(w * 0.02 + d * 0.04)}s"><polygon points="${pts(Tp(b), Tp(cc), Bp(cc), Bp(b))}" fill="${darken(col, shade[1])}"/><polygon points="${pts(Tp(dd), Tp(cc), Bp(cc), Bp(dd))}" fill="${darken(col, shade[0])}"/><polygon points="${pts(Tp(a), Tp(b), Tp(cc), Tp(dd))}" fill="${col}"/>${sweep}</g>`;
    if (date === data.best.date) bestPos = Tp([w + 0.5, d + 0.5]);
  });
  last = '';
  weeks.forEach((wk, w) => {
    const m = new Date(wk[0].date + 'T12:00:00Z').toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
    if (m !== last && w < weeks.length - 1) { const [x, y] = PJ(w, 7.9); cityUi += `<text x="${x}" y="${y + 12}" font-size="9.5" class="dim">${m}</text>`; last = m; }
  });
  if (bestPos) {
    const label = `recorde · ${data.best.contributionCount} em ${fmtDate(data.best.date)}`, lw = r1(label.length * 10 * 0.6 + 24);
    const [bx, by] = bestPos, py = by - 44;
    cityUi += `<circle cx="${bx}" cy="${by}" r="3" fill="${t.text}"/><line x1="${bx}" y1="${by - 4}" x2="${bx}" y2="${py + 11}" stroke="${t.text}" stroke-opacity=".6"/>
<rect x="${r1(bx - lw / 2)}" y="${py - 11}" width="${lw}" height="22" rx="11" fill="${t.panel}" stroke="${t.line2}"/>
<text x="${bx}" y="${py + 4}" font-size="10" text-anchor="middle">${label}</text>`;
  }

  // ---- destroços nas duas transições
  let debris = '';
  for (let i = 0; i < 70; i++) {
    const burst = i % 2 ? 'A' : 'B', v = Math.floor(R() * 4), x = r1(60 + R() * 740), y = r1(180 + R() * 180), sz = r1(2 + R() * 4);
    debris += `<rect x="${x}" y="${y}" width="${sz}" height="${sz}" rx="1" fill="${GH[2 + (i % 3)]}" class="db${burst}${v}" style="animation-delay:${r1(R() * 0.6)}s"/>`;
  }

  const crumble = [[-30, 70, -40], [26, 80, 35], [-12, 95, 70], [18, 60, -25]];
  const fly = [[-60, -50, 120], [70, -40, -90], [-40, 50, 200], [55, 45, -160]];
  let css = `${frameCss}${odCss}
.fc{transform-box:fill-box;transform-origin:center}
${crumble.map(([dx, dy, r], v) => `.f${v}{animation:f${v} ${T}s cubic-bezier(.3,.6,.4,1) infinite backwards}@keyframes f${v}{0%{transform:scale(0);opacity:0}${pct(0.9)}{transform:scale(1);opacity:1}${pct(6.4)}{transform:none;opacity:1}${pct(6.8)}{transform:translateY(-5px);opacity:1}${pct(8)}{transform:translate(${dx}px,${dy}px) rotate(${r}deg) scale(.5);opacity:0}100%{transform:scale(0);opacity:0}}`).join('\n')}
.flatui{animation:flatui ${T}s linear infinite backwards}@keyframes flatui{0%{opacity:0}${pct(0.6)}{opacity:1}${pct(6.6)}{opacity:1}${pct(7.2)}{opacity:0}100%{opacity:0}}
.beam{opacity:0;animation:beam ${T}s ease-in-out infinite}@keyframes beam{0%,${pct(1.5)}{transform:translateX(-80px);opacity:1}${pct(5.6)}{transform:translateX(${r1(gw + 80)}px);opacity:1}${pct(5.7)},100%{opacity:0}}
.bd{opacity:0;transform-box:fill-box;transform-origin:50% 100%;animation:bd ${T}s cubic-bezier(.2,1.1,.4,1) infinite}
@keyframes bd{0%,${pct(7.3)}{transform:scaleY(0);opacity:0}${pct(8.6)}{transform:scaleY(1);opacity:1}${pct(13.3)}{transform:scaleY(1);opacity:1}${pct(13.7)}{transform:translateY(-4px) scaleY(1.04);opacity:1}${pct(14.6)}{transform:translateY(24px) scaleY(0);opacity:0}100%{opacity:0;transform:scaleY(0)}}
.cityui{opacity:0;animation:cityui ${T}s linear infinite}@keyframes cityui{0%,${pct(8.4)}{opacity:0}${pct(9.2)}{opacity:1}${pct(13.2)}{opacity:1}${pct(13.8)},100%{opacity:0}}
.sw{opacity:0;animation:sw ${T}s ease-in-out infinite}@keyframes sw{0%,${pct(9.4)}{opacity:0}${pct(9.8)}{opacity:${t.name === 'dark' ? 0.5 : 0.55}}${pct(10.6)},100%{opacity:0}}
.yr{transform-box:fill-box;transform-origin:50% 100%;animation:yr 1s cubic-bezier(.2,1.1,.4,1) backwards}@keyframes yr{from{transform:scaleY(0)}}
.yl{animation:yl .5s ease-out backwards}@keyframes yl{from{opacity:0;transform:translateY(6px)}}
.flash{opacity:0;animation:flash ${T}s linear infinite}@keyframes flash{0%,${pct(6.9)}{opacity:0}${pct(7.1)}{opacity:.08}${pct(7.5)}{opacity:0}${pct(13.9)}{opacity:0}${pct(14.1)}{opacity:.08}${pct(14.5)},100%{opacity:0}}
`;
  for (const [b, t0] of [['A', 6.9], ['B', 13.9]]) fly.forEach(([dx, dy, r], v) => {
    css += `.db${b}${v}{opacity:0;transform-box:fill-box;transform-origin:center;animation:db${b}${v} ${T}s cubic-bezier(.2,.7,.4,1) infinite}@keyframes db${b}${v}{0%,${pct(t0)}{opacity:0;transform:none}${pct(t0 + 0.1)}{opacity:.9;transform:none}${pct(t0 + 1.4)}{opacity:0;transform:translate(${dx}px,${dy + 40}px) rotate(${r}deg)}100%{opacity:0}}\n`;
  });

  const ly = r1(gy + gh + 16);
  flatUi += `<text x="${W - 140}" y="${ly + 9}" font-size="9.5" text-anchor="end" class="dim">menos</text>` + shades.map((c, i) => `<rect x="${W - 132 + i * 15}" y="${ly}" width="${S}" height="${S}" rx="2.5" fill="${c}"/>`).join('') + `<text x="${W - 54}" y="${ly + 9}" font-size="9.5" class="dim">mais</text>`;

  // evolução por ano
  const years = data.years ?? [], ymax = Math.max(1, ...years.map(([, v]) => v));
  const ey0 = 440, base = H - 52, bh = 80, cw = (W - 48) / Math.max(1, years.length);
  let evo = years.length ? `<line x1="24" x2="${W - 24}" y1="${ey0 - 14}" y2="${ey0 - 14}" stroke="${t.line}"/>
<text x="24" y="${ey0 + 6}" font-size="10.5" font-weight="700" fill="${t.text}" letter-spacing="1">EVOLUÇÃO POR ANO</text>
<text x="${W - 24}" y="${ey0 + 6}" font-size="10" text-anchor="end" class="dim">${years[0][0]} → ${years[years.length - 1][0]}: ×${Math.round(years[years.length - 1][1] / Math.max(1, years[0][1]))}</text>
<line x1="24" x2="${W - 24}" y1="${base}" y2="${base}" stroke="${t.line2}"/>` : '';
  years.forEach(([y, v], i) => {
    const h = Math.max(3, r1((v / ymax) * bh)), x = r1(24 + i * cw + cw / 2 - 26), cur = i === years.length - 1;
    const growth = i ? `×${(v / Math.max(1, years[i - 1][1])).toFixed(1).replace('.', ',')}` : '';
    evo += `<rect x="${x}" y="${r1(base - h)}" width="52" height="${h}" rx="4" fill="${ramp(0.25 + (i / Math.max(1, years.length - 1)) * 0.75)}" class="yr" style="animation-delay:${r1(0.3 + i * 0.15)}s"/>
<text x="${r1(x + 26)}" y="${r1(base - h - 8)}" font-size="11" font-weight="700" text-anchor="middle" fill="${t.text}" class="yl" style="animation-delay:${r1(0.8 + i * 0.15)}s">${v.toLocaleString('pt-BR')}</text>
<text x="${r1(x + 26)}" y="${base + 16}" font-size="10.5" text-anchor="middle" class="dim">${y}${cur ? '*' : ''}</text>
${growth ? `<text x="${r1(x - cw / 2 + 26)}" y="${r1(base - 18)}" font-size="9.5" text-anchor="middle" fill="${GH[t.name === 'dark' ? 4 : 3]}">${growth}</text>` : ''}`;
  });
  const defs = `<linearGradient id="beamG" x1="0" x2="1"><stop offset="0" stop-color="${GH[4]}" stop-opacity="0"/><stop offset=".5" stop-color="${GH[4]}" stop-opacity="${t.name === 'dark' ? 0.22 : 0.18}"/><stop offset="1" stop-color="${GH[4]}" stop-opacity="0"/></linearGradient>
<clipPath id="gridClip"><rect x="${gx - 4}" y="${gy - 4}" width="${r1(gw + 8)}" height="${r1(gh + 8)}"/></clipPath>`;
  const body = `${frame({ w: W, h: H, t, label: `activity — atualizado em ${today}` })}
${tileEls}
<g class="flatui">${flatUi}</g>${flat}
<g clip-path="url(#gridClip)"><rect class="beam" x="${gx - 80}" y="${gy - 4}" width="80" height="${r1(gh + 8)}" fill="url(#beamG)"/></g>
${city}<g class="cityui">${cityUi}</g>
${debris}
<rect class="flash" x="1" y="140" width="${W - 2}" height="250" fill="${t.text}"/>
${evo}
<text x="24" y="${H - 14}" font-size="9.5" class="dim">últimos 12 meses em duas visões: calendário ↔ cidade · * ano em andamento · atualizado todo dia pelo GitHub Actions</text>`;
  return doc({ w: W, h: H, t, title: 'Atividade no GitHub: calendário e cidade 3D', css, defs, body, fonts: ['mono', 'monoBold'] });
}
