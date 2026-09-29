#!/usr/bin/env node
// Moves a built site below a sub-path, for hosting such as GitHub Pages project sites
// (https://<user>.github.io/<repo>/). Pages link with root-absolute paths ("/eras/…"); this rewrites them in
// HTML (attributes and the inline JSON the dictionary cards read) and CSS, and sets <html data-base> for the
// few URLs the client scripts build themselves. Usage: node scripts/rebase.mjs <dir> </base>
import fs from 'node:fs';
import path from 'node:path';

const [dir, rawBase] = process.argv.slice(2);
if (!dir || !rawBase) {
  console.error('Usage: node scripts/rebase.mjs <dir> </base>');
  process.exit(1);
}
const base = '/' + rawBase.replace(/^\/+|\/+$/g, '');
if (base === '/') {
  console.log('rebase: base is "/", nothing to do');
  process.exit(0);
}
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(html|css)$/.test(e.name)) files.push(p);
  }
})(dir);

let changed = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  if (f.endsWith('.html')) {
    // href/src/action/poster attributes, including escaped ones inside inline HTML strings
    s = s.replace(/(\s(?:href|src|action|poster)=\\?["'])\/(?!\/)/g, `$1${base}/`);
    // "href":"/…" in inline JSON (dictionary card data)
    s = s.replace(/("href":\s*")\/(?!\/)/g, `$1${base}/`);
    s = s.replace(/<html\b/, `<html data-base="${base}"`);
  }
  // url(/…) in stylesheets (fonts) and inline styles
  s = s.replace(/url\((["']?)\/(?!\/)/g, `url($1${base}/`);
  if (s !== before) {
    fs.writeFileSync(f, s);
    changed++;
  }
}
console.log(`✔ rebase: ${changed} of ${files.length} files moved below ${base}/`);
