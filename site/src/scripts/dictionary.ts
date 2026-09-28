// Inline dictionary (SITE_CHANGELOG_AND_TASKS.md C3). Words are marked at build time as
// <a class="dx dx-person|dx-place|dx-term" href="/dictionary/<letter>/#id" data-dx="id" aria-describedby="dxd-id">.
// Without JS they are plain links to the dictionary page. With JS:
//   hover (mouse) or keyboard focus → small tooltip (name, dates, kind, Short), placed so it never covers the word;
//   click / Enter / tap → the dictionary card (<dialog>; bottom sheet on phones); Esc closes and focus returns.
type Chapter = { title: string; href: string | null } | null;
type Entry = {
  name: string; kind: 'person' | 'place' | 'term'; subkind: string | null; dates: string | null; german: string | null;
  short: string; explanation: string; note: string | null; basis: string | null; main: Chapter; also: Chapter[]; href: string;
};

const root = document.documentElement;
const dataEl = document.getElementById('dx-data');
const KIND = { person: 'Person', place: 'Place', term: 'Term' } as const;

function store(key: string, value?: string) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch { /* storage blocked */ }
  return null;
}

// ── reading preference: "Highlight names & terms" (on by default) ─────────
const hlBtn = document.querySelector<HTMLButtonElement>('[data-highlight-toggle]');
function setHighlight(on: boolean) {
  root.classList.toggle('dx-off', !on);
  hlBtn?.setAttribute('aria-pressed', String(on));
  // When highlighting is off the words read as plain text: take them out of the tab order.
  document.querySelectorAll<HTMLElement>('a.dx').forEach((a) => (on ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
}
setHighlight(!root.classList.contains('dx-off'));
hlBtn?.addEventListener('click', () => {
  const on = root.classList.contains('dx-off');
  setHighlight(on);
  store('ghx-highlight', on ? '1' : '0');
});

if (dataEl) {
  const data: Record<string, Entry> = JSON.parse(dataEl.textContent || '{}');
  const tip = document.getElementById('dx-tooltip') as HTMLElement;
  const card = document.getElementById('dx-card') as HTMLDialogElement;
  let opener: HTMLElement | null = null;
  const hl = () => !root.classList.contains('dx-off');

  // ── tooltip ──────────────────────────────────────────────────────────
  function showTip(a: HTMLElement) {
    const e = data[a.dataset.dx!];
    if (!e || !hl()) return;
    tip.innerHTML = '';
    const head = document.createElement('p');
    head.className = 'dx-tip-head';
    const kind = document.createElement('span');
    kind.className = `dx-kind dx-kind-${e.kind}`;
    kind.textContent = KIND[e.kind];
    const name = document.createElement('strong');
    name.textContent = e.name;
    head.append(kind, ' ', name);
    if (e.dates) head.append(` · ${e.dates}`);
    const short = document.createElement('p');
    short.textContent = e.short;
    const hint = document.createElement('p');
    hint.className = 'dx-tip-hint';
    hint.textContent = 'Click or press Enter for more';
    tip.append(head, short, hint);
    tip.hidden = false;
    // Place above the word if there is room, otherwise below; keep inside the viewport horizontally.
    const r = a.getBoundingClientRect();
    const w = tip.offsetWidth, h = tip.offsetHeight, m = 8;
    const headerBottom = (document.querySelector('.site-header') as HTMLElement)?.getBoundingClientRect().bottom ?? 0;
    const above = r.top - h - m > headerBottom;
    const top = above ? r.top - h - m : r.bottom + m;
    const left = Math.min(Math.max(m, r.left + r.width / 2 - w / 2), window.innerWidth - w - m);
    tip.style.top = `${top + window.scrollY}px`;
    tip.style.left = `${left + window.scrollX}px`;
    tip.dataset.side = above ? 'above' : 'below';
  }
  const hideTip = () => (tip.hidden = true);

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.addEventListener('pointerover', (ev) => {
    const a = (ev.target as HTMLElement).closest<HTMLElement>('a.dx');
    if (a && fine.matches && ev.pointerType === 'mouse') showTip(a);
  });
  document.addEventListener('pointerout', (ev) => {
    const a = (ev.target as HTMLElement).closest<HTMLElement>('a.dx');
    if (a && !a.contains(ev.relatedTarget as Node)) hideTip();
  });
  document.addEventListener('focusin', (ev) => {
    const a = (ev.target as HTMLElement).closest?.<HTMLElement>('a.dx');
    if (a && a.matches(':focus-visible')) showTip(a);
    else hideTip();
  });
  document.addEventListener('keydown', (ev) => ev.key === 'Escape' && hideTip());
  window.addEventListener('scroll', hideTip, { passive: true });

  // ── card dialog ──────────────────────────────────────────────────────
  const f = (name: string) => card.querySelector<HTMLElement>(`[data-f="${name}"]`)!;
  function chapterNode(c: Chapter, id: string) {
    if (!c) return document.createTextNode('');
    if (c.href) {
      const a = document.createElement('a');
      a.href = `${c.href}#m-${id}`;
      a.textContent = c.title;
      return a;
    }
    const s = document.createElement('span');
    s.textContent = c.title;
    const soon = document.createElement('span');
    soon.className = 'soon';
    soon.textContent = 'coming soon';
    s.append(' ', soon);
    s.title = 'This chapter is built in a later step';
    return s;
  }
  function openCard(a: HTMLElement) {
    const id = a.dataset.dx!;
    const e = data[id];
    if (!e) return false;
    hideTip();
    f('kind').textContent = [KIND[e.kind], e.subkind].filter(Boolean).join(' · ');
    f('kind').className = `dx-card-kind dx-kind-${e.kind}`;
    f('name').textContent = e.name;
    f('german').textContent = e.german && e.german !== e.name ? e.german : '';
    f('dates').textContent = e.dates ?? '';
    const note = f('note');
    note.hidden = !e.note;
    note.textContent = '';
    if (e.note) {
      if (/CONTESTED/.test(e.note)) {
        const b = document.createElement('span');
        b.className = 'conf conf-contested';
        b.textContent = 'CONTESTED';
        note.append(b, ' ');
      }
      note.append(e.note.replace(/^CONTESTED[.:]?\s*/, ''));
    }
    f('explanation').textContent = e.explanation;
    const main = f('main');
    main.replaceChildren(chapterNode(e.main, id), document.createTextNode(e.main?.href ? ' →' : ''));
    f('main-wrap').hidden = !e.main;
    // "Also in": at most 6 chips, then "Show all (N)".
    const also = f('also');
    const chips = e.also.filter(Boolean).map((c) => {
      const n = chapterNode(c, id) as HTMLElement;
      n.classList?.add('chip');
      return n;
    });
    const LIMIT = 6;
    chips.forEach((n, i) => (n.hidden = i >= LIMIT));
    also.replaceChildren(...chips);
    const more = f('also-more') as HTMLButtonElement;
    more.hidden = chips.length <= LIMIT;
    more.textContent = `Show all (${chips.length})`;
    more.onclick = () => {
      chips.forEach((n) => (n.hidden = false));
      more.hidden = true;
      chips[LIMIT]?.querySelector('a')?.focus?.();
    };
    f('also-wrap').hidden = !chips.length;
    (f('dict-link') as HTMLAnchorElement).href = e.href;
    f('basis').textContent = e.basis ?? '';
    opener = a;
    card.showModal();
    card.querySelector<HTMLElement>('[data-dx-close]')?.focus();
    return true;
  }
  card.addEventListener('close', () => opener?.focus());
  card.querySelector('[data-dx-close]')?.addEventListener('click', () => card.close());
  card.addEventListener('click', (ev) => { if (ev.target === card) card.close(); }); // backdrop click
  document.addEventListener('click', (ev) => {
    const a = (ev.target as HTMLElement).closest<HTMLElement>('a.dx');
    if (!a || !hl() || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
    if (openCard(a)) ev.preventDefault();
  });
}
