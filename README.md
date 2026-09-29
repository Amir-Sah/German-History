# German History, Explained

**A source-critical knowledge base of German history, from the Roman frontier to 2026, and a static website generated from it.**

It is not a list of dates. Every chapter asks the same questions of its era: who held power, how the institutions really worked (not only what the constitution said), how ordinary people lived, why one system turned into the next, and where historians disagree. Confidence levels, source levels and open debates stay visible throughout.

| | |
|---|---|
| **Knowledge base** | 35 period chapters, 14 themes, a timeline, a regime matrix, a dictionary of about 2,300 people, places and terms, a 59-claim source audit and a bibliography, all in Markdown |
| **Website** | [`site/`](site/): an Astro static site that turns the Markdown into pages. It validates every file, fails the build on template breaks and never adds historical text of its own |
| **Status** | September 2026. The home page (the Journey), all 35 era chapters, the dictionary and the method and audit pages are built. Themes, timeline, gallery, regime explorer and search UI are next ([`site/PLAN.md`](site/PLAN.md)) |

**Website:** https://amir-sah.github.io/History/

## Read the knowledge base

You can read everything directly on GitHub:

| If you want… | Start with |
|---|---|
| The whole story in plain language (10 Parts) | [`00_FINAL_EXPLANATION.md`](00_FINAL_EXPLANATION.md) |
| An overview of the files and how to use them | [`00_README.md`](00_README.md) |
| How the research was done and how far to trust it | [`01_RESEARCH_METHOD.md`](01_RESEARCH_METHOD.md), [`sources/SOURCE_AUDIT.md`](sources/SOURCE_AUDIT.md) |
| Every regime compared on the same 12 questions | [`05_REGIME_MATRIX.md`](05_REGIME_MATRIX.md) |
| A chronological scaffold | [`02_MASTER_TIMELINE.md`](02_MASTER_TIMELINE.md) |
| The key causal relationships on one page | [`03_MENTAL_MODEL.md`](03_MENTAL_MODEL.md) |
| Open questions and live debates | [`04_QUESTIONS_WORTH_EXPLORING.md`](04_QUESTIONS_WORTH_EXPLORING.md) |
| One period in depth | [`ancient/`](ancient/) · [`medieval/`](medieval/) · [`early_modern/`](early_modern/) · [`nineteenth_century/`](nineteenth_century/) · [`twentieth_century/`](twentieth_century/) · [`contemporary/`](contemporary/) |
| Long-run themes | [`themes/`](themes/) |
| Names, places and terms | [`dictionary/`](dictionary/) |
| Every picture, with creator, holder and licence | [`images/IMAGE_INDEX.md`](images/IMAGE_INDEX.md) |

## Run the website

Requires **Node.js 22.12 or later**. No accounts, API keys or other credentials are needed.

```sh
git clone https://github.com/Amir-Sah/History.git
cd History/site
npm install
npm run dev            # parse the knowledge base, then serve at http://localhost:4321
```

Other commands, all run from `site/`:

```sh
npm run build          # static site in site/dist/ (with a Pagefind search index)
npm run build:pages    # the version published on GitHub Pages, in site/dist-pages/
npm run build:public   # a variant that shows every © image only as a credit-and-link card, in site/dist-public/
npm run qa             # checks for accessibility, fidelity, coverage and links (needs Playwright's Chromium)
```

[`site/README.md`](site/README.md) explains the pipeline, the checks and the design decisions. [`site/CONTENT_TRACE.md`](site/CONTENT_TRACE.md) lists every piece of wording the site adds and every inconsistency it found in the knowledge base.

## Images: copyright and takedown

**No image is stored in this repository or on the website.** Every picture is linked (hotlinked) from the museum, archive or library that holds it, and it is shown with its creator, date, holder, licence and a link to the holder's page. [`images/IMAGE_INDEX.md`](images/IMAGE_INDEX.md) lists all 72.

- **18 of 72** are public domain, CC0 or have "no known restrictions" (Cleveland Museum of Art, The Metropolitan Museum of Art, Library of Congress).
- **54 of 72** are **©**: Deutsches Historisches Museum, Stiftung Haus der Geschichte, Bundesarchiv, photographers' estates and other rights holders.

**All rights to the images belong to their respective holders.** This project claims no rights in them, and the licences of this repository ([`LICENSE.md`](LICENSE.md)) do not cover them. They are linked for non-commercial education, with full credit.

**Takedown:** if you hold the rights to an image and want it removed, [open an issue](https://github.com/Amir-Sah/History/issues) naming the image or page. It will be taken down on request, without question. Anyone who wants to host a copy of the site without the © images can build it with `npm run build:public`, which replaces them with credit-and-link cards.

## How this was made

The knowledge base was researched and written with the help of an AI assistant (Claude, by Anthropic), which also built the website. The work followed the method in [`01_RESEARCH_METHOD.md`](01_RESEARCH_METHOD.md):
- a hierarchy of source levels, from primary sources (A) to video leads (F);
- a closed vocabulary of confidence levels;
- an audit of 59 key claims against their sources ([`sources/SOURCE_AUDIT.md`](sources/SOURCE_AUDIT.md)).

Some paywalled works were read only through reviews and summaries, and the files say so where this applies. Present-day facts are current to late September 2026.

Please treat the knowledge base as a well-sourced study guide, not as a peer-reviewed publication. Check the linked sources before citing a claim. [Open an issue](../../issues) if you find a mistake.

## License

| What | License |
|---|---|
| The knowledge base: all Markdown outside `site/`, except quotations and third-party material | [CC BY 4.0](LICENSE.md) |
| The website code in `site/` (scripts, templates, styles, QA) | [MIT](site/LICENSE) |
| Images, quoted passages, fonts and libraries | Their own licences: see [`NOTICE.md`](NOTICE.md) |

To reuse the text under CC BY 4.0, credit it as: *"German History, Explained" by Amir Sahebozamani, CC BY 4.0, https://github.com/Amir-Sah/History*.
