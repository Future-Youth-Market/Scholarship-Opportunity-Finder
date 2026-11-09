# FYM Scholarship Opportunity Finder

A student-led scholarship discovery website by Future Youth Market. Built with React, TypeScript, Vite, Tailwind and React Router; static JSON, no backend or accounts.

## Run locally

Use Node 24.14.1 and npm (`.nvmrc`).

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. The dev server is a **local research preview** with an explicit banner. On this workstation, 13 actual entries from Avanthi's XLSM export are imported locally and all are pending review. Unpublished research is ignored by Git, so another clone begins with an empty preview until an authorized maintainer imports the source export. Obtain it through the team's approved private sharing process. Do not commit research files or upload a dev-server bundle.

## Functionality

- Textured butter-yellow homepage inspired by Anna's proposal; branding in `src/config.ts`.
- `/scholarships`: keyword search over name, organization, eligibility and restrictions, deadline or name sorting, URL-persisted controls, result counts and empty states.
- `/scholarships/:id`: full requirements, restrictions, notes, award text, date information and safe official links.
- Upcoming dates sort before past and unknown dates. A future deadline never implies that applications are open. Search is not an eligibility determination.
- `.xlsm`, `.xlsx`, and CSV importer: static ZIP/XML reads only; macros are never executed. No Python or Excel installation required.
- Review decisions are separate from Last Checked and bound to exact content. Production bundles contain only explicitly approved records.

## Commands

| Command                                                             | Purpose                                                                                |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `npm run check`                                                     | Validate public data, strict TypeScript, ESLint, tests and production build            |
| `npm run import:data -- "path/to/export.xlsm"`                      | Dry run; ignored validation report and candidate data                                  |
| `npm run import:data -- "path/to/export.xlsm" --write`              | Update private local research only when all records validate                           |
| `npm run review:data -- list`                                       | List IDs and current research review states                                            |
| `npm run review:data -- set ID approved "Reviewer" "Decision note"` | Record a human decision; flagged records additionally require `--acknowledge-warnings` |
| `npm run generate:data`                                             | Generate public JSON from approved exact content; does not deploy                      |
| `npm run build`                                                     | Validate approval evidence and build production `dist`                                 |
| `npm run preview`                                                   | Serve the production build, **not** unapproved research                                |

All 13 imported entries are pending; `data/reviews.json` and the public dataset are empty. No live data claims have been independently verified by this implementation. No deployment or production-domain change was made. Final brand/design and publication remain subject to Olivia's approval.

## Documentation

[Architecture](docs/ARCHITECTURE.md) · [Design](docs/DESIGN.md) · [Schema](docs/DATA-SCHEMA.md) · [Maintenance](docs/DATA-MAINTENANCE.md) · [Source findings](docs/IMPORT-FINDINGS.md) · [Deployment](docs/DEPLOYMENT.md) · [Team dependencies](docs/TEAM-DEPENDENCIES.md) · [Open decisions](docs/OPEN-DECISIONS.md) · [Roadmap](docs/ROADMAP.md) · [Verification](docs/VERIFICATION.md)

Budget: $0. No paid APIs, trackers, subscription libraries or backend services. Dependency licenses do not set a license for FYM's own work; project license remains an organizational decision.
