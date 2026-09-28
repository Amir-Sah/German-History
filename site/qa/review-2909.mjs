#!/usr/bin/env node
// Checks for the review points of 29 Sept 2026 (kept as a regression test).
import path from 'node:path';
import { launch } from './lib/browser.mjs';
import { serve } from './lib/serve.mjs';

const { server, url } = await serve(path.resolve('dist'));
const b = await launch();
let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? '✔' : '✖'} ${msg}`); if (!ok) fails++; };
const out = 'qa/reports/crops';

// 1. home ribbon on phone and tablet widths
for (const w of [360, 600, 768]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 800 } })).newPage();
  await p.goto(url + '/');
  const tw = await p.$eval('.ribbon-track', (el) => el.getBoundingClientRect().width);
  check(tw > w * 0.7, `home ribbon at ${w}px: track ${Math.round(tw)}px wide`);
  if (w === 360) await p.locator('.site-header').screenshot({ path: `${out}/home-ribbon-360.png` });
  await p.context().close();
}

// 2, 3, 8a: Hitler's card
{
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await p.goto(url + '/eras/weimar-republic/');
  await p.locator('.lead a.dx[data-dx="adolf-hitler"]').first().click();
  await p.waitForTimeout(200);
  const chips = await p.$$eval('#dx-card [data-f="also"] .chip', (els) => els.map((e) => ({ t: e.textContent, hidden: e.hidden })));
  const shown = chips.filter((c) => !c.hidden).length;
  const bad = chips.filter((c) => /Image Index|Research Method|README|Bibliography/i.test(c.t));
  check(shown <= 6 && bad.length === 0, `card "Also in": ${shown} shown of ${chips.length}, non-chapters: ${bad.map((c) => c.t).join(', ') || 'none'}`);
  const moreTxt = await p.$eval('#dx-card [data-f="also-more"]', (e) => (e.hidden ? '' : e.textContent));
  check(chips.length <= 6 || /^Show all \(\d+\)$/.test(moreTxt), `"Show all" button: "${moreTxt}"`);
  check(await p.$eval('#dx-card [data-f="main"]', (e) => /coming soon/i.test(e.textContent)), 'unbuilt main chapter shows "coming soon"');
  const metaGap = await p.$eval('#dx-card .dx-card-meta', (m) => [...m.children].filter((c) => getComputedStyle(c).display !== 'none')[0]?.getBoundingClientRect().left - m.getBoundingClientRect().left);
  check(metaGap < 1, `date line starts flush (offset ${metaGap}px)`);
  const basisHidden = await p.$eval('#dx-card [data-f="basis"]', (e) => getComputedStyle(e).display === 'none');
  check(basisHidden, 'KB/KB+K tag hidden while "How do we know?" is off');
  await p.screenshot({ path: `${out}/card-hitler-1280.png` });
  await p.keyboard.press('Escape');
  await p.click('[data-evidence-toggle]');
  await p.locator('.lead a.dx[data-dx="adolf-hitler"]').first().click();
  check(await p.$eval('#dx-card [data-f="basis"]', (e) => getComputedStyle(e).display !== 'none'), 'KB/KB+K tag shown when "How do we know?" is on');
  // 4. compounds and ordinary words
  const moscow = await p.$$eval('a.dx', (els) => els.filter((a) => /Moscow/.test(a.textContent)).map((a) => a.textContent));
  check(moscow.every((t) => t === 'Moscow'), `compound: links read ${JSON.stringify(moscow)}`);
  // Derived words are dropped from matching (CONTENT_TRACE D3) unless ambiguous_forms.md maps them explicitly for the
  // chapter — in the Weimar chapter "tolerated" is mapped to "toleration" (the SPD's toleration of Brüning), so it stays.
  const fs = await import('node:fs');
  const table = fs.readFileSync('../dictionary/ambiguous_forms.md', 'utf8');
  const dict = JSON.parse(fs.readFileSync('src/content/generated/dictionary.json', 'utf8')).entries;
  const byId = new Map(dict.map((e) => [e.id, e]));
  const marks = await p.$$eval('a.dx', (els) => els.map((a) => [a.textContent, a.dataset.dx]));
  const unexplained = marks.filter(([t, id]) => !byId.get(id).matchForms.includes(t) && !table.includes(`| ${t} | \`twentieth_century/02_weimar_republic.md\` |`));
  check(unexplained.length === 0, `every highlight uses a matched form or an explicit table row${unexplained.length ? ': ' + unexplained.map((m) => m[0]).join(', ') : ''}`);
  await p.context().close();
}

// 5, 6: dictionary search on a phone; basis tags hidden by default
{
  const p = await (await b.newContext({ viewport: { width: 375, height: 740 } })).newPage();
  await p.goto(url + '/dictionary/');
  await p.fill('#dict-q', 'brüning');
  await p.waitForTimeout(600);
  const first = p.locator('.dict-result-list li').first();
  const box = await first.boundingBox();
  check(box && box.y + box.height < 740, `phone search: first result on screen (y=${box && Math.round(box.y)})`);
  check(await p.$eval('.dict-letters', (e) => getComputedStyle(e).display === 'none'), 'letter grid hidden while searching');
  await p.screenshot({ path: `${out}/dict-search-375.png` });
  const href = await first.locator('a').getAttribute('href');
  await p.goto(url + href);
  const id = href.split('#')[1];
  const vis = await p.$eval(`[id="${id}"]`, (e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight; });
  check(vis, `result link opens the letter page at the entry (${href})`);
  const basisVisible = await p.$$eval('.dict-entry .ev-only', (els) => els.filter((e) => getComputedStyle(e).display !== 'none').length);
  check(basisVisible === 0, 'letter page: KB/KB+K tags hidden while "How do we know?" is off');
  const nodes = await p.evaluate(() => document.getElementsByTagName('*').length);
  check(nodes < 8000, `letter page element count ${nodes}`);
  await p.goto(url + '/dictionary/#adolf-hitler');
  await p.waitForURL(/\/dictionary\/a\/#adolf-hitler/, { timeout: 5000 }).catch(() => {});
  check(p.url().endsWith('/dictionary/a/#adolf-hitler'), `old link forwarded → ${p.url().replace(url, '')}`);
  await p.context().close();
}
await b.close();
server.close();
console.log(`${fails ? '✖' : '✔'} review 29 Sept: ${fails} failure(s)`);
process.exit(fails ? 1 : 0);
