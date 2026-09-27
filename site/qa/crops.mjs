#!/usr/bin/env node
// Element-level screenshots of the chapter components (for visual review).
import { launch } from './lib/browser.mjs';
import fs from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:4322';
const p = process.argv[3] ?? '/eras/weimar-republic/';
const out = 'qa/reports/crops';
fs.mkdirSync(out, { recursive: true });
const browser = await launch();
for (const [w, scheme] of [[1280, 'light'], [360, 'light'], [1280, 'dark']]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme })).newPage();
  await page.goto(base + p, { waitUntil: 'networkidle' });
  const shots = { constitution: '.constitution', context: '.era-context', flow: '.sec-8 .sec-body', myths: '.sec-11 .sec-body', debates: '.sec-12 .sec-body', five: '.five' };
  for (const [name, sel] of Object.entries(shots)) {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await el.screenshot({ path: `${out}/${name}-${w}-${scheme}.png` });
  }
  // interactions: flip first card, open §13, evidence layer, glossary tooltip
  await page.locator('[data-myth-turn]').first().click();
  await page.waitForTimeout(700);
  await page.locator('.sec-11 .sec-body').screenshot({ path: `${out}/myths-flipped-${w}-${scheme}.png` });
  await page.locator('[data-evidence-toggle]').click();
  await page.locator('.sec-13 > summary').click();
  await page.locator('.sec-14 > summary').click();
  await page.locator('.evidence-rail').screenshot({ path: `${out}/rail-${w}-${scheme}.png` });
  await page.locator('.sec-13 .sec-body').screenshot({ path: `${out}/confidence-${w}-${scheme}.png` });
  await page.locator('.sec-14 .sec-body').screenshot({ path: `${out}/sources-${w}-${scheme}.png` });
  const term = page.locator('.gl-term').first();
  await term.scrollIntoViewIfNeeded();
  await term.focus();
  await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
  await page.waitForTimeout(200);
  await page.locator('.constitution').screenshot({ path: `${out}/glossary-tip-${w}-${scheme}.png` });
}
await browser.close();
console.log('crops written to', out);
