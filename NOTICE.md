# Third-party material and credits

This project uses the work of others. Their terms are listed here and are **not** replaced by this repository's licences ([`LICENSE.md`](LICENSE.md), [`site/LICENSE`](site/LICENSE)).

## Images

No image files are stored in this repository. The chapters and the website **link** to images held by the institutions below. [`images/IMAGE_INDEX.md`](images/IMAGE_INDEX.md) gives the creator, date, holder, licence and source page of every one of the 72 images.

| Holder | Terms | Images |
|---|---|---|
| Cleveland Museum of Art, Open Access | CC0 (public domain) | 18 in total are public domain, CC0 or have "no known restrictions" |
| The Metropolitan Museum of Art, Open Access | CC0 (public domain) | (counted in the 18 above) |
| Library of Congress, Prints & Photographs Division | No known restrictions | (counted in the 18 above) |
| Deutsches Historisches Museum, *LeMO* (many photographs © Bundesarchiv) | © rights holders | 54 in total are © |
| Stiftung Haus der Geschichte der Bundesrepublik Deutschland, *LeMO* | © HdG and other rights holders | (counted in the 54 above) |

**All rights to the images belong to their holders.** The © images are linked, not copied, for non-commercial education, with full credit. This project claims no rights in them. **Any image will be taken down on request:** rights holders can [open an issue](https://github.com/Amir-Sah/History/issues). To host a copy of the site without the © images, build it with `npm run build:public` in `site/`, which shows them only as credit-and-link cards.

## Quotations and sources

The knowledge base quotes and summarises historians, primary sources and institutional websites. Each is credited where it is used and in [`sources/bibliography.md`](sources/bibliography.md). Quoted passages remain the property of their authors and are reproduced under the right of quotation for criticism and study.

## Fonts (bundled into the built site)

| Font | Author | Licence |
|---|---|---|
| Source Serif 4 (via `@fontsource-variable/source-serif-4`) | Adobe (Frank Grießhammer) | SIL Open Font License 1.1 |
| Inter (via `@fontsource-variable/inter`) | Rasmus Andersson | SIL Open Font License 1.1 |

## Software

The website is built with open-source packages, installed by `npm install` and not stored in this repository.

| Package | Licence | Used for |
|---|---|---|
| Astro | MIT | static site generator |
| unified, remark-parse, remark-gfm, mdast-util-to-string | MIT | Markdown parsing |
| zod | MIT | content schema validation |
| Pagefind | MIT | search index |
| Playwright | Apache-2.0 | QA (development only) |
| axe-core / @axe-core/playwright | MPL-2.0 | accessibility checks (development only) |
| linkinator | MIT | link checks (development only) |

Each package's full licence ships inside its folder in `site/node_modules/`.
