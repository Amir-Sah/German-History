#!/usr/bin/env node
// Writes site/DICTIONARY_ISSUES.md: every problem the website build detects in dictionary/*.md, with a
// concrete fix for each, for the session that maintains the knowledge base. Re-run after fixes:
//   node qa/dictionary-report.mjs
// Uses the same parser and matcher as the site build (scripts/lib/dictionary.mjs), so the findings are exactly
// what the site sees.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDictionary, makeMatcher } from '../scripts/lib/dictionary.mjs';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KB = path.resolve(SITE, '..');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (d.name.startsWith('.') || d.name === 'site' || d.name === 'node_modules') return [];
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith('.md') ? [path.relative(KB, p)] : [];
  });
}
const kbFiles = walk(KB).filter((f) => f !== 'WEBSITE_BUILD_PROMPT.md' && f !== 'SITE_CHANGELOG_AND_TASKS.md');
const raw = Object.fromEntries(kbFiles.map((f) => [f, fs.readFileSync(path.join(KB, f), 'utf8')]));
const errors = [];
const dict = parseDictionary(raw, new Set(kbFiles), (file, line, msg) => errors.push({ file, line, msg }));
const plain = makeMatcher(dict); // without site-side suppressions: what the dictionary itself says
const overrides = JSON.parse(fs.readFileSync(path.join(SITE, 'data/dictionary-overrides.json'), 'utf8')).suppress;
const chapters = kbFiles.filter((f) => !f.startsWith('dictionary/') && !f.startsWith('sources/') && !f.startsWith('images/'));
// Text the website highlights: everything except image links and credit lines (captions are included).
const body = (f) => raw[f].replace(/^!\[.*$|^<sub>.*$/gm, '');
const lineOf = (file, needle) => {
  const i = raw[file].indexOf(needle);
  return i < 0 ? null : raw[file].slice(0, i).split('\n').length;
};
const ref = (e) => `\`${e.file.replace('dictionary/', '')}#${e.id}\``;
const esc = (s) => String(s ?? '').replaceAll('|', '\\|').replace(/\s+/g, ' ').trim();
const words = (s) => (s ?? '').trim().split(/\s+/).filter(Boolean).length;

// 1. misreadings (suppressed on the site)
const allOverrides = overrides.map((o) => {
  const id = plain.resolve(o.form, o.chapter);
  const e = id ? dict.byId.get(id) : null;
  const inAmb = dict.amb.has(o.form);
  return { ...o, entry: e, inAmb, why: o.why.replace(/\s*\(was: [^)]*\)\s*$/, '') };
});
// Still wrong = the dictionary itself still links the form to an entry in that chapter.
const misreadings = allOverrides.filter((m) => m.entry);
const redundantOverrides = allOverrides.filter((m) => !m.entry);

// 2. rows for site/ files
const ambLines = raw['dictionary/ambiguous_forms.md'].split('\n');
const siteRows = ambLines
  .map((l, i) => ({ l, n: i + 1, m: l.match(/^\| (.+?) \| `((?:site\/[^`]+)|SITE_CHANGELOG_AND_TASKS\.md|WEBSITE_BUILD_PROMPT\.md)` \| (.+?) \|$/) }))
  .filter((r) => r.m);
// rows for those files are reported in §2, not as structural errors
for (let i = errors.length - 1; i >= 0; i--) if (/chapter (SITE_CHANGELOG_AND_TASKS|WEBSITE_BUILD_PROMPT)\.md does not exist/.test(errors[i].msg)) errors.splice(i, 1);

// 3. "Also in" / main chapter lists that no text supports
const seenIn = new Map(); // id → Set(chapter)
for (const f of chapters) {
  for (const part of plain.split(body(f), f)) {
    if (!part.entry) continue;
    if (!seenIn.has(part.entry.id)) seenIn.set(part.entry.id, new Set());
    seenIn.get(part.entry.id).add(f);
  }
}
const suppressedPairs = new Set(misreadings.filter((m) => m.entry).map((m) => `${m.entry.id}|${m.chapter}`));
const alsoOnlyMisread = [];
for (const m of misreadings) {
  if (!m.entry || !m.entry.also.includes(m.chapter)) continue;
  // Would the entry still be found in that chapter through another form?
  const other = plain.split(body(m.chapter), m.chapter).some((p) => p.entry?.id === m.entry.id && p.text !== m.form);
  if (!other) alsoOnlyMisread.push(m);
}

// 4. forms shared by several entries but missing from ambiguous_forms.md (never highlighted anywhere)
const owners = new Map();
for (const e of dict.entries) for (const f of e.forms) {
  if (!owners.has(f)) owners.set(f, []);
  owners.get(f).push(e);
}
const sharedNotInTable = [...owners]
  .filter(([f, es]) => es.length > 1 && !dict.amb.has(f))
  .map(([f, es]) => ({ form: f, entries: es, chapters: chapters.filter((c) => new RegExp(`(?<![\\p{L}\\p{N}])${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'u').test(body(c))) }))
  .filter((x) => x.chapters.length);

// 5. entries never found in their own main chapter
const notInMain = dict.entries
  .filter((e) => e.main && chapters.includes(e.main) && !seenIn.get(e.id)?.has(e.main))
  .map((e) => {
    const anyText = e.forms.some((f) => body(e.main).includes(f));
    const ambForms = e.forms.filter((f) => dict.amb.has(f) || (owners.get(f)?.length ?? 0) > 1);
    return { e, anyText, ambForms };
  });

const a = notInMain.filter((x) => !x.anyText);
const b = notInMain.filter((x) => x.anyText);

// 6. length limits (dictionary/README.md: Short ≤ 18 words, Explanation ≤ 60 words)
const longShort = dict.entries.filter((e) => words(e.short) > 18);
const longExpl = dict.entries.filter((e) => words(e.explanation) > 60);

// 7. README counts vs files
const readme = raw['dictionary/README.md'];
const counts = { people: dict.entries.filter((e) => e.kind === 'person').length, places: dict.entries.filter((e) => e.kind === 'place').length, terms: dict.entries.filter((e) => e.kind === 'term').length };
const claimed = {
  people: +(readme.match(/\*\*(\d+) people\*\*/)?.[1] ?? NaN),
  places: +(readme.match(/\*\*(\d+) places\*\*/)?.[1] ?? NaN),
  terms: +(readme.match(/\*\*([\d,]+) terms\*\*/)?.[1]?.replace(',', '') ?? NaN),
};
const countMismatch = Object.keys(counts).filter((k) => counts[k] !== claimed[k]);

// ───────────────────────── write the report ─────────────────────────
const out = [];
const P = (s = '') => out.push(s);
P('# Dictionary issues found by the website build');
P();
P(`*Generated ${new Date().toISOString().slice(0, 10)} by \`site/qa/dictionary-report.mjs\` from \`dictionary/*.md\`, using the same parser and matcher as the website. For the session that maintains the knowledge base. Re-run the script after fixing; resolved items disappear from this file.*`);
P();
P('**How the website uses the dictionary** (so the fixes below make sense): every canonical name and "Also written as" form is matched in the chapter text — case-sensitive, whole word, longest match first. A form that appears in `ambiguous_forms.md`, or that belongs to more than one entry, is highlighted only in chapters where the table names an entry; `—` or a missing row means plain text.');
P();
P('## Summary');
P();
P('| # | Problem | Count | Where to fix |');
P('|---|---|---|---|');
P(`| 1 | Word highlighted as the wrong entry (misreading) | ${misreadings.length} | \`ambiguous_forms.md\` (add rows) |`);
P(`| 2 | \`ambiguous_forms.md\` rows that point at non-chapter files (\`site/…\`, task files) | ${siteRows.length} | \`ambiguous_forms.md\` (delete rows) |`);
P(`| 3 | "Also in" chapters supported only by a misreading | ${alsoOnlyMisread.length} | entry's **Also in** |`);
P(`| 4 | Forms shared by several entries but missing from \`ambiguous_forms.md\` (never highlighted) | ${sharedNotInTable.length} | \`ambiguous_forms.md\` (add rows) |`);
P(`| 5 | Entries never found in their own main chapter: 5a no spelling there / 5b blocked by the table / 5c only inside a longer name | ${a.length} / ${notInMain.filter((x) => x.anyText && x.ambForms.length).length} / ${notInMain.filter((x) => x.anyText && !x.ambForms.length).length} | entry's **Also written as**, **Main chapter**, or \`ambiguous_forms.md\` |`);
P(`| 6 | **Short** longer than 18 words / **Explanation** longer than 60 words | ${longShort.length} / ${longExpl.length} | entry text |`);
P(`| 7 | Structural errors (malformed entries, bad links) | ${errors.length} | as listed |`);
P(`| 8 | README counts differ from the files | ${countMismatch.length} | \`dictionary/README.md\` |`);
P();
P(`Site-side workarounds (\`site/data/dictionary-overrides.json\`): ${overrides.length} in use, of which ${redundantOverrides.length} are no longer needed because the dictionary now resolves those words correctly.`);
P();

P('## 1. Misreadings — add a row to `ambiguous_forms.md` for each');
P();
P('Each row below is a word in a chapter that the dictionary links to the wrong entry. Found by reviewing all 4,351 chapter/form/entry matches with their context (two by hand, 70 by a model review, 28 Sept 2026) — please check each before applying. **Fix:** add the row `| <form> | \`<chapter>\` | — |` to `ambiguous_forms.md`, or instead of `—` link the correct entry if the dictionary has one (e.g. a separate "reparations (after 1945)" entry). Where the form is a common English word used in many chapters, consider whether it should be a form of that entry at all.');
P();
P('| Chapter | Form | Currently resolves to | Why it is wrong | Line |');
P('|---|---|---|---|---|');
for (const m of misreadings.sort((a, b) => a.chapter.localeCompare(b.chapter) || a.form.localeCompare(b.form))) {
  P(`| \`${m.chapter}\` | ${esc(m.form)} | ${m.entry ? `${esc(m.entry.name)} (${ref(m.entry)})` : '*(no longer resolves — already fixed?)*'} | ${esc(m.why)} | ${lineOf(m.chapter, m.form) ?? '—'} |`);
}
P();

P('## 2. Rows that point at non-chapter files — delete');
P();
P(`\`ambiguous_forms.md\` has ${siteRows.length} rows whose "Chapter" is not a KB chapter: files inside \`site/\` (the website, its \`node_modules\`, PLAN/README/CONTENT_TRACE) and the task file \`SITE_CHANGELOG_AND_TASKS.md\`. The dictionary builder scanned those folders too. **Fix:** delete these lines (line numbers as of generation):`);
P();
const byFile = new Map();
for (const r of siteRows) {
  const f = r.m[2];
  if (!byFile.has(f)) byFile.set(f, []);
  byFile.get(f).push(`${r.n} (${r.m[1]})`);
}
for (const [f, rows] of byFile) P(`- \`${f}\`: lines ${rows.join(', ')}`);
P();

P('## 3. "Also in" chapters supported only by a misreading');
P();
P('The entry lists the chapter under **Also in**, but the only occurrence there is the misread word from §1 — the chapter does not actually mention this entry. **Fix:** remove the chapter from the entry\'s **Also in** line.');
P();
P('| Entry | Remove from "Also in" | Misread form |');
P('|---|---|---|');
for (const m of alsoOnlyMisread) P(`| ${esc(m.entry.name)} (${ref(m.entry)}) | \`${m.chapter}\` | ${esc(m.form)} |`);
P();

P('## 4. Forms shared by several entries but missing from `ambiguous_forms.md`');
P();
P('These surface forms belong to more than one entry and have no row in `ambiguous_forms.md`, so the website never highlights them (it cannot know which entry is meant). **Fix:** if the entries describe the same thing (e.g. an abbreviation and its full name as two entries), **merge them into one entry**; otherwise add a row per chapter to `ambiguous_forms.md` naming the right entry, or remove the form from the entry where it is not a real alternative name.');
P();
P('| Form | Claimed by | Occurs in chapters |');
P('|---|---|---|');
for (const x of sharedNotInTable) P(`| ${esc(x.form)} | ${x.entries.map((e) => `${esc(e.name)} (${ref(e)})`).join('; ')} | ${x.chapters.map((c) => `\`${c}\``).join(' · ')} |`);
P();

P('## 5. Entries never found in their own main chapter');
P();
P('The website finds no highlight for these entries in the chapter named as **Main chapter**. Two causes: (a) the chapter uses a spelling that is not listed under **Also written as** — add it; (b) the name occurs but only as an ambiguous form that has no row for this chapter — add the row to `ambiguous_forms.md`. If the entry is really not discussed in that chapter, correct **Main chapter**.');
P();
P(`### 5a. No listed form occurs in the main chapter (${a.length})`);
P();
P('The last column shows where a listed form **does** occur — usually the right main chapter. "none" means no listed spelling occurs anywhere: add the spelling the text uses (e.g. "Hans and Sophie Scholl" contains neither "Hans Scholl" nor "Sophie Scholl" as written) or remove the entry.');
P();
P('| Entry | Main chapter | Forms searched | Forms occur in |');
P('|---|---|---|---|');
for (const { e } of a) {
  const where = chapters.filter((c) => e.forms.some((f) => body(c).includes(f)));
  P(`| ${esc(e.name)} (${ref(e)}) | \`${e.main}\` | ${e.forms.map(esc).join(' · ')} | ${where.length ? where.map((c) => `\`${c}\``).join(' · ') : 'none'} |`);
}
P();
const b1 = b.filter((x) => x.ambForms.length);
const b2 = b.filter((x) => !x.ambForms.length);
P(`### 5b. A form occurs, but \`ambiguous_forms.md\` blocks it in the main chapter (${b1.length})`);
P();
P('The name occurs, but the table says `—` (or has no row) for this chapter, so it is never highlighted where it matters most. **Fix:** give the row for the main chapter the entry id. If the same short form means two different entries in one chapter (e.g. "Meissner" in the Weimar chapter is both State Secretary Otto Meissner and the economist Christopher M. Meissner), the table cannot express it: add the fuller spelling the text uses to "Also written as" (e.g. "State Secretary Meissner"), or accept plain text there.');
P();
P('| Entry | Main chapter | Blocked forms |');
P('|---|---|---|');
for (const { e, ambForms } of b1) P(`| ${esc(e.name)} (${ref(e)}) | \`${e.main}\` | ${ambForms.map(esc).join(' · ')} |`);
P();
P(`### 5c. The name occurs only inside a longer word or a longer dictionary name (${b2.length}) — low priority`);
P();
P('Example: "Ruhr" occurs only within "Ruhr occupation", which is its own entry, so the longer entry is highlighted instead; or the text has the name only as part of a longer word. Often nothing needs to change. **Fix only if wrong:** correct **Main chapter** to a chapter that names the entry on its own.');
P();
P('| Entry | Main chapter |');
P('|---|---|');
for (const { e } of b2) P(`| ${esc(e.name)} (${ref(e)}) | \`${e.main}\` |`);
P();

P('## 6. Length limits (`dictionary/README.md`: Short ≤ 18 words, Explanation ≤ 60 words)');
P();
if (!longShort.length && !longExpl.length) P('None.');
for (const e of longShort) P(`- ${esc(e.name)} (${ref(e)}): **Short** has ${words(e.short)} words`);
for (const e of longExpl) P(`- ${esc(e.name)} (${ref(e)}): **Explanation** has ${words(e.explanation)} words`);
P();

P('## 7. Structural errors');
P();
if (!errors.length) P('None — all 2,300 entries parse (required fields, ids, kinds, basis, chapter links and ambiguity links are valid).');
for (const x of errors) P(`- \`${x.file}\`:${x.line} — ${x.msg}`);
P();

P('## 8. README counts');
P();
if (!countMismatch.length) P(`Match the files (${counts.people} people, ${counts.places} places, ${counts.terms} terms).`);
for (const k of countMismatch) P(`- ${k}: README says ${claimed[k]}, files contain ${counts[k]}`);
P();

fs.writeFileSync(path.join(SITE, 'DICTIONARY_ISSUES.md'), out.join('\n'));
console.log(`DICTIONARY_ISSUES.md: redundant overrides ${redundantOverrides.length}; 1:${misreadings.length} 2:${siteRows.length} 3:${alsoOnlyMisread.length} 4:${sharedNotInTable.length} 5:${notInMain.length} (${a.length}+${b.length}) 6:${longShort.length}/${longExpl.length} 7:${errors.length} 8:${countMismatch.length}`);
