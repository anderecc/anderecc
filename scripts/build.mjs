// Gera todos os SVGs do README em assets/ (dark + light) e os blocos gerados do README.
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
import { activity, fetchContrib } from './sections/activity.mjs';
import { sec } from './sections/sec.mjs';
import { builds } from './sections/builds.mjs';
import { principles } from './sections/principles.mjs';

const OUT = join(ROOT, 'assets');
mkdirSync(OUT, { recursive: true });
const only = process.argv[2];

const data = !only || ['activity', 'whoami'].includes(only) ? await fetchContrib() : null;

const sections = { hero, ...buttons, whoami: (t) => whoami(t, data ?? {}), principles, builds, stack, sec, flow, ...cards, edu };
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
writeFileSync(readme, md);
