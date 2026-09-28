#!/usr/bin/env node
// Runs every QA check against the current dist/ (run `npm run build` first). Pass --final to require
// full knowledge-base coverage, --external to also HEAD-check hotlinked images and external links.
import { spawnSync } from 'node:child_process';
const extra = process.argv.slice(2);
const steps = [
  ['pipeline fails loudly', ['qa/pipeline-negative.mjs']],
  ['coverage', ['qa/coverage.mjs', ...extra.filter((a) => a === '--final')]],
  ['links', ['qa/links.mjs', ...extra.filter((a) => a === '--external')]],
  ['fidelity (10 random passages)', ['qa/fidelity.mjs', '10']],
  ['fidelity (every passage)', ['qa/fidelity.mjs', 'all']],
  ['accessibility (axe)', ['qa/axe.mjs']],
  ['contrast tokens', ['qa/contrast.mjs']],
  ['behaviour (keyboard, reduced motion, no-JS, PUBLIC_BUILD)', ['qa/behaviour.mjs']],
  ['inline dictionary', ['qa/dictionary.mjs']],
  ['screenshots', ['qa/screenshots.mjs', 'serve']],
  ...(extra.includes('--external') ? [['hotlinked images render', ['qa/image-urls.mjs']]] : []),
];
let failed = 0;
for (const [name, args] of steps) {
  console.log(`\n── ${name} ──`);
  const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (r.status !== 0) failed++;
}
console.log(`\n${failed ? '✖' : '✔'} QA: ${steps.length - failed}/${steps.length} checks passed`);
process.exit(failed ? 1 : 0);
