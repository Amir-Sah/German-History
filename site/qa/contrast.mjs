#!/usr/bin/env node
// WCAG contrast of every text/background token pair used by the stylesheet, in light and dark, for the
// default (Archive) tokens and each reviewed mood. Complements axe, which cannot measure text drawn over
// gradients (the image fallback) or next to pseudo-elements.
import { launch } from './lib/browser.mjs';
import { serve } from './lib/serve.mjs';
import path from 'node:path';

const PAIRS = [
  // [foreground, background, minimum ratio, where]
  ['--ink', '--paper', 4.5, 'body text'], ['--ink-2', '--paper', 4.5, 'secondary text'], ['--muted', '--paper', 4.5, 'captions, notes'],
  ['--muted', '--paper-2', 4.5, 'footer, fallback card'], ['--ink-2', '--paper-2', 4.5, 'table heads, fallback'], ['--ink', '--paper-2', 4.5, 'fallback title'],
  ['--link', '--paper', 4.5, 'links'], ['--link', '--era-tint', 4.5, 'links in panels'], ['--link', '--paper-2', 4.5, 'links in fallback'],
  ['--era-accent', '--paper', 4.5, 'kickers, dates'], ['--era-accent', '--era-tint', 4.5, 'panel headings'],
  ['--era-accent-2', '--paper', 4.5, 'panel labels'], ['--era-accent-2', '--era-tint', 4.5, '"How power worked" heading'],
  ['--muted', '--era-tint', 4.5, 'notes in panels'], ['--ink', '--era-tint', 4.5, 'panel text'],
  ['--paper', '--ink', 4.5, '"5 things" card'], ['--era-line', '--ink', 3, '"5 things" numerals (large)'], ['--paper', '--era-accent', 4.5, 'current chapter bar'],
  ['--c-high', '--c-high-bg', 4.5, 'HIGH'], ['--c-medium', '--c-medium-bg', 4.5, 'MEDIUM'], ['--c-uncertain', '--c-uncertain-bg', 4.5, 'UNCERTAIN'],
  ['--c-contested', '--c-contested-bg', 4.5, 'CONTESTED'], ['--c-rejected', '--c-rejected-bg', 4.5, 'REJECTED'], ['--c-contested', '--paper', 4.5, 'rail heading'],
];

const { server, url } = await serve(path.resolve('dist'));
const browser = await launch();
let bad = 0;
for (const scheme of ['light', 'dark']) {
  for (const mood of ['', 'mood-weimar']) {
    const page = await (await browser.newContext({ colorScheme: scheme })).newPage();
    await page.goto(url + '/eras/');
    const res = await page.evaluate(({ PAIRS, mood }) => {
      if (mood) document.body.classList.add(mood);
      const probe = document.createElement('div');
      document.body.append(probe);
      const rgb = (v, prop = 'color') => { probe.style[prop] = `var(${v})`; return getComputedStyle(probe)[prop].match(/[\d.]+/g).slice(0, 3).map(Number); };
      const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      return PAIRS.map(([fg, bg, min, where]) => {
        const a = lum(rgb(fg)), b = lum(rgb(bg, 'backgroundColor'));
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        return { fg, bg, min, where, ratio: Math.round(ratio * 100) / 100 };
      });
    }, { PAIRS, mood });
    for (const r of res) if (r.ratio < r.min) { bad++; console.log(`✖ ${scheme} ${mood || 'archive'}: ${r.fg} on ${r.bg} = ${r.ratio} (< ${r.min}) — ${r.where}`); }
    const worst = res.reduce((m, r) => (r.ratio / r.min < m.ratio / m.min ? r : m));
    console.log(`  ${scheme.padEnd(5)} ${(mood || 'archive').padEnd(12)} lowest margin: ${worst.fg} on ${worst.bg} = ${worst.ratio}`);
    await page.close();
  }
}
await browser.close();
server.close();
console.log(`${bad ? '✖' : '✔'} contrast: ${PAIRS.length} token pairs × 4, ${bad} below WCAG AA`);
process.exit(bad ? 1 : 0);
