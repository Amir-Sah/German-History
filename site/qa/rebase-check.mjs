#!/usr/bin/env node
// After scripts/rebase.mjs: every root-absolute link in the HTML starts with the base, and every internal
// target (page, anchor-free path, asset) exists in the folder. Usage: node qa/rebase-check.mjs <dir> </base>
import fs from 'node:fs';
import path from 'node:path';

const [dir, rawBase] = process.argv.slice(2);
const base = '/' + rawBase.replace(/^\/+|\/+$/g, '');
const html = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) html.push(p);
  }
})(dir);
let bad = 0;
const seen = new Set();
for (const f of html) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/(?:\s(?:href|src)=\\?["']|"href":\s*"|url\(["']?)(\/(?!\/)[^"'\\)\s#?]*)/g)) {
    const u = m[1];
    if (!u.startsWith(base + '/')) {
      if (bad++ < 10) console.log(`✖ ${path.relative(dir, f)}: not below ${base}: ${u}`);
      continue;
    }
    if (seen.has(u)) continue;
    seen.add(u);
    const rel = decodeURIComponent(u.slice(base.length + 1));
    const target = path.join(dir, rel);
    const ok = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')));
    if (!ok && bad++ < 10) console.log(`✖ ${path.relative(dir, f)}: missing target ${u}`);
  }
}
console.log(`${bad ? '✖' : '✔'} rebase-check: ${html.length} pages, ${seen.size} internal targets, ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
