// Typed access to the generated content model (src/content/generated/*.json, built by
// scripts/build-content.mjs). Templates must take all historical text from here.
import periodsJson from '../content/generated/periods.json';
import imagesJson from '../content/generated/images.json';
import auditJson from '../content/generated/audit.json';
import methodJson from '../content/generated/method.json';
import kbTitlesJson from '../content/generated/kb-titles.json';
import dictionaryJson from '../content/generated/dictionary.json';
import { BUILT_ERAS } from '../../scripts/lib/scope.mjs';

export type Period = (typeof periodsJson)[number];
export type ImageRec = (typeof imagesJson)[number];

export const periods = periodsJson as Period[];
export const images = imagesJson as ImageRec[];
export const audit = auditJson;
export const method = methodJson;
export const builtEras: string[] = BUILT_ERAS;

export const kbTitles = kbTitlesJson as Record<string, string>;
export type DictEntry = (typeof dictionaryJson.entries)[number];
export const dictionary = dictionaryJson.entries as DictEntry[];
export const dictById = new Map(dictionary.map((e) => [e.id, e]));
/** Files that are reading chapters (for "Also in" lists): not the image index, method, README, sources or dictionary. */
export const isChapterFile = (f: string) =>
  !/^(images|sources|dictionary)\//.test(f) && !['01_RESEARCH_METHOD.md', '00_README.md'].includes(f);
/** Site URL of a KB file if that page is built, else null. */
export const kbHref = (file: string): string | null => {
  const p = periods.find((x) => x.file === file);
  return p ? eraHref(p.slug) : null;
};
export const imageById = new Map(images.map((i) => [i.id, i]));
export const isBuiltEra = (slug: string) => builtEras.includes(slug);
export const eraHref = (slug: string) => (isBuiltEra(slug) ? `/eras/${slug}/` : null);

/** PUBLIC_BUILD=1 renders © images as credit-and-link cards (decision of 27 Sept 2026). */
export const PUBLIC_BUILD = process.env.PUBLIC_BUILD === '1';

// Local copies made by scripts/download-images.mjs (optional). Never used for © images in PUBLIC_BUILD.
import fs from 'node:fs';
const manifestFile = new URL('../../public/img-cache/manifest.json', import.meta.url);
const imageCache: Record<string, { file: string }> = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};
export const localImage = (id: string) => imageCache[id]?.file ?? null;

// Measured image sizes (qa/image-urls.mjs --write-sizes); absent → a 4:3 frame.
const sizesFile = new URL('../../data/image-sizes.json', import.meta.url);
const imageSizes: Record<string, [number, number]> = fs.existsSync(sizesFile) ? JSON.parse(fs.readFileSync(sizesFile, 'utf8')).sizes : {};
export const imageSize = (id: string) => imageSizes[id] ?? null;

export const RIBBON = { from: -500, to: 2026 };

export const LEVEL_ORDER = ['HIGH', 'MEDIUM', 'UNCERTAIN', 'CONTESTED', 'REJECTED'] as const;
export const levelMeaning = (label: string) =>
  method.confidenceScale.find((c) => c.label === label)?.meaning ?? '';
export const sourceLevelMeaning = (level: string) =>
  level
    .split('/')
    .map((l) => {
      const s = method.sourceLevels.find((x) => x.level === l);
      return s ? `Level ${l}: ${s.type}` : `Level ${l}`;
    })
    .join(' · ');

export const fmtYear = (y: number) => (y < 0 ? `${-y} BCE` : `${y}`);
