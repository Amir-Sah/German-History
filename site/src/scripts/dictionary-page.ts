// Dictionary pages: kind filters (on the letter's entries), whole-dictionary search (loads /dictionary/index.json
// on first use; results appear above the letter grid, which is hidden while searching), and forwarding of old
// /dictionary/#id links to the letter page.
type Row = [id: string, name: string, kind: 'person' | 'place' | 'term', letter: string, forms: string, german: string, short: string];
const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const KIND = { person: 'Person', place: 'Place', term: 'Term' } as const;

const page = document.querySelector<HTMLElement>('.dict')!;
const btns = [...document.querySelectorAll<HTMLButtonElement>('[data-kind-btn]')];
const q = document.getElementById('dict-q') as HTMLInputElement;
const count = document.getElementById('dict-count')!;
const results = document.getElementById('dict-results')!;
const list = results.querySelector('ol')!;
const more = document.getElementById('dict-more')!;
const entries = [...document.querySelectorAll<HTMLElement>('.dict-entry')];
const none = document.getElementById('dict-none');

let index: Row[] | null = null;
async function loadIndex() {
  if (!index) index = (await (await fetch('/dictionary/index.json')).json()) as Row[];
  return index;
}
const kindsOn = () => new Set(btns.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.kindBtn));

function filterEntries() {
  const on = kindsOn();
  let n = 0;
  for (const e of entries) {
    e.hidden = !on.has(e.dataset.kind);
    if (!e.hidden) n++;
  }
  if (none) none.hidden = n > 0 || !entries.length;
  if (!q.value.trim()) count.textContent = entries.length ? `${n} ${n === 1 ? 'entry' : 'entries'} shown` : '';
}

const MAX = 60;
async function search() {
  const terms = strip(q.value).split(/\s+/).filter(Boolean);
  page.classList.toggle('searching', terms.length > 0);
  results.hidden = !terms.length;
  if (!terms.length) { filterEntries(); return; }
  const rows = await loadIndex();
  const on = kindsOn();
  const hits = rows.filter((r) => on.has(r[2]) && terms.every((t) => strip(`${r[1]} ${r[4]} ${r[5]} ${r[6]}`).includes(t)));
  // Rank: name starts with the query, then name or spelling contains it, then matches only in the description.
  const rank = (r: Row) => {
    const name = strip(r[1]);
    if (name.startsWith(terms[0])) return 0;
    if (terms.every((t) => name.includes(t))) return 1;
    if (terms.every((t) => strip(`${r[4]} ${r[5]}`).includes(t))) return 2;
    return 3;
  };
  hits.sort((a, b) => rank(a) - rank(b) || a[1].localeCompare(b[1]));
  list.replaceChildren(...hits.slice(0, MAX).map((r) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `/dictionary/${r[3]}/#${r[0]}`;
    a.textContent = r[1];
    a.className = `dn dn-${r[2]}`;
    const k = document.createElement('span');
    k.className = 'chip r-kind';
    k.textContent = KIND[r[2]];
    const s = document.createElement('span');
    s.className = 'r-short';
    s.textContent = r[6];
    li.append(a, k, s);
    return li;
  }));
  more.hidden = hits.length <= MAX;
  more.textContent = `Showing the first ${MAX}. Type more to narrow the search.`;
  count.textContent = `${hits.length} ${hits.length === 1 ? 'match' : 'matches'}`;
}

btns.forEach((b) => b.addEventListener('click', () => {
  b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
  filterEntries();
  if (q.value.trim()) search();
}));
let t: number | undefined;
q.addEventListener('input', () => { clearTimeout(t); t = window.setTimeout(search, 120); });
filterEntries();

// Old links (/dictionary/#id) → the entry's letter page.
if (page.dataset.dictPage === 'index' && location.hash.length > 1) {
  const id = decodeURIComponent(location.hash.slice(1));
  loadIndex().then((rows) => {
    const r = rows.find((x) => x[0] === id);
    if (r) location.replace(`/dictionary/${r[3]}/#${id}`);
  });
}
