#!/usr/bin/env node
// Element-level screenshots of the chapter components (for visual review).
import { launch } from './lib/browser.mjs';
import fs from 'node:fs';
import { serve } from './lib/serve.mjs';
import path from 'node:path';
const served = process.argv[2] ? null : await serve(path.resolve('dist'));
const base = process.argv[2] ?? served.url;
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
  // dictionary: hover tooltip on a person (mouse), then open the card
  await page.locator('[data-evidence-toggle]').click(); // back off
  const person = page.locator('.lead a.dx-person').first();
  await person.scrollIntoViewIfNeeded();
  if (w > 700) {
    await person.hover();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${out}/dx-tooltip-${w}-${scheme}.png`, clip: await clipAround(page, person) });
  }
  await person.click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${out}/dx-card-${w}-${scheme}.png` });
  await page.keyboard.press('Escape');
  const debates = page.locator('.sec-12 .sec-body');
  await debates.scrollIntoViewIfNeeded();
  await debates.screenshot({ path: `${out}/debates-${w}-${scheme}.png` });
}
await browser.close();
async function clipAround(page, loc) {
  const b = await loc.boundingBox();
  const vp = page.viewportSize();
  const x = Math.max(0, b.x - 200), y = Math.max(0, b.y - 170);
  return { x, y, width: Math.min(vp.width - x, 520), height: Math.min(vp.height - y, 260) };
}
served?.server.close();
console.log('crops written to', out);
