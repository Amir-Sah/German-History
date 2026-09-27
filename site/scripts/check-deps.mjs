#!/usr/bin/env node
// Runs before dev/build: fails with a clear message if package.json lists a package that is not installed
// (e.g. after `git pull` added a dependency but `npm install` was not run).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(SITE, 'package.json'), 'utf8'));
const wanted = Object.keys({ ...pkg.dependencies, ...(process.argv.includes('--dev') ? pkg.devDependencies : {}) });
const missing = wanted.filter((name) => !fs.existsSync(path.join(SITE, 'node_modules', name, 'package.json')));
if (missing.length) {
  console.error(`\n✖ Missing packages: ${missing.join(', ')}\n  Run \`npm install\` in site/ (package.json changed since the last install).\n`);
  process.exit(1);
}
