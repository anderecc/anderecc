// Gera todos os SVGs do README em assets/ (dark + light) e injeta o skyline 3D (STL) no README.
// Uso: node scripts/build.mjs [seção]   — a seção de atividade usa GITHUB_TOKEN (ou `gh auth token`)
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { THEMES, ROOT } from './lib/core.mjs';
import { hero } from './sections/hero.mjs';
import { whoami } from './sections/whoami.mjs';
import { stack } from './sections/stack.mjs';
import { flow } from './sections/flow.mjs';
import { cards } from './sections/cards.mjs';
import { edu, CERTS } from './sections/edu.mjs';
import { buttons } from './sections/buttons.mjs';
import { activity, fetchContrib, skylineStl } from './sections/activity.mjs';

const OUT = join(ROOT, 'assets');
mkdirSync(OUT, { recursive: true });
const only = process.argv[2];

const data = !only || ['activity', 'whoami', 'stl'].includes(only) ? await fetchContrib() : null;

const sections = { hero, ...buttons, whoami: (t) => whoami(t, data ?? {}), stack, flow, ...cards, edu };
if (data) sections.activity = (t) => activity(t, data);
else console.warn('! sem token/dados: mantendo assets/activity-* existentes');

for (const [name, fn] of Object.entries(sections)) {
  if (only && only !== name) continue;
  for (const t of Object.values(THEMES)) {
    const svg = fn(t);
    writeFileSync(join(OUT, `${name}-${t.name}.svg`), svg);
    console.log(`✓ assets/${name}-${t.name}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
  }
}

// blocos gerados dentro do README, entre <!-- nome:start --> e <!-- nome:end -->
const readme = join(ROOT, 'README.md');
let md = readFileSync(readme, 'utf8');
const inject = (name, content) => {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (re.test(md)) md = md.replace(re, (_, a, b) => `${a}\n${content}\n${b}`);
};
inject('certs', ['| curso | instrutor | horas | |', '|:--|:--|--:|:-:|',
  ...CERTS.map(([n, h, by, id]) => `| ${n} | ${by} | ${String(h).replace('.', ',')}h | [ver ↗](https://www.udemy.com/certificate/${id}/) |`)].join('\n'));
// skyline 3D interativo: o GitHub renderiza ```stl com viewer que gira no mouse
if (data && (!only || only === 'stl')) {
  const { stl, triangles } = skylineStl(data);
  inject('skyline', `\n\`\`\`stl\n${stl}\n\`\`\`\n`);
  console.log(`✓ README.md skyline STL  ${triangles} triângulos, ${(stl.length / 1024).toFixed(1)} KB`);
}
writeFileSync(readme, md);
