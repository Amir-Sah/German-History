// Typed access to the generated content model (src/content/generated/*.json, built by
// scripts/build-content.mjs). Templates must take all historical text from here.
import periodsJson from '../content/generated/periods.json';
import imagesJson from '../content/generated/images.json';
import glossaryJson from '../content/generated/glossary.json';
import auditJson from '../content/generated/audit.json';
import methodJson from '../content/generated/method.json';
import { BUILT_ERAS } from '../../scripts/lib/scope.mjs';

export type Period = (typeof periodsJson)[number];
export type ImageRec = (typeof imagesJson)[number];

export const periods = periodsJson as Period[];
export const images = imagesJson as ImageRec[];
export const glossary = glossaryJson;
export const audit = auditJson;
export const method = methodJson;
export const builtEras: string[] = BUILT_ERAS;

export const imageById = new Map(images.map((i) => [i.id, i]));
export const isBuiltEra = (slug: string) => builtEras.includes(slug);
export const eraHref = (slug: string) => (isBuiltEra(slug) ? `/eras/${slug}/` : null);

/** PUBLIC_BUILD=1 renders © images as credit-and-link cards (decision of 27 Sept 2026). */
export const PUBLIC_BUILD = process.env.PUBLIC_BUILD === '1';

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
