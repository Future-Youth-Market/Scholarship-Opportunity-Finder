# Anna-inspired design implementation

Reviewed Anna Gonzalez's `Scholarship opportunity finder.pdf`, especially complete pages 3–7, both rendered and as text/font metadata. The preferred page 7 homepage is textured yellow with a large centered navy headline and simple pill actions. Page 5 uses rounded outlined cards, strong titles, deadline emphasis and readable eligibility copy. These directions inform all three page types.

## Tokens and provenance

| Token         | Value   | Status/source                                                                           |
| ------------- | ------- | --------------------------------------------------------------------------------------- |
| Butter yellow | #FBE29D | Explicit on page 3 and in project request                                               |
| Body burgundy | #43302E | Explicit on page 3 and in request                                                       |
| Navy          | #203D4D | Sampled approximation of PDF's main title color; provisional pending Anna's exact value |
| Blush         | #E36888 | Page 3 labeled palette; accents only                                                    |
| Tangerine     | #F08C21 | Page 3 labeled palette; accents only                                                    |
| Paper         | #FFFAF0 | Provisional readable neutral surface                                                    |
| Line          | #78695B | Provisional functional neutral border                                                   |
| Placeholder   | #685C56 | Provisional accessible functional neutral                                               |

Colors are centralized as CSS variables. Bright accents are not used for small body text. Textured hero uses original procedural SVG noise in CSS, not a copied screenshot or promotional image. Cards work without artwork and use one consistent layout.

## Typography

PDF font metadata identifies Extenda-40Hecto and OpenSauceOne (Regular/Bold). Embedded PDF fonts are not extracted or redistributed. Extenda requires a separate webfont license; none was supplied, so it is not redistributed. Open Sauce One is available under SIL OFL 1.1. Barlow Condensed 800 is the provisional open-source display alternative; Open Sauce One 400/500/700 is the exact readable body font. Both are self-hosted through Fontsource under SIL Open Font License 1.1. References: https://fontsource.org/fonts/barlow-condensed/about and https://fontsource.org/fonts/open-sauce-one/about . Keep their license notices with any redistribution. Condensed type is confined to headings and brief display text, never long requirements.

## Deliberate adaptations

- Default brand remains Scholarship Opportunity Finder; proposed names/logos are not adopted.
- “Your future, curated.” is provisional copy describing an editorial directory, with no personalized matching claim.
- Browse Scholarships and How It Works replace account/matching actions. No Sign Up.
- Real research cards, full detail routes, search and sorting replace static mockup content.
- Pink deadline accents remain decorative; actual deadline text uses dark readable colors.
- Full notes and requirements use safe text and paragraph/list formatting, not screenshots.

Home, directory and details share typography, butter surfaces, outlined rounded components and navy actions. Design direction is implemented, but this is not a pixel-identical reproduction or final approved identity. Anna/Olivia must confirm fonts/assets/colors and homepage direction; Shreevidya must confirm usability/navigation.

Font license notices are included with deployed assets under `public/font-licenses/`. Extenda license reference: https://www.zetafonts.com/extenda .
