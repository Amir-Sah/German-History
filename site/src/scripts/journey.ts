// The Journey (home): the time-ribbon marker follows the Part being read. The marker takes the Part's
// era mood (only --era-* tokens change). No scroll-jacking; without JS the ribbon simply shows the whole span.
const ribbon = document.querySelector<HTMLElement>('[data-ribbon]');
const here = document.querySelector<HTMLElement>('[data-ribbon-here]');
const where = document.querySelector<HTMLElement>('[data-ribbon-where]');
const parts = [...document.querySelectorAll<HTMLElement>('section.part[data-part]')];
const FROM = -500;
const TO = 2026;
const pct = (y: number) => ((y - FROM) / (TO - FROM)) * 100;
const initial = where?.textContent ?? '';
let current: HTMLElement | null = null;

function show(part: HTMLElement | null) {
  if (!ribbon || !here || !where || part === current) return;
  current = part;
  for (const c of [...ribbon.classList]) if (c.startsWith('mood-')) ribbon.classList.remove(c);
  if (!part) {
    here.hidden = true;
    where.textContent = initial;
    return;
  }
  const mood = part.dataset.mood;
  if (mood) ribbon.classList.add(`mood-${mood}`);
  ribbon.classList.toggle('calm', part.classList.contains('calm'));
  where.textContent = part.dataset.label ?? '';
  const s = part.dataset.start;
  const e = part.dataset.end;
  if (s === undefined || e === undefined) {
    here.hidden = true;
    return;
  }
  here.hidden = false;
  here.style.left = `${pct(+s)}%`;
  here.style.width = `max(4px, ${pct(+e) - pct(+s)}%)`;
}

if (ribbon && parts.length) {
  const visible = new Set<HTMLElement>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) (en.isIntersecting ? visible.add(en.target as HTMLElement) : visible.delete(en.target as HTMLElement));
      // The reading line sits a third of the way down the screen; the Part crossing it is "here".
      show(parts.find((p) => visible.has(p)) ?? null);
    },
    { rootMargin: '-33% 0px -66% 0px' },
  );
  parts.forEach((p) => io.observe(p));
}
