# Initial research import findings — November 9, 2026

Source: `FYM_Scholarship_Simple_Template.xlsm`, worksheet `Scholarships`, found in the provided workstation's Downloads. SHA-256: `0AEAE4FD18F029CE99022C7844B8CE5AD2C0B31CD2910C20681E45EB1626776B`.

The source contains **13 populated records**, not only the four named in the request. All 13 imported successfully into ignored private local JSON. Blank formatted rows are skipped. All 13 remain **pending-review**; none are approved and the production dataset contains zero listings. The Last Checked dates are research dates only. No source details have been independently live-verified by this implementation; flags below are source-content and URL-path checks, not claims about current program facts.

| Pending record (source spelling)                | Automated/manual source flag                                                                                                     |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| GE-Regan Foundation Scholarship Program         | Source spells Regan; confirm spelling before correction. Retained as supplied.                                                   |
| Taco Bell Live Mas Scholarship                  | Application domain differs from provider domain; verify that the provider authorizes the external application platform.          |
| Jackie Robinson Foundation Scholarship          | No structural flag; human review still needed.                                                                                   |
| Breanna Coleman Memorial Nursing Scholarship    | No structural flag; human review still needed.                                                                                   |
| Appalachian Region Vocational Scholarship       | No structural flag; human review still needed.                                                                                   |
| Technology Addiction Awareness Scholarship      | Numeric award has no explicit currency; retained without a currency symbol.                                                      |
| Optimist International Essay Contest            | No structural flag; human review still needed.                                                                                   |
| Elks Legacy Awards                              | Application path contains MVS while name says Legacy; likely program mismatch to resolve. Numeric award lacks explicit currency. |
| Davidson Fellows Scholarship                    | No structural flag; human review still needed.                                                                                   |
| TheDream.US National Scholarship                | No structural flag; human review still needed.                                                                                   |
| Fisher House Scholarships for Military Children | Numeric award lacks explicit currency; retained without inference.                                                               |
| Heroes' Legacy                                  | No structural flag; human review still needed.                                                                                   |
| Connex Foundation Skilled Trades Scholarship    | No structural flag; human review still needed.                                                                                   |

Notes are blank in the supplied populated rows. Their absence is not filled with generated descriptions. Whitespace and Excel date encodings were normalized; detailed requirements/restrictions were retained. Provider availability, citizenship/financial/other criteria, renewals, cycle-specific deadlines, amounts and whether applications are open must be reviewed by Avanthi/Olivia before approval. The importer does not scrape providers, judge a student's eligibility or approve research.

Anna's PDF source SHA-256: `1A04492703296A61A02EBD21D22D5E76CA98DC07F217AD725D5257A054ED3CB7`. See DESIGN.md for visual/typographic interpretation. Source files remain outside public assets and Git.
