// Progressive enhancement only: every feature below has a readable no-JS state.
const root = document.documentElement;

function store(key: string, value?: string): string | null {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked (private mode, previews): the page still works */
  }
  return null;
}

// ── "How do we know?" layer ──────────────────────────────────────────────
const evBtn = document.querySelector<HTMLButtonElement>('[data-evidence-toggle]');
function setEvidence(on: boolean) {
  root.classList.toggle('evidence-on', on);
  evBtn?.setAttribute('aria-pressed', String(on));
}
setEvidence(root.classList.contains('evidence-on'));
evBtn?.addEventListener('click', () => {
  const on = !root.classList.contains('evidence-on');
  setEvidence(on);
  store('ghx-evidence', on ? '1' : '0');
});

// ── theme: auto → light → dark ───────────────────────────────────────────
const themeBtn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const THEMES = ['auto', 'light', 'dark'] as const;
function showTheme(t: string) {
  const label = t === 'auto' ? 'Auto' : t === 'light' ? 'Light' : 'Dark';
  themeBtn?.setAttribute('aria-label', `Colour theme: ${label.toLowerCase()} (change)`);
  const span = themeBtn?.querySelector('.theme-label');
  if (span) span.textContent = label;
}
showTheme(root.getAttribute('data-theme') ?? 'auto');
themeBtn?.addEventListener('click', () => {
  const cur = root.getAttribute('data-theme') ?? 'auto';
  const next = THEMES[(THEMES.indexOf(cur as (typeof THEMES)[number]) + 1) % THEMES.length];
  root.setAttribute('data-theme', next);
  store('ghx-theme', next);
  showTheme(next);
});

// ── expand / collapse all sections ───────────────────────────────────────
document.querySelectorAll<HTMLButtonElement>('[data-expand-all]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-pressed') !== 'true';
    document.querySelectorAll<HTMLDetailsElement>('details.sec').forEach((d) => (d.open = open));
    btn.setAttribute('aria-pressed', String(open));
    btn.textContent = open ? 'Collapse all sections' : 'Expand all sections';
  });
});
// Opening a section from a link (#s13 …) expands it.
function openHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const el = document.getElementById(id);
  const det = el?.closest('details') ?? (el instanceof HTMLDetailsElement ? el : null);
  if (det) det.open = true;
}
window.addEventListener('hashchange', openHash);
openHash();

// ── Misconception / Correction cards ─────────────────────────────────────
document.querySelectorAll<HTMLElement>('[data-myths]').forEach((box) => {
  if (!box.classList.contains('myths-cards')) return;
  box.classList.add('enhanced');
  const cards = [...box.querySelectorAll<HTMLElement>('[data-myth]')];
  const set = (card: HTMLElement, turned: boolean, focus = false) => {
    card.classList.toggle('turned', turned);
    const front = card.querySelector<HTMLElement>('.myth-front')!;
    const back = card.querySelector<HTMLElement>('.myth-back')!;
    front.inert = turned;
    back.inert = !turned;
    card.querySelector('[data-myth-turn]')?.setAttribute('aria-expanded', String(turned));
    if (focus) (turned ? back : front).querySelector<HTMLButtonElement>('button')?.focus();
  };
  cards.forEach((c) => {
    set(c, false);
    c.querySelector('[data-myth-turn]')?.addEventListener('click', () => set(c, true, true));
    c.querySelector('[data-myth-back]')?.addEventListener('click', () => set(c, false, true));
  });
  const all = box.querySelector<HTMLButtonElement>('[data-myths-all]');
  all?.addEventListener('click', () => {
    const on = all.getAttribute('aria-pressed') !== 'true';
    all.setAttribute('aria-pressed', String(on));
    all.textContent = on ? 'Show as cards' : 'Show all corrections';
    box.classList.toggle('show-all', on);
    cards.forEach((c) => {
      c.classList.remove('turned');
      c.querySelector<HTMLElement>('.myth-front')!.inert = false;
      c.querySelector<HTMLElement>('.myth-back')!.inert = !on;
    });
  });
});

// ── phone menu (nav, highlight toggle, theme); without JS the menu is always shown ────
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.getElementById('site-menu');
menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') !== 'true';
  menuBtn.setAttribute('aria-expanded', String(open));
  menu?.classList.toggle('open', open);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu?.classList.contains('open')) {
    menu.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.focus();
  }
});

// ── images that failed before this script ran ────────────────────────────
function checkImages() {
  document.querySelectorAll<HTMLImageElement>('.fig-media img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) img.closest('.fig-media')?.classList.add('failed');
    else if (img.complete) img.closest('.fig-media')?.classList.add('loaded');
  });
}
checkImages();
window.addEventListener('load', checkImages);

// ── transition steps: reveal on scroll (only where motion is welcome) ─────
const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const scrollTimeline = CSS.supports?.('animation-timeline: view()');
if (motionOK && !scrollTimeline && 'IntersectionObserver' in window && !document.body.classList.contains('calm')) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add('in'), io.unobserve(en.target))),
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('.flow-step').forEach((s) => {
    s.classList.add('pre');
    io.observe(s);
  });
}
