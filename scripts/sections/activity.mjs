// Atividade: busca o calendário de contribuições (GraphQL) e desenha o calendário animado
// (entrada em onda + feixe varrendo) com contadores em odômetro.
import { execSync } from 'node:child_process';
import { doc, frame, frameCss, r1, mix } from '../lib/core.mjs';

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
  const W = 860, H = 340;
  const { weeks } = data;
  const fmtDate = (s) => s.split('-').reverse().slice(0, 2).join('/');
  const today = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // tiles com odômetro
  const tiles = [[data.total, 'contribuições', '12 meses'], [data.active, 'dias ativos', `de ${weeks.flat().length}`], [data.current, 'streak atual', 'dias'], [data.longest, 'maior streak', 'dias']];
  let odCss = '', tileEls = '';
  tiles.forEach(([v, a, b], i) => {
    const x = 24 + i * 206;
    const od = odometer(t, x + 18, 98, v, 28, 0.2 + i * 0.15);
    odCss = od.css;
    tileEls += `<rect x="${x}" y="48" width="194" height="82" rx="10" fill="${t.bg2}" stroke="${t.line}"/>
<rect x="${x}" y="48" width="3" height="82" rx="1.5" fill="${i ? t.line2 : t.c1}"/>
${od.out}
<text x="${x + 18}" y="116" font-size="11" class="dim">${a} · ${b}</text>`;
  });

  // calendário igual ao do GitHub: níveis por quartil, entrada em onda e um feixe varrendo
  const counts = weeks.flat().map((d) => d.contributionCount).filter(Boolean).sort((a, b) => a - b);
  const q = (p) => counts[Math.floor((counts.length - 1) * p)] ?? 1;
  const th = [q(0.25), q(0.5), q(0.75)];
  const level = (c) => (!c ? 0 : c <= th[0] ? 1 : c <= th[1] ? 2 : c <= th[2] ? 3 : 4);
  const empty = t.name === 'dark' ? '#161B22' : '#EBEEF2';
  const shades = [empty, mix(empty, t.c1, 0.3), mix(empty, t.c1, 0.52), mix(empty, t.c1, 0.76), t.c1];
  const S = 11.5, G = 3, gx = 56, gy = 176, P = S + G;
  let cells = '', months = '', last = '', bestCell = '';
  weeks.forEach((wk, w) => {
    const m = new Date(wk[0].date + 'T12:00:00Z').toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
    if (m !== last && w < weeks.length - 2) { months += `<text x="${r1(gx + w * P)}" y="${gy - 10}" font-size="10" class="dim">${m}</text>`; last = m; }
    wk.forEach((d) => {
      const x = r1(gx + w * P), y = r1(gy + d.weekday * P), lv = level(d.contributionCount);
      cells += `<rect x="${x}" y="${y}" width="${S}" height="${S}" rx="2.5" fill="${shades[lv]}" class="c" style="animation-delay:${r1(0.3 + w * 0.018 + d.weekday * 0.03)}s"><title>${d.contributionCount} em ${fmtDate(d.date)}</title></rect>`;
      if (d.date === data.best.date) bestCell = `<rect x="${x - 2}" y="${y - 2}" width="${S + 4}" height="${S + 4}" rx="4" stroke="${t.text}" stroke-width="1.2" class="best"/>`;
    });
  });
  const lastWk = weeks[weeks.length - 1], lastDay = lastWk[lastWk.length - 1];
  const tx = r1(gx + (weeks.length - 1) * P), ty = r1(gy + lastDay.weekday * P);
  const todayEl = `<rect x="${tx - 2}" y="${ty - 2}" width="${S + 4}" height="${S + 4}" rx="4" stroke="${t.c1}" class="ping"/>`;
  const days = [['seg', 1], ['qua', 3], ['sex', 5]].map(([s, d]) => `<text x="24" y="${r1(gy + d * P + 9)}" font-size="9.5" class="dim">${s}</text>`).join('');
  const gw = weeks.length * P, gh = 7 * P;
  const legend = shades.map((c, i) => `<rect x="${W - 132 + i * 15}" y="${H - 32}" width="${S}" height="${S}" rx="2.5" fill="${c}"/>`).join('');

  const css = `${frameCss}${odCss}
.c{transform-box:fill-box;transform-origin:center;animation:pop .5s cubic-bezier(.2,1.3,.4,1) backwards}
@keyframes pop{from{transform:scale(0);opacity:0}}
.beam{animation:beam 7s ease-in-out 1.6s infinite backwards}@keyframes beam{from{transform:translateX(-80px)}to{transform:translateX(${r1(gw + 80)}px)}}
.ping{transform-box:fill-box;transform-origin:center;animation:ping 2.2s ease-out infinite}@keyframes ping{0%{transform:scale(1);opacity:.9}80%,100%{transform:scale(1.9);opacity:0}}
.best{animation:fade 1s ease-out 1.5s backwards}@keyframes fade{from{opacity:0}}`;
  const defs = `<linearGradient id="beamG" x1="0" x2="1"><stop offset="0" stop-color="${t.c1}" stop-opacity="0"/><stop offset=".5" stop-color="${t.c1}" stop-opacity="${t.name === 'dark' ? 0.22 : 0.16}"/><stop offset="1" stop-color="${t.c1}" stop-opacity="0"/></linearGradient>
<clipPath id="gridClip"><rect x="${gx - 4}" y="${gy - 4}" width="${r1(gw + 8)}" height="${r1(gh + 8)}"/></clipPath>`;
  const body = `${frame({ w: W, h: H, t, label: `activity — atualizado em ${today}` })}
${tileEls}
${months}${days}${cells}${bestCell}${todayEl}
<g clip-path="url(#gridClip)"><rect class="beam" x="${gx - 80}" y="${gy - 4}" width="80" height="${r1(gh + 8)}" fill="url(#beamG)"/></g>
<text x="24" y="${H - 22}" font-size="9.5" class="dim">recorde: <tspan fill="${t.text}">${data.best.contributionCount}</tspan> em ${fmtDate(data.best.date)} · atualizado todo dia pelo GitHub Actions</text>
<text x="${W - 140}" y="${H - 22}" font-size="9.5" text-anchor="end" class="dim">menos</text>${legend}<text x="${W - 54}" y="${H - 22}" font-size="9.5" class="dim">mais</text>`;
  return doc({ w: W, h: H, t, title: 'Atividade no GitHub', css, defs, body, fonts: ['mono', 'monoBold'] });
}
