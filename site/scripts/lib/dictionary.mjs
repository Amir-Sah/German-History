// dictionary/{people,places,terms,ambiguous_forms}.md → entries + a build-time matcher
// (SITE_CHANGELOG_AND_TASKS.md, Part C1–C2). Parsing is strict: malformed entries, duplicate ids,
// unknown main chapters or unresolvable ambiguity links fail the build.

const FIELD = /^- \*\*([A-Za-z ]+):\*\* (.*)$/;
const KNOWN_FIELDS = ['Kind', 'Dates', 'Also written as', 'Ambiguous forms', 'Short', 'Explanation', 'German', 'Main chapter', 'Also in', 'Basis', 'Note'];
const REQUIRED = ['Kind', 'Short', 'Explanation', 'Main chapter', 'Basis'];
const KINDS = { 'people.md': 'person', 'places.md': 'place', 'terms.md': 'term' };

const splitList = (v) => v.split(' · ').map((s) => s.trim()).filter(Boolean);
const codePath = (v) => [...v.matchAll(/`([^`]+)`/g)].map((m) => m[1].replace(/^\.\.\//, ''));
const stripInline = (s) => s.replace(/\*\*?([^*]+)\*\*?/g, '$1').replace(/`([^`]+)`/g, '$1');

/**
 * @param {Record<string,string>} raw  KB path → file text
 * @param {Set<string>} kbFileSet  existing KB markdown paths
 * @param {(file:string,line:number,msg:string)=>void} fail
 */
export function parseDictionary(raw, kbFileSet, fail) {
  const entries = [];
  const byId = new Map();
  for (const [name, kind] of Object.entries(KINDS)) {
    const file = `dictionary/${name}`;
    const text = raw[file];
    if (!text) { fail(file, 0, 'dictionary file missing'); continue; }
    const lines = text.split('\n');
    let cur = null;
    const close = () => {
      if (!cur) return;
      for (const f of REQUIRED) if (!cur.fields[f]) fail(file, cur.line, `entry "${cur.name}" lacks **${f}:**`);
      if (!cur.id) fail(file, cur.line, `entry "${cur.name}" has no <a id>`);
      const k = (cur.fields.Kind ?? '').split(' · ');
      if (k[0] !== kind) fail(file, cur.line, `entry "${cur.name}" has Kind "${k[0]}", expected ${kind}`);
      const main = codePath(cur.fields['Main chapter'] ?? '')[0];
      if (!main || !kbFileSet.has(main)) fail(file, cur.line, `entry "${cur.name}": main chapter ${main ?? '(none)'} does not exist`);
      const also = codePath(cur.fields['Also in'] ?? '');
      for (const a of also) if (!kbFileSet.has(a)) fail(file, cur.line, `entry "${cur.name}": "Also in" ${a} does not exist`);
      if (cur.id && byId.has(cur.id)) fail(file, cur.line, `duplicate id "${cur.id}" (also in ${byId.get(cur.id).file})`);
      const e = {
        id: cur.id,
        file,
        line: cur.line,
        kind,
        subkind: k[1] ?? null,
        name: cur.name,
        forms: [...new Set([cur.name, ...splitList(cur.fields['Also written as'] ?? '')])],
        ambiguousForms: cur.fields['Ambiguous forms'] ? splitList(cur.fields['Ambiguous forms'].replace(/\s*\(see `ambiguous_forms\.md`\)/g, '')) : [],
        dates: cur.fields.Dates ?? null,
        short: stripInline(cur.fields.Short ?? ''),
        explanation: stripInline(cur.fields.Explanation ?? ''),
        german: cur.fields.German ?? null,
        main: main ?? null,
        also,
        basis: cur.fields.Basis ?? null,
        note: cur.fields.Note ?? null,
      };
      if (!['KB', 'KB+K'].includes(e.basis)) fail(file, cur.line, `entry "${cur.name}": Basis "${e.basis}" is not KB or KB+K`);
      entries.push(e);
      if (e.id) byId.set(e.id, e);
      cur = null;
    };
    lines.forEach((l, i) => {
      const h = l.match(/^### (.+)$/);
      if (h) { close(); cur = { name: h[1].trim(), line: i + 1, id: null, fields: {} }; return; }
      if (/^## /.test(l)) { close(); return; }
      if (!cur) return;
      const a = l.match(/^<a id="([^"]+)"><\/a>$/);
      if (a) { cur.id = a[1]; return; }
      const f = l.match(FIELD);
      if (f) {
        if (!KNOWN_FIELDS.includes(f[1])) fail(file, i + 1, `unknown field "${f[1]}"`);
        else if (cur.fields[f[1]]) fail(file, i + 1, `field "${f[1]}" repeated`);
        cur.fields[f[1]] = f[2].trim();
      } else if (l.trim() && !/^- /.test(l)) fail(file, i + 1, `unexpected line in entry "${cur.name}": ${l.slice(0, 60)}`);
      else if (/^- /.test(l)) fail(file, i + 1, `malformed field line: ${l.slice(0, 60)}`);
    });
    close();
  }

  // ambiguous_forms.md: | Form | Chapter | Means |
  const amb = new Map(); // form → Map(chapter → id|null)
  const af = 'dictionary/ambiguous_forms.md';
  let skippedSiteRows = 0;
  (raw[af] ?? '').split('\n').forEach((l, i) => {
    const m = l.match(/^\| (.+?) \| `([^`]+)` \| (.+?) \|$/);
    if (!m) return;
    const [, form, chapter, means] = m;
    // Rows that point into the website folder (site/…) are not KB chapters: skipped and reported (CONTENT_TRACE K19).
    if (chapter.startsWith('site/')) { skippedSiteRows++; return; }
    if (!kbFileSet.has(chapter)) fail(af, i + 1, `chapter ${chapter} does not exist`);
    let id = null;
    if (means.trim() !== '—') {
      const link = means.match(/\]\((people|places|terms)\.md#([^)]+)\)/);
      if (!link || !byId.has(link[2])) fail(af, i + 1, `"${form}" in ${chapter}: target ${means} not found`);
      else id = link[2];
    }
    if (!amb.has(form)) amb.set(form, new Map());
    if (amb.get(form).has(chapter)) fail(af, i + 1, `"${form}" in ${chapter} listed twice`);
    amb.get(form).set(chapter, id);
  });
  return { entries, byId, amb, skippedSiteRows };
}

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A–Z bucket of an entry (the dictionary is published one page per letter; digits and symbols → "num"). */
export function dictLetter(name) {
  const c = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')[0];
  return c && /[a-z]/.test(c) ? c : 'num';
}
export const dictHref = (e) => `/dictionary/${dictLetter(e.name)}/#${e.id}`;

/**
 * Surface forms the site matches for an entry (user review of 29 Sept 2026, CONTENT_TRACE D3):
 * - hyphenated compounds whose first part is already a form of the entry ("Moscow-aligned") are not used;
 *   the matcher links just "Moscow" inside such compounds;
 * - lowercase single-word alternative forms that are not a case variant or plural of one of the entry's
 *   names are not used: they are ordinary derived words ("tolerated", "feudal", "nationalist").
 */
export function matchForms(e) {
  const isLowerWord = (f) => /^\p{Ll}[\p{L}']*$/u.test(f);
  const heads = new Set(
    e.forms.filter((f) => f === e.name || !isLowerWord(f)).flatMap((f) => [f.toLowerCase(), f.toLowerCase().split(/[\s-]/).pop()]),
  );
  const pluralOrCase = (f) => {
    const base = f.replace(/ies$/, 'y').replace(/(es|s)$/, '');
    return [...heads].some((h) => h === f || h === base || h + 's' === f || h + 'es' === f || h.replace(/y$/, 'ies') === f);
  };
  return e.forms.filter((f) => {
    if (f === e.name) return true;
    const compound = f.match(/^(.+?)-\p{Ll}/u);
    if (compound && e.forms.includes(compound[1])) return false;
    if (isLowerWord(f) && !pluralOrCase(f)) return false;
    return true;
  });
}

/**
 * Build-time matcher. A surface form is ambiguous when ambiguous_forms.md lists it, or when several entries
 * claim it; ambiguous forms are highlighted only where the table names an entry for that chapter.
 */
export function makeMatcher({ entries, byId, amb }, overrides = []) {
  // Site-side suppressions for dictionary misreadings (data/dictionary-overrides.json), each reported to the KB owner.
  const suppress = new Set(overrides.map((o) => `${o.form}\u0000${o.chapter}`));
  const formOwners = new Map();
  for (const e of entries) for (const f of matchForms(e)) {
    if (!formOwners.has(f)) formOwners.set(f, new Set());
    formOwners.get(f).add(e.id);
  }
  const forms = [...new Set([...formOwners.keys(), ...amb.keys()])].filter((f) => f.length > 1).sort((a, b) => b.length - a.length);
  const re = new RegExp(`(?<![\\p{L}\\p{N}\\-’'])(${forms.map(escRe).join('|')})(?![\\p{L}\\p{N}]|-(?!\\p{Ll}))`, 'gu');

  function resolve(form, chapter) {
    if (suppress.has(`${form}\u0000${chapter}`) || suppress.has(`${form}\u0000*`)) return null;
    if (amb.has(form)) return amb.get(form).get(chapter) ?? null; // missing row or "—" → plain text
    const owners = formOwners.get(form);
    if (!owners || owners.size !== 1) return null; // claimed by several entries and not in the table → plain
    return [...owners][0];
  }

  /** Split plain text into [{text}|{text, entry}] for one chapter. */
  function split(text, chapter) {
    const out = [];
    let last = 0;
    for (const m of text.matchAll(re)) {
      const id = resolve(m[1], chapter);
      if (!id) continue;
      if (m.index > last) out.push({ text: text.slice(last, m.index) });
      out.push({ text: m[1], entry: byId.get(id) });
      last = m.index + m[1].length;
    }
    if (last < text.length) out.push({ text: text.slice(last) });
    return out;
  }
  return { split, resolve, formCount: forms.length };
}
