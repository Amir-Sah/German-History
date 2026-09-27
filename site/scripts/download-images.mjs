#!/usr/bin/env node
// OPTIONAL — caches the hotlinked images in public/img-cache/ for offline, personal-study use.
// It downloads files from the holders' servers, so it only runs when you call it:
//   npm run images:download            (all 72 images)
//   npm run images:download -- --free  (only the 18 public-domain / no-known-restrictions images)
// Afterwards `npm run build` uses the local copies (manifest: public/img-cache/manifest.json).
// Credits are unaffected: every image keeps its caption, creator, date, holder, licence and source link.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const images = JSON.parse(fs.readFileSync(path.join(SITE, 'src/content/generated/images.json'), 'utf8'));
const dir = path.join(SITE, 'public/img-cache');
fs.mkdirSync(dir, { recursive: true });
const manifestPath = path.join(dir, 'manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const onlyFree = process.argv.includes('--free');

let ok = 0, failed = 0;
for (const img of images) {
  if (onlyFree && img.rights === '©') continue;
  const ext = (path.extname(new URL(img.url).pathname) || '.jpg').toLowerCase();
  const file = `${img.id}${ext}`;
  try {
    const res = await fetch(img.url, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get('content-type') ?? '';
    if (!type.startsWith('image/')) throw new Error(`not an image (${type})`);
    fs.writeFileSync(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
    manifest[img.id] = { file: `/img-cache/${file}`, source: img.url, fetchedAt: new Date().toISOString(), rights: img.rights };
    ok++;
    console.log(`✔ ${img.id}`);
  } catch (e) {
    failed++;
    console.log(`✖ ${img.id}: ${e.message}`);
  }
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log(`${ok} cached, ${failed} failed → ${path.relative(SITE, dir)}`);
