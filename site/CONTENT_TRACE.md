# CONTENT_TRACE

Every piece of wording or classification on the site that does not come verbatim from the knowledge base is recorded here, with the file and section it derives from. Knowledge-base disagreements are logged too; the site never resolves them silently.

**How verbatim text is guaranteed.** All historical text on the site is produced by `scripts/build-content.mjs` from the Markdown (rendered from the parsed syntax tree, never retyped). `qa/fidelity.mjs all` checks that every passage of ≥ 50 characters in each built chapter appears verbatim on its page (Weimar: 103/103, including the "In plain words" lines). Site additions that are not KB text carry `data-ui` or live in the components listed below.

*Status: vertical slice (Weimar Republic) + inline dictionary, 28 Sept 2026. Entries are added as the rollout proceeds.*

## 1. New wording and classifications

### 1a. Interface wording (no historical content)

| id | Site location | New text / rule | Derived from |
|---|---|---|---|
| U1 | Header | Site title "German History, Explained" | `00_FINAL_EXPLANATION.md` H1 |
| U2 | Header | Nav labels "Eras", "Glossary", "Source audit"; theme button "Auto / Light / Dark"; "Skip to content" | Site map, `PLAN.md` §3 |
| U3 | Header | Toggle "How do we know?" | `WEBSITE_BUILD_PROMPT.md` ("How do we know?" layer) |
| U4 | Footer | "Every historical sentence on this site is generated from the Markdown knowledge base *German History — A Source-Critical Knowledge Base* (compiled September 2026)…"; "Images are hotlinked from the institutions that hold them… Images marked © are shown for personal study only." | `00_README.md` title and subtitle; `images/IMAGE_INDEX.md` intro and "Where the images come from" |
| U5 | Home (preview), Eras index, Glossary intros | Short explanatory sentences about the preview and the rollout; glossary intro "German terms, each explained in the words the knowledge base itself uses…" | Build process (`WEBSITE_BUILD_PROMPT.md` Process §2); glossary rule (brief rule 3) |
| U6 | Chapter | "The chapter, section by section"; "Expand all sections" / "Collapse all sections"; "From `<file>` §N." under every section | Template (`01_RESEARCH_METHOD.md` §8) |
| U7 | Chapter, era context | "Where this chapter sits · {era group}"; "Chapters overlap at their edges on purpose (date conventions). Scale: {from}–{to}, linear." | `01_RESEARCH_METHOD.md` §9, row "Chapter overlaps" |
| U8 | Constitution strip | Column headings "What the constitution said" / "How power actually worked" are the two halves of the KB's own label; in §2 the pointer "What the constitution said vs how power actually worked — shown at the top of this chapter." | `01_RESEARCH_METHOD.md` §8 ("Constitution vs reality") |
| U9 | §11 cards | Card labels "Misconception" / "Correction" (the KB table headers); buttons "Show the correction", "Back to the misconception", "Show all corrections" / "Show as cards" | §11 table headers in every period file |
| U10 | §12 | Panel label "Historians disagree"; a CONTESTED badge at the top of any debate card whose text contains CONTESTED (rule, marked `data-ui`) | `WEBSITE_BUILD_PROMPT.md` ("Historians disagree" panel); the card's own text |
| U11 | §2 matrix | "The same 12 questions are asked of every political system (`05_REGIME_MATRIX.md`)." | `01_RESEARCH_METHOD.md` §1: "For each system the research asked the same questions (see the Regime Matrix)" |
| U12 | §13 | Legend "What the confidence labels mean" (meanings quoted from §4) and "There is no LOW label." Badge tooltips quote the §4 meanings | `01_RESEARCH_METHOD.md` §4 |
| U13 | "How do we know?" rail | Headings "Confidence in this chapter's key findings (§13)", "Sources by level (§14)", "Checked in the source audit"; counts are computed from the chapter's own §13 table and §14 list; audit claims come from `data/audit-map.json` (A1) | §13, §14, `sources/SOURCE_AUDIT.md` |
| U14 | §14 | Chips "Level X" (tooltip: the level's type from method §3), "primary", "no level", access letter R/M/K (tooltip: bibliography legend), "Access note: …" | `01_RESEARCH_METHOD.md` §3; `sources/bibliography.md` intro line |
| U15 | Figures | Rights chips "© personal study only", "Public domain (CC0)", "No known restrictions"; fallback text "The image could not be loaded from its holder." / "This image is © and is not reproduced in the public version." / "View it at {holder}" | `images/IMAGE_INDEX.md` Licence column and rights summary |
| U16 | Figures (flagged images) | "Read this image critically": "This is {kind}: it shows how power wanted to be seen. Its caption: {caption}" + "Questions this project asks of every primary source:" + the five checklist questions (parsed from the file) | `images/IMAGE_INDEX.md` "How images were chosen"; `sources/primary_sources.md` checklist |
| U17 | Figures | Alt text = the image title in `IMAGE_INDEX.md`, nothing added; the caption shown is the one in the file that uses the image | `images/IMAGE_INDEX.md` |
| U18 | Time ribbon | "{date range} within 500 BCE – 2026"; hidden "You are here:"; century ticks | Chapter H1; range = earliest chapter (`ancient/01`, c. 500 BCE) to present (2026) |
| U19 | Chapter navigation | "All eras"; "(rollout)" next to chapters not yet built. Cross-references (`…md`) show the target's **title** (its H1 without the date range), linked when the page exists; otherwise plain, with the file path and "this page is built in a later step" as tooltip (Part B3) | H1 of the target file |
| U20 | Header | Toggle "Highlight names & terms" (on by default); phone menu button "Menu" | `SITE_CHANGELOG_AND_TASKS.md` C3 |
| U21 | Inline dictionary | Tooltip: kind badge "Person / Place / Term", name, dates, Short text, hint "Click or press Enter for more". Card: kind · subkind, name, German form, dates, note (with a CONTESTED badge when the note says so), Explanation, "Main chapter", "Also in", "Open in dictionary", "Close", basis chip (KB / KB+K) in the "How do we know?" layer with the tooltip "KB: from the knowledge base text. KB+K: knowledge base plus well-established general knowledge". Hidden screen-reader text "Person: {Short}" etc. All entry text is from `dictionary/*.md` | `dictionary/README.md` (fields, Basis) |
| U22 | Dictionary page | Kicker "Reference"; intro "People, places and terms named in the knowledge base, with the short and longer explanations from its dictionary (dictionary/*.md)." and a KB+K note paraphrasing `dictionary/README.md` "Basis: KB+K"; filters "People / Places / Terms"; "Search the dictionary"; "N entries shown"; "No entries match."; "Main chapter:", "Also in:", "(chapter not built yet)", "Note:", "Basis: …" | `dictionary/README.md` |
| U23 | §12 debates | Panel label "In plain words" (the KB's own lead-in `*In plain words:*`, shown as a label) | `SITE_CHANGELOG_AND_TASKS.md` C4 |
| U24 | Presentation changes approved in Part B | Debate titles lose a trailing colon; a bare trailing "CONTESTED." is replaced by the card's badge (B4). Constitution strip items keep only the date qualifier of "Said (…)" / "Worked (…)" (B8). Credit line = creator · date · holder · licence, date omitted when the title contains it (B5). `qa/fidelity.mjs` applies exactly these changes before comparing | `SITE_CHANGELOG_AND_TASKS.md` Part B |

### 1b. Classifications and mappings (editorial, each a data file)

| id | Data file | Rule | Derived from |
|---|---|---|---|
| E1 | `data/eras.json` groups | Six era groups with labels "Antiquity and the Franks" (to 919), "Holy Roman Empire and early modern" (919–1806), "Long 19th century" (1792–1918), "1914–1945", "Divided Germany" (1945–1990), "United Germany" (1990–2026); every period file assigned by its folder and date range | `PLAN.md` §6 era groups; Part spans in `00_FINAL_EXPLANATION.md` |
| E2 | `data/eras.json` moods | Vellum · Woodcut · Biedermeier · Archive (Weimar modern for `twentieth_century/02`) · Two inks · Civic paper; chapter accents Callot grey (`early_modern/02`) and Iron & soot (`nineteenth_century/07`) | Decision of 27 Sept 2026 (`WEBSITE_BUILD_PROMPT.md`) |
| E3 | `data/eras.json` sensitive | Whole chapters in the calm register: `nineteenth_century/08`, `twentieth_century/03`–`08`. Section-level for `twentieth_century/10` and `11` (repression, Stasi, border deaths) — **sections to be fixed during rollout** | `PLAN.md` §5 + decision of 27 Sept 2026 |
| E4 | `data/eras.json` ruptures | Ticks at 1618, 1806, 1918, 1945 | `00_FINAL_EXPLANATION.md` mental map: "The biggest ruptures came from war — 1618, 1806, 1918, 1945" |
| I1 | `data/image-notes.json` | Flags "official art" (`kaiserproklamation`, `koeniggraetz`) and "posed photograph" (`kolonialbeamter`); Völkischer Beobachter and Hitler Youth images to be flagged in rollout | `images/IMAGE_INDEX.md` "How images were chosen" |
| A1 | `data/audit-map.json` | A claim maps to a chapter when the chapter states the same finding in §12/§13. Weimar → claims 28, 29, 30, 32 | `sources/SOURCE_AUDIT.md` claim table; `twentieth_century/02` §12–13 |
| G1 | *(retired 28 Sept 2026)* | The six-term `data/glossary.json` allow-list is replaced by the KB dictionary; all six terms are covered there (*Preußenschlag* → "Prussian coup", *Vernunftrepublikaner* → "republicans of reason", *Präsidialkabinette*, *Kaiserreich*, *Machtergreifung*, *Reichsstädte*) | `dictionary/terms.md` |
| D1 | Dictionary matching (`scripts/lib/dictionary.mjs`) | Canonical name + "Also written as" forms; case-sensitive, whole word, longest match first; not in headings, links, code or image credits; image captions included. Ambiguous forms (listed in `ambiguous_forms.md`, or claimed by several entries) are highlighted only where the table names an entry for that chapter. People and places: every mention; terms: first mention per section; places get a location glyph on their first mention per section. First mention on a page carries the anchor `#m-{id}` used by "Main chapter →" | `SITE_CHANGELOG_AND_TASKS.md` C2 |
| D2 | `data/dictionary-overrides.json` | **72 suppressions** of misreadings: a form is left as plain text in one chapter. 2 found by hand (Weimar: "20 July" inside the date of the Prussian coup; "Meissner" = State Secretary Otto Meissner, not the economist), 70 found by a model review of all 4,351 chapter/form/entry matches with context (28 Sept 2026). Typical causes: ordinary English words matched to a technical term ("coalition", "reaction", "toleration", "counts", "contributions", "electorate"), a term's era wrong for the context ("reparations" after 1945, "concentration camps" in the colonial chapter), fragments of other names ("Israel" in "Jonathan Israel"). Suppressing is the safe direction: a missed highlight, never a wrong one. `qa/dictionary.mjs` fails on stale suppressions. **Each should move into `dictionary/ambiguous_forms.md`** (see K20) | Review files in the session scratchpad; reasons in each entry's `why` |
| P1 | Chapter page | Images after the hero are spread evenly between sections 2–14 (placement only; the caption carries the meaning) | — |
| P3 | `data/image-sizes.json` | Pixel sizes measured from the hotlinked images; used for `width`/`height` and the frame's aspect ratio (clamped between 4:5 and 21:9, image contained, never cropped). Layout metadata, not content | Measured 27 Sept 2026 by `qa/image-urls.mjs` |
| P3b | Hero order (Part B11) | Desktop: title, date and summary on the left, hero image on the right. Phones: title, then the hero image, then the one-paragraph summary — the image comes first in reading order after the title, as the brief asks | Brief: "Start with a hero image and the one-paragraph summary" |
| P2 | Chapter page | Sections 8, 11 and 12 open by default (featured diagram, cards, debate panel); the others expand on demand; §1 is the lead | Brief: "expandable sections" + featured components |

## 2. Knowledge-base inconsistencies (flagged, not resolved)

Found during the inventory (27 Sept 2026, `PLAN.md` §7) and during the pipeline build. **Status** records what the KB itself says now.

| # | Item | Conflicting values (file) | Status / site treatment |
|---|---|---|---|
| K1 | Frankish/Carolingian end date | 919 (`medieval/01` H1) · 911 (timeline §B) · 843 (mental map) | Resolved in the KB by convention: `01_RESEARCH_METHOD.md` §9 explains the three dates. The site links to §9 wherever chapter dates differ |
| K2 | Holy Roman Empire start | 919 (`medieval/02`) · 962 | Resolved by §9 convention (kingdom 919, empire 962) |
| K3 | Weimar start | 1918/19 · 1919 · 1918 | Resolved: all Weimar ranges now "1918/19–1933"; §9 explains |
| K4 | Number of expellees | ~12 million vs 12–14 million (caption) | Resolved: caption aligned; §9 explains that some works give 12–14 million |
| K5 | Treuhand firms | ~8,500 vs some 8,000 (caption) | Resolved: caption aligned (about 8,500) |
| K6 | Hunger-winter name | *Kohlrübenwinter* vs *Steckrübenwinter* | Resolved: caption now "*Kohlrübenwinter*, also called *Steckrübenwinter*" |
| K7 | Number of political systems | ~14 vs 13 | Resolved: method file now says 13 |
| K8 | Template compliance | contemporary/02–04 merged or lacked sections | Resolved in consistency pass 2; the pipeline now enforces the template on all 35 files |
| K9 | Matrix coverage | 13 files had no matrix | Resolved: 26 full matrices + 9 `**Matrix:** see …` cross-references; the pipeline enforces exactly one per file |
| K10 | Transition label scheme | CRISIS/TRANSITION and 15+ variants | Resolved: BEFORE → PRESSURES → TRANSITION → AFTER in all 35 files, enforced |
| K11 | Confidence scale | LOW in the brief; free-text labels in files | Resolved in period files (closed vocabulary, enforced; no LOW). See K15 for the audit file |
| K12 | Image blocks | 8 files have none | By design (brief: the method file and `sources/` have none). Those pages get no hero image |
| K13 | Journey Part 1 range | Heading "Part 1 — … (to 919)" vs its box "If you remember only 5 things (to 900)" (`00_FINAL_EXPLANATION.md`) | **Open.** Both shown as written when the Journey is built |
| K14 | Matrix heading form | `ancient/02` "### Regime Matrix (Roman provinces …)" and `twentieth_century/07` "### Regime Matrix (wartime changes)" use parentheses, not an em dash (§8 rule) | **Open** (still in the KB on 28 Sept 2026, so `data/template-exceptions.json` cannot be emptied as Part A1 expects). Qualifier shown as written |
| K15 | Audit confidence cells | Claim 36 "Largely REJECTED (strong form)" is outside the §4 closed vocabulary; many cells hold two labels ("HIGH (fact) / CONTESTED (effect)"), while §4 describes one label per cell | **Open.** Audit page shows the cell text as written |
| K16 | Unexplained German terms (Weimar page) | *Reichstag*, *Reichsrat*, *Reichswehr*, *Rentenmark*, *Osthilfe*, *Doppelverdiener*, *Zwangslagen* have no English explanation anywhere in the KB | **Open — for the author.** No tooltip is shown (none may be invented). Adding a short explanation in the KB would let the glossary pick them up |
| K17 | §12 format | `contemporary/03` and `/04` write §12 as prose, not a bullet list | Not a rule violation; rendered as prose (build warning) |
| K19 | `dictionary/ambiguous_forms.md` rows for site files | 77 rows name files inside `site/` (incl. `site/node_modules/…`, `site/PLAN.md`) as chapters — the dictionary builder scanned the website folder | **Open.** Ignored by the build (not KB chapters); should be deleted from the KB |
| K20 | Dictionary misreadings | 72 chapter/form pairs where the dictionary's forms pick the wrong entry (see D2) | **Open.** Suppressed site-side; the fix belongs in `ambiguous_forms.md` ("—" or the right entry) |
| K21 | Dictionary "Also in" lists | Entries list chapters where a word merely occurs in another sense (e.g. "Coalition" = workers' right to combine, listed for chapters that mean party coalitions) | **Open.** Noted only |
| K16b | German terms without explanation (K16) | Now covered by the dictionary: *Reichstag*, *Reichsrat*, *Reichswehr*, *Rentenmark*, *Osthilfe*, *Doppelverdiener*, *Zwangslagen* all have entries | **Resolved** by the KB dictionary |
| K18 | Source level format | `ancient/01` Tacitus: "(primary, Level A — read critically as Roman literature)" vs the usual "(Level A)" | Parsed correctly; noted only |
