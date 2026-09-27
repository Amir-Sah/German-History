# PLAN — "German History, Explained": an interactive, source-critical website

*Step 1 of `WEBSITE_BUILD_PROMPT.md` (Inventory). Written 27 Sept 2026 after reading all 63 Markdown files and `images/IMAGE_INDEX.md`. **Nothing is built yet.** This plan waits for your approval.*

---

## 0. Setup already done (reversible)

| What | Where | Why |
|---|---|---|
| `package.json` and installed npm packages: `astro@7.3.5`, `unified`/`remark-parse`/`remark-gfm`, `mdast-util-to-string`, `zod`, `pagefind@1.5.2`; dev: `playwright`, `@axe-core/playwright`, `linkinator` | `site/` | Build pipeline, search, QA |
| `site/CLAUDE.md` | `site/` | The non-negotiable rules in short form, so any later session follows them |
| `.claude/launch.json` (`site-dev` on port 4321, `site-preview` on port 4322) | project root (tooling only; no knowledge-base file touched) | Lets me open the site in the in-app browser for visual review |
| `site/.gitignore` | `site/` | Keeps build output and caches out of version control |

**Not done yet (needs your OK):** the Playwright browser download (~150 MB, Chromium), used for automated screenshots and the axe audit. Instead, I can run the whole visual and accessibility review in the app's built-in browser (see §8).

---

## 1. Stack and why

**Astro 7 (static output) + vanilla TypeScript "islands" + Pagefind.**

- The site has about 70 pages (35 eras, 14 themes, plus hubs). Astro gives file-based routing and templating for all of them, and it ships **zero JavaScript by default**. That makes it a better fit than Vite + vanilla TS, where I would have to hand-roll routing and HTML templating.
- Interactivity (matrix explorer, timeline filters, lightbox, flip cards, "How do we know?" toggle, self-check) is written as small vanilla-TS scripts, loaded only on the pages that need them. No React or other UI framework.
- Motion uses **CSS scroll-driven animations** (`animation-timeline: view()`) with an IntersectionObserver fallback. There is no GSAP. Every animation sits behind `@media (prefers-reduced-motion: no-preference)` and has a static equivalent.
- Search uses **Pagefind**: it indexes the built HTML at build time and runs client-side, loading only the index chunks a query needs.

---

## 2. Content model (Markdown → JSON)

`scripts/build-content.mjs` parses every file with `remark-parse` + `remark-gfm` into an AST. It validates the result against **zod schemas** and writes `src/content/generated/*.json`. Rendered prose is converted **from the AST** (Markdown → HTML), never retyped.

**The build fails loudly** (non-zero exit, file and line reported) when a required element is missing or malformed. Deviations that are already known (see §7) are listed in `scripts/template-exceptions.json`, each with a reason. That way they are explicit and reviewed, not silently tolerated.

```ts
Period {
  slug, file, folder, eraGroup, title, dateLabel,        // from H1, e.g. "(1918/19 – 1933)"
  span: { start, end },                                  // parsed years; "c." kept as approx flag
  images: ImageRef[],                                    // from the IMAGES block (hero = first)
  sections: Section[14],                                 // keyed by template number 1–14
  regimeMatrices: RegimeMatrix[],                        // 0..n "### Regime Matrix …" tables
  constitutionVsReality: { said?, worked?[], raw } | null,
  transition: { steps: {label, text}[] } | { prose } ,   // ↓-chain; labels kept verbatim
  misconceptions: { myth, correction }[],
  debates: Debate[],                                     // §12 bullets; CONTESTED flags detected
  confidence: { finding, level, qualifier?, why? }[],    // level ∈ HIGH|MEDIUM|LOW|UNCERTAIN|CONTESTED|REJECTED (+compound)
  sources: { text, url?, level: "A".."F" | compound }[],
  fiveThings: string[5],
  sensitive: boolean                                     // from config, see §5
}
Section { n, heading, html, subsections[] }
RegimeMatrix { id, title, periodSlug, rows: { q: 1..12, question, answer }[12] }
RegimeSummary { id, name, span, chain, constitutionVsReality, quickTable? }  // from 05_REGIME_MATRIX.md
JourneyPart { n, title, span, lead /* bold "Why…?" line */, html, images, fiveThings, detailLinks[] }
MentalMap { ascii, nodes: { label, span, periodSlugs[] }[] }                 // node→file map is editorial (traced)
TimelineEvent { system /* A–J heading */, anchor, event, whatChanged, year?, periodSlugs[], themes[] }
Theme { slug, title, images, sections[], tables[], fiveThings }
Question { n, question, positions, startWith }                              // 04 §A; §B–D kept as lists
Image { id /* anchor */, n, title, url, creator, date, holder, holderUrl, licence,
        rights: "CC0"|"PD-LoC"|"©", usedIn[], caption, type, propaganda?, criticalNote? }
AuditClaim { n, claim, sources[3], agreement, disagreement, confidence }     // SOURCE_AUDIT.md
Source { title, author, date, level, access: "R"|"M"|"K", url }             // bibliography.md
GlossaryTerm { term, gloss, sourceFile, sourceLine, pattern }
```

**Glossary.** It is built from the explanations the files already give: `English (*German*)`, `*German* (English)`, and the terminology table in `01_RESEARCH_METHOD.md §5`. A dry run found about 280 candidate pairs among 523 italic spans. Many of the spans are book titles, so the build drops anything inside §14 Sources or the bibliography and applies a reviewed allow-list, `glossary-allow.json`, which is editorial and traced. German terms with no explanation anywhere in the KB are **listed for you, not invented**.

---

## 3. Site map

```
/                         The Journey — scroll narrative through Parts 1–10 (+ mental map, time ribbon)
/eras/                    All 35 period chapters, grouped by folder, on the ribbon
/eras/<slug>/             Era chapter (×35)
/regimes/                 Regime Matrix explorer (compare 2–3)
/themes/  /themes/<slug>/ Theme threads (×14)
/timeline/                Interactive master timeline
/gallery/                 Image gallery + lightbox (72 images)
/questions/               Open questions (04_QUESTIONS_WORTH_EXPLORING)
/self-check/              Optional recall cards
/how-we-know/             Method: source hierarchy A–F, confidence scale, terminology rules, triangulation
/how-we-know/audit/       SOURCE_AUDIT claim table (anchor per claim) + consistency logs
/sources/                 Bibliography, primary-source reading guide, German/international/video assessments
/glossary/                German terms, each linked to where it is explained
/about/                   Image rights, limitations, how the site was generated
```

Global chrome: persistent **time ribbon**, a **"How do we know?"** toggle, search (⌘K or `/`), a light/dark theme switch, and a skip link.

---

## 4. Features and what each one teaches

| Feature | What the reader learns | Built from |
|---|---|---|
| **The Journey** (home): 10 full-bleed Parts, each opening with the file's own bold "Why…?" lead line; the "5 things" as a closing card per Part | The big story in plain language, in order | `00_FINAL_EXPLANATION.md` |
| **Mental map** as a clickable diagram (ASCII original kept as the static fallback) | That German history branches and loops, and is not a straight line | Mental map + node→file mapping (traced) |
| **Time ribbon** (2,000 years, sticky): shows the current position; tick marks for the ruptures 1618/1806/1918/1945 named on the map page | Scale and where the ruptures fall | H1 date ranges + Part spans |
| **Era chapters**: hero image + one-paragraph summary; 14 collapsible sections; "5 things" closing card | Depth on demand, with the same questions asked of every era | Period files |
| **Transition flow**: BEFORE → … → AFTER as an animated step diagram, labels kept verbatim (CRISIS, ESCALATION, DÉTENTE…) | Change as a process with pressures, not as a date | §8 chains |
| **Myth / Correction flip cards** (buttons, keyboard-accessible, readable without flipping when motion is reduced) | Common errors and why they are wrong | §11 tables |
| **"Historians disagree"** panel: positions side by side, CONTESTED badge | Which things are debated, by whom | §12 |
| **Constitution vs reality** signature strip on every regime: two columns, "On paper" / "In practice" | The site's core lesson: formal rules ≠ real power | §2 contrasts, `05_REGIME_MATRIX.md` |
| **Regime Matrix explorer**: choose 2–3 of 22 period-file matrices or the 5-regime quick table; rows by question 1–12; differences highlighted; contrast strip on top | Comparison across systems, e.g. Weimar vs FRG, Nazi vs GDR | Period matrices + `05` |
| **Theme threads**: a theme's era rows placed on the ribbon, with jump-links into the relevant era sections | Long-run continuities (federalism, women, militarism…) | `themes/*.md` + era-label→file map (traced) |
| **Interactive timeline**: grouped by system A–J (native to the file), filter by system and theme, each row linked to its chapter | Chronology as scaffolding, with "what changed" first | `02_MASTER_TIMELINE.md` |
| **"How do we know?" layer**: a global toggle that reveals confidence badges, source levels A–F, R/M/K access marks, and links to the matching `SOURCE_AUDIT` claim | Evidence quality, visible everywhere | §13, §14, audit, bibliography |
| **Gallery + lightbox**: filter by era and type; full credits always visible; the source link shown next to the image | Images as sources, with who made them and why | `IMAGE_INDEX.md` |
| **Self-check**: recall cards from "5 things" and myth/correction only; progress stored in `localStorage` (try/catch). **No points or streaks anywhere**, and sensitive eras show plain cards only | Retrieval practice without gamifying atrocity | §11, "5 things" |
| **Open questions** page, with filters: live debates / thin topics / test-yourself / open empirical | Where knowledge ends | `04_QUESTIONS_WORTH_EXPLORING.md` |
| **Search** (Pagefind) | Find any term, person or event | Built HTML |
| **Glossary tooltips** (`<abbr>`/popover, keyboard and touch friendly) + glossary page | German terms in plain English | §2 above |

**My additions, with justification:**
1. **"Read this image critically"** notes on propaganda and official art. Each combines the image's own caption with the five-question checklist in `sources/primary_sources.md` ("Who wrote it, for whom, and why?" …). This teaches source criticism using the KB's own method, and needs no new facts.
2. **Access marks (R/M/K)** next to sources in the "How do we know?" layer. The bibliography records whether each work was read, abstract-only, or cited from knowledge. That is unusually honest, and readers should see it.
3. **Two small charts, only from figures the files state.** One is NSDAP vote shares (2.6% 1928 → 18.3% 1930 → ~37% Jul 1932 → ~33% Nov 1932 → 43.9% Mar 1933 under terror), with the terror caveat printed on the chart. The other is the Thirty Years' War mortality *range* (Wilson ~20% vs Franz/Pfister 30–40%), drawn as a range, not a point. Both show uncertainty as data.

**Left out because the KB lacks the facts** (for you to decide on later): territorial maps / border animations, population curves before 1800, audio, and portraits of people not in the image index.

---

## 5. Sensitive sections (calmer register, no gamification)

My proposal, based on the prompt plus file content (please confirm):

- **Calm register (all eras on this list):** `twentieth_century/04` Nazi state, `05` everyday life under Nazism, `06` Holocaust & persecution, `07` WWII, `08` occupation & expulsion (mass rapes, expulsion deaths), `nineteenth_century/08` colonialism, `twentieth_century/10` GDR, `11` Cold War & Wall (border deaths); Journey Part 6; themes `authoritarianism`, `minorities_and_migration`.
- **What "calm" means in practice:** a neutral archive palette; no accent colour, and never red/black/white together (the Nazi palette); slower fades only, with no parallax and no slide-ins; flip cards replaced by stacked Myth/Correction pairs; no self-check progress UI; images shown at a restrained size with credits.
- **On every page:** no zoom, pan, colourisation or "enhancement" on any photograph. Parallax is allowed only on CC0 artworks in non-sensitive eras. No graphic atrocity imagery (the KB already avoids it).

---

## 6. Visual direction — 2–3 mood options per era group

A shared system on all pages: one serif for reading (Source Serif 4), one grotesk for UI and labels (Inter), self-hosted via `@fontsource`. Colour tokens sit on `:root` with dark-mode overrides, and every era group sets only `--era-accent`, `--era-paper` and `--era-texture`. All combinations are checked for WCAG AA.

| Era group | Option A | Option B | Option C |
|---|---|---|---|
| **Antiquity & Franks** (to 919) | *Terra & verdigris*: clay, bronze-green, Roman-pottery warmth | *Vellum & minuscule*: parchment, iron-gall ink, rubric red initials | *Limes at dusk*: slate and ochre, frontier-line motif |
| **Holy Roman Empire & early modern** (919–1806) | *Woodcut*: black line on paper, Schedel-style hatching texture, rubrication | *Baroque court*: Bellotto sky-blue with muted gilt | *Callot grey* for 1618–48 inside option A or B |
| **Long 19th century** (1792–1914) | *Biedermeier*: cream, sage, quiet interiors | *Romantic moonlight*: Friedrich dusk-teal and amber | *Iron & soot*: brick, graphite, railway-line motif for industrial chapters |
| **1914–1945** | *Archive* (**recommended; required for the sensitive eras**): warm greys, off-white, no accent | *Newsprint*: black on newsprint, grotesk headings, for 1914–18 only | *Weimar modern*: restrained Bauhaus blue/ochre for 1918–33 only (no red/black) |
| **Divided Germany** (1945–1990) | *Two inks*: warm West / cool East split within one layout | *Concrete & signal*: grey with a single signal-yellow accent | *Photo lab*: neutral, contact-sheet frames |
| **United Germany** (1990–2026) | *Civic paper*: clean white, Basic-Law black, EU-blue accent | *Glass dome*: pale sky, light greys, transparent layers | *Plain data*: minimal, figures foregrounded |

**My pick if you have no preference:** B · A · A · A (+C for Weimar) · A · A.

---

## 7. Risks and template inconsistencies found

*These will also be logged in `CONTENT_TRACE.md`. I will not silently pick a side on any of them. Where the site has to render something, it shows the conflicting values side by side, each with its source file.*

**Template deviations (the build will name each one in `template-exceptions.json`):**

1. **`contemporary/03` and `/04` do not follow the 14-section template.** `/03` merges §7–10 into one heading and has no transition chain. `/04` has no §8, §9 or §10 at all and merges §4–5. Both give §13 Confidence as a single sentence, not a table. `/02` has §8 as one sentence ("This is the present"), merges §9–10 and titles §12 "Debates". **`SOURCE_AUDIT.md`'s consistency log says all 35 files "Pass"**, noting the contemporary merges "by design", but `/04` is missing sections, not merging them.
2. **Transition labels are inconsistent.** The prompt says BEFORE → PRESSURES → **TRANSITION** → AFTER, `00_README` says BEFORE → PRESSURES → **CRISIS** → AFTER, and the files use 15+ variants (CRISIS/TRANSITION, ESCALATION, WAR, END, DEVELOPMENT, CONSOLIDATION, STABILISATION, DECLINE, COLLAPSE, DIVISION, CEMENTING, DÉTENTE, TURNING POINTS, NOW). Some chains have 5 steps, and some steps are bullet lists. I will render the labels verbatim.
3. **Not every era has a 12-question matrix or a "constitution vs reality" statement.** 22 of 35 files have a matrix. 11 have no explicit contrast statement: `ancient/01`, `medieval/03`, `medieval/04` (has a matrix but no contrast), `nineteenth_century/03`, `/07`, `twentieth_century/03`, `/05`, `/06`, `contemporary/01`, `/03`, `/04`. `12_reunification` gives an "Art. 23 vs Art. 146" choice instead. `11_cold_war` has a two-state table, not a matrix. The audit log claims "every political system has a 12-question matrix". In `05_REGIME_MATRIX.md` only system (3) has a full 12-row table; the rest are chains plus the 5-regime quick table. **Proposal:** these chapters show "No separate regime matrix; see [related era]", built from the file's own cross-references. Nothing will be fabricated.
4. **The confidence vocabulary is not closed.** The method scale has 4 levels (HIGH/MEDIUM/CONTESTED/UNCERTAIN) and **no LOW**, while the prompt lists LOW. The files also use *Rejected*, *Largely rejected*, compounds (*MEDIUM–HIGH*, *CONTESTED / largely rejected*) and qualifiers ("HIGH (among historians)"). **Proposal:** the badge shows the leading level(s) and the full qualifier text appears beside it. I will add a REJECTED badge style and no LOW style (the label is never used).
5. **Theme files use free-form structure.** None follows the 14-section template. That is expected, but `themes/continuity_and_change.md` has no Sources section.
6. **8 files have no image block** (`01_RESEARCH_METHOD.md` and all 7 `sources/` files). The prompt says "every file starts with image blocks".
7. `IMAGE_INDEX.md` anchor ids use hyphens (`caster-vase`), while its caption list uses underscores (`caster_vase`). This is harmless, and the parser normalises both.

**Factual/date disagreements between files (flag, don't resolve):**

| Item | Values found |
|---|---|
| Frankish/Carolingian end date | c. 500–**919** (`medieval/01` H1) · **911** (timeline §B, "Frankish world c.500–911") · c. 751–**911** (`05` system 1) · **843** (mental map "Frankish Empire c.500–843") · Part 1 "to c. **900**" |
| Holy Roman Empire start | **919** (`medieval/02`, Part 2) · **962** (mental map "HRE 962–1806") |
| Weimar start | **1918/19** (file) · **1919** (mental map, `05`) · **1918** (Part 5) |
| Expellees | "about **12 million**" (text everywhere) · "about **12–14 million**" (expellee-map caption) |
| Treuhand firms | "~**8,500**" (files) · "some **8,000**" (Treuhand stamp caption) |
| Hunger winter name | *Kohlrübenwinter* (WWI file / LeMO) · *Steckrübenwinter* (image caption) |
| Number of systems | "~**14** distinct political systems" (`01` §2) · **13** listed in `05` |
| Journey Part ranges overlap | Part 2 ends 1806 while Part 3 starts 1792; Part 4 starts 1866 while `nineteenth_century/05` runs 1858–1871 (overlaps are real, but the ribbon must show them honestly) |
| README folder name | the structure diagram says `germany-history/`; the actual folder is `Germany/` (cosmetic) |

**Other risks:**
- **© images on a public site.** 54 of the 72 images are © DHM/HdG/Bundesarchiv/estates, "for personal study only"; only 18 are CC0 or Library of Congress "no known restrictions". If the site is ever deployed publicly, hotlinking or caching them would conflict with that. **Proposal:** a `PUBLIC_BUILD=1` flag renders every © image as a credit card with a "View at the holder's site" link, and the CC0 and Library of Congress images stay. The default build is local and for personal study.
- **Hotlink fragility.** The holders may block or move images. The fallback card shows the full credit plus a link, and `download-images.mjs` exists but only runs if you ask.
- **Present-day content dates quickly** (Sept 2026 election figures are marked preliminary in the KB). These get a "current to 27 Sept 2026" stamp.
- **Glossary precision.** Italic spans mix German terms and book titles, so the allow-list needs one review pass by you.
- **Editorial mappings** (mental-map node→file, theme era-row→file, timeline row→theme, image type) are new classifications. Each is a data file, logged in `CONTENT_TRACE.md` with its rule.

---

## 8. Build order (after your approval)

1. **Pipeline:** `build-content.mjs` + schemas + exception list; run it against all files and show you the failure/exception report.
2. **Vertical slice: Weimar Republic** (`twentieth_century/02`) end-to-end: chapter page, transition flow, flip cards, debate panel, constitution-vs-reality strip, confidence badges, "How do we know?" toggle, glossary tooltips, images with credits, ribbon, light/dark, phone and desktop. **I will stop again for your reaction.**
3. Roll out to all 35 eras → Journey home → regimes → themes → timeline → gallery → questions → self-check → glossary → search → method/sources pages.
4. **QA:**
   - `qa/coverage.mjs`: every period, theme, image, audit claim and Journey Part appears in the output.
   - linkinator: internal links, plus an image HEAD check (external image checks count as network use but download nothing).
   - A fidelity spot check: 10 random passages compared with the Markdown source.
   - axe accessibility audit, and screenshots at 360 px and 1280 px in light and dark themes.
   - I'll run axe by injecting `axe-core` into pages in the app's built-in browser. If you'd rather use headless Playwright, I'll ask before downloading Chromium.
5. **Deliver:** the `site/` folder, a README (run and build instructions), `CONTENT_TRACE.md`, and a list of limitations and v2 ideas.

## 9. Decisions I need from you

1. The **mood per era group** (§6), or accept my pick.
2. Confirm or edit the **sensitive-section list** (§5).
3. **© images:** is this a local personal-study site only, or should I build the `PUBLIC_BUILD` variant from the start?
4. **Editorial classifications** (timeline→theme tags, image types) by documented keyword rules: OK?
5. **QA browser:** the built-in browser (no download) or the Playwright Chromium download?
