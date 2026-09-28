# Build an interactive website from my German history knowledge base

## Your role
Act as a senior front-end developer and an information designer who also has training in history. You are building an interactive, visually exciting, **source-critical** website on the history of Germany and the German-speaking lands. The website draws entirely on the Markdown knowledge base in this folder. The goal is a site that makes a curious non-specialist *want* to keep scrolling, and that is just as honest about evidence, uncertainty and debate as the research itself.

## The material (read all of it before planning)
The knowledge base is the root of this repository/folder (locally: `/Users/amir/Documents/Agent/History/Germany`), with 63 Markdown files and `images/IMAGE_INDEX.md`.

**Top-level files**
- `00_README.md` is the map of the whole knowledge base.
- `00_FINAL_EXPLANATION.md` is the plain-language narrative in 10 Parts, plus a mental map. This is the **spine of the site**.
- `01_RESEARCH_METHOD.md` covers the source hierarchy A–F, triangulation and terminology rules.
- `02_MASTER_TIMELINE.md`, `03_MENTAL_MODEL.md`, `04_QUESTIONS_WORTH_EXPLORING.md` and `05_REGIME_MATRIX.md` are the other top-level documents.

**Period folders:** `ancient/`, `medieval/`, `early_modern/`, `nineteenth_century/`, `twentieth_century/` and `contemporary/`, with 35 files in total. Every file follows the same 14-section template, with exact heading names and labelling rules defined in `01_RESEARCH_METHOD.md` §8 (a heading may add a qualifier after an em dash):
1. Period in One Paragraph
2. The Political Structure. This contains exactly one `### Regime Matrix — …` heading — either the full 12-question table, or a cross-reference line `**Matrix:** see <file>` for chapters that sit inside a system analysed elsewhere — and exactly one paragraph starting **What the constitution said vs how power actually worked:**.
3. Society
4. Everyday Life
5. Economy
6. Ideas
7. Pressures for change
8. Transition: exactly four steps, **BEFORE → PRESSURES → TRANSITION → AFTER**; a step may carry a qualifier in parentheses (e.g., "TRANSITION (crisis, 1930–33)") and may contain a bullet list of phases
9. What changed for ordinary people
10. What stayed the same
11. Misconceptions table
12. Historiographical debate
13. Confidence assessment — closed vocabulary: HIGH / MEDIUM / UNCERTAIN (ordinal; ranges such as MEDIUM–HIGH allowed) plus CONTESTED and REJECTED; anything in parentheses is a qualifier. There is no LOW label (`01_RESEARCH_METHOD.md` §4)
14. Sources, with levels A–F

Each file ends with "If you remember only 5 things".

**Other folders**
- `themes/` has 14 cross-period analyses: power, class, identity, nationalism, religion, militarism, democracy, authoritarianism, socialism, industrialisation, minorities & migration, women & family, education, continuity & change.
- `sources/` holds the bibliography, primary, German, international and video sources, the source-quality notes, and `SOURCE_AUDIT.md`. `SOURCE_AUDIT.md` is a claim-by-claim verification table.
- `dictionary/` contains 2,300 reference entries (437 people, 280 places, 1,583 terms) with short and long definitions. See `SITE_CHANGELOG_AND_TASKS.md` for the plain-language lines added to historiographical debates and the website rendering plan.

**Images**
- Every period, theme and top-level narrative file starts with an image block between `<!-- IMAGES:START -->` and `<!-- IMAGES:END -->` (the method file and the `sources/` files have none, by design). `00_FINAL_EXPLANATION.md` has one block per Part.
- Each block contains the image URL, a caption, the creator, the date, the holder and the licence.
- `images/IMAGE_INDEX.md` lists all 72 images, with a **Type** column (painting, print, artwork, manuscript, object, document, poster, cartoon, map, photograph, film still) and a rights summary.
- The images are hotlinked from the institutions that hold them: Cleveland Museum of Art, the Met, DHM LeMO, Haus der Geschichte LeMO and the Library of Congress.
- 18 images are public domain / CC0; the 54 marked © are for **personal study only**.

Ignore `WEBSITE_BUILD_PROMPT.md`, which is this file. **Do not modify any existing knowledge-base file.** Build everything inside a new `site/` folder.

## Non-negotiable rules (same as the original research)
1. **The knowledge base is the single source of truth.**
   - Generate site content from the Markdown at build time by parsing the files. Do not retype or paraphrase them by hand.
   - Anything you write that is new, such as a teaser, a transition sentence, a quiz question, or alt text beyond the caption, must be traceable to a specific file and section.
   - Record every such item in `site/CONTENT_TRACE.md`.
   - Do not add new historical facts. If a feature seems to need a fact the knowledge base doesn't contain, leave the feature out and list it for me.
2. **Keep the epistemics visible. Never flatten them into a confident story.**
   - Show confidence levels, CONTESTED labels, source levels (A–F) and historiographical debates in the interface, as badges, toggles or "How do we know?" panels. Do not bury them.
   - Keep "what the constitution said vs how power actually worked" as a signature element for every regime.
3. **Simple language, German terms explained.** Every German term in the text (*Reichsstadt*, *Volksgemeinschaft*, *Treuhand*…) gets an accessible tooltip or glossary entry. Build the glossary from the explanations the files already give.
4. **Images are sources, not decoration.**
   - Always show the caption, creator, date, holder and licence, with a link to the source page.
   - Label propaganda and official art as such, for example the *Völkischer Beobachter*, the Hitler Youth march, Bürde's celebration of the new emperor, and the posed colonial photo. Add a short "Read this image critically" note built from the caption.
   - Never crop out credits.
   - Never apply cinematic effects (Ken Burns zoom, dramatic music, colourisation, AI upscaling or "enhancement") to photographs of persecution, violence or war.
5. **Handle the Nazi period, the Holocaust, colonial violence and the GDR's repression with dignity.**
   - Do not gamify them: no points, streaks or "fun" animations in those sections.
   - Use a calmer, slower visual register there.
   - Do not add graphic atrocity imagery.
6. **Accuracy of structure.** Periods, dates and transitions must match the files. Some dates differ between files on purpose (e.g., 843 / 911 / 919 for the end of the Frankish world); the conventions are explained in `01_RESEARCH_METHOD.md` §9 — link to them where the difference is visible. When the knowledge base genuinely disagrees with itself, flag it in `CONTENT_TRACE.md` and do not pick a side silently.

## What the experience should feel like
The experience should feel like a museum exhibition crossed with long-form interactive journalism: immersive, image-led, with rhythm, and with depth on demand. Suggested features are below. Propose your own too, but justify each one by what the reader learns from it.

- **The Journey (home):** a scroll-driven narrative through the 10 Parts of `00_FINAL_EXPLANATION.md`.
  - Use full-bleed era images, the mental map as a navigable overview, and a persistent era "time ribbon" showing where you are in 2,000 years.
  - The mood should change by era through palette, typography accents and texture, while staying consistent and readable.
- **Era chapters:** one page per period file.
  - Start with a hero image and the one-paragraph summary.
  - Continue with expandable sections for all 14 template sections.
  - Present the BEFORE → PRESSURES → TRANSITION → AFTER flow as an animated diagram.
  - Present the misconceptions as "Myth / Correction" flip cards.
  - Give the historiography its own "Historians disagree" panel, with the positions side by side.
  - End with "If you remember only 5 things" as a closing card.
- **Regime Matrix explorer:** compare any 2–3 regimes across the 12 questions (from `05_REGIME_MATRIX.md` and each file's matrix), with the "constitution vs reality" contrast highlighted.
- **Theme threads:** pick a theme, such as women & family or militarism, and follow it across eras on the timeline, jumping into the relevant sections.
- **Interactive timeline** from `02_MASTER_TIMELINE.md`, filterable by system and theme, linked to the chapters.
- **"How do we know?" layer:** a global toggle that reveals confidence badges, source levels and links to the `SOURCE_AUDIT.md` entries throughout the site.
- **Image gallery / lightbox** built from `IMAGE_INDEX.md`, filterable by era and by the index's Type column, with full credits.
- **Self-check:** optional recall cards generated only from the "5 things" lists and the misconception tables, with no points in the sensitive sections. Progress is stored in `localStorage`, wrapped in try/catch.
- **Open questions:** a page built from `04_QUESTIONS_WORTH_EXPLORING.md`.
- **Search** across all content, built at build time and run client-side.

## Technical requirements
- **Static site, no backend.** Use a lightweight stack. Astro or Vite + vanilla TS are both fine; choose one and justify it briefly. Use restrained motion: CSS scroll-driven animations or a small library such as GSAP ScrollTrigger. No heavy frameworks without a reason.
- **Build pipeline:** Markdown → a structured JSON content model. The model covers periods, sections, regime matrices, transitions, misconceptions, confidence rows, sources, images and glossary. The build must fail loudly if a file doesn't match the template.
- **Images:**
  - Use the hotlinked URLs, with `loading="lazy"`, explicit sizes and a graceful fallback card that shows the credit when an image fails to load.
  - Add an optional script, `site/scripts/download-images.mjs`, that caches the images locally for offline use. Do not run it without asking me.
- **Accessibility:**
  - Semantic HTML, keyboard navigation, visible focus and alt text taken from the captions.
  - Honour `prefers-reduced-motion`; every animation must have a static equivalent.
  - Text contrast must meet WCAG AA.
- **Responsive:** it must work well on a phone (360 px) as well as a desktop. Provide light and dark themes.
- **Performance:** fast first load, and page weight kept reasonable.

## Process
1. **Inventory.** Read every file. Produce `site/PLAN.md` containing:
   - the content model;
   - the site map;
   - the feature list, with what each feature teaches;
   - the visual direction, with 2–3 mood options per era group;
   - the risks, including template inconsistencies you found.
   **Stop and show me the plan before building.**
2. **Build** in vertical slices. Do one era end-to-end first, for example the Weimar Republic, so I can react to it, then roll the same pattern out to all eras.
3. **Quality assurance** before you call it done:
   - an automated check that every period, theme and image in the knowledge base appears on the site;
   - a link and image checker;
   - a content-fidelity spot check of 10 random passages against the Markdown;
   - an accessibility audit;
   - visual review in a real browser at phone and desktop widths, using screenshots.
4. **Deliver:**
   - the `site/` folder;
   - a README with how to run and build the site;
   - `CONTENT_TRACE.md`;
   - a short list of limitations and ideas for version 2.

Work on a branch and commit in small, well-described steps. If you are running in a cloud session, check first that you can reach the image hosts (openaccess-cdn.clevelandart.org, images.metmuseum.org, www.dhm.de, www.hdg.de, tile.loc.gov); if not, tell me, and use a headless browser (Playwright/Chromium) plus screenshots for the visual review. Ask me before any irreversible action, any download of files, or any publishing or deployment.

## Decisions already made (27 Sept 2026)
1. **Moods:** use the plan's pick (Vellum & minuscule · Woodcut · Biedermeier · Archive, with Weimar modern for 1918–33 · Two inks · Civic paper), with two chapter-level accents: *Callot grey* for the Thirty Years' War and *Iron & soot* for the industrial-society chapter. No blackletter/Fraktur display type anywhere.
2. **Sensitive sections (calm register, no gamification):** the plan's list plus `twentieth_century/03` (rise of Nazism). For `twentieth_century/10` (GDR) and `11` (Cold War) apply the calm register to the repression, Stasi and border-death sections rather than to whole chapters. Mortality figures and casualty ranges anywhere (e.g., the Thirty Years' War chart, WWI) get no playful motion.
3. **© images:** the default build is a local, personal-study site. Build the `PUBLIC_BUILD=1` variant (© images become credit-and-link cards) now, but never deploy anything publicly without asking. The GitHub repository stays private.
4. **Classifications:** timeline → theme tags and mental-map node → file mappings by documented rules are fine; log every rule in `CONTENT_TRACE.md` and keep a manual override file. Image types come from the Type column in `IMAGE_INDEX.md`, not from keyword rules.
5. **QA browser:** use Playwright + `@axe-core/playwright` so QA can be re-run anywhere (locally, in a cloud session, in CI). Downloading Chromium is approved; if a Chromium is already installed (cloud sessions), point Playwright at it instead of downloading.
