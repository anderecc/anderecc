// Botões de contato: pílulas com ícone e brilho passando (cada uma é um SVG pra poder ser link).
import { doc, icon, esc, CHAR } from '../lib/core.mjs';

const BUTTONS = {
  linkedin: { label: 'LinkedIn', mark: 'in', color: '#0A66C2' },
  email: { label: 'Email', icon: 'gmail' },
  instagram: { label: 'Instagram', icon: 'instagram' },
  github: { label: 'Follow', mark: '+', color: null },
};

function button(t, b, i) {
  const w = Math.round(52 + b.label.length * 12 * CHAR), h = 36;
  const col = b.icon ? icon(b.icon, t).color : (b.color ?? t.c1);
  const glyph = b.icon
    ? `<g transform="translate(14 9) scale(${18 / 24})"><path d="${icon(b.icon, t).d}" fill="${col}"/></g>`
    : `<rect x="14" y="9" width="18" height="18" rx="4" fill="${col}"/><text x="23" y="22.5" font-size="11" font-weight="700" text-anchor="middle" fill="#fff">${b.mark}</text>`;
  const css = `.sh{animation:sh 4s ease-in-out ${i * 0.5}s infinite}@keyframes sh{0%,60%{transform:translateX(-80px)}100%{transform:translateX(${w + 80}px)}}`;
  const defs = `<linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${t.name === 'dark' ? 0.12 : 0.5}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="c"><rect width="${w}" height="${h}" rx="18"/></clipPath>`;
  const body = `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="17.5" fill="${t.panel}" stroke="${t.line2}"/>
<g clip-path="url(#c)"><rect class="sh" x="0" y="0" width="60" height="${h}" fill="url(#g)" transform="skewX(-20)"/></g>
${glyph}<text x="40" y="22.5" font-size="12" font-weight="700">${esc(b.label)}</text>`;
  return doc({ w, h, t, title: b.label, css, defs, body, fonts: ['monoBold'] });
}

export const buttons = Object.fromEntries(Object.entries(BUTTONS).map(([k, b], i) => [`btn-${k}`, (t) => button(t, b, i)]));
