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
  // curl follows redirects the way browsers do (Node's fetch gets a self-redirect from some holders, e.g. DHM).
  // A proxy/egress refusal ("Host not in allowlist", CONNECT 403) is an environment limit, not a broken link.
  const { spawnSync } = await import('node:child_process');
  function check(u, retry = true) {
    const r = spawnSync('curl', ['-sS', '-L', '--max-redirs', '10', '-r', '0-0', '-A', 'Mozilla/5.0 (link check)', '--max-time', '25', '-o', '-', '-w', '\n%{http_code}', u], { encoding: 'latin1' });
    const out = r.stdout ?? '';
    const status = +out.slice(out.lastIndexOf('\n') + 1) || 0;
    const envBlocked = /Host not in allowlist/.test(out) || /CONNECT tunnel failed, response 403/.test(r.stderr ?? '');
    const botCheck = /<title>Just a moment\.\.\.<\/title>|cf-mitigated/i.test(out);
    if (!status && retry) return check(u, false); // one retry for a transient timeout
    return { status, envBlocked, botCheck };
  }
  const results = [];
  for (const u of ext) results.push({ u, ...check(u) });
  let bad = 0, env = 0;
  let bots = 0;
  for (const { u, status, envBlocked, botCheck } of results) {
    const ok = status === 200 || status === 206;
    if (ok) continue;
    if (botCheck) { bots++; console.log(`– bot challenge (works in a browser; verify by hand): ${u}`); continue; }
    if (envBlocked) { env++; console.log(`– blocked by this environment's network policy: ${u}`); }
    else { bad++; console.log(`✖ ${status} ${u}`); }
  }
  console.log(`${bad ? '✖' : '✔'} external: ${results.length - bad - env - bots}/${results.length} reachable, ${bad} broken, ${bots} behind a bot challenge, ${env} not checkable here (host not allowed)`);
  if (bad) process.exitCode = 1;
}
if (broken) process.exitCode = 1;
