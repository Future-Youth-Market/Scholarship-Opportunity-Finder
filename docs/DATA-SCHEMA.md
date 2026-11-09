# Research and publication schema

## Source export

The actual workbook's `Scholarships` sheet has these ten columns. The importer accepts their exact names after trimming surrounding whitespace; order is flexible. All columns must be present, though optional cells may be empty. Unknown or duplicate headers are errors. Multi-sheet workbooks require `--sheet "Scholarships"` to avoid an implicit choice.

| Source column    | JSON field                     | Required | Interpretation                                                                                           |
| ---------------- | ------------------------------ | -------- | -------------------------------------------------------------------------------------------------------- |
| Scholarship Name | name                           | Yes      | Source spelling retained; outer/line whitespace trimmed                                                  |
| Organization     | provider                       | Yes      | Source organization                                                                                      |
| Award Amount     | award                          | No       | Plain text; numbers preserved without inferred currency                                                  |
| Deadline         | deadline or deadlineText       | No       | Exact calendar date to YYYY-MM-DD; ambiguous/partial text retained and flagged                           |
| Eligibility      | eligibility                    | No       | Full multiline requirements; missing flagged                                                             |
| Restrictions     | restrictions                   | No       | Full plain text; absence does not mean unrestricted                                                      |
| Official Link    | informationUrl                 | Yes      | Absolute HTTPS URL, no credentials/whitespace                                                            |
| Application Link | applicationUrl                 | No       | Same URL validation; missing link displays unavailable message                                           |
| Last Checked     | lastChecked or lastCheckedText | No       | Research activity date, not publication approval; missing/imprecise flagged, future exact dates rejected |
| Notes            | notes                          | No       | Public-safe text; research notes become visible if approved                                              |

Blank optional fields are omitted. Leading/trailing whitespace and per-line indentation are trimmed, CRLF becomes LF, but original words, amounts, list items, restrictions and notes are retained. Known bullets are rendered semantically. Dates use the workbook's 1900 or 1904 system; time-bearing values remain unparsed text rather than silently dropping time. CSV dates must be YYYY-MM-DD for exact interpretation. Invalid or uncertain date text remains visible as unconfirmed and never ranks as upcoming.

`id` is a URL-safe name slug plus a hash of normalized name/provider. Reordering rows or changing notes/deadlines preserves the ID. Correcting a name/provider can change the ID; review the old record's removal. Duplicate name/provider pairs reject every copy. Shared application URLs generate review warnings rather than automatic deduplication.

## Private research envelope

Each record has `scholarship`, `contentHash` (SHA-256 over sorted normalized fields), `sourceRow`, `warnings`, and `errors`. This JSON is ignored by Git and available only to local development. Warnings require human attention; records with errors cannot replace the research dataset. All new/changed entries default to pending-review.

## Separate review decisions

`data/reviews.json` stores `id`, `contentHash`, `status` (`pending-review`, `approved`, or `needs-correction`), `reviewer`, `reviewedAt` (YYYY-MM-DD), and `note`. Approval requires a named human reviewer and decision note. CLI approval of flagged records requires explicit warning acknowledgment. These statuses describe FYM content review, never the provider's application status. This file does not provide authentication; repository access/review controls govern authority.

## Public listing

`src/data/scholarships.json` contains normalized scholarship fields plus `reviewStatus: approved`, and only records with matching approved decisions. Missing information gets truthful labels. Past deadlines remain labeled as past; unknown deadlines sort last. No listing is labeled open based on date alone. The previous provisional 90-day hard hold is replaced with a research warning; publication still requires human approval.
