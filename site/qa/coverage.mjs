#!/usr/bin/env node
// Coverage: does every period, theme, image, audit claim and Journey Part of the knowledge base appear
// on the site? In this build stage (vertical slice) missing items are reported; with --final they fail.
// For every BUILT chapter the check is strict: all 14 sections, every image, every misconception,
// debate, confidence row, source and all 5 things must be on the page.
import fs from 'node:fs';
import path from 'node:path';
import { builtPages } from './lib/serve.mjs';

const final = process.argv.includes('--final');
const g = (n) => JSON.parse(fs.readFileSync(`src/content/generated/${n}.json`, 'utf8'));
const periods = g('periods'), images = g('images'), audit = g('audit'), report = g('report');
const pages = builtPages(path.resolve('dist'));
const html = Object.fromEntries(pages.map((p) => [p, fs.readFileSync(path.join('dist', p, 'index.html'), 'utf8')]));
const all = Object.values(html).join('\n');
let strictFails = 0;
const count = (h, re) => (h.match(re) ?? []).length;

for (const p of periods) {
  const h = html[`/eras/${p.slug}/`];
  if (!h) continue;
  const blocks = p.sections.flatMap((s) => s.blocks);
  const expect = {
    sections: [count(h, /<details class="sec /g), 13],
    images: [p.images.filter((i) => h.includes(`id="img-${i.id}"`)).length, p.images.length],
    misconceptions: [count(h, /<li class="myth"/g), blocks.find((b) => b.type === 'misconceptions').items.length],
    debates: [count(h, /<li class="debate(?!-sub)/g), blocks.find((b) => b.type === 'debates')?.items.length ?? 0],
    confidenceRows: [count(h, /<td class="conf-cell">/g), blocks.find((b) => b.type === 'confidence').rows.length],
    sources: [count(h, /<ul class="sources">[\s\S]*?<\/ul>/g) ? count(h.match(/<ul class="sources">[\s\S]*?<\/ul>/)[0], /<li>/g) : 0, blocks.find((b) => b.type === 'sources').items.length],
    fiveThings: [count(h.match(/<section class="five"[\s\S]*?<\/section>/)?.[0] ?? '', /<li>/g), 5],
    transitionSteps: [count(h, /<li class="flow-step/g), 4],
    matrixRows: [count(h, /<div class="matrix-row">/g), p.matrix ? 12 : 0],
    constitution: [count(h, /<section class="constitution"/g), 1],
  };
  // image frames use the measured proportions (a silent fallback to 4:3 went unnoticed once)
  const layout = JSON.parse(fs.readFileSync('src/content/generated/image-layout.json', 'utf8')).sizes;
  const wrongRatio = p.images.filter((i) => {
    const size = layout[i.id];
    if (!size) return false;
    const want = Math.min(21 / 9, Math.max(4 / 5, size[0] / size[1])).toFixed(4);
    return !h.includes(`id="img-${i.id}"><div class="fig-media`) || !new RegExp(`id="img-${i.id}"><div[^>]*aspect-ratio:${want}`).test(h);
  });
  expect.imageProportions = [p.images.length - wrongRatio.length, p.images.length];
  for (const [k, [got, want]] of Object.entries(expect)) {
    if (got !== want) { strictFails++; console.log(`✖ ${p.slug}: ${k} ${got}/${want}`); }
  }
  console.log(`✔ ${p.slug}: all template elements present`);
}

// The Journey (home): 10 Parts, each with its images, 5-things box (Parts 1–9), Details links; the mental map
// verbatim, with every node linked.
const journey = g('journey');
let journeyOk = 0;
{
  const h = html['/'] ?? '';
  const dec = (x) => x.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const pre = h.match(/<pre class="map-ascii">([\s\S]*?)<\/pre>/)?.[1];
  const mapOk = pre !== undefined && dec(pre) === journey.map.ascii;
  const nodesLinked = count(pre ?? '', /<a class="map-node"/g);
  if (!mapOk) { strictFails++; console.log('✖ journey: mental map text differs from the knowledge base'); }
  if (nodesLinked !== journey.map.nodes.length) { strictFails++; console.log(`✖ journey: ${nodesLinked}/${journey.map.nodes.length} map nodes linked`); }
  for (const p of journey.parts) {
    const sec = h.match(new RegExp(`<section[^>]*id="${p.id}"[\\s\\S]*?(?=<section[^>]*class="part|<footer class="wrap journey-end|$)`))?.[0] ?? '';
    const want = {
      images: [p.images.filter((i) => sec.includes(`id="img-${i.id}"`)).length, p.images.length],
      fiveThings: [count(sec.match(/<section class="five"[\s\S]*?<\/section>/)?.[0] ?? '', /<li>/g), p.five ? 5 : 0],
      details: [count(sec.match(/<nav class="part-details"[\s\S]*?<\/nav>/)?.[0] ?? '', /<li>/g), p.details.length],
    };
    let ok = !!sec;
    for (const [k, [got, w]] of Object.entries(want)) if (got !== w) { ok = false; strictFails++; console.log(`✖ journey part ${p.n}: ${k} ${got}/${w}`); }
    if (ok) journeyOk++;
  }
  if (mapOk && journeyOk === journey.parts.length) console.log(`✔ journey: mental map verbatim (${nodesLinked} nodes linked), ${journeyOk} Parts complete`);
}

const missing = {
  periods: periods.filter((p) => !html[`/eras/${p.slug}/`]).map((p) => p.file),
  images: images.filter((i) => !all.includes(`id="img-${i.id}"`)).map((i) => i.id),
  auditClaims: audit.filter((c) => !all.includes(`id="claim-${c.n}"`)).map((c) => c.n),
};
const pending = { themes: report.counts.themes, journeyParts: journey.parts.length - journeyOk }; // pages not yet built in this stage
console.log(`\nCoverage of the knowledge base in this build:`);
console.log(`  periods      ${periods.length - missing.periods.length}/${periods.length}`);
console.log(`  images       ${images.length - missing.images.length}/${images.length}`);
console.log(`  audit claims ${audit.length - missing.auditClaims.length}/${audit.length}`);
console.log(`  themes       0/${pending.themes} (rollout)`);
console.log(`  Journey      ${journeyOk}/${journey.parts.length} Parts`);
fs.mkdirSync('qa/reports', { recursive: true });
fs.writeFileSync('qa/reports/coverage.json', JSON.stringify({ missing, pending }, null, 1));
const incomplete = missing.periods.length + missing.images.length + missing.auditClaims.length + pending.themes + pending.journeyParts;
if (strictFails || (final && incomplete)) { console.log('✖ coverage'); process.exit(1); }
console.log(`✔ coverage: built chapters complete${incomplete ? '; the rest is listed for the rollout (use --final to require everything)' : ''}`);
