# Dictionary issues found by the website build

*Generated 2026-09-28 by `site/qa/dictionary-report.mjs` from `dictionary/*.md`, using the same parser and matcher as the website. For the session that maintains the knowledge base. Re-run the script after fixing; resolved items disappear from this file.*

**How the website uses the dictionary** (so the fixes below make sense): every canonical name and "Also written as" form is matched in the chapter text — case-sensitive, whole word, longest match first. A form that appears in `ambiguous_forms.md`, or that belongs to more than one entry, is highlighted only in chapters where the table names an entry; `—` or a missing row means plain text.

## Summary

| # | Problem | Count | Where to fix |
|---|---|---|---|
| 1 | Word highlighted as the wrong entry (misreading) | 0 | `ambiguous_forms.md` (add rows) |
| 2 | `ambiguous_forms.md` rows that point at non-chapter files (`site/…`, task files) | 0 | `ambiguous_forms.md` (delete rows) |
| 3 | "Also in" chapters supported only by a misreading | 0 | entry's **Also in** |
| 4 | Forms shared by several entries but missing from `ambiguous_forms.md` (never highlighted) | 0 | `ambiguous_forms.md` (add rows) |
| 5 | Entries never found in their own main chapter: 5a no spelling there / 5b blocked by the table / 5c only inside a longer name | 126 / 8 / 22 | entry's **Also written as**, **Main chapter**, or `ambiguous_forms.md` |
| 6 | **Short** longer than 18 words / **Explanation** longer than 60 words | 0 / 0 | entry text |
| 7 | Structural errors (malformed entries, bad links) | 0 | as listed |
| 8 | README counts differ from the files | 0 | `dictionary/README.md` |

Site-side workarounds (`site/data/dictionary-overrides.json`): 0 in use, of which 0 are no longer needed because the dictionary now resolves those words correctly.

## 1. Misreadings — add a row to `ambiguous_forms.md` for each

Each row below is a word in a chapter that the dictionary links to the wrong entry. Found by reviewing all 4,351 chapter/form/entry matches with their context (two by hand, 70 by a model review, 28 Sept 2026) — please check each before applying. **Fix:** add the row `| <form> | `<chapter>` | — |` to `ambiguous_forms.md`, or instead of `—` link the correct entry if the dictionary has one (e.g. a separate "reparations (after 1945)" entry). Where the form is a common English word used in many chapters, consider whether it should be a form of that entry at all.

| Chapter | Form | Currently resolves to | Why it is wrong | Line |
|---|---|---|---|---|

## 2. Rows that point at non-chapter files — delete

`ambiguous_forms.md` has 0 rows whose "Chapter" is not a KB chapter: files inside `site/` (the website, its `node_modules`, PLAN/README/CONTENT_TRACE) and the task file `SITE_CHANGELOG_AND_TASKS.md`. The dictionary builder scanned those folders too. **Fix:** delete these lines (line numbers as of generation):


## 3. "Also in" chapters supported only by a misreading

The entry lists the chapter under **Also in**, but the only occurrence there is the misread word from §1 — the chapter does not actually mention this entry. **Fix:** remove the chapter from the entry's **Also in** line.

| Entry | Remove from "Also in" | Misread form |
|---|---|---|

## 4. Forms shared by several entries but missing from `ambiguous_forms.md`

These surface forms belong to more than one entry and have no row in `ambiguous_forms.md`, so the website never highlights them (it cannot know which entry is meant). **Fix:** if the entries describe the same thing (e.g. an abbreviation and its full name as two entries), **merge them into one entry**; otherwise add a row per chapter to `ambiguous_forms.md` naming the right entry, or remove the form from the entry where it is not a real alternative name.

| Form | Claimed by | Occurs in chapters |
|---|---|---|

## 5. Entries never found in their own main chapter

The website finds no highlight for these entries in the chapter named as **Main chapter**. Two causes: (a) the chapter uses a spelling that is not listed under **Also written as** — add it; (b) the name occurs but only as an ambiguous form that has no row for this chapter — add the row to `ambiguous_forms.md`. If the entry is really not discussed in that chapter, correct **Main chapter**.

### 5a. No listed form occurs in the main chapter (126)

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
| Hartmann Schedel (`people.md#hartmann-schedel`) | `medieval/04_cities_church_feudalism.md` | Hartmann Schedel | none |
| Heinrich August Winkler (`people.md#heinrich-august-winkler`) | `twentieth_century/02_weimar_republic.md` | Heinrich August Winkler · Winkler | `04_QUESTIONS_WORTH_EXPLORING.md` · `themes/socialism.md` |
| Heinrich Mann (`people.md#heinrich-mann`) | `nineteenth_century/06_german_empire.md` | Heinrich Mann | `themes/authoritarianism.md` |
| Herold of Würzburg (`people.md#herold-of-wurzburg`) | `medieval/04_cities_church_feudalism.md` | Herold of Würzburg · Bishop Harold | none |
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
| Heidelberg (`places.md#heidelberg`) | `medieval/04_cities_church_feudalism.md` | Heidelberg | `01_RESEARCH_METHOD.md` · `themes/education.md` |
| Lechfeld (`places.md#lechfeld`) | `medieval/02_holy_roman_empire.md` | Lechfeld | `02_MASTER_TIMELINE.md` |
| Lusatia (`places.md#lusatia`) | `contemporary/03_modern_society.md` | Lusatia | `themes/minorities_and_migration.md` |
| Milan (`places.md#milan`) | `medieval/02_holy_roman_empire.md` | Milan | `nineteenth_century/04_1848_revolutions.md` |
| Nuremberg rally grounds (`places.md#nuremberg-rally-grounds`) | `twentieth_century/08_occupation_and_denazification.md` | Nuremberg rally grounds | none |
| Oberpollinger (`places.md#oberpollinger`) | `twentieth_century/09_west_germany.md` | Oberpollinger | none |
| Ohel Jakob Synagogue (`places.md#ohel-jakob-synagogue`) | `twentieth_century/06_holocaust_and_persecution.md` | Ohel Jakob Synagogue | none |
| Würzburg Residenz (`places.md#wurzburg-residenz`) | `medieval/04_cities_church_feudalism.md` | Würzburg Residenz | none |
| 2006 World Cup (`terms.md#2006-world-cup`) | `contemporary/03_modern_society.md` | 2006 World Cup | `themes/nationalism.md` |
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
| Bonn–Copenhagen Declarations (`terms.md#bonn-copenhagen-declarations`) | `twentieth_century/09_west_germany.md` | Bonn–Copenhagen Declarations | `themes/minorities_and_migration.md` |
| Captain of Köpenick (`terms.md#captain-of-kopenick`) | `nineteenth_century/06_german_empire.md` | Captain of Köpenick | `themes/militarism.md` |
| "Caster Ware" Vase with Hunt Scene (`terms.md#caster-ware-vase-with-hunt-scene`) | `ancient/02_roman_frontier.md` | "Caster Ware" Vase with Hunt Scene · Caster Ware | none |
| citizens in arms (`terms.md#citizens-in-arms`) | `nineteenth_century/01_napoleon.md` | citizens in arms | `themes/militarism.md` |
| class enemy (`terms.md#class-enemy`) | `twentieth_century/10_east_germany.md` | class enemy | `themes/authoritarianism.md` |
| Cleveland Museum of Art (`terms.md#cleveland-museum-of-art`) | `ancient/02_roman_frontier.md` | Cleveland Museum of Art | none |
| Communist League (`terms.md#communist-league`) | `nineteenth_century/04_1848_revolutions.md` | Communist League | `themes/socialism.md` |
| conscientious objection (`terms.md#conscientious-objection`) | `twentieth_century/11_cold_war_germany.md` | conscientious objection | `themes/militarism.md` |
| cooperative separation (`terms.md#cooperative-separation`) | `twentieth_century/09_west_germany.md` | cooperative separation · Cooperative separation | `themes/religion.md` |
| Craft code (`terms.md#craft-code`) | `nineteenth_century/07_industrial_society.md` | Craft code | `themes/continuity_and_change.md` |
| cult of the front soldier (`terms.md#cult-of-the-front-soldier`) | `twentieth_century/02_weimar_republic.md` | cult of the front soldier | `themes/militarism.md` |
| cultural sovereignty (`terms.md#cultural-sovereignty`) | `twentieth_century/09_west_germany.md` | cultural sovereignty | `themes/education.md` |
| demagogues (`terms.md#demagogues`) | `nineteenth_century/02_german_confederation.md` | demagogues | `00_FINAL_EXPLANATION.md` |
| Der Geschichtsunterricht (`terms.md#der-geschichtsunterricht`) | `nineteenth_century/02_german_confederation.md` | Der Geschichtsunterricht · The History Lesson | none |
| Deutsches Historisches Museum (`terms.md#deutsches-historisches-museum`) | `nineteenth_century/01_napoleon.md` | Deutsches Historisches Museum · DHM | `01_RESEARCH_METHOD.md` |
| dictatorship of the proletariat (`terms.md#dictatorship-of-the-proletariat`) | `twentieth_century/10_east_germany.md` | dictatorship of the proletariat | `themes/socialism.md` |
| dpa (`terms.md#dpa`) | `twentieth_century/12_reunification.md` | dpa | none |
| emergency laws (`terms.md#emergency-laws`) | `twentieth_century/09_west_germany.md` | emergency laws | `themes/political_power.md` |
| Entente (`terms.md#entente`) | `twentieth_century/01_world_war_one.md` | Entente | `themes/nationalism.md` |
| Erweiterte Oberschule (`terms.md#erweiterte-oberschule`) | `twentieth_century/10_east_germany.md` | Erweiterte Oberschule | `themes/education.md` |
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
| Innere Führung (`terms.md#innere-fuhrung`) | `twentieth_century/11_cold_war_germany.md` | Innere Führung · citizen in uniform · citizens in uniform | `themes/militarism.md` · `themes/political_power.md` |
| Kapp Putsch (`terms.md#kapp-putsch`) | `twentieth_century/02_weimar_republic.md` | Kapp Putsch | `02_MASTER_TIMELINE.md` |
| Kriegstüchtigkeit (`terms.md#kriegstuchtigkeit`) | `contemporary/04_germany_in_europe.md` | Kriegstüchtigkeit | `themes/militarism.md` |
| late industrialisation (`terms.md#late-industrialisation`) | `nineteenth_century/07_industrial_society.md` | late industrialisation | `themes/industrialization.md` |
| Leitkultur (`terms.md#leitkultur`) | `contemporary/03_modern_society.md` | Leitkultur | `themes/minorities_and_migration.md` |
| Locarno Treaties (`terms.md#locarno-treaties`) | `twentieth_century/02_weimar_republic.md` | Locarno Treaties · Locarno | `02_MASTER_TIMELINE.md` |
| LPG (`terms.md#lpg`) | `twentieth_century/10_east_germany.md` | LPG | `themes/industrialization.md` |
| Magdeburg Ivories (`terms.md#magdeburg-ivories`) | `medieval/02_holy_roman_empire.md` | Magdeburg Ivories | none |
| Metropolitan Museum of Art (`terms.md#metropolitan-museum-of-art`) | `nineteenth_century/03_nationalism.md` | Metropolitan Museum of Art · The Metropolitan Museum of Art | none |
| Monday demonstrations (`terms.md#monday-demonstrations`) | `twentieth_century/12_reunification.md` | Monday demonstrations | `00_FINAL_EXPLANATION.md` |
| multiculturalism (`terms.md#multiculturalism`) | `contemporary/03_modern_society.md` | multiculturalism | `themes/minorities_and_migration.md` |
| Munt (`terms.md#munt`) | `medieval/03_medieval_society.md` | Munt | `themes/women_and_family.md` |
| Nazi student league (`terms.md#nazi-student-league`) | `twentieth_century/03_rise_of_nazism.md` | Nazi student league | `themes/education.md` |
| neo-Nazis (`terms.md#neo-nazis`) | `contemporary/01_post_reunification.md` | neo-Nazis | `themes/nationalism.md` |
| November criminals (`terms.md#november-criminals`) | `twentieth_century/02_weimar_republic.md` | November criminals | `themes/nationalism.md` |
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
| Social Democratism (`terms.md#social-democratism`) | `twentieth_century/10_east_germany.md` | Social Democratism | `themes/socialism.md` |
| Spartacist uprising (`terms.md#spartacist-uprising`) | `twentieth_century/02_weimar_republic.md` | Spartacist uprising · Spartacist | `02_MASTER_TIMELINE.md` |
| SSW (`terms.md#ssw`) | `contemporary/02_modern_political_system.md` | SSW | `themes/minorities_and_migration.md` |
| Staatsgerichtshof (`terms.md#staatsgerichtshof`) | `twentieth_century/02_weimar_republic.md` | Staatsgerichtshof | `themes/continuity_and_change.md` |
| state arbitration (`terms.md#state-arbitration`) | `twentieth_century/02_weimar_republic.md` | state arbitration · Arbitration | `themes/industrialization.md` |
| sustainability (`terms.md#sustainability`) | `early_modern/05_enlightenment.md` | sustainability | `04_QUESTIONS_WORTH_EXPLORING.md` |
| The Large Miseries of War (`terms.md#large-miseries-of-war`) | `early_modern/02_thirty_years_war.md` | The Large Miseries of War · Large Miseries of War | none |
| Treaties of Rome (`terms.md#treaties-of-rome`) | `twentieth_century/11_cold_war_germany.md` | Treaties of Rome | `02_MASTER_TIMELINE.md` |
| Two Men Contemplating the Moon (`terms.md#two-men-contemplating-the-moon`) | `nineteenth_century/03_nationalism.md` | Two Men Contemplating the Moon | none |
| Untertan (`terms.md#untertan`) | `nineteenth_century/06_german_empire.md` | Untertan | `themes/authoritarianism.md` |
| Vereinigte Stahlwerke (`terms.md#vereinigte-stahlwerke`) | `twentieth_century/02_weimar_republic.md` | Vereinigte Stahlwerke | `themes/industrialization.md` |
| Völkischer Beobachter (`terms.md#volkischer-beobachter`) | `twentieth_century/04_nazi_state.md` | Völkischer Beobachter | none |
| WASG (`terms.md#wasg`) | `contemporary/02_modern_political_system.md` | WASG | `themes/socialism.md` |
| Weimar Constitution (`terms.md#weimar-constitution`) | `twentieth_century/02_weimar_republic.md` | Weimar Constitution | `02_MASTER_TIMELINE.md` · `nineteenth_century/04_1848_revolutions.md` · `twentieth_century/03_rise_of_nazism.md` · `twentieth_century/04_nazi_state.md` · `twentieth_century/05_everyday_life_under_nazism.md` |
| whole house (`terms.md#whole-house`) | `early_modern/01_reformation.md` | whole house · Whole house | `themes/women_and_family.md` |
| Wilhelmine era (`terms.md#wilhelmine-era`) | `nineteenth_century/06_german_empire.md` | Wilhelmine era · Wilhelmine | `02_MASTER_TIMELINE.md` |
| Zündapp (`terms.md#zundapp`) | `twentieth_century/09_west_germany.md` | Zündapp | none |

### 5b. A form occurs, but `ambiguous_forms.md` blocks it in the main chapter (8)

The name occurs, but the table says `—` (or has no row) for this chapter, so it is never highlighted where it matters most. **Fix:** give the row for the main chapter the entry id. If the same short form means two different entries in one chapter (e.g. "Meissner" in the Weimar chapter is both State Secretary Otto Meissner and the economist Christopher M. Meissner), the table cannot express it: add the fuller spelling the text uses to "Also written as" (e.g. "State Secretary Meissner"), or accept plain text there.

| Entry | Main chapter | Blocked forms |
|---|---|---|
| Christopher M. Meissner (`people.md#christopher-m-meissner`) | `twentieth_century/02_weimar_republic.md` | Meissner |
| Gotha (`places.md#gotha`) | `nineteenth_century/07_industrial_society.md` | Gotha |
| Province of Westphalia (`places.md#province-of-westphalia`) | `nineteenth_century/01_napoleon.md` | Westphalia |
| Allies (`terms.md#allies-first-world-war`) | `twentieth_century/01_world_war_one.md` | Allies · Allied · allies |
| Concentration camp (`terms.md#concentration-camp`) | `twentieth_century/04_nazi_state.md` | concentration camp |
| Councils (`terms.md#councils`) | `twentieth_century/02_weimar_republic.md` | councils |
| Maastricht (`terms.md#maastricht`) | `contemporary/04_germany_in_europe.md` | Maastricht |
| Protestantism (`terms.md#protestantism`) | `early_modern/01_reformation.md` | Protestant |

### 5c. The name occurs only inside a longer word or a longer dictionary name (22) — low priority

Example: "Ruhr" occurs only within "Ruhr occupation", which is its own entry, so the longer entry is highlighted instead; or the text has the name only as part of a longer word. Often nothing needs to change. **Fix only if wrong:** correct **Main chapter** to a chapter that names the entry on its own.

| Entry | Main chapter |
|---|---|
| Carl Friedrich Goerdeler (`people.md#carl-friedrich-goerdeler`) | `twentieth_century/06_holocaust_and_persecution.md` |
| Joseph Stalin (`people.md#joseph-stalin`) | `twentieth_century/07_world_war_two.md` |
| Olaf Scholz (`people.md#olaf-scholz`) | `contemporary/02_modern_political_system.md` |
| Sophie Scholl (`people.md#sophie-scholl`) | `twentieth_century/06_holocaust_and_persecution.md` |
| Wilhelm Groener (`people.md#wilhelm-groener`) | `twentieth_century/01_world_war_one.md` |
| Alsace (`places.md#alsace`) | `nineteenth_century/05_unification.md` |
| Frankfurt (`places.md#frankfurt`) | `twentieth_century/09_west_germany.md` |
| Frankish kingdom (`places.md#frankish-kingdom`) | `medieval/01_carolingian_world.md` |
| Fürth (`places.md#furth`) | `nineteenth_century/02_german_confederation.md` |
| Göttingen (`places.md#gottingen`) | `nineteenth_century/02_german_confederation.md` |
| Magdeburg (`places.md#magdeburg`) | `medieval/04_cities_church_feudalism.md` |
| Malmö (`places.md#malmo`) | `nineteenth_century/04_1848_revolutions.md` |
| Ruhr (`places.md#ruhr`) | `twentieth_century/02_weimar_republic.md` |
| Stralsund (`places.md#stralsund`) | `medieval/04_cities_church_feudalism.md` |
| Strasbourg (`places.md#strasbourg`) | `medieval/01_carolingian_world.md` |
| Zabern (`places.md#zabern`) | `nineteenth_century/06_german_empire.md` |
| Berlin Airlift (`terms.md#berlin-airlift`) | `twentieth_century/11_cold_war_germany.md` |
| Christian Social Union (`terms.md#christian-social-union`) | `contemporary/02_modern_political_system.md` |
| Final Solution (`terms.md#final-solution`) | `twentieth_century/06_holocaust_and_persecution.md` |
| Kohlrüben (`terms.md#kohlruben`) | `twentieth_century/01_world_war_one.md` |
| prefect (`terms.md#prefect`) | `nineteenth_century/01_napoleon.md` |
| right to asylum (`terms.md#right-to-asylum`) | `contemporary/01_post_reunification.md` |

## 6. Length limits (`dictionary/README.md`: Short ≤ 18 words, Explanation ≤ 60 words)

None.

## 7. Structural errors

None — all 2,300 entries parse (required fields, ids, kinds, basis, chapter links and ambiguity links are valid).

## 8. README counts

Match the files (437 people, 280 places, 1581 terms).
