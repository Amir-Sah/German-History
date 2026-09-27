#!/usr/bin/env node
// Internal link check of dist/ (every href and src on every page, plus #fragments), and an optional
// HEAD check of the hotlinked images and external links (--external; needs network access to the holders).
import fs from 'node:fs';
import path from 'node:path';
import { builtPages } from './lib/serve.mjs';

const dist = path.resolve('dist');
const external = process.argv.includes('--external');
const pages = builtPages(dist);
const html = Object.fromEntries(pages.map((p) => [p, fs.readFileSync(path.join(dist, p, 'index.html'), 'utf8')]));
const idsOf = (h) => new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
let broken = 0;
const ext = new Set();
for (const [p, h] of Object.entries(html)) {
  for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const link = m[1].replaceAll('&amp;', '&');
    if (/^(https?:)?\/\//.test(link)) { ext.add(link); continue; }
    if (/^(mailto|data|javascript):/.test(link)) continue;
    const u = new URL(link, 'http://site' + p);
    const target = u.pathname;
    let file = path.join(dist, decodeURIComponent(target));
    if (target.endsWith('/')) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { broken++; console.log(`✖ ${p}: broken link ${link}`); continue; }
    if (u.hash && target.endsWith('/')) {
      const targetHtml = html[target] ?? fs.readFileSync(file, 'utf8');
      if (!idsOf(targetHtml).has(decodeURIComponent(u.hash.slice(1)))) { broken++; console.log(`✖ ${p}: missing anchor ${link}`); }
    }
  }
}
console.log(`${broken ? '✖' : '✔'} links: ${pages.length} pages, ${broken} broken internal link(s); ${ext.size} external URLs ${external ? 'checked below' : 'not checked (use --external)'}`);
if (external) {
  let bad = 0;
  for (const u of ext) {
    try {
      const r = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (!r.ok) { bad++; console.log(`✖ ${r.status} ${u}`); }
    } catch (e) { bad++; console.log(`✖ ${e.cause?.code ?? e.name} ${u}`); }
  }
  console.log(`${bad ? '✖' : '✔'} external: ${ext.size - bad}/${ext.size} reachable`);
  if (bad) process.exitCode = 1;
}
if (broken) process.exitCode = 1;
