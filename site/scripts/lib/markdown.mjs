// Markdown → HTML for the knowledge base.
// Text is never rewritten: this renderer only escapes, links cross-references,
// marks glossary terms and styles confidence labels that are already in the text.
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString } from 'mdast-util-to-string';
import { dictHref } from './dictionary.mjs';

const processor = unified().use(remarkParse).use(remarkGfm);

export function parseMd(src) {
  return processor.parse(src);
}

export { toString as mdText };

export function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const LEVEL_WORD = /\b(HIGH|MEDIUM|UNCERTAIN|CONTESTED|REJECTED)\b/g;
const BADGE_ONLY = /^(HIGH|MEDIUM|UNCERTAIN|CONTESTED|REJECTED)\.?$/;

export function levelClass(level) {
  return `conf conf-${level.toLowerCase()}`;
}

/**
 * ctx = {
 *   file: 'twentieth_century/02_weimar_republic.md',
 *   resolveXref(target, fromFile) → { href, label } | null,
 *   glossary: { match(text) → entry | null },
 *   glossSeen: Set (first occurrence per scope),
 *   warn(msg),
 *   idPrefix
 * }
 */
export function renderBlocks(nodes, ctx) {
  return nodes.map((n) => renderNode(n, ctx)).join('\n');
}

export function renderInline(nodes, ctx) {
  return nodes.map((n) => renderNode(n, ctx)).join('');
}

let tipCounter = 0;

function glossWrap(innerHtml, text, ctx) {
  if (!ctx.glossary) return null;
  const entry = ctx.glossary.match(text);
  if (!entry) return null;
  ctx.usedTerms?.add(entry.id);
  if (ctx.glossSeen?.has(entry.id)) return null;
  ctx.glossSeen?.add(entry.id);
  const id = `gl-${entry.id}-${++tipCounter}`;
  return (
    `<span class="gl"><button type="button" class="gl-term" aria-describedby="${id}" data-term="${entry.id}">${innerHtml}</button>` +
    `<span class="gl-tip" role="tooltip" id="${id}"><span class="gl-gloss">${escapeHtml(entry.gloss)}</span>` +
    `<span class="gl-src">Glossary · from ${escapeHtml(entry.sourceLabel)}</span></span></span>`
  );
}

function badges(esc) {
  // Confidence words written in capitals in the prose become badges (same text, styled).
  return esc.replace(LEVEL_WORD, (m) => `<span class="${levelClass(m)}">${m}</span>`);
}

/**
 * Dictionary highlighting (SITE_CHANGELOG_AND_TASKS.md C2). ctx.dict = { matcher, chapter, seen: Set, used: Set }.
 * People and places: every mention. Terms: first mention per section (ctx.dict.seen is reset per section).
 * Places get a location glyph on their first mention per section. Never inside headings or links (ctx.noDict).
 */
function renderText(value, ctx) {
  const d = ctx?.dict;
  if (!d || ctx.noDict) return badges(escapeHtml(value));
  let pos = 0;
  return d.matcher
    .split(value, d.chapter)
    .map((part) => {
      const at = pos;
      pos += part.text.length;
      const esc = badges(escapeHtml(part.text));
      const e = part.entry;
      if (!e) return esc;
      const firstInSection = !d.seen.has(e.id);
      if (e.kind === 'term' && !firstInSection) return esc;
      const firstOnPage = d.anchor !== false && !d.used.has(e.id);
      d.seen.add(e.id);
      d.used.add(e.id);
      d.log?.push({ chapter: d.chapter, form: part.text, id: e.id, kind: e.kind, context: value.slice(Math.max(0, at - 70), at + part.text.length + 70) });
      const cls = `dx dx-${e.kind}${firstInSection ? ' dx-first' : ''}`;
      const anchor = firstOnPage ? ` id="m-${e.id}"` : '';
      return `<a class="${cls}"${anchor} href="${dictHref(e)}" data-dx="${e.id}" aria-describedby="dxd-${e.id}">${esc}</a>`;
    })
    .join('');
}

function renderNode(node, ctx) {
  switch (node.type) {
    case 'root':
      return renderBlocks(node.children, ctx);
    case 'paragraph':
      return `<p>${renderInline(node.children, ctx)}</p>`;
    case 'heading': {
      const lvl = Math.min(6, node.depth + (ctx.headingShift ?? 0));
      return `<h${lvl}>${renderInline(node.children, { ...ctx, noDict: true })}</h${lvl}>`;
    }
    case 'text':
      return renderText(node.value, ctx);
    case 'emphasis': {
      const inner = renderInline(node.children, ctx);
      const html = `<em>${inner}</em>`;
      return glossWrap(html, toString(node), ctx) ?? html;
    }
    case 'strong': {
      const t = toString(node).trim();
      if (BADGE_ONLY.test(t)) {
        const lvl = t.replace('.', '');
        return `<strong class="${levelClass(lvl)}">${escapeHtml(t)}</strong>`;
      }
      const inner = renderInline(node.children, ctx);
      const html = `<strong>${inner}</strong>`;
      return glossWrap(html, t, ctx) ?? html;
    }
    case 'delete':
      return `<del>${renderInline(node.children, ctx)}</del>`;
    case 'inlineCode':
      return renderXref(node.value, ctx);
    case 'code':
      return `<pre class="ascii"><code>${escapeHtml(node.value)}</code></pre>`;
    case 'break':
      return '<br>';
    case 'link': {
      const r = ctx.resolveXref?.(node.url, ctx.file, true);
      const inner = renderInline(node.children, { ...ctx, noDict: true });
      if (r?.href) return `<a href="${escapeHtml(r.href)}">${inner}</a>`;
      if (r?.pending) return `<span class="xref-pending" title="This page is built in a later step">${inner}</span>`;
      if (/^https?:/.test(node.url))
        return `<a href="${escapeHtml(node.url)}" rel="noopener">${inner}</a>`;
      ctx.warn?.(`unresolved link ${node.url}`);
      return inner;
    }
    case 'list': {
      const tag = node.ordered ? 'ol' : 'ul';
      const start = node.ordered && node.start && node.start !== 1 ? ` start="${node.start}"` : '';
      return `<${tag}${start}>${node.children.map((li) => renderNode(li, ctx)).join('')}</${tag}>`;
    }
    case 'listItem': {
      // Tight list items render without <p> wrappers.
      const tight = node.spread === false;
      const inner = node.children
        .map((c) => (tight && c.type === 'paragraph' ? renderInline(c.children, ctx) : renderNode(c, ctx)))
        .join('');
      return `<li>${inner}</li>`;
    }
    case 'blockquote':
      return `<blockquote>${renderBlocks(node.children, ctx)}</blockquote>`;
    case 'table':
      return renderTable(node, ctx);
    case 'thematicBreak':
      return '';
    case 'html':
      // Raw HTML from the KB (comments, anchors) is dropped; image blocks are parsed separately.
      return '';
    case 'image':
      ctx.warn?.(`inline image outside an image block: ${node.url}`);
      return '';
    default:
      ctx.warn?.(`unhandled markdown node ${node.type}`);
      return '';
  }
}

export function renderTable(node, ctx, { caption } = {}) {
  const [head, ...rows] = node.children;
  const align = node.align ?? [];
  const cell = (c, i, tag) => {
    const a = align[i] ? ` style="text-align:${align[i]}"` : '';
    const scope = tag === 'th' ? ' scope="col"' : '';
    return `<${tag}${scope}${a}>${renderInline(c.children, ctx)}</${tag}>`;
  };
  return (
    `<div class="table-wrap" tabindex="0" role="region" aria-label="${escapeHtml(caption ?? 'Table')}"><table>` +
    (caption ? `<caption>${escapeHtml(caption)}</caption>` : '') +
    `<thead><tr>${head.children.map((c, i) => cell(c, i, 'th')).join('')}</tr></thead>` +
    `<tbody>${rows.map((r) => `<tr>${r.children.map((c, i) => cell(c, i, 'td')).join('')}</tr>`).join('')}</tbody>` +
    `</table></div>`
  );
}

function renderXref(value, ctx) {
  // Inline code in the KB is (almost always) a file cross-reference such as `twentieth_century/04_nazi_state.md`
  // or `01_RESEARCH_METHOD.md §5`. Part B3: show the chapter's title (the file path stays in the tooltip).
  const r = ctx.resolveXref?.(value, ctx.file, false);
  if (r) {
    const label = escapeHtml(r.title + (r.section ? ` §${r.section}` : ''));
    if (r.href) return `<a class="xref" href="${escapeHtml(r.href)}" title="${escapeHtml(value)}">${label}</a>`;
    return `<span class="xref xref-pending" title="${escapeHtml(value)} — this page is built in a later step">${label}</span>`;
  }
  return `<code>${escapeHtml(value)}</code>`;
}

/** Plain text of inline markdown (for alt text, titles). */
export function inlineText(src) {
  return toString(parseMd(src)).trim();
}

/** Render a markdown fragment. */
export function renderMd(src, ctx) {
  return renderBlocks(parseMd(src).children, ctx);
}

/** Render a markdown fragment that is a single paragraph, without the <p>. */
export function renderMdInline(src, ctx) {
  const tree = parseMd(src);
  if (tree.children.length === 1 && tree.children[0].type === 'paragraph')
    return renderInline(tree.children[0].children, ctx);
  return renderBlocks(tree.children, ctx);
}
