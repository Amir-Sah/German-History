#!/usr/bin/env node
// Accessibility audit (axe-core, WCAG 2.x A/AA) of every built page at 360 and 1280 px, light and dark,
// with the "How do we know?" layer and all sections open so hidden content is audited too.
import AxeBuilder from '@axe-core/playwright';
import { launch } from './lib/browser.mjs';
import { serve, builtPages } from './lib/serve.mjs';
import path from 'node:path';
import fs from 'node:fs';

const dist = path.resolve('dist');
const { server, url } = await serve(dist);
const pages = builtPages(dist);
const browser = await launch();
let violations = 0;
const report = [];
for (const p of pages) {
  for (const [w, scheme] of [[360, 'light'], [1280, 'light'], [1280, 'dark'], [360, 'dark']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme });
    const page = await ctx.newPage();
    await page.goto(url + p, { waitUntil: 'load' });
    await page.evaluate(() => {
      document.documentElement.classList.add('evidence-on');
      document.querySelectorAll('details').forEach((d) => (d.open = true));
    });
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    for (const v of r.violations) {
      violations++;
      report.push({ page: p, width: w, scheme, id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 5).map((n) => n.target.join(' ') + ' — ' + n.failureSummary) });
    }
    await ctx.close();
  }
}
await browser.close();
server.close();
fs.mkdirSync('qa/reports', { recursive: true });
fs.writeFileSync('qa/reports/axe.json', JSON.stringify(report, null, 1));
for (const v of report) console.log(`✖ ${v.page} ${v.width}px ${v.scheme}: [${v.impact}] ${v.id} — ${v.help}\n    ${v.nodes.join('\n    ')}`);
console.log(`${violations ? '✖' : '✔'} axe: ${pages.length} pages × 4 variants, ${violations} violation(s)`);
process.exit(violations ? 1 : 0);
