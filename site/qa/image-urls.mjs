#!/usr/bin/env node
// Do all 72 hotlinked images in images/IMAGE_INDEX.md render? Loads each as an <img> in Chromium (as a reader's
// browser would, with referrer suppressed like the site) and checks its decoded size. Nothing is saved to disk.
// Source-page links are reported for information only: they open in the reader's browser, and the
// environment running QA may not be allowed to reach them.
import fs from 'node:fs';
import { launch } from './lib/browser.mjs';

const images = JSON.parse(fs.readFileSync('src/content/generated/images.json', 'utf8'));
const browser = await launch();
const page = await (await browser.newContext()).newPage();
await page.setContent('<!doctype html><body></body>');
const results = await page.evaluate(async (imgs) => {
  const load = (im) =>
    new Promise((resolve) => {
      const el = new Image();
      el.referrerPolicy = 'no-referrer';
      const t = setTimeout(() => resolve({ id: im.id, ok: false, why: 'timeout' }), 45000);
      el.onload = () => { clearTimeout(t); resolve({ id: im.id, ok: el.naturalWidth > 0, w: el.naturalWidth, h: el.naturalHeight }); };
      el.onerror = () => { clearTimeout(t); resolve({ id: im.id, ok: false, why: 'error' }); };
      el.src = im.url;
    });
  const out = [];
  for (let i = 0; i < imgs.length; i += 8) out.push(...(await Promise.all(imgs.slice(i, i + 8).map(load))));
  return out;
}, images.map((i) => ({ id: i.id, url: i.url })));
await browser.close();

let bad = 0;
for (const r of results) if (!r.ok) { bad++; console.log(`✖ ${r.id}: ${r.why}`); }
const byHost = {};
for (const im of images) { const h = new URL(im.url).host; const r = results.find((x) => x.id === im.id); byHost[h] ??= [0, 0]; byHost[h][1]++; if (r.ok) byHost[h][0]++; }
for (const [h, [ok, n]] of Object.entries(byHost)) console.log(`  ${h.padEnd(34)} ${ok}/${n}`);
fs.mkdirSync('qa/reports', { recursive: true });
fs.writeFileSync('qa/reports/image-urls.json', JSON.stringify(results, null, 1));
// Record measured sizes so <img> gets exact width/height (no layout shift) and frames keep true proportions.
if (process.argv.includes('--write-sizes')) {
  const sizes = Object.fromEntries(results.filter((r) => r.ok).map((r) => [r.id, [r.w, r.h]]));
  fs.writeFileSync('data/image-sizes.json', JSON.stringify({ _about: 'Pixel sizes of the hotlinked images, measured by qa/image-urls.mjs --write-sizes. Layout metadata only.', measuredAt: new Date().toISOString().slice(0, 10), sizes }, null, 1) + '\n');
  console.log('  wrote data/image-sizes.json');
}
console.log(`${bad ? '✖' : '✔'} images: ${images.length - bad}/${images.length} hotlinked images render`);
process.exit(bad ? 1 : 0);
