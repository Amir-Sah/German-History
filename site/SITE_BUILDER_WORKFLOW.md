---
name: site-builder-workflow
description: Use when building, extending, fixing or reviewing the German-history website in site/ (Astro static site generated from the Markdown knowledge base) — adding page types, adapting to knowledge-base changes, dictionary highlighting, review fixes, QA, merging. Not for editing the knowledge base itself (see ../KB_BUILDER_DICTIONARY_WORKFLOW.md).
---

# Site Builder — workflow, state and lessons

*Written 29 Sept 2026 by the Site Builder session; publishing step added 30 Sept 2026. Records what was built in `site/`, how, the decisions taken with the owner, the pitfalls met, and how to keep token use low. Read this first in every new Site Builder session; then read only what the task needs.*

---

## 1. Role and boundaries

- The Site Builder owns **`site/`** only (plus, since the public release, the repository-level release files it created on the owner's request: `README.md`, `LICENSE.md`, `NOTICE.md`, `.github/workflows/pages.yml`, see §5.7). The knowledge base (KB: the repository root — period folders, `themes/`, `sources/`, `images/`, `dictionary/`, top-level `0x_*.md`) is **read-only**. The other exception outside `site/` is `.claude/launch.json`.
- A separate **KB builder** session maintains the KB and follows `../KB_BUILDER_DICTIONARY_WORKFLOW.md`. Hand-offs go both ways as Markdown files: KB → site in `../SITE_CHANGELOG_AND_TASKS.md`; site → KB in `site/DICTIONARY_ISSUES.md` (generated) and `site/CONTENT_TRACE.md` §2 (KB inconsistencies).
- Non-negotiables (full text: `../WEBSITE_BUILD_PROMPT.md`, short form: `site/CLAUDE.md`): the Markdown is the only source of historical text; every new word or classification is logged in `CONTENT_TRACE.md`; no new facts; epistemics visible; images are sources (full credits, no crop/zoom/effects on photographs, "Read this image critically" for propaganda/official art); calm register for Nazi era, Holocaust, colonial violence, GDR repression; the build fails loudly on template breaks; ask before downloads, publishing, deploying.
- Git: develop on the session's designated branch; commit in small described steps; the stop hook requires a clean, pushed tree before a turn ends. Merge to `master` only when the owner says so (pattern that worked: **pull `master` into the branch first, rebuild + QA, then open a PR and merge it**).

## 2. What exists (29 Sept 2026)

| Area | State |
|---|---|
| Content pipeline | `scripts/build-content.mjs` parses all 70 KB files → `src/content/generated/*.json`; strict validation (template §8, closed confidence vocabulary, image blocks ↔ `IMAGE_INDEX.md`, dictionary structure) |
| Era chapters | **All 35 built** from one template (`src/pages/eras/[slug].astro`), moods per era group, calm register |
| Dictionary | Inline highlighting (people/places/terms) on all chapters; tooltip + card dialog; `/dictionary/` index + one page per letter + JSON search index |
| Other pages | `/` the Journey (10 Parts + mental map, from `00_FINAL_EXPLANATION.md` → `journey.json`; node map `data/mental-map.json`; ribbon script `src/scripts/journey.ts`), `/eras/`, `/how-we-know/` (method), `/how-we-know/audit/` (59 claims with anchors) |
| QA | `npm run qa` = 11 checks, all passing (see §6) |
| Publishing | **Optional step, done 29 Sept 2026** (§5.7): repo public; GitHub Pages at https://amir-sah.github.io/History/ via `.github/workflows/pages.yml` on every push to `master`; all 72 images hotlinked with rights + takedown notice; `data/takedowns.json` |
| **Not built yet** | Regime explorer (`05_REGIME_MATRIX.md`), 14 theme pages, interactive timeline (`02_MASTER_TIMELINE.md`), gallery, open questions (`04_…`), self-check, mental-model page (`03_…`), search UI (Pagefind index exists, no UI), sources/bibliography page, two charts proposed in PLAN §4 (NSDAP votes, Thirty Years' War mortality range) |

Merged PRs so far: Amir-Sah/History#1 (pipeline + Weimar slice + QA), #2 (dictionary, plain words, review fixes), #3–#5 (dictionary report, 5-things fix), #6 (review of 29 Sept), #7 (all 35 chapters), #8 (this workflow file), #9 (Journey home), #10 (README, licences, Pages), #11 (all images on the published site + takedown list).

## 3. Architecture (read this instead of the code)

```
../*.md ──► scripts/build-content.mjs ──► src/content/generated/*.json ──► Astro pages ──► dist/
            lib/markdown.mjs  (mdast → HTML: xrefs, badges, dictionary marks)
            lib/dictionary.mjs (parse dictionary/*.md, matcher, matchForms, dictHref)
            lib/routes.mjs    (KB path → URL, resolver with titles)
            lib/scope.mjs     (which pages are built)   lib/schema.mjs (zod)
```

- **Generated JSON** (all under `src/content/generated/`): `periods` (35; per period: sections[14] of typed blocks, matrix/matrixRef, constitution, fiveThings, images, dictionaryUsed, auditClaims), `images` (72), `dictionary` (2,300 entries + `letter`, `href`, `matchForms`), `dictionary-matches` (every highlight with context — for reviews), `audit` (59), `bibliography`, `method` (confidence scale, source levels, access legend R/M/K, primary-source checklist, groups, ruptures), `docs` (method + audit rendered), `kb-titles`, `scope`, `image-layout`, `report`.
- **Section blocks** (`type`): `html`, `matrix`, `matrixRef`, `constitution`, `transition` (4 steps), `misconceptions`, `debates` (title, body, plainHtml, subs[]), `confidence`, `sources`. Page template renders by type.
- **Editorial data** (each traced in `CONTENT_TRACE.md`): `data/eras.json` (groups, moods, sensitive chapters/sections, ruptures), `data/image-notes.json` (critical-reading flags), `data/audit-map.json` (claim → chapters), `data/dictionary-overrides.json` (per-chapter suppressions; currently empty), `data/template-exceptions.json` (2 known KB deviations; stale entries fail the build), `data/image-sizes.json` (measured).
- **Components** (`src/components/`): Figure, TimeRibbon, EraContext, ConstitutionStrip, RegimeMatrix, TransitionFlow, MythCards, Debates, ConfidenceTable, SourcesList, EvidenceRail, DictData, DictEntry, DictShell. Client JS: `src/scripts/site.ts` (toggles, cards, menu, images), `dictionary.ts` (tooltip/card), `dictionary-page.ts` (search/filters).
- **Styles**: one `src/styles/global.css` with tokens on `:root`, dark via `prefers-color-scheme` + `[data-theme]`; moods only change `--era-*`; dictionary pages use `src/styles/dictionary.css` (global, scoped under `.dict`).

## 4. Commands

Run from `site/` (Node ≥ 22.12):

```sh
npm install                  # after every pull that changes package.json (predev/prebuild check tells you)
npm run content              # parse + validate the KB only (fast; run after any KB or data change)
npm run dev | build | preview
npm run build:public         # dist-public/, © images as credit cards (needed by the behaviour check)
npm run build:pages          # dist-pages/, the version GitHub Pages publishes (all images hotlinked)
node scripts/rebase.mjs dist-pages /History && node qa/rebase-check.mjs dist-pages /History   # links below /History/
npm run qa                   # 11 checks; qa:final adds --final coverage and --external links
npm run dictionary:report    # regenerate DICTIONARY_ISSUES.md for the KB session
node qa/fidelity.mjs all     # every passage verbatim (fast; run after any rendering change)
node qa/screenshots.mjs serve /eras/<slug>/ …   # screenshots → qa/reports/screens
node qa/crops.mjs            # component crops of the Weimar page
node qa/image-urls.mjs [--write-sizes]          # all 72 hotlinks render in Chromium
```

## 5. Workflows

### 5.1 Start of every session (cheap)
1. `git fetch && git log HEAD..origin/master` — merge `origin/master` into the branch if needed (`git merge --no-edit origin/master`; branches diverge because PRs create merge commits).
2. `cd site && npm run content` — if it fails, the KB changed: read the error lines, not the files.
3. Read `../SITE_CHANGELOG_AND_TASKS.md` only if it changed (`git log -1 -- ../SITE_CHANGELOG_AND_TASKS.md`).
4. Environment (cloud): image hosts need the network allowlist (openaccess-cdn.clevelandart.org, images.metmuseum.org, www.dhm.de, www.hdg.de, tile.loc.gov). Check with one `curl -I`.

### 5.2 Adding a new page type (next steps)
1. Find what the KB file looks like with **`grep -n '^#'`** and a few `sed -n` lines — do not read whole files.
2. Parse it in `build-content.mjs` into a typed JSON block (reuse `renderMd`/`renderInline` with `ctxFor`-style context so xrefs, badges and dictionary marks work; set `noDict` for headings). Validate structure and fail loudly; add a zod schema if the shape is non-trivial.
3. Write the Astro page + components; take every text from JSON; log UI wording in `CONTENT_TRACE.md` (U-ids) and any classification (new data file + trace id).
4. Add the page to `BUILT_PAGES` in `scripts/lib/scope.mjs` so cross-references to it become links.
5. QA: `npm run content && npm run build`, `node qa/fidelity.mjs all` (extend it to the new page type if it renders KB text), `node qa/links.mjs`, axe via `npm run qa`, screenshots at 360 + 1280, light + dark. Extend `qa/coverage.mjs` so every KB item of the type must appear.
6. Stop for the owner's review after each new page type (the brief asks for vertical slices).

### 5.3 Intake of KB changes (SITE_CHANGELOG_AND_TASKS.md or new commits)
- Run `npm run content`; fix parser only where the KB rule changed. Keep `template-exceptions.json` honest (stale entries fail).
- If the dictionary changed: `npm run content` → `npm run dictionary:report` → report which items dropped, empty any redundant overrides (the report counts them), commit the regenerated `DICTIONARY_ISSUES.md`.
- KB problems found by the site go to `CONTENT_TRACE.md` §2 (K-ids) and, for the dictionary, `DICTIONARY_ISSUES.md`. Never fix them in the KB.

### 5.4 Review feedback from the owner
- Make a numbered task list mirroring the owner's points; fix; add a **regression test** (`qa/review-2909.mjs` is the pattern: one browser script with one check per point) and add it to `qa/run-all.mjs`.
- Points that are KB fixes: say so and leave them (they go on the KB hand-off list).
- Approved presentational changes to KB text (e.g. dropping a debate title's trailing colon) must also be taught to `qa/fidelity.mjs` → `presentational()`; otherwise fidelity fails.

### 5.5 Dictionary (inline highlighting)
- Matching happens at build time in `lib/markdown.mjs` → `renderText` using `lib/dictionary.mjs`: canonical name + `matchForms(e)` ("Also written as" minus compound forms like "Moscow-aligned" and minus lowercase derived words like "tolerated" unless `ambiguous_forms.md` maps them); case-sensitive, whole word, longest first; ambiguous forms only where `ambiguous_forms.md` names an entry for that chapter; never in headings, links, code, credits; people/places every mention, terms first per section.
- Review of highlights at scale: `src/content/generated/dictionary-matches.json` → group by chapter/form/entry with context → batches → Sonnet subagents flag clear misreadings → suppressions in `data/dictionary-overrides.json` → report to KB → KB fixes `ambiguous_forms.md` → overrides become redundant → delete them.
- Calm register: person/place colours neutral, no map pins.

### 5.6 Commit, push, merge
- `git add -A site && git commit` (message: what + why; include the attribution lines required by the session), `git push -u origin <branch>`.
- Merge only on the owner's word: `git fetch && git merge --no-edit origin/master` → rebuild + QA → `create_pull_request` → `merge_pull_request` with `expectedHeadSha` = **full 40-char** `git rev-parse HEAD`.
- Since publishing (§5.7) every merge to `master` redeploys the live site: after merging, check the run (`actions_list` → `list_workflow_runs`) and that the change is live.

### 5.7 Optional: publish (only when the owner asks)
Never publish on your own initiative. The owner asked on 29 Sept 2026. The steps below are the recipe; skip the ones already done (check `README.md`, `.github/workflows/pages.yml`).
1. **Release files at the repo root** (these were the owner's explicit exception to the `site/`-only rule):
   - `README.md`: overview, reading guide, how to run the site, image rights, "How this was made" (AI assistance disclosed);
   - `LICENSE.md`: KB texts under CC BY 4.0, linking to the legal code rather than copying it (nothing downloaded);
   - `site/LICENSE`: code under MIT; `"license": "MIT"` in `package.json`;
   - `NOTICE.md`: image holders, quotations, fonts (OFL), software licences (read them from `node_modules/*/package.json`).
2. **Pre-publication scan** (report, don't fix silently):
   - secrets: `git grep` for key/token patterns, `.env`, credentials (none found; the site needs none);
   - personal data: local paths (`WEBSITE_BUILD_PROMPT.md` has `/Users/amir/…`), emails;
   - third-party files: `sources/Steinacher_2023_…pdf` (the owner chose to keep it);
   - history: old commits stay visible once the repo is public, so say so. Only a fresh repository would hide them.
3. **Pages workflow** (`.github/workflows/pages.yml`): `npm ci` → `npm run build:pages` → `scripts/rebase.mjs dist-pages /<repo>` → `qa/rebase-check.mjs` → `upload-pages-artifact` → `deploy-pages`. A project site lives under `/<repo>/`, but every page links root-absolute (`/eras/…`): `rebase.mjs` rewrites HTML attributes, inline JSON `"href"`, CSS `url()` and sets `<html data-base>`; client scripts that build URLs must prefix `document.documentElement.dataset.base ?? ''` (see `dictionary-page.ts`). Any new client-side URL needs the same.
4. **Owner-only settings**: no tool here can change visibility or enable Pages. Ask the owner for:
   - Settings → General → Change visibility → Public (Pages on a free plan needs a public repo);
   - Settings → Pages → Source: **GitHub Actions**.

   Until then `deploy` fails with 404 "Ensure GitHub Pages has been enabled". Afterwards, re-run it with `actions_run_trigger` `rerun_failed_jobs`.
5. **Verify live**:
   - `curl` the key paths under `https://amir-sah.github.io/History/`;
   - a Playwright smoke test on the live URL: ribbon, dictionary search, card link, `/dictionary/#id` forwarding, no failed requests;
   - a scroll-through that lists each `figure.fig` as loaded or card.
6. **Images** (owner's decision, 29 Sept 2026): the published site shows all 72 images hotlinked, with the notice that all rights belong to the holders and any image is taken down on request via a GitHub issue (README, NOTICE, footer). To take one down, add its id to `data/takedowns.json` and merge: every build then shows a credit card. `build:public` remains the variant without © images.

## 6. QA suite (`npm run qa`, must stay green)

| Check | Script | Notes |
|---|---|---|
| Build fails loudly | `pipeline-negative.mjs` | copies KB to temp, breaks 6 rules, expects exit 1 |
| Coverage | `coverage.mjs` | per built chapter: sections, images (+ true proportions), myths, debates, confidence rows, sources, 5 things, flow, matrix, constitution |
| Links | `links.mjs [--external]` | internal + anchors; external via curl (env-blocked hosts and bot challenges reported separately) |
| Fidelity | `fidelity.mjs [N\|all]` | every passage ≥ 50 chars verbatim after `presentational()` changes (2,983/2,983) |
| Accessibility | `axe.mjs` | all pages × 360/1280 × light/dark, sections open, evidence on; dictionary letter pages sampled |
| Contrast | `contrast.mjs` | every text/background token pair × every mood × both themes |
| Behaviour | `behaviour.mjs` | keyboard, reduced motion, no-JS, persisted toggle, PUBLIC_BUILD |
| Dictionary | `dictionary.mjs` | no marks in headings/links/credits/code or directly in grid/flex; completeness; stale overrides; tooltip/card keyboard + touch; toggle; axe on open card |
| Review 29 Sept | `review-2909.mjs` | ribbon, card chips, coming soon, compounds, dictionary search/pages, forwarding |
| Rebase (publishing) | `rebase-check.mjs <dir> </base>` | after `rebase.mjs`: every root-absolute link is below the base and resolves; runs in the Pages workflow |
| Screenshots | `screenshots.mjs serve` | all pages, 360/1280, light/dark (scrolls first so lazy images load) |

Visual review pattern: screenshots → one Sonnet subagent reviews `*-1280-light-full` + `*-360-dark-top` against the Weimar reference and lists defects → verify flagged pages by hand with element crops.

## 7. Decisions taken with the owner (do not re-ask)

- Stack: Astro 7 static + vanilla TS + Pagefind; fonts Source Serif 4 + Inter (self-hosted); no blackletter anywhere.
- Moods: Vellum · Woodcut · Biedermeier · Archive (Weimar modern for `twentieth_century/02`) · Two inks · Civic paper; accents Callot grey (`early_modern/02`), Iron & soot (`nineteenth_century/07`).
- Calm register: `nineteenth_century/08`, `twentieth_century/03`–`08` whole; `twentieth_century/10` §2, §11; `twentieth_century/11` §2. No points/streaks, no playful motion, cards stacked, no map pins.
- Publishing (29–30 Sept 2026): the repo is **public** and the site is on GitHub Pages; every merge to `master` redeploys. The published build shows all images hotlinked with a rights and takedown notice (`data/takedowns.json`); `PUBLIC_BUILD=1` (`build:public`) stays available as the variant without © images. The PDF in `sources/` stays. Licences: KB CC BY 4.0, code MIT. Anything beyond this (new hosts, custom domain, history rewrite) needs the owner's go-ahead.
- Classifications by documented rules, each in a data file and `CONTENT_TRACE.md`; image types from the index's Type column.
- QA with Playwright + axe; in cloud use the pre-installed Chromium.
- Critical-reading flags: official art `kaiserproklamation`, `koeniggraetz`; posed photo `kolonialbeamter`; propaganda `hj-march`, `vb-enabling`. **Not** flagged (owner, 29 Sept): `white-rose`, `hakenkreuz`, `wir-bleiben`.
- "How do we know?" layer: off by default, remembered per reader. Sections 8, 11, 12 open by default. Hero image beside the summary on desktop, after the title on phones.
- Dictionary: people and places every mention, terms first per section; card "Also in" max 6 + "Show all (N)", non-chapter files excluded; "coming soon" for unbuilt chapters; dictionary as one page per letter.
- Owner prefers: short status updates, merge only on request, pull before merge, cheaper subagents for small/mechanical tasks.

## 8. Pitfalls met (and the fix)

| Symptom | Cause | Fix / rule |
|---|---|---|
| Pages silently missing / images all 4:3 | `src/` code read files via `import.meta.url` or `fs`; paths change in Astro's bundle | Pass data through `src/content/generated/*.json` (see `scope.json`, `image-layout.json`); never read the filesystem from `src/` |
| Text split into a column of fragments | `set:html` with inline links placed directly in a grid/flex `li` | Wrap in `<span set:html>`; `qa/dictionary.mjs` guards it |
| `href="undefined"` | resolver returned `{pending}` and code tested truthiness | test `r?.href` |
| Edit "applied" but nothing changed | `sed` pattern with regex/escape mismatch fails silently | Use Python `str.replace` with `assert old in s`, then `grep` to confirm |
| Big edit removed unrelated code | slicing between two markers spanned other sections | Slice narrowly; re-run `npm run content` immediately |
| Chromium: `ERR_CERT_AUTHORITY_INVALID` in cloud | proxy CA missing from Chromium's NSS store | `qa/lib/browser.mjs` pins the proxy CA by SPKI (only when `/root/.ccr` exists). Never disable TLS checks |
| Playwright wants to download a browser | version mismatch with `/opt/pw-browsers` | `executablePath: /opt/pw-browsers/chromium` (in `qa/lib/browser.mjs`) |
| Node `fetch` redirect loop on dhm.de | server self-redirect for Node's fetch | external checks use `curl` |
| Lazy images blank in full-page screenshots | never scrolled into view | `screenshots.mjs` scrolls first |
| axe/screenshot runs never finish on a 2,300-entry page | page too large | per-letter pages; axe samples large pages |
| Overlapping text beside narrow images | placeholder card behind `object-fit: contain` image | hide placeholder on `load` |
| Background QA exited 254 without log | log path / env of the background shell | write logs into the session scratchpad dir, `cd` explicitly |
| Tool calls refused "classifier gave no verdict" | transient harness failure | retry once later; do read-only work meanwhile; check `.git/logs/HEAD` with Grep to see if a commit happened |
| Subagent left a screenshot process running | subagents start long jobs | `ps aux | grep -E 'qa/|chrome'` after they finish; kill leftovers |
| Merge failed: sha must be 40 chars | short sha | `git rev-parse HEAD` |
| `git push`/PR creation: 503 "credential service temporarily unavailable" / "token store temporarily unavailable" | transient GitHub-credential outage | retry push with backoff; wait with `until` loops (a bare `sleep N; …` chain is blocked), then retry the MCP call |
| Live site: links 404 / styles missing | project Pages serves under `/<repo>/` | `rebase.mjs` in the workflow; new client-built URLs must use `data-base` |
| Pages `deploy` job: 404 "Ensure GitHub Pages has been enabled" | Pages off or repo private | owner enables Pages (Source: GitHub Actions) and makes the repo public, then re-run failed jobs |
| Full `qa/run-all.mjs` killed at 15 min | own `timeout 900` | run long checks (axe, behaviour, dictionary, review) separately in the background |

## 9. Token economy (how to do this cheaply)

1. **Use the generator, not hand work.** New chapters = one line in `scope.mjs`; KB text never needs to be read to be rendered. Query structure with `node -e "require('./src/content/generated/periods.json')…"` instead of reading Markdown.
2. **Read minimally.** Headings via `grep -n '^#'`, a section via `awk '/^## 12/,/^## 13/'`, counts via `grep -c`. Never `cat` KB files, `dictionary/*.md` (27k lines) or generated JSON. Don't re-read files after editing (the edit tool errors if it failed); verify with one `grep`.
3. **Let scripts judge.** Run QA and print only failures: `… | grep -E '✖|QA:'`. Fidelity/coverage/dictionary checks replace manual reading of pages.
4. **Background the slow things** (`run_in_background`: full QA ≈ 15 min, screenshots) and continue other work; don't poll with sleep — the notification arrives.
5. **Look at few images.** Prefer element crops (`crops.mjs`) and the top of a page; view full-page shots only when a layout is in question. Delegate bulk screenshot review to a Sonnet subagent with a precise defect list and "do not report" list.
6. **Subagents (Sonnet) for mechanical, isolated work** — each gets: exact input files, exact output file (one file it may edit), rules, a verification command, and a required final-report format. Worked well for: dictionary misreading review (4 parallel batches), audit-claim mapping, screenshot first pass, building a self-contained page. Keep for yourself: anything touching sensitive presentation, shared files (`global.css`, `build-content.mjs`), and decisions for the owner.
7. **Batch edits** in one Python script per task with asserts; build once; test once.
8. **Commit when a unit is done** (the stop hook forces it anyway) — avoids re-deriving state later.
9. **Answer the owner briefly**; tables for results; one line per open question.

## 10. Open items / next steps

1. Regime explorer (`05_REGIME_MATRIX.md` + 26 chapter matrices; compare 2–3; constitution-vs-reality on top).
2. Theme pages (14, free-form; `themes/*.md`), timeline (systems A–J tables; filters; theme tags by traced rule), gallery (72, filters by era + Type), open questions (§A–D), self-check (from 5 things + myths; no points; plain cards in calm chapters), mental-model page, sources/bibliography page, search UI (Pagefind), the two charts.
3. Final delivery per the brief: README (run/build), `CONTENT_TRACE.md`, limitations + v2 ideas; `npm run qa:final` (full coverage + external links) green.
4. KB hand-offs still open: `DICTIONARY_ISSUES.md` §5 (156 entries not found in their main chapter), K14 (two parenthesised matrix headings), K15 (audit confidence cells), sort people by surname, "Zwangslagen" wording.
