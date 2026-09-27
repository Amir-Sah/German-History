# German History, Explained — website

A static, source-critical website generated from the Markdown knowledge base in the parent folder. The knowledge base is the single source of truth; nothing in `site/` changes it.

**Status (27 Sept 2026): vertical slice.** The whole knowledge base is parsed and validated; one era chapter (the Weimar Republic) is built end to end so the pattern can be reviewed before the rollout. See `PLAN.md` for the plan and `CONTENT_TRACE.md` for every new word and every flagged inconsistency.

## Run it

Requires Node ≥ 22.12. From `site/`:

```sh
npm install            # once
npm run dev            # parse the KB, then serve at http://localhost:4321 with live reload
npm run build          # parse the KB → dist/ (+ Pagefind search index)
npm run preview        # serve dist/ at http://localhost:4321
npm run build:public   # PUBLIC_BUILD=1 → dist-public/: © images become credit-and-link cards
npm run qa             # all checks (see below); run after `npm run build`
```

The default build is a **local, personal-study site**: 54 of the 72 images are © and hotlinked "for personal study only". Use `build:public` for anything that other people will see, and do not deploy either build without deciding on image rights first.

## How it works

```
../*.md  ──►  scripts/build-content.mjs  ──►  src/content/generated/*.json  ──►  Astro pages (src/pages)
               (parse, validate, render)       periods, images, glossary,        static HTML + a little
                                               audit, bibliography, method,       vanilla TS (src/scripts)
                                               docs, report
```

- **Validation fails loudly.** The template rules are read from `01_RESEARCH_METHOD.md` §8 and enforced on every period file: 14 canonical section names, one `### Regime Matrix — …` (12-row table or `**Matrix:** see …`), one "What the constitution said vs how power actually worked:" paragraph, the four-step BEFORE → PRESSURES → TRANSITION → AFTER chain, the closed confidence vocabulary (§4), exactly five "things to remember", image blocks that match `images/IMAGE_INDEX.md`. Any deviation stops the build with `file:line`, unless it is listed with a reason in `data/template-exceptions.json` (stale exceptions also fail).
- **Editorial data** lives in `data/` (era groups and moods, sensitive chapters, glossary allow-list, image flags, audit mapping). Each file says where its rules come from; `CONTENT_TRACE.md` lists them.
- **Glossary glosses are quoted, not written:** the build checks each gloss against the KB text it cites.
- **Pages built so far** are listed in `scripts/lib/scope.mjs`. Cross-references to pages that do not exist yet render as plain file names.

## Quality checks (`npm run qa`)

| Check | Script | What it proves |
|---|---|---|
| Pipeline fails loudly | `qa/pipeline-negative.mjs` | Six kinds of template breakage each stop the build with a precise message |
| Coverage | `qa/coverage.mjs` | Every built chapter shows all its sections, images, misconceptions, debates, confidence rows, sources and 5 things; reports what of the KB is not yet on the site (`--final` makes that fail) |
| Links | `qa/links.mjs` | No broken internal link or missing anchor; `--external` also HEAD-checks hotlinked images and external links |
| Fidelity | `qa/fidelity.mjs [N\|all] [seed]` | Random (or all) passages of the Markdown appear verbatim on the page |
| Accessibility | `qa/axe.mjs` | axe-core WCAG 2.2 A/AA on every page, 360/1280 px, light/dark, all sections open |
| Contrast | `qa/contrast.mjs` | Every text/background token pair meets WCAG AA in each theme and mood (covers what axe cannot measure) |
| Behaviour | `qa/behaviour.mjs` | Keyboard use, reduced motion (static equivalents), no-JS reading, persisted toggle, `PUBLIC_BUILD` hides © images |
| Hotlinked images | `qa/image-urls.mjs [--write-sizes]` | All 72 index images render in Chromium (nothing saved); `--write-sizes` records their pixel sizes in `data/image-sizes.json` for exact `width`/`height` and true proportions |
| Screenshots | `qa/screenshots.mjs`, `qa/crops.mjs` | Pages and components at 360 and 1280 px, light and dark → `qa/reports/` |

`npm run qa:final` adds `--final` (full KB coverage required) and `--external` (external links via curl; hosts behind a bot challenge or blocked by the network are reported separately, not as broken).

QA uses Playwright with the Chromium found at `PW_CHROMIUM` or `/opt/pw-browsers/chromium` (cloud sessions); elsewhere run `npx playwright install chromium` once (≈150 MB download). In cloud sessions, `qa/lib/browser.mjs` makes Chromium trust the session proxy's CA (pinned by public-key hash; certificate checks stay on).

## Images offline

`npm run images:download` (`scripts/download-images.mjs`) caches the hotlinked images in `public/img-cache/` (git-ignored) for offline use; `-- --free` limits it to the 18 public-domain images. It downloads files from the holders, so it is never run automatically. The next build uses the local copies; credits and source links are unchanged.
