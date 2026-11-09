# Architecture

## Audit and retained work

Phase 0 supplied React/TypeScript/Vite/Tailwind, ESLint, Vitest, an empty public dataset, a CSV validation foundation and project documentation. The Week 2 increment extends those components and tests, replacing the provisional verified-status column with the actual ten-column research template and separate review decisions. No imaginary earlier site was migrated.

## Structure

- `src/config.ts`: configurable name and organization; no proposed name treated as approved.
- `src/components`: layout, cards, search control, empty state, safe paragraph/bullet rendering.
- `src/pages`: homepage, directory, scholarship details and not-found route.
- `src/lib/search.ts`: pure keyword search and sorting, date display.
- `src/data/schema.ts`: typed scholarship, research envelope, listing and review decision; shared field validation.
- `scripts/lib/importer.ts`: CSV/XLSX/XLSM reading, normalization, source-quality flags and stable IDs.
- `scripts/lib/review.ts`: content-bound review, production validation and record selection.
- `scripts/lib/data-plugin.ts`: virtual Vite data module; never imports private data into production.
- `data/private/research.json`: ignored unpublished research, generated locally; never in `public/` or `src/`.
- `data/reviews.json`: human review metadata, committed only after authorization and review.
- `src/data/scholarships.json`: approved publication snapshot; currently empty.
- `reports/`: ignored reports and candidate data; never deployed.

## Data boundary

Google Sheet → private export → validation report → explicit private import → human content review → exact-content decision → explicit public-data generation → checks/PR → publication approval → production build.

`npm run dev` reads local research through a virtual module and labels every page as a local research preview. It binds to 127.0.0.1. Private filesystem routes are denied. Do not tunnel or expose it publicly. `npm run build`, direct Vite builds, and Netlify Deploy Previews read only the approved snapshot and validate its content hashes against decisions. Even a build with mode=development uses approved data because the boundary uses the Vite command, not MODE/DEV flags. `npm run preview` serves that production build.

A content change invalidates approval. The old published snapshot remains a known-good version until generation replaces it; a rejected import never mutates it. Revoking a matching review decision makes that old snapshot fail release validation until regenerated. Content hashes are change-detection evidence, not digital signatures or authentication; authorized reviewers and Git review enforce the human process.

## Parsing and limitations

`read-excel-file` reads zipped OOXML, including this XLSM, without Office or VBA execution. `fflate` inspects XML and rejects formulas instead of trusting cached formula output; no external links are fetched. A 10 MB compressed / 50 MB expanded import limit avoids accidental oversized workbooks. CSV parsing handles quoted commas and multiline text. Extra/duplicate columns, duplicates, invalid required fields or unsafe URLs block private replacement. Failed operations leave old private and public data intact. Files are written to a sibling temporary file and renamed into place.

Dates use real YYYY-MM-DD when exact. Workbook date styles and 1900/1904 epochs are interpreted by the reader. Localized or partial date text is retained, flagged and not sorted as a known date. Numeric award text never gains an inferred currency. Notes/restrictions remain plain text. Styling and known list markers are interpreted, HTML is never injected. External URLs require HTTPS with no credentials/whitespace; syntax cannot establish official ownership or live accuracy.

## Dependencies and cost

New dependencies were checked against official docs and npm metadata November 9: React Router 8.5.1 (MIT, Node >=22.22; Node 24.14 is compatible), read-excel-file 9.3.14 (MIT, Node >=18), fflate (MIT), and self-hosted Fontsource OFL fonts. No server/backend, Python runtime, accounts, paid API or remote font requests. Sources: https://reactrouter.com/start/declarative/installation and https://github.com/catamphetamine/read-excel-file .

An existing lint-tool minimatch advisory was resolved with a tested `minimatch ^11.0.1` override; review/remove that override when upstream lint dependencies adopt the patch. Tests and lint pass with the override. Recheck npm advisories and compatibility before updates; keep the lockfile. Build-time data remains appropriate for 13 records. There is no asynchronous loading, so no artificial loading spinner; local data errors and missing routes have explicit states. Final WCAG acceptance and researcher/provider verification remain human work.
