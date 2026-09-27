// Shape of the generated content model (PLAN.md §2). Validated before anything is written.
import { z } from 'zod';

const Level = z.enum(['HIGH', 'MEDIUM', 'UNCERTAIN', 'CONTESTED', 'REJECTED']);
const Html = z.string();
const Block = z.discriminatedUnion('type', [
  z.object({ type: z.literal('html'), html: Html }),
  z.object({ type: z.literal('matrix') }),
  z.object({ type: z.literal('matrixRef') }),
  z.object({ type: z.literal('constitution') }),
  z.object({
    type: z.literal('transition'),
    steps: z
      .array(z.object({ label: z.enum(['BEFORE', 'PRESSURES', 'TRANSITION', 'AFTER']), qualifier: z.string().nullable(), html: Html }))
      .length(4),
  }),
  z.object({ type: z.literal('misconceptions'), items: z.array(z.object({ mythHtml: Html, correctionHtml: Html, myth: z.string() })).min(1) }),
  z.object({ type: z.literal('debates'), items: z.array(z.object({ titleHtml: Html.nullable(), bodyHtml: Html, contested: z.boolean() })).min(1) }),
  z.object({
    type: z.literal('confidence'),
    extraHeads: z.array(z.string()),
    rows: z.array(z.object({ findingHtml: Html, finding: z.string(), levels: z.array(Level).min(1).max(2), qualifier: z.string().nullable(), text: z.string(), extraHtml: z.array(Html) })).min(1),
  }),
  z.object({
    type: z.literal('sources'),
    items: z.array(z.object({ html: Html, level: z.string().nullable(), levelNote: z.string().nullable(), primary: z.boolean(), url: z.string().nullable(), access: z.string().nullable() })).min(1),
  }),
]);

export const Period = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  file: z.string(),
  title: z.string().min(1),
  dateLabel: z.string().min(1),
  span: z.object({ start: z.number(), end: z.number(), approxStart: z.boolean(), approxEnd: z.boolean() }),
  group: z.string(),
  mood: z.string(),
  sensitive: z.boolean(),
  images: z.array(z.object({ id: z.string(), captionHtml: Html })).min(1),
  sections: z.array(z.object({ n: z.number(), name: z.string(), qualifier: z.string().nullable(), blocks: z.array(Block) })).length(14),
  matrix: z
    .object({ title: z.string(), headingHtml: Html, rows: z.array(z.object({ q: z.number(), question: z.string(), answerHtml: Html })).length(12) })
    .nullable(),
  matrixRef: z.object({ html: Html, targets: z.array(z.object({ file: z.string(), slug: z.string() })).min(1) }).nullable(),
  constitution: z.object({ leadHtml: Html.nullable(), items: z.array(z.any()).nullable(), tableHtml: Html.nullable() }),
  fiveThings: z.array(Html).length(5),
}).passthrough().refine((p) => (p.matrix === null) !== (p.matrixRef === null), 'exactly one of matrix / matrixRef');

export const Image = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  type: z.string(),
  holder: z.string(),
  holderUrl: z.string().url(),
  licence: z.string(),
  rights: z.enum(['CC0', 'PD-LoC', '©']),
  caption: z.string(),
}).passthrough();
