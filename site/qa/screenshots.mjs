#!/usr/bin/env node
// Screenshots at phone (360 px) and desktop (1280 px), light and dark. Usage:
//   node qa/screenshots.mjs [baseUrl] [path ...]
// Chromium: see qa/lib/browser.mjs.
import { launch } from './lib/browser.mjs';
import fs from 'node:fs';
import path from 'node:path';

const base = process.argv[2] ?? 'http://localhost:4322';
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['/eras/weimar-republic/'];
const out = path.resolve('qa/reports/screens');
fs.mkdirSync(out, { recursive: true });

const browser = await launch();
for (const p of paths) {
  for (const [w, h] of [[360, 780], [1280, 900]]) {
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto(base + p, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const name = `${p.replace(/\W+/g, '_').replace(/^_|_$/g, '') || 'home'}-${w}-${scheme}`;
      await page.screenshot({ path: `${out}/${name}-top.png` });
      await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > w) console.log(`⚠ horizontal overflow on ${p} at ${w}px: scrollWidth ${sw}`);
      await ctx.close();
    }
  }
}
await browser.close();
console.log(`Screenshots in ${out}`);
