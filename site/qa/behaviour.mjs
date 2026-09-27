#!/usr/bin/env node
// Behaviour checks for the static-equivalent rules in the brief: keyboard use, reduced motion, no-JS,
// persistence of the "How do we know?" toggle, and the PUBLIC_BUILD variant (if dist-public/ exists).
import fs from 'node:fs';
import path from 'node:path';
import { launch } from './lib/browser.mjs';
import { serve } from './lib/serve.mjs';

const P = '/eras/weimar-republic/';
const { server, url } = await serve(path.resolve('dist'));
const browser = await launch();
let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? '✔' : '✖'} ${msg}`); if (!ok) fails++; };

// 1. Keyboard: turn a misconception card with Enter; focus moves to the correction; turn back.
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(url + P);
  const btn = page.locator('[data-myth-turn]').first();
  await btn.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  const focused = await page.evaluate(() => document.activeElement?.matches('[data-myth-back]'));
  const backInert = await page.evaluate(() => document.querySelector('[data-myth] .myth-back').inert);
  check(focused && !backInert, 'keyboard: Enter turns the card and moves focus to the correction');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  check(await page.evaluate(() => document.activeElement?.matches('[data-myth-turn]')), 'keyboard: turning back returns focus to the misconception');
  // Sections open with the keyboard
  await page.locator('.sec-3 > summary').focus();
  await page.keyboard.press('Enter');
  check(await page.evaluate(() => document.querySelector('.sec-3').open), 'keyboard: Enter opens a section');
  // Glossary tip is shown on keyboard focus
  const term = page.locator('.gl-term').first();
  await term.focus();
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  const vis = await page.evaluate(() => getComputedStyle(document.activeElement.nextElementSibling).visibility);
  check(vis === 'visible', 'keyboard: glossary explanation appears on focus');
  await page.keyboard.press('Escape');
  check(await page.evaluate(() => getComputedStyle(document.activeElement.nextElementSibling).visibility) === 'hidden', 'keyboard: Escape hides the glossary explanation');
  // Evidence toggle persists
  await page.locator('[data-evidence-toggle]').click();
  await page.reload();
  check(await page.evaluate(() => document.documentElement.classList.contains('evidence-on')), '"How do we know?" choice survives a reload');
  await page.context().close();
}

// 2. Reduced motion: every transition step fully visible without scrolling; no transitions on cards.
{
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
  await page.goto(url + P);
  const ops = await page.$$eval('.flow-step', (els) => els.map((e) => +getComputedStyle(e).opacity));
  check(ops.length === 4 && ops.every((o) => o === 1), 'reduced motion: transition steps are static and fully visible');
  const anim = await page.$$eval('.flow-step', (els) => els.map((e) => getComputedStyle(e).animationName));
  check(anim.every((a) => a === 'none'), 'reduced motion: no scroll animation on the flow');
  const tr = await page.$eval('.myth-face', (e) => getComputedStyle(e).transform);
  check(tr === 'none', 'reduced motion: cards swap without a 3D turn');
  await page.context().close();
}

// 3. No JavaScript: misconceptions and corrections are both readable; images keep their credits.
{
  const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
  await page.goto(url + P);
  const both = await page.$$eval('[data-myth]', (els) => els.every((e) => [...e.querySelectorAll('.myth-face')].every((f) => f.getBoundingClientRect().height > 0 && getComputedStyle(f).visibility === 'visible')));
  check(both, 'no JS: every misconception shows its correction');
  const credits = await page.$$eval('figure.fig', (els) => els.every((f) => f.querySelector('.fig-credit a[href]') && f.querySelector('.fig-caption').textContent.trim().length > 20));
  check(credits, 'no JS: every image shows caption, credit and source link');
  await page.context().close();
}
await browser.close();
server.close();

// 4. PUBLIC_BUILD: © images become credit-and-link cards (no <img>), free images stay.
if (fs.existsSync('dist-public')) {
  const images = JSON.parse(fs.readFileSync('src/content/generated/images.json', 'utf8'));
  const h = fs.readFileSync(`dist-public${P}index.html`, 'utf8');
  const leaked = images.filter((i) => i.rights === '©' && h.includes(i.url));
  check(leaked.length === 0, `PUBLIC_BUILD: no © image is hotlinked (${leaked.map((i) => i.id).join(', ') || 'none'})`);
} else console.log('– PUBLIC_BUILD check skipped (build it with: PUBLIC_BUILD=1 astro build --outDir dist-public)');

console.log(`${fails ? '✖' : '✔'} behaviour: ${fails} failure(s)`);
process.exit(fails ? 1 : 0);
