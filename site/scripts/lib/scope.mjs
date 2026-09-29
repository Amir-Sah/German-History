// Which site pages exist in this build. The pipeline parses and validates the whole knowledge base; pages were
// published step by step (WEBSITE_BUILD_PROMPT.md, Process §2): the Weimar slice first, then all 35 chapters
// (rollout, 29 Sept 2026). Cross-references to pages not yet built render as plain titles marked "coming soon".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PERIOD_FOLDERS, periodSlug } from './routes.mjs';

const KB = process.env.KB_ROOT ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const BUILT_ERAS = PERIOD_FOLDERS.flatMap((folder) =>
  fs.existsSync(path.join(KB, folder))
    ? fs.readdirSync(path.join(KB, folder)).filter((f) => f.endsWith('.md')).map((f) => periodSlug(`${folder}/${f}`))
    : [],
);

export const BUILT_PAGES = [...BUILT_ERAS.map((s) => `/eras/${s}/`), '/eras/', '/dictionary/', '/how-we-know/', '/how-we-know/audit/'];
