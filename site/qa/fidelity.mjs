#!/usr/bin/env node
// Content-fidelity spot check: N random passages (sentences of ≥ 50 characters) from the Markdown of every
// built chapter must appear verbatim, after whitespace normalisation, in the rendered page text.
// Usage: node qa/fidelity.mjs [N=10 | all] [seed]
import fs from 'node:fs';
import path from 'node:path';
import { parseMd, mdText } from '../scripts/lib/markdown.mjs';
import { BUILT_ERAS } from '../scripts/lib/scope.mjs';

const ALL = process.argv[2] === 'all';
const N = ALL ? Infinity : +(process.argv[2] ?? 10);
let seed = +(process.argv[3] ?? Date.now() % 100000);
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const periods = JSON.parse(fs.readFileSync('src/content/generated/periods.json', 'utf8'));
const norm = (s) => s.replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
const pageText = (h) => norm(decode(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<span class="gl-tip"[\s\S]*?<\/span><\/span>/g, '').replace(/<p[^>]*\sdata-ui[^>]*>[\s\S]*?<\/p>/g, ' ').replace(/<\/?(p|li|div|dt|dd|td|th|h[1-6]|tr|section|figcaption|summary|ol|ul|dl|table)\b[^>]*>/g, ' ').replace(/<[^>]+>/g, '')));

let fails = 0;
const report = [];
for (const slug of BUILT_ERAS) {
  const p = periods.find((x) => x.slug === slug);
  const md = fs.readFileSync(path.resolve('..', p.file), 'utf8').replace(/<!-- IMAGES:START -->[\s\S]*?<!-- IMAGES:END -->/g, '');
  const text = pageText(fs.readFileSync(`dist/eras/${slug}/index.html`, 'utf8'));
  // passages: text of paragraphs, list items and table cells, split into sentences
  const units = [];
  (function visit(n) {
    if (['paragraph', 'tableCell'].includes(n.type)) units.push(mdText(n));
    else n.children?.forEach(visit);
  })(parseMd(md));
  const sentences = units
    .flatMap((u) => norm(u).split(/\s*↓?\s*\b(?:BEFORE|PRESSURES|TRANSITION|AFTER)(?: \([^)]*\))?:\s*/))
    .flatMap((u) => u.split(/(?<=[.;!?])\s+(?=[A-Z"(])/))
    .map((s) => s.replace(/^(BEFORE|PRESSURES|TRANSITION|AFTER)(\s\([^)]*\))?:\s*/, '').replace(/\s*↓\s*/g, ' ').trim())
    .filter((s) => s.length >= 50 && !/^What the constitution said vs how power actually worked:$/.test(s));
  const picks = ALL ? sentences : Array.from({ length: N }, () => sentences[Math.floor(rand() * sentences.length)]);
  for (const s of picks) {
    const ok = text.includes(norm(s));
    report.push({ slug, ok, passage: s });
    if (!ok) fails++;
    console.log(`${ok ? '✔' : '✖'} [${slug}] ${s.length > 110 ? s.slice(0, 107) + '…' : s}`);
  }
}
console.log(`${fails ? '✖' : '✔'} fidelity: ${report.length - fails}/${report.length} passages found verbatim (seed ${process.argv[3] ?? 'random'})`);
fs.mkdirSync('qa/reports', { recursive: true });
fs.writeFileSync('qa/reports/fidelity.json', JSON.stringify(report, null, 1));
process.exit(fails ? 1 : 0);
