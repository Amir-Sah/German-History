#!/usr/bin/env node
// Proves that build-content fails loudly on template violations. Copies the knowledge base to a
// temporary folder, breaks one rule at a time, and expects a non-zero exit with a precise message.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KB = path.resolve(SITE, '..');
const target = 'twentieth_century/02_weimar_republic.md';

const cases = [
  ['renamed section heading', (s) => s.replace('## 11. Important Misconceptions', '## 11. Misconceptions'), /section 11 heading "Misconceptions"/],
  ['missing transition step', (s) => s.replace('**AFTER:** Within six months', 'Within six months'), /transition steps are "BEFORE,PRESSURES,TRANSITION"/],
  ['label outside the confidence vocabulary', (s) => s.replace('| Hitler appointed, not elected to majority | HIGH |', '| Hitler appointed, not elected to majority | LOW |'), /confidence "LOW" is outside the closed vocabulary/],
  ['missing constitution-vs-reality paragraph', (s) => s.replace('**What the constitution said vs how power actually worked:**', '**Constitution:**'), /no "What the constitution said/],
  ['matrix with 11 rows', (s) => s.replace(/\| 12 \| Ordinary person's view \|.*\n/, ''), /matrix must have rows 1–12/],
  ['four "5 things"', (s) => s.replace(/\n5\. Hitler was appointed.*$/s, '\n'), /exactly 5/],
];

let failed = 0;
for (const [name, mutate, expect] of cases) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-neg-'));
  fs.cpSync(KB, tmp, { recursive: true, filter: (src) => !src.includes(`${path.sep}site`) && !src.includes(`${path.sep}.git`) });
  const f = path.join(tmp, target);
  const before = fs.readFileSync(f, 'utf8');
  const after = mutate(before);
  if (after === before) throw new Error(`mutation "${name}" did not change the file`);
  fs.writeFileSync(f, after);
  const r = spawnSync(process.execPath, [path.join(SITE, 'scripts/build-content.mjs')], {
    env: { ...process.env, KB_ROOT: tmp, CONTENT_OUT: path.join(tmp, '_out') },
    encoding: 'utf8',
  });
  const ok = r.status === 1 && expect.test(r.stderr);
  console.log(`${ok ? '✔' : '✖'} ${name}${ok ? '' : `\n   status ${r.status}\n${r.stderr}`}`);
  if (!ok) failed++;
  fs.rmSync(tmp, { recursive: true, force: true });
}
if (failed) process.exit(1);
console.log('Pipeline fails loudly on every tested template violation.');
