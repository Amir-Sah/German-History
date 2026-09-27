#!/usr/bin/env node
// Knowledge base (../*.md) → structured JSON content model (src/content/generated/*.json).
//
// The Markdown is the single source of truth. This script parses and validates it against the
// template rules in 01_RESEARCH_METHOD.md §8 and FAILS LOUDLY (exit 1, file:line) on any deviation
// that is not listed, with a reason, in data/template-exceptions.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseMd,
  mdText,
  renderBlocks,
  renderInline,
  renderTable,
  renderMd,
  renderMdInline,
  inlineText,
  escapeHtml,
} from './lib/markdown.mjs';
import { makeResolver, periodSlug, PERIOD_FOLDERS } from './lib/routes.mjs';
import { BUILT_PAGES } from './lib/scope.mjs';
import { Period, Image } from './lib/schema.mjs';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KB = process.env.KB_ROOT ? path.resolve(process.env.KB_ROOT) : path.resolve(SITE, '..');
const OUT = process.env.CONTENT_OUT ?? path.join(SITE, 'src/content/generated');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(SITE, p), 'utf8'));

// ───────────────────────── error collection ─────────────────────────
const errors = [];
const warnings = [];
const kbIssues = []; // knowledge-base inconsistencies (reported, never resolved silently)
const fail = (file, line, msg) => errors.push(`${file}${line ? `:${line}` : ''} — ${msg}`);
const warn = (file, msg) => warnings.push(`${file} — ${msg}`);

const exceptionsCfg = readJson('data/template-exceptions.json').exceptions;
const usedExceptions = new Set();
function allowed(file, rule, found) {
  const i = exceptionsCfg.findIndex((e) => e.file === file && e.rule === rule && (!e.found || e.found === found));
  if (i >= 0) usedExceptions.add(i);
  return i >= 0;
}

// ───────────────────────── files ─────────────────────────
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (d.name.startsWith('.') || d.name === 'site' || d.name === 'node_modules') return [];
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith('.md') ? [path.relative(KB, p)] : [];
  });
}
const kbFiles = walk(KB)
  .filter((f) => f !== 'WEBSITE_BUILD_PROMPT.md')
  .sort();
const raw = Object.fromEntries(kbFiles.map((f) => [f, fs.readFileSync(path.join(KB, f), 'utf8')]));
const periodFiles = kbFiles.filter((f) => PERIOD_FOLDERS.includes(f.split('/')[0]));
const themeFiles = kbFiles.filter((f) => f.startsWith('themes/'));

const isBuilt = (href) => BUILT_PAGES.some((p) => (typeof p === 'string' ? p === href : p.test(href)));
const resolveXref = makeResolver(kbFiles, isBuilt);

// ───────────────────────── method file: canonical names & vocab ─────────────────────────
const method = raw['01_RESEARCH_METHOD.md'];
const sectionNamesLine = method.split('\n').find((l) => l.startsWith('- **Sections:**'));
if (!sectionNamesLine) fail('01_RESEARCH_METHOD.md', 0, 'cannot find the §8 "Sections:" rule');
const CANONICAL = {};
for (const m of (sectionNamesLine ?? '').split('exact names — ')[1]?.matchAll(/(\d{1,2}) ([^·]+?)(?= ·|\. A heading)/g)) CANONICAL[+m[1]] = m[2].trim();
if (Object.keys(CANONICAL).length !== 14)
  fail('01_RESEARCH_METHOD.md', 0, `expected 14 canonical section names, parsed ${Object.keys(CANONICAL).length}`);

const ORDINAL = ['HIGH', 'MEDIUM', 'UNCERTAIN'];
const LABELS = [...ORDINAL, 'CONTESTED', 'REJECTED'];

function tableRows(tableNode) {
  return tableNode.children.map((r) => r.children.map((c) => c));
}
function sectionTable(md, heading) {
  // Table under a "## N. heading" in a markdown string.
  const tree = parseMd(md);
  let inSec = false;
  for (const n of tree.children) {
    if (n.type === 'heading' && n.depth === 2) inSec = mdText(n).includes(heading);
    else if (inSec && n.type === 'table') return n;
  }
  return null;
}
const baseCtx = (file) => ({
  file,
  resolveXref,
  warn: (m) => warn(file, m),
});

// Confidence meanings (§4) and source levels (§3), verbatim, for badges and the legend.
const confTable = sectionTable(method, 'Confidence scale');
const confidenceScale = tableRows(confTable)
  .slice(1)
  .map(([label, meaning]) => ({
    label: mdText(label).replaceAll('*', '').trim(),
    meaningHtml: renderInline(meaning.children, baseCtx('01_RESEARCH_METHOD.md')),
    meaning: mdText(meaning),
  }));
const levelTable = sectionTable(method, 'Source hierarchy');
const sourceLevels = tableRows(levelTable)
  .slice(1)
  .map(([lvl, type, examples, usedFor]) => ({
    level: mdText(lvl).trim(),
    type: mdText(type),
    usedFor: mdText(usedFor),
  }));

function parseConfidence(text) {
  // Closed vocabulary (01_RESEARCH_METHOD.md §4): LABEL | RANGE, then optional "(qualifier)".
  const t = text.trim();
  const m = t.match(/^([A-Z]+)(?:–([A-Z]+))?(?:\s*\((.+)\))?$/s);
  if (!m) return null;
  const [, a, b, qualifier] = m;
  if (!LABELS.includes(a)) return null;
  if (b) {
    if (!ORDINAL.includes(a) || !ORDINAL.includes(b)) return null;
    if (Math.abs(ORDINAL.indexOf(a) - ORDINAL.indexOf(b)) !== 1) return null;
  }
  return { levels: b ? [a, b] : [a], qualifier: qualifier ?? null, text: t };
}

// ───────────────────────── glossary ─────────────────────────
const stripMarks = (s) => s.replace(/[*_`]/g, '');
const glossaryCfg = readJson('data/glossary.json').terms;
const glossary = [];
for (const g of glossaryCfg) {
  const src = raw[g.source];
  const where = `data/glossary.json (${g.term})`;
  if (!src) {
    fail(where, 0, `source file ${g.source} not found`);
    continue;
  }
  if (!src.includes(g.evidence)) fail(where, 0, `evidence not found verbatim in ${g.source}: ${g.evidence}`);
  const ev = stripMarks(g.evidence);
  const forms = [g.term, ...(g.forms ?? [])];
  if (!forms.some((f) => ev.includes(f))) fail(where, 0, 'term does not occur in its evidence');
  if (!ev.includes(g.gloss)) fail(where, 0, 'gloss is not quoted from its evidence');
  const line = src.slice(0, src.indexOf(g.evidence)).split('\n').length;
  const id = g.term
    .toLowerCase()
    .normalize('NFD')
    .replace(/ß/g, 'ss')
    .replace(/[̀-ͯ]/g, (c) => (c === '̈' ? 'e' : ''))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  glossary.push({
    id,
    term: g.term,
    forms,
    gloss: g.gloss,
    source: g.source,
    sourceLine: line,
    sourceLabel: g.source.replace(/\.md$/, ''),
    evidence: g.evidence,
  });
}
const glossaryIndex = new Map();
for (const g of glossary) for (const f of g.forms) glossaryIndex.set(f, g);
const glossaryMatcher = { match: (text) => glossaryIndex.get(text.trim()) ?? null };

// ───────────────────────── image index ─────────────────────────
const idx = raw['images/IMAGE_INDEX.md'];
const idxTree = parseMd(idx);
const idxTable = idxTree.children.find(
  (n) => n.type === 'table' && mdText(n.children[0]).includes('Holder'),
);
const idxHeader = idxTable.children[0].children.map((c) => mdText(c).trim());
const col = (name) => idxHeader.indexOf(name);
const expectCols = ['#', 'Image', 'Type', 'Creator', 'Date', 'Holder / source', 'Licence', 'Used in'];
for (const c of expectCols) if (col(c) < 0) fail('images/IMAGE_INDEX.md', 0, `index table lacks column "${c}"`);

const captionsFull = {};
for (const line of idx.split('\n')) {
  const m = line.match(/^- \*\*(.+?)\*\* \(`([a-z0-9_-]+)`\): (.+)$/);
  if (m) captionsFull[m[2].replaceAll('_', '-')] = m[3].trim();
}

const IMAGE_TYPES = ['painting', 'print', 'artwork', 'manuscript', 'object', 'document', 'poster', 'cartoon', 'map', 'photograph', 'film still'];
const imageNotes = readJson('data/image-notes.json').flags;
const images = [];
for (const row of idxTable.children.slice(1)) {
  const cells = row.children;
  const numCell = cells[col('#')];
  const anchor = numCell.children.find((c) => c.type === 'html' && /id="/.test(c.value));
  const id = anchor?.value.match(/id="([^"]+)"/)?.[1];
  const n = parseInt(mdText(numCell), 10);
  const imgLink = cells[col('Image')].children.find((c) => c.type === 'link');
  const holderLink = cells[col('Holder / source')].children.find((c) => c.type === 'link');
  const licence = mdText(cells[col('Licence')]).trim();
  const type = mdText(cells[col('Type')]).trim();
  const line = row.position.start.line;
  if (!id || !imgLink) {
    fail('images/IMAGE_INDEX.md', line, 'row lacks anchor id or image link');
    continue;
  }
  if (!IMAGE_TYPES.includes(type)) fail('images/IMAGE_INDEX.md', line, `unknown Type "${type}"`);
  const rights = /CC0|Public domain/i.test(licence)
    ? 'CC0'
    : /No known restrictions/i.test(licence)
      ? 'PD-LoC'
      : '©';
  const usedIn = cells[col('Used in')].children
    .filter((c) => c.type === 'link')
    .map((l) => ({ file: l.url.replace(/^\.\.\//, ''), note: null }));
  const creator = mdText(cells[col('Creator')]).trim();
  const ctx = baseCtx('images/IMAGE_INDEX.md');
  images.push({
    id,
    n,
    title: mdText(imgLink).trim(),
    titleHtml: renderInline(imgLink.children, ctx),
    url: imgLink.url,
    type,
    creator: creator === '—' ? null : creator,
    date: mdText(cells[col('Date')]).trim(),
    holder: mdText(holderLink).trim(),
    holderUrl: holderLink.url,
    licence,
    rights,
    usedIn,
    caption: captionsFull[id] ?? null,
    captionHtml: captionsFull[id] ? renderMdInline(captionsFull[id], ctx) : null,
    critical: imageNotes[id] ? { kind: imageNotes[id].kind } : null,
  });
  if (!captionsFull[id]) fail('images/IMAGE_INDEX.md', line, `no full caption for ${id}`);
}
for (const id of Object.keys(imageNotes))
  if (!images.find((i) => i.id === id)) fail('data/image-notes.json', 0, `unknown image id ${id}`);
const imageById = new Map(images.map((i) => [i.id, i]));
{
  const summary = idx.match(/\*\*Rights summary:\*\* (\d+) images .*?; (\d+) are ©/);
  const pd = images.filter((i) => i.rights !== '©').length;
  if (images.length !== 72) warn('images/IMAGE_INDEX.md', `expected 72 images (brief), found ${images.length}`);
  if (summary && (+summary[1] !== pd || +summary[2] !== images.length - pd))
    fail('images/IMAGE_INDEX.md', 0, `rights summary says ${summary[1]}/${summary[2]}, table gives ${pd}/${images.length - pd}`);
}

// Image blocks in every file
const IMG_BLOCK = /<!-- IMAGES:START -->\n([\s\S]*?)\n<!-- IMAGES:END -->/g;
const imageBlocks = {}; // file → [{id, caption, captionHtml, blockIndex}]
for (const f of kbFiles) {
  const blocks = [...raw[f].matchAll(IMG_BLOCK)];
  imageBlocks[f] = [];
  blocks.forEach((b, bi) => {
    const entries = b[1].split(/\n\s*\n/).filter((e) => e.trim());
    for (const e of entries) {
      const lines = e.split('\n');
      const img = lines[0].match(/^!\[(.*)\]\((\S+)\)$/);
      const idm = e.match(/IMAGE_INDEX\.md#([a-z0-9-]+)/);
      const line = raw[f].slice(0, b.index).split('\n').length + 1;
      if (!img || !idm) {
        fail(f, line, 'malformed entry in image block');
        continue;
      }
      const id = idm[1];
      const rec = imageById.get(id);
      if (!rec) {
        fail(f, line, `image id ${id} not in IMAGE_INDEX.md`);
        continue;
      }
      if (rec.url !== img[2]) fail(f, line, `image ${id}: URL differs from the index`);
      const caption = lines
        .slice(1)
        .filter((l) => !l.startsWith('<sub>'))
        .join(' ')
        .trim();
      if (caption !== rec.caption)
        kbIssues.push({ file: f, item: `caption of ${id}`, detail: 'caption in the file differs from IMAGE_INDEX.md full caption; the file’s caption is shown there' });
      imageBlocks[f].push({ id, block: bi, caption, captionHtml: renderMdInline(caption, baseCtx(f)) });
      if (!rec.usedIn.some((u) => u.file === f))
        kbIssues.push({ file: f, item: `image ${id}`, detail: 'image used in this file but the index "Used in" column does not list the file' });
    }
  });
}
for (const img of images)
  for (const u of img.usedIn)
    if (!imageBlocks[u.file]?.some((b) => b.id === img.id))
      fail('images/IMAGE_INDEX.md', 0, `index says ${img.id} is used in ${u.file}, but that file has no such image`);

const stripImageBlocks = (s) => s.replace(IMG_BLOCK, (m) => m.replace(/[^\n]/g, ''));

// ───────────────────────── bibliography & audit ─────────────────────────
const normUrl = (u) => u.replace(/[).,;]+$/, '').replace(/\/$/, '').replace(/^https?:\/\/(www\.)?/, '');
const bibliography = [];
{
  const f = 'sources/bibliography.md';
  const tree = parseMd(raw[f]);
  let group = null;
  for (const n of tree.children) {
    if (n.type === 'heading' && n.depth === 2) group = mdText(n);
    if (n.type !== 'table') continue;
    const head = n.children[0].children.map((c) => mdText(c).trim().toLowerCase());
    const ci = (k) => head.indexOf(k);
    for (const r of n.children.slice(1)) {
      const cell = (k) => (ci(k) >= 0 ? mdText(r.children[ci(k)] ?? { type: 'text', value: '' }).trim() : null);
      const url = cell('url');
      bibliography.push({
        group,
        title: mdText(r.children[0]).trim(),
        author: cell('org / author') ?? cell('author'),
        date: cell('date'),
        level: cell('level'),
        access: cell('access'),
        url: url && /^https?:/.test(url) ? url : null,
      });
    }
  }
}
const bibByUrl = new Map(bibliography.filter((b) => b.url).map((b) => [normUrl(b.url), b]));

const audit = [];
{
  const f = 'sources/SOURCE_AUDIT.md';
  const t = sectionTable(raw[f], 'Claim table');
  const head = t.children[0].children.map((c) => mdText(c).trim());
  for (const r of t.children.slice(1)) {
    const c = r.children;
    const ctx = baseCtx(f);
    const conf = mdText(c[head.indexOf('Confidence')]).trim();
    const parts = conf.split(' / ').map((p) => ({ raw: p, parsed: parseConfidence(p) }));
    if (parts.some((p) => !p.parsed))
      kbIssues.push({
        file: f,
        item: `claim ${mdText(c[0]).trim()}`,
        detail: `Confidence "${conf}" does not follow the closed vocabulary of 01_RESEARCH_METHOD.md §4`,
      });
    audit.push({
      n: +mdText(c[0]).trim(),
      claimHtml: renderInline(c[1].children, ctx),
      claim: mdText(c[1]).trim(),
      sourcesHtml: [2, 3, 4].map((i) => renderInline(c[i].children, ctx)),
      agreementHtml: renderInline(c[5].children, ctx),
      disagreementHtml: renderInline(c[6].children, ctx),
      confidence: conf,
      levels: [...new Set(conf.match(/HIGH|MEDIUM|UNCERTAIN|CONTESTED|REJECTED/g) ?? [])],
    });
  }
}
const auditMap = readJson('data/audit-map.json').map;

// ───────────────────────── period files ─────────────────────────
const erasCfg = readJson('data/eras.json');

function parseYears(label) {
  // "c. 500 BCE – c. 500 CE", "1918/19 – 1933", "1884 – 1919 and its afterlife", "March 1848 – July 1849"
  const [a, b] = label.split(/\s+–\s+/);
  const yr = (s, pick) => {
    if (!s) return null;
    const nums = [...s.matchAll(/(\d{1,4})(?:\s*(BCE|CE))?/g)].map((m) => (m[2] === 'BCE' ? -m[1] : +m[1]));
    if (!nums.length) return null;
    return pick === 'first' ? nums[0] : Math.max(...nums);
  };
  return {
    start: yr(a, 'first'),
    end: yr(b ?? a, 'first') !== null && b ? yr(b.split(/,| and /)[0], 'max') : yr(a, 'first'),
    approxStart: /c\./.test(a ?? ''),
    approxEnd: /c\./.test(b ?? ''),
  };
}

function splitSections(file, text) {
  const lines = text.split('\n');
  const heads = [];
  lines.forEach((l, i) => {
    const m = l.match(/^## (\d{1,2})\. (.+)$/);
    if (m) heads.push({ n: +m[1], title: m[2], line: i });
    else if (/^## /.test(l)) fail(file, i + 1, `unnumbered H2 "${l}"`);
  });
  return { lines, heads };
}

function parsePeriod(file) {
  const text = stripImageBlocks(raw[file]);
  const cfg = erasCfg.files[file];
  if (!cfg) fail('data/eras.json', 0, `no era configuration for ${file}`);
  const { lines, heads } = splitSections(file, text);

  // H1
  const h1 = lines[0].match(/^# (.+)$/);
  if (!h1) fail(file, 1, 'first line is not an H1');
  const h1Text = h1?.[1] ?? '';
  const dm = h1Text.match(/^(.*)\s\(([^()]*\d[^()]*)\)$/);
  if (!dm) fail(file, 1, 'H1 lacks a date range in final parentheses');
  const title = dm ? dm[1] : h1Text;
  const dateLabel = dm ? dm[2] : '';
  const span = parseYears(dateLabel);

  // sections 1..14 with canonical names
  if (heads.length !== 14) fail(file, 0, `expected 14 numbered sections, found ${heads.length}`);
  heads.forEach((h, i) => {
    if (h.n !== i + 1) fail(file, h.line + 1, `section ${h.n} out of order (expected ${i + 1})`);
    const [base, ...q] = h.title.split(' — ');
    if (base !== CANONICAL[h.n]) fail(file, h.line + 1, `section ${h.n} heading "${base}" ≠ canonical "${CANONICAL[h.n]}"`);
    h.name = base;
    h.qualifier = q.length ? q.join(' — ') : null;
  });

  const preamble = lines.slice(1, heads[0]?.line ?? 1).join('\n').trim();
  const sections = [];
  let fiveThings = null;
  let constitution = null;
  let matrix = null;
  let matrixRef = null;
  const glossSeen = new Set();
  const usedTerms = new Set();
  const ctxFor = () => ({ ...baseCtx(file), glossary: glossaryMatcher, glossSeen, usedTerms });

  for (let i = 0; i < heads.length; i++) {
    const h = heads[i];
    const startLine = h.line + 1;
    const endLine = i + 1 < heads.length ? heads[i + 1].line : lines.length;
    let body = lines.slice(startLine, endLine);
    const lineOf = (k) => startLine + k + 1;

    if (h.n === 14) {
      const k = body.findIndex((l) => /^### If you remember only 5 things/.test(l));
      if (k < 0) fail(file, lineOf(0), 'missing "If you remember only 5 things"');
      else {
        const tree = parseMd(body.slice(k + 1).join('\n'));
        const list = tree.children.find((n) => n.type === 'list' && n.ordered);
        if (!list || list.children.length !== 5) fail(file, lineOf(k), '"5 things" must be an ordered list of exactly 5');
        else fiveThings = list.children.map((li) => renderInline(li.children.flatMap((c) => c.children ?? [c]), ctxFor()));
        body = body.slice(0, k);
        while (body.length && /^(---|\s*)$/.test(body.at(-1))) body.pop();
      }
    }

    glossSeen.clear(); // tooltip on the first occurrence in each (collapsible) section
    const md = body.join('\n');
    const section = { n: h.n, name: h.name, qualifier: h.qualifier, blocks: [] };
    const html = (nodes) => ({ type: 'html', html: renderBlocks(nodes, ctxFor()) });

    if (h.n === 8) {
      // Transition chain — split at raw level: steps begin with **LABEL…:**, arrows are lines "↓".
      const stepRe = /^\*\*(BEFORE|PRESSURES|TRANSITION|AFTER)(?: \((.*)\))?:\*\*\s*(.*)$/;
      const idxs = body.map((l, k) => (stepRe.test(l) ? k : -1)).filter((k) => k >= 0);
      const order = idxs.map((k) => body[k].match(stepRe)[1]).join(',');
      if (order !== 'BEFORE,PRESSURES,TRANSITION,AFTER')
        fail(file, lineOf(idxs[0] ?? 0), `transition steps are "${order}", expected BEFORE,PRESSURES,TRANSITION,AFTER`);
      const intro = body.slice(0, idxs[0] ?? body.length).join('\n').trim();
      if (intro) section.blocks.push({ type: 'html', html: renderMd(intro, ctxFor()) });
      const steps = idxs.map((k, j) => {
        const m = body[k].match(stepRe);
        const chunk = [m[3], ...body.slice(k + 1, idxs[j + 1] ?? body.length)]
          .filter((l) => l.trim() !== '↓')
          .join('\n')
          .trim();
        return { label: m[1], qualifier: m[2] ?? null, html: renderMd(chunk, ctxFor()) };
      });
      section.blocks.push({ type: 'transition', steps });
      sections.push(section);
      continue;
    }

    const tree = parseMd(md);
    const nodes = tree.children;
    let buf = [];
    const flush = () => {
      if (buf.length) section.blocks.push(html(buf));
      buf = [];
    };

    for (let k = 0; k < nodes.length; k++) {
      const n = nodes[k];
      const line = startLine + n.position.start.line;

      if (h.n === 2 && n.type === 'heading' && n.depth === 3 && /^Regime Matrix/.test(mdText(n))) {
        const ht = mdText(n);
        const rawHeading = `### ${md.split('\n')[n.position.start.line - 1].replace(/^###\s*/, '')}`;
        if (matrix || matrixRef) fail(file, line, 'more than one "Regime Matrix" heading');
        let mtitle;
        if (ht.startsWith('Regime Matrix — ')) mtitle = ht.slice('Regime Matrix — '.length);
        else if (allowed(file, 'matrix-heading-form', rawHeading)) mtitle = ht.replace(/^Regime Matrix\s*\(?|\)$/g, '');
        else {
          fail(file, line, `matrix heading "${ht}" must be "Regime Matrix — …"`);
          mtitle = ht;
        }
        flush();
        const next = nodes[k + 1];
        if (next?.type === 'table') {
          const rows = next.children.slice(1).map((r) => ({
            q: +mdText(r.children[0]).trim(),
            question: mdText(r.children[1]).trim(),
            answerHtml: renderInline(r.children[2].children, ctxFor()),
          }));
          const head = next.children[0].children.map((c) => mdText(c).trim()).join('|');
          if (head !== '#|Question|Answer') fail(file, line, `matrix header "${head}" ≠ "#|Question|Answer"`);
          if (rows.length !== 12 || rows.some((r, j) => r.q !== j + 1)) fail(file, line, 'matrix must have rows 1–12');
          matrix = { title: mtitle, headingHtml: renderInline(n.children, ctxFor()), rows };
          section.blocks.push({ type: 'matrix' });
          k++;
        } else if (next?.type === 'paragraph' && mdText(next).startsWith('Matrix:')) {
          if (mtitle !== 'cross-reference') fail(file, line, 'cross-reference matrix heading must be "Regime Matrix — cross-reference"');
          const targets = [];
          (function visit(x) {
            if (x.type === 'inlineCode') targets.push(x.value);
            x.children?.forEach(visit);
          })(next);
          const resolved = targets.map((t) => ({ target: t, res: resolveXref(t, file) }));
          for (const r of resolved) if (!r.res) fail(file, line, `matrix cross-reference ${r.target} does not resolve`);
          matrixRef = {
            html: renderInline(next.children, ctxFor()),
            targets: resolved.map((r) => ({ file: r.res?.kb, slug: r.res?.kb ? periodSlug(r.res.kb) : null })),
          };
          section.blocks.push({ type: 'matrixRef' });
          k++;
        } else fail(file, line, 'Regime Matrix heading not followed by a 12-row table or a "**Matrix:** see …" line');
        continue;
      }

      if (
        h.n === 2 &&
        n.type === 'paragraph' &&
        n.children[0]?.type === 'strong' &&
        mdText(n.children[0]).trim() === 'What the constitution said vs how power actually worked:'
      ) {
        if (constitution) fail(file, line, 'more than one constitution-vs-reality paragraph');
        flush();
        const rest = n.children.slice(1);
        const lead = renderInline(rest, ctxFor()).trim();
        constitution = { leadHtml: lead || null, items: null, tableHtml: null };
        const next = nodes[k + 1];
        if (/:\s*$/.test(mdText(n)) && next && (next.type === 'list' || next.type === 'table')) {
          if (next.type === 'list') {
            constitution.items = next.children.map((li) => {
              const p = li.children[0];
              const first = p?.children?.[0];
              const label =
                first?.type === 'emphasis' && /:$/.test(mdText(first).trim()) ? mdText(first).trim().replace(/:$/, '') : null;
              const kids = label ? p.children.slice(1) : p.children;
              return {
                label,
                side: label ? (/^Said/.test(label) ? 'said' : /^Worked/.test(label) ? 'worked' : null) : null,
                html: renderInline(kids, ctxFor()).trim() + renderBlocks(li.children.slice(1), ctxFor()),
              };
            });
          } else constitution.tableHtml = renderTable(next, ctxFor(), { caption: 'What the constitution said vs how power actually worked' });
          k++;
        }
        section.blocks.push({ type: 'constitution' });
        continue;
      }

      if (h.n === 11 && n.type === 'table') {
        const head = n.children[0].children.map((c) => mdText(c).trim()).join('|');
        if (head !== 'Misconception|Correction') fail(file, line, `misconception table header "${head}"`);
        flush();
        section.blocks.push({
          type: 'misconceptions',
          items: n.children.slice(1).map((r) => ({
            mythHtml: renderInline(r.children[0].children, ctxFor()),
            correctionHtml: renderInline(r.children[1].children, ctxFor()),
            myth: mdText(r.children[0]).trim(),
          })),
        });
        continue;
      }

      if (h.n === 12 && n.type === 'list') {
        flush();
        section.blocks.push({
          type: 'debates',
          items: n.children.map((li) => {
            const p = li.children[0];
            const first = p?.children?.[0];
            const hasTitle = first?.type === 'strong';
            const rest = hasTitle ? p.children.slice(1) : p.children;
            const bodyHtml = (renderInline(rest, ctxFor()).replace(/^\s*[:—–-]?\s*/, '') || '') + renderBlocks(li.children.slice(1), ctxFor());
            return {
              titleHtml: hasTitle ? renderInline(first.children, ctxFor()).replace(/[:.]\s*$/, '') : null,
              bodyHtml,
              contested: /\bCONTESTED\b/.test(mdText(li)),
            };
          }),
        });
        continue;
      }

      if (h.n === 13 && n.type === 'table') {
        const head = n.children[0].children.map((c) => mdText(c).trim());
        const ci = head.indexOf('Confidence');
        if (ci < 0) fail(file, line, 'confidence table has no "Confidence" column');
        flush();
        const extra = head.map((hd, j) => ({ hd, j })).filter(({ j }) => j !== 0 && j !== ci);
        section.blocks.push({
          type: 'confidence',
          extraHeads: extra.map((e) => e.hd),
          rows: n.children.slice(1).map((r) => {
            const t = mdText(r.children[ci]).trim();
            const parsed = parseConfidence(t);
            if (!parsed) fail(file, startLine + r.position.start.line, `confidence "${t}" is outside the closed vocabulary (§4)`);
            return {
              findingHtml: renderInline(r.children[0].children, ctxFor()),
              finding: mdText(r.children[0]).trim(),
              ...(parsed ?? { levels: [], qualifier: null, text: t }),
              extraHtml: extra.map((e) => renderInline(r.children[e.j]?.children ?? [], ctxFor())),
            };
          }),
        });
        continue;
      }

      if (h.n === 14 && n.type === 'list') {
        flush();
        section.blocks.push({
          type: 'sources',
          items: n.children.map((li) => {
            const t = mdText(li);
            const lv = t.match(/\bLevel ([A-F](?:\/[A-F])*)(?![A-Za-z])([^)]*)/);
            const urls = [];
            (function visit(x) {
              if (x.type === 'link' && /^https?:/.test(x.url)) urls.push(x.url);
              x.children?.forEach(visit);
            })(li);
            const bib = urls.map((u) => bibByUrl.get(normUrl(u))).find(Boolean) ?? null;
            if (!lv && !/\(primary\)/.test(t)) warn(file, `source without a level: ${t.slice(0, 70)}…`);
            return {
              html: renderInline(li.children.flatMap((c) => (c.type === 'paragraph' ? c.children : [c])), ctxFor()),
              level: lv ? lv[1] : null,
              levelNote: lv && lv[2] ? lv[2].replace(/^[;,]\s*/, '') : null,
              primary: /\(primary\)/.test(t),
              url: urls[0] ?? null,
              access: bib?.access ?? null,
            };
          }),
        });
        continue;
      }

      buf.push(n);
    }
    flush();
    if (h.n === 11 && !section.blocks.some((b) => b.type === 'misconceptions')) fail(file, lineOf(0), 'no misconception table');
    if (h.n === 13 && !section.blocks.some((b) => b.type === 'confidence')) fail(file, lineOf(0), 'no confidence table');
    if (h.n === 12 && !section.blocks.some((b) => b.type === 'debates')) warn(file, '§12 has no bullet list of debates; rendered as prose');
    sections.push(section);
  }

  if (!matrix && !matrixRef) fail(file, 0, '§2 has no "Regime Matrix" heading');
  if (!constitution) fail(file, 0, '§2 has no "What the constitution said vs how power actually worked:" paragraph');

  const imgs = (imageBlocks[file] ?? []).map((b) => ({ id: b.id, captionHtml: b.captionHtml }));
  if (!imgs.length) fail(file, 0, 'no image block');

  const group = erasCfg.groups.find((g) => g.id === cfg?.group);
  const lead = sections[0]?.blocks.find((b) => b.type === 'html')?.html ?? '';
  return {
    slug: periodSlug(file),
    file,
    folder: file.split('/')[0],
    order: periodFiles.indexOf(file),
    title,
    titleHtml: renderMdInline(title, baseCtx(file)),
    dateLabel,
    span,
    group: cfg?.group ?? null,
    groupLabel: group?.label ?? null,
    mood: cfg?.mood ?? group?.mood ?? null,
    sensitive: cfg?.sensitive === true,
    sensitiveSections: Array.isArray(cfg?.sensitiveSections) ? cfg.sensitiveSections : null,
    preambleHtml: preamble ? renderMd(preamble, baseCtx(file)) : null,
    leadHtml: lead,
    images: imgs,
    sections,
    matrix,
    matrixRef,
    constitution,
    fiveThings,
    auditClaims: auditMap[file] ?? [],
    glossaryTerms: [...usedTerms],
  };
}

const periods = periodFiles.map(parsePeriod);
{
  const slugs = periods.map((p) => p.slug);
  const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dup.length) fail('site', 0, `duplicate period slugs: ${dup.join(', ')}`);
  for (const p of periods) if (p.span.start === null || p.span.end === null) fail(p.file, 1, `cannot parse years from "${p.dateLabel}"`);
}
for (const f of Object.keys(erasCfg.files)) if (!periodFiles.includes(f)) fail('data/eras.json', 0, `configured file ${f} does not exist`);
for (const [f, claims] of Object.entries(auditMap))
  for (const c of claims) if (!audit.find((a) => a.n === c)) fail('data/audit-map.json', 0, `${f}: no audit claim ${c}`);

// ───────────────────────── glossary candidates (for review, never auto-published) ─────────────────────────
const glossaryCandidates = [];
const GERMANISH = /[äöüßÄÖÜ]|^[A-ZÄÖÜ][a-zäöüß]+(?:[a-zäöüß]{6,})$|(ung|keit|heit|schaft|recht|stadt|land|reich|tum|wesen|kammer|bund|rat|tag)(e|en|er|s)?$/;
for (const f of kbFiles) {
  if (f.startsWith('sources/')) continue;
  const text = stripImageBlocks(raw[f]).split(/^## 14\. Sources/m)[0];
  const tree = parseMd(text);
  (function visit(node, parent) {
    if (node.type === 'emphasis' && parent) {
      const term = mdText(node).trim();
      if (!GERMANISH.test(term) || term.split(' ').length > 4) return;
      if (glossaryIndex.has(term)) return;
      const i = parent.children.indexOf(node);
      const before = parent.children[i - 1];
      const after = parent.children[i + 1];
      let candidate = null;
      if (before?.type === 'text' && /\($/.test(before.value.trimEnd()) && after?.type === 'text' && /^[,)]/.test(after.value)) {
        candidate = before.value.trimEnd().slice(0, -1).split(/[.;:—,"]/).pop().trim().split(' ').slice(-6).join(' ');
      } else if (after?.type === 'text' && /^ \(([^)]+)\)/.test(after.value)) {
        candidate = after.value.match(/^ \(([^),;]+)/)[1];
      }
      glossaryCandidates.push({ term, candidateGloss: candidate || null, file: f, line: node.position.start.line });
      return;
    }
    node.children?.forEach((c) => visit(c, node));
  })(tree, null);
}

// ───────────────────────── schema check ─────────────────────────
for (const p of periods) {
  const r = Period.safeParse(p);
  if (!r.success) for (const i of r.error.issues) fail(p.file, 0, `schema: ${i.path.join('.')} ${i.message}`);
}
for (const im of images) {
  const r = Image.safeParse(im);
  if (!r.success) for (const i of r.error.issues) fail('images/IMAGE_INDEX.md', 0, `schema (${im.id}): ${i.path.join('.')} ${i.message}`);
}

// ───────────────────────── write / report ─────────────────────────
exceptionsCfg.forEach((e, i) => {
  if (!usedExceptions.has(i)) fail('data/template-exceptions.json', 0, `stale exception (no longer matches): ${e.file} ${e.rule}`);
});

const report = {
  generatedAt: new Date().toISOString(),
  counts: {
    kbFiles: kbFiles.length,
    periods: periods.length,
    themes: themeFiles.length,
    images: images.length,
    imagesPublicDomain: images.filter((i) => i.rights !== '©').length,
    auditClaims: audit.length,
    bibliography: bibliography.length,
    glossary: glossary.length,
    glossaryCandidates: glossaryCandidates.length,
    matrices: periods.filter((p) => p.matrix).length,
    matrixCrossRefs: periods.filter((p) => p.matrixRef).length,
  },
  exceptionsApplied: exceptionsCfg,
  kbIssues,
  warnings,
  glossaryCandidates,
};

if (errors.length) {
  console.error(`\n✖ build-content: ${errors.length} template/validation error(s):\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error('\nFix the knowledge base, or add a reviewed entry to data/template-exceptions.json.\n');
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
const write = (name, data) => fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(data, null, 1));
write('periods', periods);
write('images', images);
write('glossary', glossary);
write('audit', audit);
write('bibliography', bibliography);
write('method', { confidenceScale, sourceLevels, canonicalSections: CANONICAL, groups: erasCfg.groups, ruptures: erasCfg.ruptures.years });
write('report', report);

console.log('✔ build-content: knowledge base parsed and validated');
for (const [k, v] of Object.entries(report.counts)) console.log(`  ${k.padEnd(20)} ${v}`);
console.log(`  exceptions applied   ${exceptionsCfg.length} (data/template-exceptions.json)`);
console.log(`  KB issues logged     ${kbIssues.length}`);
console.log(`  warnings             ${warnings.length}`);
if (process.argv.includes('--verbose')) {
  for (const w of warnings) console.log(`   ⚠ ${w}`);
  for (const k of kbIssues) console.log(`   ⚑ ${k.file} — ${k.item}: ${k.detail}`);
}
