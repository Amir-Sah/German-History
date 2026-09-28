// Knowledge-base path → site URL. One place, so every cross-reference resolves the same way.
import path from 'node:path';

export const PERIOD_FOLDERS = [
  'ancient',
  'medieval',
  'early_modern',
  'nineteenth_century',
  'twentieth_century',
  'contemporary',
];

export function periodSlug(file) {
  return path.basename(file, '.md').replace(/^\d+_/, '').replaceAll('_', '-');
}

export function themeSlug(file) {
  return path.basename(file, '.md').replaceAll('_', '-');
}

const TOP = {
  '00_FINAL_EXPLANATION.md': '/',
  '00_README.md': '/about/',
  '01_RESEARCH_METHOD.md': '/how-we-know/',
  '02_MASTER_TIMELINE.md': '/timeline/',
  '03_MENTAL_MODEL.md': '/mental-model/',
  '04_QUESTIONS_WORTH_EXPLORING.md': '/questions/',
  '05_REGIME_MATRIX.md': '/regimes/',
  'images/IMAGE_INDEX.md': '/gallery/',
  'sources/SOURCE_AUDIT.md': '/how-we-know/audit/',
};

/**
 * @param {string[]} kbFiles  all KB markdown paths (repo-relative)
 * @param {(href:string)=>boolean} isBuilt  whether a site URL exists in this build
 */
export function makeResolver(kbFiles, isBuilt, titles = {}) {
  const fileSet = new Set(kbFiles);

  function kbToHref(kb, section) {
    let href = null;
    if (TOP[kb]) href = TOP[kb];
    else if (PERIOD_FOLDERS.includes(kb.split('/')[0])) href = `/eras/${periodSlug(kb)}/`;
    else if (kb.startsWith('themes/')) href = `/themes/${themeSlug(kb)}/`;
    else if (kb.startsWith('sources/')) href = `/sources/#${path.basename(kb, '.md').toLowerCase().replaceAll('_', '-')}`;
    if (!href) return null;
    const page = href.split('#')[0];
    const anchor = section ? `#s${section}` : '';
    const title = titles[kb] ?? kb;
    return isBuilt(page) ? { href: href + anchor, kb, title, section } : { pending: true, kb, title, section };
  }

  function findKb(target, fromFile) {
    let t = target.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
    const candidates = [t];
    if (fromFile) candidates.push(path.posix.join(path.posix.dirname(fromFile), target));
    for (const c of candidates) {
      const norm = path.posix.normalize(c);
      if (fileSet.has(norm)) return norm;
    }
    // Short forms such as `ancient/01` or `twentieth_century/04`
    const m = t.match(/^([a-z_]+)\/(\d{2})$/);
    if (m) return kbFiles.find((f) => f.startsWith(`${m[1]}/${m[2]}_`)) ?? null;
    // Short forms relative to the current folder such as `04` are not used in the KB.
    return null;
  }

  /** Resolve inline-code or link targets. Returns {href}|{pending}|null. */
  return function resolve(raw, fromFile) {
    const value = raw.trim();
    const [target, hash] = value.split('#');
    const secMatch = target.match(/^(\S+?)\s*§\s*(\d+)/);
    const fileTarget = secMatch ? secMatch[1] : target.split(/\s/)[0];
    if (!/\.md$|^[a-z_]+\/\d{2}$/.test(fileTarget)) return null;
    const kb = findKb(fileTarget, fromFile);
    if (!kb) return null;
    const res = kbToHref(kb, secMatch?.[2]);
    if (res?.href && hash && kb === 'images/IMAGE_INDEX.md') res.href = `/gallery/#${hash}`;
    return res;
  };
}
