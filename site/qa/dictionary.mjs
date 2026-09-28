#!/usr/bin/env node
// Inline dictionary checks (SITE_CHANGELOG_AND_TASKS.md C5) on every built chapter:
//  1. no highlight inside headings, links, image credits or code;
//  2. every entry the build matched for the chapter is highlighted on the page (nothing lost in rendering),
//     and every suppression in data/dictionary-overrides.json still matches something (no stale overrides);
//  3. keyboard: focus shows the tooltip, Enter opens the card (a modal dialog), Esc closes it and focus returns;
//  4. touch: the first tap opens the card directly;
//  5. "Highlight names & terms" off → words are plain and out of the tab order, and the choice persists;
//  6. axe on the page with the card open.
import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { launch } from './lib/browser.mjs';
import { serve } from './lib/serve.mjs';
import { BUILT_ERAS } from '../scripts/lib/scope.mjs';

const periods = JSON.parse(fs.readFileSync('src/content/generated/periods.json', 'utf8'));
const overrides = JSON.parse(fs.readFileSync('data/dictionary-overrides.json', 'utf8')).suppress;
let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? '✔' : '✖'} ${msg}`); if (!ok) fails++; };

// 2b. stale overrides: the suppressed form must occur in that chapter's text
const raw = (f) => fs.readFileSync(path.resolve('..', f), 'utf8');
const stale = overrides.filter((o) => o.chapter !== '*' && !raw(o.chapter).includes(o.form));
check(stale.length === 0, `overrides: ${overrides.length} suppressions, ${stale.length} stale${stale.length ? ': ' + stale.map((o) => `${o.form}@${o.chapter}`).join(', ') : ''}`);

const { server, url } = await serve(path.resolve('dist'));
const browser = await launch();
for (const slug of BUILT_ERAS) {
  const p = periods.find((x) => x.slug === slug);
  const P = `/eras/${slug}/`;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url + P);

  const bad = await page.$$eval('h1 a.dx, h2 a.dx, h3 a.dx, h4 a.dx, h5 a.dx, h6 a.dx, summary a.dx, a a.dx, .fig-credit a.dx, code a.dx, .xref a.dx', (els) => els.map((e) => e.textContent));
  check(bad.length === 0, `${slug}: no highlight in headings, links, credits or code${bad.length ? ' — found: ' + bad.join(', ') : ''}`);

  // Highlights must flow inline with the text: a direct child of a grid/flex container becomes its own cell
  // (this broke the "5 things" card once).
  const inLayout = await page.$$eval('a.dx', (els) => els.filter((a) => /grid|flex/.test(getComputedStyle(a.parentElement).display)).map((a) => `${a.textContent} in ${a.parentElement.tagName.toLowerCase()}.${a.parentElement.className}`));
  check(inLayout.length === 0, `${slug}: no highlight is a direct child of a grid/flex container${inLayout.length ? ' — ' + [...new Set(inLayout)].slice(0, 5).join('; ') : ''}`);

  const onPage = new Set(await page.$$eval('a.dx', (els) => els.map((e) => e.dataset.dx)));
  const missing = p.dictionaryUsed.filter((id) => !onPage.has(id));
  const counts = await page.$$eval('a.dx', (els) => ['person', 'place', 'term'].map((k) => els.filter((e) => e.classList.contains(`dx-${k}`)).length));
  check(missing.length === 0, `${slug}: all ${p.dictionaryUsed.length} matched entries highlighted (${counts[0]} person, ${counts[1]} place, ${counts[2]} term marks)${missing.length ? ' — missing ' + missing.join(', ') : ''}`);
  const described = await page.$$eval('a.dx', (els) => els.every((e) => document.getElementById(e.getAttribute('aria-describedby'))?.textContent.trim()));
  check(described, `${slug}: every highlight has a screen-reader description (aria-describedby)`);

  // 3. keyboard
  const first = page.locator('.lead a.dx').first();
  await first.focus();
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); // focus via keyboard → :focus-visible
  check(await page.isVisible('#dx-tooltip'), `${slug}: keyboard focus shows the tooltip`);
  const tipBox = await page.locator('#dx-tooltip').boundingBox();
  const wordBox = await first.boundingBox();
  const overlap = !(tipBox.y + tipBox.height <= wordBox.y || tipBox.y >= wordBox.y + wordBox.height || tipBox.x + tipBox.width <= wordBox.x || tipBox.x >= wordBox.x + wordBox.width);
  check(!overlap && tipBox.x >= 0 && tipBox.x + tipBox.width <= 1280, `${slug}: tooltip does not cover the word and stays on screen`);
  await page.keyboard.press('Enter');
  check(await page.evaluate(() => document.getElementById('dx-card').open && document.getElementById('dx-card').contains(document.activeElement)), `${slug}: Enter opens the card and moves focus into it`);
  const axe = await new AxeBuilder({ page }).include('#dx-card').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  check(axe.violations.length === 0, `${slug}: axe on the open card: ${axe.violations.map((v) => v.id).join(', ') || '0 violations'}`);
  await page.keyboard.press('Escape');
  const back = await page.evaluate(() => !document.getElementById('dx-card').open && document.activeElement?.matches('.lead a.dx'));
  check(back, `${slug}: Esc closes the card and returns focus to the word`);

  // 5. highlight toggle
  await page.click('[data-highlight-toggle]');
  const plain = await page.$eval('.lead a.dx', (a) => a.getAttribute('tabindex') === '-1' && getComputedStyle(a).textDecorationLine === 'none');
  await page.reload();
  const persisted = await page.evaluate(() => document.documentElement.classList.contains('dx-off'));
  check(plain && persisted, `${slug}: "Highlight names & terms" off makes words plain and out of the tab order, and persists`);
  await page.click('[data-highlight-toggle]');
  await ctx.close();

  // 4. touch
  const t = await browser.newContext({ viewport: { width: 375, height: 800 }, hasTouch: true, isMobile: true });
  const tp = await t.newPage();
  await tp.goto(url + P);
  await tp.locator('.lead a.dx').first().tap();
  await tp.waitForTimeout(200);
  const sheet = await tp.evaluate(() => { const d = document.getElementById('dx-card'); const r = d.getBoundingClientRect(); return d.open && Math.round(r.bottom) >= innerHeight - 1; });
  check(sheet, `${slug}: first tap on a phone opens the card as a bottom sheet`);
  await t.close();
}
await browser.close();
server.close();
console.log(`${fails ? '✖' : '✔'} dictionary: ${fails} failure(s)`);
process.exit(fails ? 1 : 0);
