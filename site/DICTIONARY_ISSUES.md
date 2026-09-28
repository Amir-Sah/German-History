# Dictionary issues found by the website build

*Generated 2026-09-28 by `site/qa/dictionary-report.mjs` from `dictionary/*.md`, using the same parser and matcher as the website. For the session that maintains the knowledge base. Re-run the script after fixing; resolved items disappear from this file.*

**How the website uses the dictionary** (so the fixes below make sense): every canonical name and "Also written as" form is matched in the chapter text — case-sensitive, whole word, longest match first. A form that appears in `ambiguous_forms.md`, or that belongs to more than one entry, is highlighted only in chapters where the table names an entry; `—` or a missing row means plain text.

## Summary

| # | Problem | Count | Where to fix |
|---|---|---|---|
| 1 | Word highlighted as the wrong entry (misreading) | 72 | `ambiguous_forms.md` (add rows) |
| 2 | `ambiguous_forms.md` rows that point at non-chapter files (`site/…`, task files) | 84 | `ambiguous_forms.md` (delete rows) |
| 3 | "Also in" chapters supported only by a misreading | 54 | entry's **Also in** |
| 4 | Forms shared by several entries but missing from `ambiguous_forms.md` (never highlighted) | 0 | `ambiguous_forms.md` (add rows) |
| 5 | Entries never found in their own main chapter | 177 | entry's **Also written as** or **Main chapter** |
| 6 | **Short** longer than 18 words / **Explanation** longer than 60 words | 0 / 0 | entry text |
| 7 | Structural errors (malformed entries, bad links) | 0 | as listed |
| 8 | README counts differ from the files | 0 | `dictionary/README.md` |

The website currently works around 1 (the 72 pairs are shown as plain text, see `site/data/dictionary-overrides.json`) and ignores 2. Once 1 is fixed in `ambiguous_forms.md`, those workarounds can be deleted.

## 1. Misreadings — add a row to `ambiguous_forms.md` for each

Each row below is a word in a chapter that the dictionary links to the wrong entry. Found by reviewing all 4,351 chapter/form/entry matches with their context (two by hand, 70 by a model review, 28 Sept 2026) — please check each before applying. **Fix:** add the row `| <form> | `<chapter>` | — |` to `ambiguous_forms.md`, or instead of `—` link the correct entry if the dictionary has one (e.g. a separate "reparations (after 1945)" entry). Where the form is a common English word used in many chapters, consider whether it should be a form of that entry at all.

| Chapter | Form | Currently resolves to | Why it is wrong | Line |
|---|---|---|---|---|
| `ancient/01_germanic_societies.md` | allies | Allies (`terms.md#allies-first-world-war`) | Roman allies in the 5th century, not the First World War Allies. | 84 |
| `ancient/01_germanic_societies.md` | coalitions | Coalition (`terms.md#coalition`) | Tribal coalitions, not workers' right to combine into unions. | 24 |
| `ancient/01_germanic_societies.md` | Dutch | Dutch Republic (`places.md#dutch-republic`) | Refers to the modern Dutch people/language as descendants of Germanic speakers, not the 1581-1795 Republic. | 100 |
| `ancient/01_germanic_societies.md` | the West | The West (`terms.md#the-west`) | Means the Western Roman Empire, not modern liberal democracies. | 76 |
| `ancient/02_roman_frontier.md` | Gradual | Gradual (`terms.md#gradual`) | 'Gradual transformation' is an ordinary adjective, not a chant book. | 85 |
| `ancient/02_roman_frontier.md` | Land | Länder (`terms.md#lander`) | 'Land and poll taxes' is ordinary land tax, not German federal states. | 24 |
| `ancient/02_roman_frontier.md` | the West | The West (`terms.md#the-west`) | Means the Western Roman Empire, not modern liberal democracies. | 11 |
| `contemporary/01_post_reunification.md` | coalition | Coalition (`terms.md#coalition`) | Political/government coalition, not the workers' right to combine. | 82 |
| `contemporary/01_post_reunification.md` | count | count (`terms.md#count`) | Ordinary noun ('corrected count' of arrivals), not the noble title. | 33 |
| `contemporary/01_post_reunification.md` | electorate | elector (`terms.md#elector`) | Modern voters, not a Holy Roman prince-elector. | 19 |
| `contemporary/01_post_reunification.md` | rearmament | rearmament (`terms.md#rearmament`) | Refers to post-war/2022 rearmament, not 1930s Versailles-era rebuilding. | 19 |
| `contemporary/02_modern_political_system.md` | coalition | Coalition (`terms.md#coalition`) | Political/government coalition, not the workers' right to combine. | 15 |
| `contemporary/02_modern_political_system.md` | coalitions | Coalition (`terms.md#coalition`) | Political/government coalition, not the workers' right to combine. | 15 |
| `contemporary/02_modern_political_system.md` | contributions | contributions (`terms.md#contributions`) | Social-insurance/EU budget payments, not Thirty Years' War levies. | 28 |
| `contemporary/02_modern_political_system.md` | questionnaire | Fragebogen (`terms.md#fragebogen`) | 2025 military-service questionnaire, not the denazification form. | 67 |
| `contemporary/02_modern_political_system.md` | reaction | Reaction (`terms.md#reaction`) | Ordinary word 'hostile reaction', not the 1850s era. | 107 |
| `contemporary/03_modern_society.md` | brigades | workplace brigades (`terms.md#workplace-brigades`) | 'Volunteer fire brigades' in modern Germany, not GDR work teams. | 26 |
| `contemporary/03_modern_society.md` | counts | count (`terms.md#count`) | Verb 'who counts as German', not the noble title. | 33 |
| `contemporary/03_modern_society.md` | resettlers | Umsiedler (`terms.md#umsiedler`) | Post-Soviet German resettlers (Spätaussiedler), not the East German term for expellees. | 37 |
| `contemporary/04_germany_in_europe.md` | coalitions | Coalition (`terms.md#coalition`) | Political/government coalition, not the workers' right to combine. | 45 |
| `contemporary/04_germany_in_europe.md` | contributions | contributions (`terms.md#contributions`) | Social-insurance/EU budget payments, not Thirty Years' War levies. | 47 |
| `contemporary/04_germany_in_europe.md` | rearmament | rearmament (`terms.md#rearmament`) | Refers to post-war/2022 rearmament, not 1930s Versailles-era rebuilding. | 31 |
| `early_modern/02_thirty_years_war.md` | toleration | toleration (`terms.md#toleration`) | Religious toleration arguments, not the SPD's 1930-32 toleration of Brüning. | 60 |
| `early_modern/04_prussia_and_austria.md` | accession | accession (`terms.md#accession`) | Maria Theresa's 1740 accession to the throne, not the 1990 GDR accession. | 44 |
| `early_modern/04_prussia_and_austria.md` | confirmation | confirmation (`terms.md#confirmation`) | Confirmation of nobles' rights, not the Christian rite. | 17 |
| `early_modern/04_prussia_and_austria.md` | toleration | toleration (`terms.md#toleration`) | Religious toleration under Frederick II, not the SPD's 1930-32 policy. | 20 |
| `early_modern/05_enlightenment.md` | Israel | Israel (`places.md#israel`) | Part of the author name Jonathan Israel, not the state of Israel. | 117 |
| `early_modern/05_enlightenment.md` | reaction | Reaction (`terms.md#reaction`) | Late 18th-century reaction against rationalism, not the 1850s Reaction. | 15 |
| `early_modern/05_enlightenment.md` | toleration | toleration (`terms.md#toleration`) | Enlightenment religious toleration, not the SPD's 1930-32 policy. | 15 |
| `medieval/04_cities_church_feudalism.md` | Citizenship | citizenship law (`terms.md#citizenship-law`) | Medieval urban citizenship, not modern German citizenship law (1913-). | 42 |
| `medieval/04_cities_church_feudalism.md` | Empire | Holy Roman Empire (`places.md#holy-roman-empire`) | 'Trade Empire' in the Hanseatic League article title, not the Holy Roman Empire. | 9 |
| `nineteenth_century/01_napoleon.md` | toleration | toleration (`terms.md#toleration`) | Means religious toleration in 1800s Germany, not the SPD's 1930-32 toleration of Bruning. | 109 |
| `nineteenth_century/02_german_confederation.md` | contributions | contributions (`terms.md#contributions`) | Member contributions to the Confederation, not Thirty Years' War extortion payments. | 28 |
| `nineteenth_century/02_german_confederation.md` | Main | Main River (`places.md#main-river`) | 'Main currents' uses the ordinary adjective, not the river. | 29 |
| `nineteenth_century/04_1848_revolutions.md` | Main | Main River (`places.md#main-river`) | 'Main causes of defeat' uses the ordinary adjective, not the river. | 29 |
| `nineteenth_century/05_unification.md` | allies | Allies (`terms.md#allies-first-world-war`) | Prussia's German allies in 1866, not the WWI Allies. | 15 |
| `nineteenth_century/05_unification.md` | the Empire | Holy Roman Empire (`places.md#holy-roman-empire`) | Refers to the Bismarckian German Empire (post-1871), not the Holy Roman Empire. | 140 |
| `nineteenth_century/06_german_empire.md` | electorate | elector (`terms.md#elector`) | 'Electorate' means the body of voters, not the prince-elector of the Holy Roman Empire. | 98 |
| `nineteenth_century/06_german_empire.md` | Federal Council | Bundesrat (`terms.md#bundesrat-federal-republic`) | Matched to the post-1949 Bundesrat, but context is the Empire's Bundesrat of 1871-1918. | 15 |
| `nineteenth_century/06_german_empire.md` | the Empire | Holy Roman Empire (`places.md#holy-roman-empire`) | Refers to the Kaiserreich (colonies, battle fleet, Nipperdey), not the Holy Roman Empire. | 15 |
| `nineteenth_century/07_industrial_society.md` | contributions | contributions (`terms.md#contributions`) | Health insurance contributions by workers/employers, not Thirty Years' War contributions. | 21 |
| `nineteenth_century/07_industrial_society.md` | counts | count (`terms.md#count`) | 'In some counts' means 'by some counts' (estimates), not the noble title. | 56 |
| `nineteenth_century/07_industrial_society.md` | the Empire | Holy Roman Empire (`places.md#holy-roman-empire`) | Refers to the German Empire of 1871-1918, not the Holy Roman Empire. | 5 |
| `nineteenth_century/08_colonialism.md` | concentration camps | concentration camps (`terms.md#concentration-camps`) | Refers to camps in German South West Africa (1904-08), not Nazi camps of 1933-45. | 28 |
| `nineteenth_century/08_colonialism.md` | councils | Councils (`terms.md#councils`) | Limited settler councils in the colonies, not the 1918-19 workers' and soldiers' councils. | 26 |
| `nineteenth_century/08_colonialism.md` | forced labour | Forced labour (`terms.md#forced-labour`) | Colonial forced labour in Africa, not the WWII foreign forced labour in Germany. | 5 |
| `twentieth_century/01_world_war_one.md` | coalitions | Coalition (`terms.md#coalition`) | Means government coalitions of parties, not workers' right to combine. | 34 |
| `twentieth_century/01_world_war_one.md` | revisionism | Revisionism (`terms.md#revisionism`) | Refers to the Fischer thesis historiography, not Bernstein's socialist revisionism. | 139 |
| `twentieth_century/01_world_war_one.md` | Soviet Russia | Russia (`places.md#russia`) | Refers to Soviet Russia in 1918, not the post-Soviet state. | 63 |
| `twentieth_century/02_weimar_republic.md` | 20 July | 20 July plot (`terms.md#20-july-plot`) | part of the date of the Prussian coup (20 July 1932), not the 20 July plot (1944) | 43 |
| `twentieth_century/02_weimar_republic.md` | coalitions | Coalition (`terms.md#coalition`) | Means government coalitions of parties, not workers' right to combine. | 28 |
| `twentieth_century/02_weimar_republic.md` | Meissner | Christopher M. Meissner (`people.md#christopher-m-meissner`) | the regime matrix means State Secretary (Otto) Meissner; the dictionary resolves it to the economist Christopher M. Meissner | 28 |
| `twentieth_century/02_weimar_republic.md` | state within the state | State within the state (`terms.md#state-within-the-state`) | Describes the Reichswehr, not the SPD counter-society. | 31 |
| `twentieth_century/02_weimar_republic.md` | subsidies | subsidies (`terms.md#subsidies`) | Osthilfe subsidies to estates, not payments between states for troops. | 49 |
| `twentieth_century/04_nazi_state.md` | 20 July | 20 July plot (`terms.md#20-july-plot`) | Part of '20 July 1933' (Reich Concordat), not the 1944 plot. | 35 |
| `twentieth_century/04_nazi_state.md` | mass organisations | mass organisations (`terms.md#mass-organisations`) | Nazi mass organisations, not GDR ones. | 47 |
| `twentieth_century/04_nazi_state.md` | state within the state | State within the state (`terms.md#state-within-the-state`) | Describes Himmler's SS, not the SPD counter-society. | 64 |
| `twentieth_century/05_everyday_life_under_nazism.md` | mass organisations | mass organisations (`terms.md#mass-organisations`) | Nazi mass organisations, not GDR ones. | 15 |
| `twentieth_century/06_holocaust_and_persecution.md` | allies | Allies (`terms.md#allies-first-world-war`) | Nazi Germany's Axis allies, not the WWI Allies. | 30 |
| `twentieth_century/06_holocaust_and_persecution.md` | auxiliaries | auxiliaries (`terms.md#auxiliaries`) | Local auxiliary police in WWII, not Roman auxiliaries. | 32 |
| `twentieth_century/06_holocaust_and_persecution.md` | brigades | workplace brigades (`terms.md#workplace-brigades`) | 'SS brigades' are military units, not GDR workplace teams. | 22 |
| `twentieth_century/07_world_war_two.md` | auxiliaries | auxiliaries (`terms.md#auxiliaries`) | Wehrmacht auxiliaries in WWII, not Roman auxiliaries. | 42 |
| `twentieth_century/08_occupation_and_denazification.md` | reparations | reparations (`terms.md#reparations`) | Post-1945 reparations, not the 1919-32 WWI reparations. | 36 |
| `twentieth_century/08_occupation_and_denazification.md` | Reparations | reparations (`terms.md#reparations`) | Post-1945 reparations, not the 1919-32 WWI reparations. | 73 |
| `twentieth_century/09_west_germany.md` | coalition | Coalition (`terms.md#coalition`) | Means coalition parties in government, not workers' right to combine. | 32 |
| `twentieth_century/09_west_germany.md` | contributions | contributions (`terms.md#contributions`) | Social insurance contributions, not Thirty Years' War levies. | 36 |
| `twentieth_century/09_west_germany.md` | reaction | Reaction (`terms.md#reaction`) | Ordinary word ('a reaction to Bolshevik crimes'), not the 1850s Reaction. | 91 |
| `twentieth_century/10_east_germany.md` | reparations | reparations (`terms.md#reparations`) | Soviet reparations after 1945, not WWI reparations 1919-32. | 67 |
| `twentieth_century/10_east_germany.md` | right to emigrate | ius emigrandi (`terms.md#ius-emigrandi`) | Modern human-rights context, not the 1555 Peace of Augsburg right. | 41 |
| `twentieth_century/12_reunification.md` | dismantling | dismantling (`terms.md#dismantling`) | Dismantling of the Hungarian border fence, not Soviet removal of factories. | 28 |
| `twentieth_century/12_reunification.md` | electorate | elector (`terms.md#elector`) | Modern voters, not a Holy Roman prince-elector. | 71 |
| `twentieth_century/12_reunification.md` | grand coalition | grand coalition (`terms.md#grand-coalition`) | 1990 GDR coalition government, not the 1928-30 Weimar grand coalition. | 44 |

## 2. Rows that point at non-chapter files — delete

`ambiguous_forms.md` has 84 rows whose "Chapter" is not a KB chapter: files inside `site/` (the website, its `node_modules`, PLAN/README/CONTENT_TRACE) and the task file `SITE_CHANGELOG_AND_TASKS.md`. The dictionary builder scanned those folders too. **Fix:** delete these lines (line numbers as of generation):

- `SITE_CHANGELOG_AND_TASKS.md`: lines 181 (Chancellor), 308 (Depression), 319 (Diet), 662 (Main), 867 (Reichstag), 909 (Saxony), 1031 (Weimar)
- `site/node_modules/chalk/readme.md`: lines 218 (combination)
- `site/node_modules/commander/Readme.md`: lines 219 (combination), 487 (exit)
- `site/node_modules/diff/README.md`: lines 220 (combination)
- `site/node_modules/mdast-util-from-markdown/readme.md`: lines 221 (combination), 489 (exit), 641 (List)
- `site/node_modules/meow/build/licenses.md`: lines 222 (combination)
- `site/node_modules/prismjs/CHANGELOG.md`: lines 223 (combination)
- `site/node_modules/regex/README.md`: lines 224 (combination)
- `site/node_modules/undici/docs/docs/api/MockCallHistory.md`: lines 225 (combination)
- `site/node_modules/vite/LICENSE.md`: lines 226 (combination), 946 (Stein), 1138 (Wilson)
- `site/CONTENT_TRACE.md`: lines 434 (Empire), 877 (Reichstag), 1039 (Weimar)
- `site/PLAN.md`: lines 435 (Empire), 459 (estates), 483 (exit), 516 (Franz), 565 (Friedrich), 623 (Left), 721 (Nazi), 892 (Romantic), 974 (tolerated), 1018 (Wall), 1040 (Weimar), 1074 (West), 1137 (Wilson)
- `site/node_modules/@clack/core/README.md`: lines 484 (exit)
- `site/node_modules/@clack/prompts/README.md`: lines 485 (exit)
- `site/node_modules/argparse/README.md`: lines 486 (exit)
- `site/node_modules/js-yaml/README.md`: lines 488 (exit)
- `site/node_modules/mdast-util-to-markdown/readme.md`: lines 490 (exit), 642 (List)
- `site/node_modules/meow/readme.md`: lines 491 (exit), 643 (List)
- `site/node_modules/micromark-factory-space/readme.md`: lines 492 (exit)
- `site/node_modules/micromark-util-chunked/readme.md`: lines 493 (exit)
- `site/node_modules/micromark-util-classify-character/readme.md`: lines 494 (exit)
- `site/node_modules/p-queue/readme.md`: lines 495 (exit)
- `site/node_modules/tinyexec/README.md`: lines 496 (exit)
- `site/node_modules/unist-util-visit-parents/readme.md`: lines 497 (exit), 652 (List)
- `site/node_modules/unist-util-visit/readme.md`: lines 498 (exit), 653 (List)
- `site/node_modules/axe-core/README.md`: lines 550 (French), 635 (List)
- `site/node_modules/mdast-util-to-hast/readme.md`: lines 551 (French)
- `site/node_modules/vite/README.md`: lines 552 (French)
- `site/node_modules/@babel/parser/CHANGELOG.md`: lines 613 (Jordan)
- `site/node_modules/extend/README.md`: lines 614 (Jordan)
- `site/node_modules/micromark-extension-gfm-table/readme.md`: lines 624 (Left)
- `site/node_modules/character-entities-legacy/readme.md`: lines 636 (List)
- `site/node_modules/css-tree/README.md`: lines 637 (List)
- `site/node_modules/html-void-elements/readme.md`: lines 638 (List)
- `site/node_modules/linkinator/README.md`: lines 639 (List)
- `site/node_modules/marked-gfm-heading-id/README.md`: lines 640 (List)
- `site/node_modules/micromark-util-html-tag-name/readme.md`: lines 644 (List)
- `site/node_modules/playwright-core/lib/tools/skills/playwright-cli/references/request-mocking.md`: lines 645 (List)
- `site/node_modules/playwright-core/lib/tools/skills/playwright-cli/references/session-management.md`: lines 646 (List)
- `site/node_modules/playwright-core/lib/tools/skills/playwright-cli/references/storage-state.md`: lines 647 (List)
- `site/node_modules/playwright-core/lib/tools/skills/playwright-trace/SKILL.md`: lines 648 (List)
- `site/node_modules/undici/docs/docs/api/Interceptors.md`: lines 649 (List)
- `site/node_modules/undici/docs/docs/api/MockAgent.md`: lines 650 (List)
- `site/node_modules/unified/readme.md`: lines 651 (List)
- `site/node_modules/vfile/readme.md`: lines 654 (List)
- `site/node_modules/anymatch/node_modules/picomatch/README.md`: lines 666 (Main)
- `site/node_modules/minimatch/README.md`: lines 667 (Main), 674 (Max)
- `site/node_modules/picomatch/README.md`: lines 668 (Main)
- `site/node_modules/cookie/README.md`: lines 673 (Max)
- `site/node_modules/verkit/README.md`: lines 675 (Max)
- `site/CLAUDE.md`: lines 720 (Nazi)
- `site/node_modules/devalue/README.md`: lines 933 (Schmidt)
- `site/README.md`: lines 1041 (Weimar)

## 3. "Also in" chapters supported only by a misreading

The entry lists the chapter under **Also in**, but the only occurrence there is the misread word from §1 — the chapter does not actually mention this entry. **Fix:** remove the chapter from the entry's **Also in** line.

| Entry | Remove from "Also in" | Misread form |
|---|---|---|
| Allies (`terms.md#allies-first-world-war`) | `ancient/01_germanic_societies.md` | allies |
| Coalition (`terms.md#coalition`) | `ancient/01_germanic_societies.md` | coalitions |
| Dutch Republic (`places.md#dutch-republic`) | `ancient/01_germanic_societies.md` | Dutch |
| The West (`terms.md#the-west`) | `ancient/01_germanic_societies.md` | the West |
| Gradual (`terms.md#gradual`) | `ancient/02_roman_frontier.md` | Gradual |
| The West (`terms.md#the-west`) | `ancient/02_roman_frontier.md` | the West |
| Coalition (`terms.md#coalition`) | `contemporary/01_post_reunification.md` | coalition |
| count (`terms.md#count`) | `contemporary/01_post_reunification.md` | count |
| elector (`terms.md#elector`) | `contemporary/01_post_reunification.md` | electorate |
| rearmament (`terms.md#rearmament`) | `contemporary/01_post_reunification.md` | rearmament |
| contributions (`terms.md#contributions`) | `contemporary/02_modern_political_system.md` | contributions |
| Fragebogen (`terms.md#fragebogen`) | `contemporary/02_modern_political_system.md` | questionnaire |
| workplace brigades (`terms.md#workplace-brigades`) | `contemporary/03_modern_society.md` | brigades |
| count (`terms.md#count`) | `contemporary/03_modern_society.md` | counts |
| Umsiedler (`terms.md#umsiedler`) | `contemporary/03_modern_society.md` | resettlers |
| Coalition (`terms.md#coalition`) | `contemporary/04_germany_in_europe.md` | coalitions |
| contributions (`terms.md#contributions`) | `contemporary/04_germany_in_europe.md` | contributions |
| rearmament (`terms.md#rearmament`) | `contemporary/04_germany_in_europe.md` | rearmament |
| toleration (`terms.md#toleration`) | `early_modern/02_thirty_years_war.md` | toleration |
| accession (`terms.md#accession`) | `early_modern/04_prussia_and_austria.md` | accession |
| confirmation (`terms.md#confirmation`) | `early_modern/04_prussia_and_austria.md` | confirmation |
| toleration (`terms.md#toleration`) | `early_modern/04_prussia_and_austria.md` | toleration |
| Israel (`places.md#israel`) | `early_modern/05_enlightenment.md` | Israel |
| Reaction (`terms.md#reaction`) | `early_modern/05_enlightenment.md` | reaction |
| toleration (`terms.md#toleration`) | `early_modern/05_enlightenment.md` | toleration |
| citizenship law (`terms.md#citizenship-law`) | `medieval/04_cities_church_feudalism.md` | Citizenship |
| toleration (`terms.md#toleration`) | `nineteenth_century/01_napoleon.md` | toleration |
| contributions (`terms.md#contributions`) | `nineteenth_century/02_german_confederation.md` | contributions |
| Allies (`terms.md#allies-first-world-war`) | `nineteenth_century/05_unification.md` | allies |
| elector (`terms.md#elector`) | `nineteenth_century/06_german_empire.md` | electorate |
| Bundesrat (`terms.md#bundesrat-federal-republic`) | `nineteenth_century/06_german_empire.md` | Federal Council |
| contributions (`terms.md#contributions`) | `nineteenth_century/07_industrial_society.md` | contributions |
| count (`terms.md#count`) | `nineteenth_century/07_industrial_society.md` | counts |
| Forced labour (`terms.md#forced-labour`) | `nineteenth_century/08_colonialism.md` | forced labour |
| Coalition (`terms.md#coalition`) | `twentieth_century/01_world_war_one.md` | coalitions |
| Revisionism (`terms.md#revisionism`) | `twentieth_century/01_world_war_one.md` | revisionism |
| 20 July plot (`terms.md#20-july-plot`) | `twentieth_century/02_weimar_republic.md` | 20 July |
| State within the state (`terms.md#state-within-the-state`) | `twentieth_century/02_weimar_republic.md` | state within the state |
| subsidies (`terms.md#subsidies`) | `twentieth_century/02_weimar_republic.md` | subsidies |
| 20 July plot (`terms.md#20-july-plot`) | `twentieth_century/04_nazi_state.md` | 20 July |
| mass organisations (`terms.md#mass-organisations`) | `twentieth_century/04_nazi_state.md` | mass organisations |
| State within the state (`terms.md#state-within-the-state`) | `twentieth_century/04_nazi_state.md` | state within the state |
| mass organisations (`terms.md#mass-organisations`) | `twentieth_century/05_everyday_life_under_nazism.md` | mass organisations |
| Allies (`terms.md#allies-first-world-war`) | `twentieth_century/06_holocaust_and_persecution.md` | allies |
| auxiliaries (`terms.md#auxiliaries`) | `twentieth_century/06_holocaust_and_persecution.md` | auxiliaries |
| workplace brigades (`terms.md#workplace-brigades`) | `twentieth_century/06_holocaust_and_persecution.md` | brigades |
| auxiliaries (`terms.md#auxiliaries`) | `twentieth_century/07_world_war_two.md` | auxiliaries |
| Coalition (`terms.md#coalition`) | `twentieth_century/09_west_germany.md` | coalition |
| contributions (`terms.md#contributions`) | `twentieth_century/09_west_germany.md` | contributions |
| Reaction (`terms.md#reaction`) | `twentieth_century/09_west_germany.md` | reaction |
| reparations (`terms.md#reparations`) | `twentieth_century/10_east_germany.md` | reparations |
| ius emigrandi (`terms.md#ius-emigrandi`) | `twentieth_century/10_east_germany.md` | right to emigrate |
| dismantling (`terms.md#dismantling`) | `twentieth_century/12_reunification.md` | dismantling |
| elector (`terms.md#elector`) | `twentieth_century/12_reunification.md` | electorate |

## 4. Forms shared by several entries but missing from `ambiguous_forms.md`

These surface forms belong to more than one entry and have no row in `ambiguous_forms.md`, so the website never highlights them (it cannot know which entry is meant). **Fix:** add a row per chapter naming the right entry (or `—`), or remove the form from the entries where it is not a real alternative name.

| Form | Claimed by | Occurs in chapters |
|---|---|---|

## 5. Entries never found in their own main chapter

The website finds no highlight for these entries in the chapter named as **Main chapter**. Two causes: (a) the chapter uses a spelling that is not listed under **Also written as** — add it; (b) the name occurs but only as an ambiguous form that has no row for this chapter — add the row to `ambiguous_forms.md`. If the entry is really not discussed in that chapter, correct **Main chapter**.

### 5a. No listed form occurs in the main chapter (150)

The last column shows where a listed form **does** occur — usually the right main chapter. "none" means no listed spelling occurs anywhere: add the spelling the text uses (e.g. "Hans and Sophie Scholl" contains neither "Hans Scholl" nor "Sophie Scholl" as written) or remove the entry.

| Entry | Main chapter | Forms searched | Forms occur in |
|---|---|---|---|
| Caspar David Friedrich (`people.md#caspar-david-friedrich`) | `nineteenth_century/03_nationalism.md` | Caspar David Friedrich | none |
| Christian Wulff (`people.md#christian-wulff`) | `contemporary/03_modern_society.md` | Christian Wulff · Wulff | `themes/minorities_and_migration.md` |
| Claudia Koonz (`people.md#claudia-koonz`) | `twentieth_century/05_everyday_life_under_nazism.md` | Claudia Koonz | `themes/women_and_family.md` |
| Clovis (`people.md#clovis`) | `medieval/01_carolingian_world.md` | Clovis | `02_MASTER_TIMELINE.md` |
| Conrad Celtis (`people.md#conrad-celtis`) | `early_modern/01_reformation.md` | Conrad Celtis · Celtis | `themes/nationalism.md` |
| Emil Hünten (`people.md#emil-hunten`) | `nineteenth_century/05_unification.md` | Emil Hünten | none |
| Georg Adam Schmidt (`people.md#georg-adam-schmidt`) | `nineteenth_century/02_german_confederation.md` | Georg Adam Schmidt | none |
| George L. Mosse (`people.md#george-l-mosse`) | `twentieth_century/03_rise_of_nazism.md` | George L. Mosse · Mosse | `themes/nationalism.md` |
| Giovanni Battista Tiepolo (`people.md#giovanni-battista-tiepolo`) | `medieval/04_cities_church_feudalism.md` | Giovanni Battista Tiepolo | none |
| Gisela Bock (`people.md#gisela-bock`) | `twentieth_century/05_everyday_life_under_nazism.md` | Gisela Bock | `themes/women_and_family.md` |
| Gordon Craig (`people.md#gordon-craig`) | `nineteenth_century/06_german_empire.md` | Gordon Craig | `themes/militarism.md` |
| Hans Scholl (`people.md#hans-scholl`) | `twentieth_century/06_holocaust_and_persecution.md` | Hans Scholl | none |
| Hartmann Schedel (`people.md#hartmann-schedel`) | `medieval/04_cities_church_feudalism.md` | Hartmann Schedel | none |
| Heinrich August Winkler (`people.md#heinrich-august-winkler`) | `twentieth_century/02_weimar_republic.md` | Heinrich August Winkler · Winkler | `04_QUESTIONS_WORTH_EXPLORING.md` · `themes/socialism.md` |
| Heinrich Mann (`people.md#heinrich-mann`) | `nineteenth_century/06_german_empire.md` | Heinrich Mann | `themes/authoritarianism.md` |
| Herold of Würzburg (`people.md#herold-of-wurzburg`) | `medieval/04_cities_church_feudalism.md` | Herold of Würzburg · Bishop Harold | none |
| Jacob Grimm (`people.md#jacob-grimm`) | `nineteenth_century/03_nationalism.md` | Jacob Grimm | `ancient/01_germanic_societies.md` |
| Kurt Schumacher (`people.md#kurt-schumacher`) | `twentieth_century/09_west_germany.md` | Kurt Schumacher | `themes/socialism.md` |
| Michael Wolgemut (`people.md#michael-wolgemut`) | `medieval/04_cities_church_feudalism.md` | Michael Wolgemut | none |
| Paul Bürde (`people.md#paul-burde`) | `nineteenth_century/05_unification.md` | Paul Bürde | none |
| Robert Koehler (`people.md#robert-koehler`) | `nineteenth_century/07_industrial_society.md` | Robert Koehler | none |
| Sebastian Haffner (`people.md#sebastian-haffner`) | `twentieth_century/02_weimar_republic.md` | Sebastian Haffner · Haffner | `04_QUESTIONS_WORTH_EXPLORING.md` · `themes/socialism.md` |
| Susanne (`people.md#susanne-chodowiecki`) | `early_modern/05_enlightenment.md` | Susanne | none |
| Theodor W. Adorno (`people.md#theodor-w-adorno`) | `twentieth_century/03_rise_of_nazism.md` | Theodor W. Adorno · Adorno | `themes/authoritarianism.md` |
| Ulrich von Hutten (`people.md#ulrich-von-hutten`) | `early_modern/01_reformation.md` | Ulrich von Hutten · Hutten | `themes/nationalism.md` |
| Agri Decumates (`places.md#agri-decumates`) | `ancient/02_roman_frontier.md` | Agri Decumates | `02_MASTER_TIMELINE.md` |
| Armentières (`places.md#armentieres`) | `twentieth_century/01_world_war_one.md` | Armentières | none |
| Balkans (`places.md#balkans`) | `twentieth_century/01_world_war_one.md` | Balkans · Balkan | `nineteenth_century/06_german_empire.md` |
| Heidelberg (`places.md#heidelberg`) | `medieval/04_cities_church_feudalism.md` | Heidelberg | `01_RESEARCH_METHOD.md` · `themes/education.md` |
| Lechfeld (`places.md#lechfeld`) | `medieval/02_holy_roman_empire.md` | Lechfeld | `02_MASTER_TIMELINE.md` |
| Lusatia (`places.md#lusatia`) | `contemporary/03_modern_society.md` | Lusatia | `themes/minorities_and_migration.md` |
| Milan (`places.md#milan`) | `medieval/02_holy_roman_empire.md` | Milan | `nineteenth_century/04_1848_revolutions.md` |
| Nuremberg rally grounds (`places.md#nuremberg-rally-grounds`) | `twentieth_century/08_occupation_and_denazification.md` | Nuremberg rally grounds | none |
| Oberpollinger (`places.md#oberpollinger`) | `twentieth_century/09_west_germany.md` | Oberpollinger | none |
| Ohel Jakob Synagogue (`places.md#ohel-jakob-synagogue`) | `twentieth_century/06_holocaust_and_persecution.md` | Ohel Jakob Synagogue | none |
| Province of Westphalia (`places.md#province-of-westphalia`) | `nineteenth_century/02_german_confederation.md` | Province of Westphalia · Westphalia | `00_FINAL_EXPLANATION.md` · `01_RESEARCH_METHOD.md` · `02_MASTER_TIMELINE.md` · `early_modern/02_thirty_years_war.md` · `nineteenth_century/01_napoleon.md` |
| Würzburg Residenz (`places.md#wurzburg-residenz`) | `medieval/04_cities_church_feudalism.md` | Würzburg Residenz | none |
| 2006 World Cup (`terms.md#2006-world-cup`) | `contemporary/03_modern_society.md` | 2006 World Cup | `themes/nationalism.md` |
| abbess (`terms.md#abbess`) | `medieval/03_medieval_society.md` | abbess · abbesses | `medieval/01_carolingian_world.md` · `themes/women_and_family.md` |
| Abitur (`terms.md#abitur`) | `nineteenth_century/01_napoleon.md` | Abitur | `themes/education.md` |
| Aktion Mensch (`terms.md#aktion-mensch`) | `contemporary/03_modern_society.md` | Aktion Mensch | none |
| Allied Control Council Law No. 46 (`terms.md#control-council-law-no-46`) | `twentieth_century/08_occupation_and_denazification.md` | Allied Control Council Law No. 46 | `themes/militarism.md` |
| Article 116 (`terms.md#article-116`) | `twentieth_century/09_west_germany.md` | Article 116 · Art. 116 | `themes/minorities_and_migration.md` |
| Auslandsdeutsche (`terms.md#auslandsdeutsche`) | `twentieth_century/02_weimar_republic.md` | Auslandsdeutsche | `themes/german_identity.md` |
| authoritarian personality (`terms.md#authoritarian-personality`) | `twentieth_century/03_rise_of_nazism.md` | authoritarian personality | `themes/authoritarianism.md` |
| Bauhaus (`terms.md#bauhaus`) | `twentieth_century/02_weimar_republic.md` | Bauhaus | `04_QUESTIONS_WORTH_EXPLORING.md` |
| black-white-red (`terms.md#black-white-red`) | `twentieth_century/02_weimar_republic.md` | black-white-red | `themes/german_identity.md` |
| Blomberg–Fritsch crisis (`terms.md#blomberg-fritsch-crisis`) | `twentieth_century/04_nazi_state.md` | Blomberg–Fritsch crisis · 1938 purge | `themes/militarism.md` |
| Bologna reform (`terms.md#bologna-reform`) | `contemporary/03_modern_society.md` | Bologna reform | `themes/education.md` |
| Bonn–Berlin move (`terms.md#bonn-berlin-move`) | `contemporary/01_post_reunification.md` | Bonn–Berlin move | `00_FINAL_EXPLANATION.md` · `contemporary/02_modern_political_system.md` · `themes/continuity_and_change.md` |
| Bonn–Copenhagen Declarations (`terms.md#bonn-copenhagen-declarations`) | `twentieth_century/09_west_germany.md` | Bonn–Copenhagen Declarations | `themes/minorities_and_migration.md` |
| Boycott of 1 April 1933 (`terms.md#boycott-of-1-april-1933`) | `twentieth_century/06_holocaust_and_persecution.md` | Boycott of 1 April 1933 · 1933 boycott · April boycott | `02_MASTER_TIMELINE.md` · `twentieth_century/05_everyday_life_under_nazism.md` |
| Captain of Köpenick (`terms.md#captain-of-kopenick`) | `nineteenth_century/06_german_empire.md` | Captain of Köpenick | `themes/militarism.md` |
| care insurance (`terms.md#care-insurance`) | `contemporary/03_modern_society.md` | care insurance | `themes/continuity_and_change.md` |
| "Caster Ware" Vase with Hunt Scene (`terms.md#caster-ware-vase-with-hunt-scene`) | `ancient/02_roman_frontier.md` | "Caster Ware" Vase with Hunt Scene · Caster Ware | none |
| childcare right (`terms.md#childcare-right`) | `contemporary/03_modern_society.md` | childcare right | `themes/women_and_family.md` |
| citizens in arms (`terms.md#citizens-in-arms`) | `nineteenth_century/01_napoleon.md` | citizens in arms | `themes/militarism.md` |
| class enemy (`terms.md#class-enemy`) | `twentieth_century/10_east_germany.md` | class enemy | `themes/authoritarianism.md` |
| Cleveland Museum of Art (`terms.md#cleveland-museum-of-art`) | `ancient/02_roman_frontier.md` | Cleveland Museum of Art | none |
| collective bargaining (`terms.md#collective-bargaining`) | `contemporary/03_modern_society.md` | collective bargaining | `contemporary/02_modern_political_system.md` · `themes/continuity_and_change.md` · `twentieth_century/01_world_war_one.md` · `twentieth_century/02_weimar_republic.md` |
| Communist League (`terms.md#communist-league`) | `nineteenth_century/04_1848_revolutions.md` | Communist League | `themes/socialism.md` |
| conscientious objection (`terms.md#conscientious-objection`) | `twentieth_century/11_cold_war_germany.md` | conscientious objection | `themes/militarism.md` |
| cooperative separation (`terms.md#cooperative-separation`) | `twentieth_century/09_west_germany.md` | cooperative separation · Cooperative separation | `themes/religion.md` |
| Craft code (`terms.md#craft-code`) | `nineteenth_century/07_industrial_society.md` | Craft code | `themes/continuity_and_change.md` |
| cult of the front soldier (`terms.md#cult-of-the-front-soldier`) | `twentieth_century/02_weimar_republic.md` | cult of the front soldier | `themes/militarism.md` |
| cultural sovereignty (`terms.md#cultural-sovereignty`) | `twentieth_century/09_west_germany.md` | cultural sovereignty | `themes/education.md` |
| demagogues (`terms.md#demagogues`) | `nineteenth_century/02_german_confederation.md` | demagogues | `00_FINAL_EXPLANATION.md` |
| Democratic radicalism (`terms.md#democratic-radicalism`) | `nineteenth_century/03_nationalism.md` | Democratic radicalism · democratic radicalism | `nineteenth_century/02_german_confederation.md` |
| Der Geschichtsunterricht (`terms.md#der-geschichtsunterricht`) | `nineteenth_century/02_german_confederation.md` | Der Geschichtsunterricht · The History Lesson | none |
| Deutsches Historisches Museum (`terms.md#deutsches-historisches-museum`) | `nineteenth_century/01_napoleon.md` | Deutsches Historisches Museum · DHM | `01_RESEARCH_METHOD.md` |
| dictatorship of the proletariat (`terms.md#dictatorship-of-the-proletariat`) | `twentieth_century/10_east_germany.md` | dictatorship of the proletariat | `themes/socialism.md` |
| dpa (`terms.md#dpa`) | `twentieth_century/12_reunification.md` | dpa | none |
| early tracking (`terms.md#early-tracking`) | `contemporary/03_modern_society.md` | early tracking · tracked schooling | `themes/education.md` |
| emergency laws (`terms.md#emergency-laws`) | `twentieth_century/09_west_germany.md` | emergency laws | `themes/political_power.md` |
| Entente (`terms.md#entente`) | `twentieth_century/01_world_war_one.md` | Entente | `themes/nationalism.md` |
| Erweiterte Oberschule (`terms.md#erweiterte-oberschule`) | `twentieth_century/10_east_germany.md` | Erweiterte Oberschule | `themes/education.md` |
| European Communities (`terms.md#european-communities`) | `contemporary/04_germany_in_europe.md` | European Communities | `twentieth_century/11_cold_war_germany.md` |
| Europeanism (`terms.md#europeanism`) | `contemporary/04_germany_in_europe.md` | Europeanism | `contemporary/01_post_reunification.md` · `contemporary/02_modern_political_system.md` |
| Exzellenzinitiative (`terms.md#exzellenzinitiative`) | `contemporary/03_modern_society.md` | Exzellenzinitiative | `themes/education.md` |
| feudalisation of the bourgeoisie (`terms.md#feudalisation-of-the-bourgeoisie`) | `nineteenth_century/06_german_empire.md` | feudalisation of the bourgeoisie · Feudalisation of the bourgeoisie | `themes/class.md` |
| forced secularisation (`terms.md#forced-secularisation`) | `twentieth_century/10_east_germany.md` | forced secularisation | `themes/religion.md` |
| Freikorps (`terms.md#freikorps`) | `twentieth_century/02_weimar_republic.md` | Freikorps | `00_FINAL_EXPLANATION.md` · `02_MASTER_TIMELINE.md` · `themes/socialism.md` |
| Frisians (`terms.md#frisians`) | `contemporary/03_modern_society.md` | Frisians | `04_QUESTIONS_WORTH_EXPLORING.md` · `themes/minorities_and_migration.md` |
| GDR districts (`terms.md#gdr-districts`) | `twentieth_century/10_east_germany.md` | GDR districts · districts | `contemporary/02_modern_political_system.md` · `early_modern/04_prussia_and_austria.md` · `medieval/01_carolingian_world.md` · `nineteenth_century/04_1848_revolutions.md` · `themes/continuity_and_change.md` · `themes/political_power.md` · `twentieth_century/02_weimar_republic.md` |
| GDR local elections of May 1989 (`terms.md#gdr-local-elections-1989`) | `twentieth_century/12_reunification.md` | GDR local elections of May 1989 · Election fraud | `02_MASTER_TIMELINE.md` |
| GEAS (`terms.md#geas`) | `contemporary/04_germany_in_europe.md` | GEAS | `themes/minorities_and_migration.md` |
| general strike (`terms.md#general-strike-1920`) | `twentieth_century/02_weimar_republic.md` | general strike | `02_MASTER_TIMELINE.md` |
| Geruchskonserve (`terms.md#geruchskonserve`) | `twentieth_century/10_east_germany.md` | Geruchskonserve | none |
| Golden Twenties (`terms.md#golden-twenties`) | `twentieth_century/02_weimar_republic.md` | Golden Twenties | `02_MASTER_TIMELINE.md` |
| Gradual (`terms.md#gradual`) | `medieval/01_carolingian_world.md` | Gradual | `ancient/02_roman_frontier.md` · `themes/democracy.md` · `themes/women_and_family.md` |
| Grundschule (`terms.md#grundschule`) | `twentieth_century/02_weimar_republic.md` | Grundschule | `themes/education.md` |
| Gruppe 47 (`terms.md#gruppe-47`) | `twentieth_century/09_west_germany.md` | Gruppe 47 | `04_QUESTIONS_WORTH_EXPLORING.md` |
| Haus der Geschichte (`terms.md#haus-der-geschichte`) | `twentieth_century/09_west_germany.md` | Haus der Geschichte · Stiftung Haus der Geschichte | none |
| Hitler putsch (`terms.md#hitler-putsch`) | `twentieth_century/03_rise_of_nazism.md` | Hitler putsch | `02_MASTER_TIMELINE.md` |
| Huldigung an Kaiser Wilhelm I. (`terms.md#huldigung-an-kaiser-wilhelm-i`) | `nineteenth_century/06_german_empire.md` | Huldigung an Kaiser Wilhelm I. · Homage to Emperor Wilhelm I | none |
| hunger crisis of 1846–47 (`terms.md#hunger-crisis-1846-47`) | `nineteenth_century/02_german_confederation.md` | hunger crisis of 1846–47 · hunger crisis | `00_FINAL_EXPLANATION.md` · `02_MASTER_TIMELINE.md` |
| Innere Führung (`terms.md#innere-fuhrung`) | `twentieth_century/11_cold_war_germany.md` | Innere Führung · citizen in uniform · citizens in uniform | `themes/militarism.md` · `themes/political_power.md` |
| invasion of Poland (`terms.md#invasion-of-poland`) | `twentieth_century/07_world_war_two.md` | invasion of Poland · Invasion of Poland | `02_MASTER_TIMELINE.md` |
| Kapp Putsch (`terms.md#kapp-putsch`) | `twentieth_century/02_weimar_republic.md` | Kapp Putsch | `02_MASTER_TIMELINE.md` |
| Kriegstüchtigkeit (`terms.md#kriegstuchtigkeit`) | `contemporary/04_germany_in_europe.md` | Kriegstüchtigkeit | `themes/militarism.md` |
| late industrialisation (`terms.md#late-industrialisation`) | `nineteenth_century/07_industrial_society.md` | late industrialisation | `themes/industrialization.md` |
| Leitkultur (`terms.md#leitkultur`) | `contemporary/03_modern_society.md` | Leitkultur | `themes/minorities_and_migration.md` |
| local elections of May 1989 (`terms.md#local-elections-of-may-1989`) | `twentieth_century/12_reunification.md` | local elections of May 1989 · falsified local elections | `twentieth_century/10_east_germany.md` |
| Locarno Treaties (`terms.md#locarno-treaties`) | `twentieth_century/02_weimar_republic.md` | Locarno Treaties · Locarno | `02_MASTER_TIMELINE.md` |
| LPG (`terms.md#lpg`) | `twentieth_century/10_east_germany.md` | LPG | `themes/industrialization.md` |
| Magdeburg Ivories (`terms.md#magdeburg-ivories`) | `medieval/02_holy_roman_empire.md` | Magdeburg Ivories | none |
| Metropolitan Museum of Art (`terms.md#metropolitan-museum-of-art`) | `nineteenth_century/03_nationalism.md` | Metropolitan Museum of Art · The Metropolitan Museum of Art | none |
| Monday demonstrations (`terms.md#monday-demonstrations`) | `twentieth_century/12_reunification.md` | Monday demonstrations | `00_FINAL_EXPLANATION.md` |
| multiculturalism (`terms.md#multiculturalism`) | `contemporary/03_modern_society.md` | multiculturalism | `themes/minorities_and_migration.md` |
| Munt (`terms.md#munt`) | `medieval/03_medieval_society.md` | Munt | `themes/women_and_family.md` |
| Napoleonic Wars (`terms.md#napoleonic-wars`) | `nineteenth_century/01_napoleon.md` | Napoleonic Wars · Napoleonic wars | `nineteenth_century/03_nationalism.md` |
| Nazi student league (`terms.md#nazi-student-league`) | `twentieth_century/03_rise_of_nazism.md` | Nazi student league | `themes/education.md` |
| neo-Nazis (`terms.md#neo-nazis`) | `contemporary/01_post_reunification.md` | neo-Nazis | `themes/nationalism.md` |
| November criminals (`terms.md#november-criminals`) | `twentieth_century/02_weimar_republic.md` | November criminals | `themes/nationalism.md` |
| NVA (`terms.md#nva`) | `twentieth_century/10_east_germany.md` | NVA | `themes/militarism.md` |
| Operation Barbarossa (`terms.md#operation-barbarossa`) | `twentieth_century/07_world_war_two.md` | Operation Barbarossa · invasion of the Soviet Union in 1941 · Invasion of USSR | `00_FINAL_EXPLANATION.md` · `02_MASTER_TIMELINE.md` · `twentieth_century/06_holocaust_and_persecution.md` |
| option model (`terms.md#option-model`) | `contemporary/03_modern_society.md` | option model | `themes/minorities_and_migration.md` |
| polytechnic school (`terms.md#polytechnic-school`) | `twentieth_century/10_east_germany.md` | polytechnic school · polytechnic schooling | `themes/education.md` |
| Porajmos (`terms.md#porajmos`) | `twentieth_century/06_holocaust_and_persecution.md` | Porajmos | `themes/minorities_and_migration.md` |
| protected Jews (`terms.md#protected-jews`) | `early_modern/03_territorial_states.md` | protected Jews | `themes/minorities_and_migration.md` · `themes/religion.md` |
| real existing socialism (`terms.md#real-existing-socialism`) | `twentieth_century/10_east_germany.md` | real existing socialism · Real socialism | `themes/socialism.md` |
| Realschule (`terms.md#realschule`) | `nineteenth_century/06_german_empire.md` | Realschule | `themes/education.md` |
| Reich and State Citizenship Law (`terms.md#reich-and-state-citizenship-law`) | `nineteenth_century/06_german_empire.md` | Reich and State Citizenship Law | `themes/minorities_and_migration.md` |
| research university (`terms.md#research-university`) | `nineteenth_century/01_napoleon.md` | research university | `04_QUESTIONS_WORTH_EXPLORING.md` · `themes/education.md` |
| Rhineland massacres (`terms.md#rhineland-massacres`) | `medieval/04_cities_church_feudalism.md` | Rhineland massacres | `02_MASTER_TIMELINE.md` |
| Roman months (`terms.md#roman-months`) | `early_modern/03_territorial_states.md` | Roman months | `05_REGIME_MATRIX.md` |
| rural proletariat (`terms.md#rural-proletariat`) | `nineteenth_century/01_napoleon.md` | rural proletariat | `themes/class.md` |
| Saxon Wars (`terms.md#saxon-wars`) | `medieval/01_carolingian_world.md` | Saxon Wars · Charlemagne's Saxon Wars | `02_MASTER_TIMELINE.md` |
| scriptorium (`terms.md#scriptorium`) | `medieval/01_carolingian_world.md` | scriptorium | none |
| Second industrial revolution (`terms.md#second-industrial-revolution`) | `nineteenth_century/07_industrial_society.md` | Second industrial revolution · second industrial revolution | `nineteenth_century/06_german_empire.md` |
| Social Democratism (`terms.md#social-democratism`) | `twentieth_century/10_east_germany.md` | Social Democratism | `themes/socialism.md` |
| solidarity tax (`terms.md#solidarity-tax`) | `contemporary/01_post_reunification.md` | solidarity tax | `twentieth_century/12_reunification.md` |
| Spartacist uprising (`terms.md#spartacist-uprising`) | `twentieth_century/02_weimar_republic.md` | Spartacist uprising · Spartacist | `02_MASTER_TIMELINE.md` |
| SSW (`terms.md#ssw`) | `contemporary/02_modern_political_system.md` | SSW | `themes/minorities_and_migration.md` |
| Staatsgerichtshof (`terms.md#staatsgerichtshof`) | `twentieth_century/02_weimar_republic.md` | Staatsgerichtshof | `themes/continuity_and_change.md` |
| state arbitration (`terms.md#state-arbitration`) | `twentieth_century/02_weimar_republic.md` | state arbitration · Arbitration | `themes/industrialization.md` |
| sustainability (`terms.md#sustainability`) | `early_modern/05_enlightenment.md` | sustainability | `04_QUESTIONS_WORTH_EXPLORING.md` |
| The Large Miseries of War (`terms.md#large-miseries-of-war`) | `early_modern/02_thirty_years_war.md` | The Large Miseries of War · Large Miseries of War | none |
| Third Reich (`terms.md#third-reich`) | `twentieth_century/04_nazi_state.md` | Third Reich | `03_MENTAL_MODEL.md` · `twentieth_century/05_everyday_life_under_nazism.md` |
| Treaties of Rome (`terms.md#treaties-of-rome`) | `twentieth_century/11_cold_war_germany.md` | Treaties of Rome | `02_MASTER_TIMELINE.md` |
| Two Men Contemplating the Moon (`terms.md#two-men-contemplating-the-moon`) | `nineteenth_century/03_nationalism.md` | Two Men Contemplating the Moon | none |
| ultramontanism (`terms.md#ultramontanism`) | `nineteenth_century/06_german_empire.md` | ultramontanism | `nineteenth_century/01_napoleon.md` · `themes/religion.md` |
| Untertan (`terms.md#untertan`) | `nineteenth_century/06_german_empire.md` | Untertan | `themes/authoritarianism.md` |
| Vereinigte Stahlwerke (`terms.md#vereinigte-stahlwerke`) | `twentieth_century/02_weimar_republic.md` | Vereinigte Stahlwerke | `themes/industrialization.md` |
| Völkischer Beobachter (`terms.md#volkischer-beobachter`) | `twentieth_century/04_nazi_state.md` | Völkischer Beobachter | none |
| WASG (`terms.md#wasg`) | `contemporary/02_modern_political_system.md` | WASG | `themes/socialism.md` |
| Weimar Constitution (`terms.md#weimar-constitution`) | `twentieth_century/02_weimar_republic.md` | Weimar Constitution | `02_MASTER_TIMELINE.md` · `nineteenth_century/04_1848_revolutions.md` · `twentieth_century/03_rise_of_nazism.md` · `twentieth_century/04_nazi_state.md` · `twentieth_century/05_everyday_life_under_nazism.md` |
| whole house (`terms.md#whole-house`) | `early_modern/01_reformation.md` | whole house · Whole house | `themes/women_and_family.md` |
| Wilhelmine era (`terms.md#wilhelmine-era`) | `nineteenth_century/06_german_empire.md` | Wilhelmine era · Wilhelmine | `02_MASTER_TIMELINE.md` |
| Zündapp (`terms.md#zundapp`) | `twentieth_century/09_west_germany.md` | Zündapp | none |

### 5b. A form occurs, but the match is blocked (ambiguous, shared, or only inside a longer name) (27)

| Entry | Main chapter | Ambiguous/shared forms |
|---|---|---|
| Carl Friedrich Goerdeler (`people.md#carl-friedrich-goerdeler`) | `twentieth_century/06_holocaust_and_persecution.md` | — (occurs only inside a longer matched name) |
| Joseph Stalin (`people.md#joseph-stalin`) | `twentieth_century/07_world_war_two.md` | — (occurs only inside a longer matched name) |
| Olaf Scholz (`people.md#olaf-scholz`) | `contemporary/02_modern_political_system.md` | — (occurs only inside a longer matched name) |
| Wilhelm Groener (`people.md#wilhelm-groener`) | `twentieth_century/01_world_war_one.md` | — (occurs only inside a longer matched name) |
| Alsace (`places.md#alsace`) | `nineteenth_century/05_unification.md` | — (occurs only inside a longer matched name) |
| Frankfurt (`places.md#frankfurt`) | `twentieth_century/09_west_germany.md` | — (occurs only inside a longer matched name) |
| Frankish kingdom (`places.md#frankish-kingdom`) | `medieval/01_carolingian_world.md` | — (occurs only inside a longer matched name) |
| Fürth (`places.md#furth`) | `nineteenth_century/02_german_confederation.md` | — (occurs only inside a longer matched name) |
| Gotha (`places.md#gotha`) | `nineteenth_century/07_industrial_society.md` | Gotha |
| Göttingen (`places.md#gottingen`) | `nineteenth_century/02_german_confederation.md` | — (occurs only inside a longer matched name) |
| Magdeburg (`places.md#magdeburg`) | `medieval/04_cities_church_feudalism.md` | — (occurs only inside a longer matched name) |
| Malmö (`places.md#malmo`) | `nineteenth_century/04_1848_revolutions.md` | — (occurs only inside a longer matched name) |
| Ruhr (`places.md#ruhr`) | `twentieth_century/02_weimar_republic.md` | — (occurs only inside a longer matched name) |
| Stralsund (`places.md#stralsund`) | `medieval/04_cities_church_feudalism.md` | — (occurs only inside a longer matched name) |
| Strasbourg (`places.md#strasbourg`) | `medieval/01_carolingian_world.md` | — (occurs only inside a longer matched name) |
| Zabern (`places.md#zabern`) | `nineteenth_century/06_german_empire.md` | — (occurs only inside a longer matched name) |
| Berlin Airlift (`terms.md#berlin-airlift`) | `twentieth_century/11_cold_war_germany.md` | — (occurs only inside a longer matched name) |
| Christian Social Union (`terms.md#christian-social-union`) | `contemporary/02_modern_political_system.md` | — (occurs only inside a longer matched name) |
| Concentration camp (`terms.md#concentration-camp`) | `twentieth_century/04_nazi_state.md` | concentration camp |
| Councils (`terms.md#councils`) | `twentieth_century/02_weimar_republic.md` | councils |
| Final Solution (`terms.md#final-solution`) | `twentieth_century/06_holocaust_and_persecution.md` | — (occurs only inside a longer matched name) |
| Gotha unification (`terms.md#gotha-unification`) | `nineteenth_century/07_industrial_society.md` | Gotha |
| Kohlrüben (`terms.md#kohlruben`) | `twentieth_century/01_world_war_one.md` | — (occurs only inside a longer matched name) |
| Maastricht (`terms.md#maastricht`) | `contemporary/04_germany_in_europe.md` | Maastricht |
| prefect (`terms.md#prefect`) | `nineteenth_century/01_napoleon.md` | — (occurs only inside a longer matched name) |
| Protestantism (`terms.md#protestantism`) | `early_modern/01_reformation.md` | Protestant |
| right to asylum (`terms.md#right-to-asylum`) | `contemporary/01_post_reunification.md` | — (occurs only inside a longer matched name) |

## 6. Length limits (`dictionary/README.md`: Short ≤ 18 words, Explanation ≤ 60 words)

None.

## 7. Structural errors

None — all 2,300 entries parse (required fields, ids, kinds, basis, chapter links and ambiguity links are valid).

## 8. README counts

Match the files (437 people, 280 places, 1583 terms).
