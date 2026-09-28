# Knowledge-base change log and tasks for the Site Builder

*For the Claude session that builds `site/`. Written 28 Sept 2026. The knowledge base (KB) is the single source of truth; the site must not add facts of its own. Work through the tasks in order and tick them off in `site/PLAN.md`.*

---

## Part A — What changed in the knowledge base since `site/PLAN.md` was written

### A1. Consistency pass 2 (27 Sept 2026) — already in the KB
Full log: `sources/SOURCE_AUDIT.md` → "Consistency pass 2". Rules: `01_RESEARCH_METHOD.md` §4, §8 and §9.

- **Chapter structure:** all 35 period files now have the 14 sections with canonical names. A heading may add a qualifier after an em dash, e.g. `## 2. The Political Structure — local level`. `contemporary/02–04` were completed. **`scripts/template-exceptions.json` should now be empty** — delete the entries and let the build fail on any new deviation.
- **Regime matrix:** section 2 of every period file has exactly one `### Regime Matrix — …` heading. It is followed either by the 12-row table or by a line `**Matrix:** see \`<file>\`` (a cross-reference, heading `### Regime Matrix — cross-reference`). Five new full matrices: `ancient/01`, `medieval/03`, `nineteenth_century/04`, `twentieth_century/03` (presidential cabinets 1930–33) and `contemporary/04` (EU/NATO system). `05_REGIME_MATRIX.md` now has a table saying where each system's full matrix is.
- **Constitution vs reality:** exactly one paragraph per period file starting `**What the constitution said vs how power actually worked:**`. In `contemporary/02` it is followed by a two-column table.
- **Transitions (§8):** always exactly `BEFORE → PRESSURES → TRANSITION → AFTER`, separated by `↓`. A step may carry a qualifier in parentheses (`**TRANSITION (crisis, 1930–33):**`) and may contain a bullet list of phases. Render the qualifier as a sub-label; no more verbatim label variants.
- **Confidence vocabulary (closed):** HIGH, MEDIUM, UNCERTAIN (ordinal; ranges such as `MEDIUM–HIGH` between neighbours allowed), plus CONTESTED and REJECTED; text in parentheses is a qualifier. There is no LOW.
- **Date conventions:** `01_RESEARCH_METHOD.md` §9 explains why 843/911/919 and 919/962 both appear. Weimar is 1918/19–1933 everywhere. Link to §9 wherever differing dates are visible (the chapter-position mini-timeline already does this).
- **Image index:** `images/IMAGE_INDEX.md` now has a **Type** column; use it for the gallery filter instead of keyword rules. It also has a rights summary (18 public domain, 54 © for personal study).
- Three chapter titles gained date ranges (`medieval/04`, `nineteenth_century/04`, `contemporary/04`); `nineteenth_century/06` and `contemporary/02` titles were reformatted.

### A2. Dictionary of people, places and terms — done
A new folder `dictionary/` is being added to the KB: `people.md`, `places.md`, `terms.md`, `ambiguous_forms.md` and `README.md`. It has about 2,300 entries (≈440 people, ≈280 places, ≈1,580 terms). Every entry has:

- a canonical name;
- "Also written as" (the exact surface forms used in the KB);
- ambiguous forms;
- kind and subkind;
- dates;
- **Short** (≤ 18 words, for hover);
- **Explanation** (≤ 60 words, for the click pop-up);
- German name;
- main chapter;
- also-in chapters;
- basis (KB or KB+K);
- note (e.g. CONTESTED).

`ambiguous_forms.md` says, for each chapter, which entry an ambiguous form means (e.g. "Reichstag" = Imperial Diet in the early modern chapters, the parliament after 1871). "—" means: do not highlight it there.

**Status:** Complete. Final counts: 437 people, 280 places, 1,583 terms, 1,135 ambiguous rows (338 resolved, 797 unresolved) = 2,300 total. 9 fact-check fixes applied. Dictionary written to `dictionary/{people,places,terms,ambiguous_forms}.md` and `dictionary/README.md`. Ready for Part C.

### A3. "In plain words" lines for every historiographical debate — done
Each item in §12 "Historiographical Debate" of the 35 period files will get an indented paragraph starting `*In plain words:*` (122 lines in total). It explains the dispute for a non-specialist: the question, the sides and any jargon. Example (Weimar, Borchardt controversy):

> *In plain words:* Could Chancellor Brüning have fought the Depression by spending more instead of cutting? Borchardt said no — wages were too high for what workers produced and nobody would lend Germany money. Critics say the wage figures are wrong and other policies were possible; Ritschl says the real trap was Germany's foreign debts and reparations.


**Status:** All 122 plain-words lines inserted into the 35 period files under §12. Inserted directly after item_start match. Validator confirms no template violations. Ready for Part C.
---

## Part B — Fixes from the review of the Weimar slice (27–28 Sept 2026)

The review was done in the Claude desktop app's browser: no console errors; images load; the evidence toggle, myth cards and section accordions work; the page does not overflow at 375 px.

1. **Evidence toggle hidden after scroll.** "How do we know?" disappears when the header collapses, so readers cannot switch it mid-chapter. Keep it in the compact header.
2. **Header too tall on phones.** The header is 188 px before collapsing, at both 375 px and 737 px. Aim for ≤ 110 px on phones; the ribbon can shrink.
3. **Raw file paths in text.** "see `twentieth_century/04_nazi_state.md`" and "See `03_rise_of_nazism.md`" appear as-is. Render every backticked `.md` reference as a link to that chapter's page, using its title. Resolve bare names like `03_…md` relative to the file's own folder.
4. **Debate panel formatting.** Titles keep trailing colons ("The Borchardt controversy (1979–):"), and CONTESTED appears twice (badge plus the text's own "CONTESTED."). Strip the trailing colon, and drop a bare trailing "CONTESTED." from the body when the badge is shown.
5. **Image credit repeats the title and date** ("Crowd in front of the Reichstag, 9 November 1918 — 1918."). Show the caption once; in the credit line, show only creator · date · holder · licence, and omit the date if the title already contains it.
6. **Footer typo:** "knowledge baseGerman History" is missing a space.
7. **Mini-timeline truncation:** "Where this chapter sits" cuts titles off ("The First …"). Use short labels (e.g. derived from the file slug or a short-title map logged in CONTENT_TRACE) with the full title in a tooltip, or allow two-line wrapping.
8. **Constitution strip duplicates labels:** the content repeats the column headings ("Said (1919):", "Worked (1930–33):"). Keep only the date qualifier as a small label.
9. **Evidence panel accessibility:** the confidence counts are exposed as "× 3" without the level name. Put the label (HIGH, CONTESTED…) in the accessible name. Source levels: merge combined levels (e.g. "A/C") into one group, or show them as "A + C", not as a second "Level C" group.
10. **Myth cards:** the fixed height leaves large empty space; size them to their content, keeping a min-height only for the flip animation.
11. **Hero image position:** it currently comes after §1. Decide: put it first (as the brief says), or keep it and log the decision.

---

## Part C — New feature: inline dictionary with people and places set apart (starts when `dictionary/` exists)

**Goal (from the owner):** readers who do not know who Brüning or Borchardt was, what "deflation" or the "Young Plan" means, or where Königgrätz is, can understand every paragraph without leaving it. Person and place names must be visually distinct from each other and from ordinary text.

### C1. Data
- Parse `dictionary/people.md`, `places.md` and `terms.md` (entry = `### Name` + `<a id>` + bullet fields) and `ambiguous_forms.md` into `src/content/generated/dictionary.json`.
- The build must fail loudly on a malformed entry, a duplicate id, or a main chapter that does not exist.
- These glosses come from the KB, so they satisfy the "quoted from the KB" rule; replace or extend the current `data/glossary.json` allow-list with this source. Keep the existing entries if they add something.

### C2. Matching (build time, not in the browser)
- Match the canonical name plus "Also written as" forms in body text, captions, tables and debate text. Do not match inside headings, links, code, image credits or the dictionary pages themselves.
- Case-sensitive, whole-word, longest match first (so "Saxony-Anhalt" wins over "Saxony", and "Weimar Republic" over "Weimar").
- **Ambiguous forms:** use `ambiguous_forms.md`. Highlight only where the table names an entry for that chapter; "—" or a missing row means plain text.
- Density: mark **every** mention of people and places, because the owner wants them set apart. Terms get a tooltip on their first mention per section only; later mentions stay plain text unless it's a person or place.

### C3. Presentation
- **Three visually distinct classes**, never distinguished by colour alone:
  - *person* — e.g. small caps or medium weight plus a person colour, with a subtle dotted underline;
  - *place* — e.g. place colour plus a small location glyph on first mention per section;
  - *term* — ordinary colour with a dotted underline.
- Colours must pass WCAG AA in light and dark themes and follow the era mood without clashing with the calm register in sensitive chapters.
- **Hover or keyboard focus:** a small tooltip with name, dates, kind badge (Person · Place · Term) and the **Short** text. The tooltip must not cover the word and must stay on-screen.
- **Click or Enter:** a pop-up dictionary card (a dialog on desktop, a bottom sheet on phones) with:
  - name, German form, dates and kind;
  - the **Explanation**;
  - a CONTESTED note if present;
  - "Main chapter →" (a link to the chapter page, anchored to the first mention if possible);
  - "Also in" (chapter chips);
  - "Open in dictionary" (a link to the dictionary page);
  - the basis marker (KB / KB+K) visible in the "How do we know?" mode.
  
  Esc closes it and focus returns to the word.
- **Touch:** first tap opens the pop-up directly (no hover on phones).
- **Dictionary page** (`/dictionary/`): A–Z with filters People / Places / Terms, search (Pagefind or client-side), and one anchor per entry id. Each entry links back to its chapters.
- **Reading preference:** a toggle "Highlight names & terms" (on by default, stored in localStorage with try/catch) for readers who want plain text.
- Accessibility: use `aria-describedby` for the tooltip text; the pop-up is a proper dialog with focus trap; no information is available only on hover.

### C4. "In plain words" in debates
- Render the `*In plain words:*` paragraph inside each debate card as a visually distinct, always-visible block (e.g. a light panel labelled "In plain words" above or below the scholarly text).
- Where a debate item has sub-bullets (e.g. War origins, How to characterise the GDR), each sub-bullet has its own line.
- Items in `contemporary/03` and `/04` are single paragraphs; they get one line each.

### C5. QA additions
- Coverage: every dictionary entry whose forms occur in a chapter is highlighted there, except where `ambiguous_forms.md` says "—".
- No highlight inside headings, links or credits.
- Tooltip and pop-up are keyboard- and screen-reader-accessible (axe).
- Screenshots of the Weimar chapter with highlights on at 375 px and 1280 px, in light and dark.

---

## Part D — Unchanged decisions
See `WEBSITE_BUILD_PROMPT.md` → "Decisions already made". The site stays local and for personal study; `PUBLIC_BUILD` turns © images into credit cards; never deploy without asking.
