// Typed access to the generated content model (src/content/generated/*.json, built by
// scripts/build-content.mjs). Templates must take all historical text from here.
import periodsJson from '../content/generated/periods.json';
import imagesJson from '../content/generated/images.json';
import auditJson from '../content/generated/audit.json';
import methodJson from '../content/generated/method.json';
import kbTitlesJson from '../content/generated/kb-titles.json';
import dictionaryJson from '../content/generated/dictionary.json';
import scopeJson from '../content/generated/scope.json';
import journeyJson from '../content/generated/journey.json';

export type Period = (typeof periodsJson)[number];
export type ImageRec = (typeof imagesJson)[number];

export const periods = periodsJson as Period[];
export const images = imagesJson as ImageRec[];
export const audit = auditJson;
export const method = methodJson;
export const builtEras: string[] = scopeJson.builtEras;

export const kbTitles = kbTitlesJson as Record<string, string>;
export const journey = journeyJson;
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

// Measured image sizes and optional local copies (via src/content/generated/image-layout.json).
import imageLayoutJson from '../content/generated/image-layout.json';
const imageLayout = imageLayoutJson as { sizes: Record<string, [number, number]>; local: Record<string, string>; takedowns?: string[] };
export const localImage = (id: string) => imageLayout.local[id] ?? null;
export const imageSize = (id: string) => imageLayout.sizes[id] ?? null;
// Images removed at a rights holder's request (data/takedowns.json): shown only as credit-and-link cards.
export const isTakenDown = (id: string) => (imageLayout.takedowns ?? []).includes(id);

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
