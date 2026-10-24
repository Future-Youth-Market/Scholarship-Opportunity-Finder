# Provisional scholarship schema

Avanthi must confirm column names before research entry begins. CSV headers are case-sensitive. Use `data/scholarships-template.csv`. All values are plain text, not formulas. Empty optional cells become absent JSON properties. Required text must contain non-whitespace content. Text is otherwise preserved exactly.

| Field              | Required      | Format and missing behavior                                                                                    |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------- |
| id                 | Yes           | Stable unique text ID; do not recycle                                                                          |
| name               | Yes           | Scholarship name                                                                                               |
| provider           | Yes           | Official provider name                                                                                         |
| award              | No            | Exact verified description including currency if known; unavailable label when empty                           |
| deadline           | No            | Real YYYY-MM-DD only; unknown label when empty; partial/rolling dates need research review, never invent a day |
| eligibility        | No            | Verified plain-language description; unavailable label when empty                                              |
| restrictions       | No            | Geographic/citizenship restrictions; omitted if unknown, not interpreted as unrestricted                       |
| informationUrl     | Yes           | Absolute HTTPS official provider information URL without credentials                                           |
| applicationUrl     | No            | HTTPS official application link if different; omitted when absent                                              |
| lastVerified       | Yes           | Real YYYY-MM-DD; cannot be future; displayed unchanged                                                         |
| notes              | No            | Public-safe content only; displayed if present                                                                 |
| categories         | No            | Provisional plain text; not a filter system                                                                    |
| verificationStatus | CSV only, yes | Exact `verified` after human verification; other values rejected; not emitted to public JSON                   |

Duplicate IDs and case-insensitive scholarship/provider pairs reject all copies. Different legitimate cycles with the same name need research resolution under this provisional schema. Past deadlines and verification older than 90 days are held. Missing award, eligibility, or deadline generates review warnings but can be accepted after human review. A URL parser does not verify ownership, link health, or content accuracy. Optional notes must never include student/private data.
