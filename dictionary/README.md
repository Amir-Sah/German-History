# Dictionary

This directory contains the reference dictionary for the German history knowledge base: 2,300 entries covering people, places, and historical terms mentioned across the 35 period chapters and 14 theme files.

## Purpose

The dictionary serves two functions: it provides short definitions for names and terms in the text (via hover on the website), and it allows the site to visually distinguish people, places, and terms from the surrounding narrative. Entries are extracted from the knowledge base text and cross-checked against well-established reference sources.

## How to read an entry

Each entry contains some or all of the following fields:

- **Kind:** person, place, or term
- **Dates:** birth–death for people (year or range); establishment–dissolution for institutions; or dates a place/term was relevant
- **Also written as:** alternative names or spellings in English
- **Ambiguous forms:** different people or concepts that share a name (e.g., multiple Friedrichs), with notation of which form is resolved and which remain unresolved
- **Short:** a brief definition (≤18 words), for hover display
- **Explanation:** a longer definition (≤60 words), for the dictionary card or chapter link
- **German:** German name or term (when different from English)
- **Main chapter:** the primary chapter where this entry is discussed
- **Also in:** other chapters mentioning the entry
- **Basis:** source of the definition — either "KB" (extracted from knowledge base text) or "KB+K" (knowledge base plus well-established general knowledge, such as birth/death dates from standard reference works)
- **Note:** any caveats, e.g., dates that could not be confirmed or contested claims

## Basis: KB+K

Entries marked "Basis: KB+K" combine knowledge base content with well-established general knowledge. For example, a person's birth year may come from a standard biography reference, while their role description comes from the KB text. This distinction helps readers understand what is sourced in the KB itself versus what is background context from reliable references.

## Ambiguous forms

When multiple people or concepts share a name, the dictionary marks which forms are "resolved" (clearly distinguished) and which remain "unresolved" (not highlighted in the text, because no clear distinction can be made). Unresolved forms are safe: they simply mean the text reference is not highlighted; they do not indicate an error.

## Counts

- **437 people** in `people.md`
- **280 places** in `places.md`
- **1,583 terms** in `terms.md`
- **1,135 ambiguous rows** in `ambiguous_forms.md` (338 resolved, 797 unresolved)
- **Total: 2,300 entries**

## How it was made

The dictionary was built in five stages:

1. **Extraction by chapter group:** Nine groups of files (periods and themes) were processed to extract all named entities and defined terms.
2. **Merge and de-duplication:** Raw extractions were merged, deduplicated (e.g., splitting Diet of Worms 1495 from 1521), and consolidated into a single inventory.
3. **Fact-checking:** All entries were reviewed for accuracy. Dates, offices, roles, and locations were verified; definitions were checked for clarity and brevity. Nine corrections were applied.
4. **Generation:** The merged and fact-checked inventory was converted to this Markdown format.
5. **Ambiguous-forms resolution:** Entries sharing a name were catalogued; where distinction was possible, forms were marked resolved.

## Known limits

The dictionary is not audited claim by claim in the way `sources/SOURCE_AUDIT.md` audits the knowledge base. Some recent entries (e.g., September 2026 election figures) come from the knowledge base text and are not independently verified. The dictionary is accurate for names, dates, and roles, but readers consulting it for contested historical claims should check the chapter source notes and the main audit.
