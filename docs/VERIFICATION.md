# Phase 0 verification — October 24, 2026

- Audit: existing repository held only README and .gitignore; no earlier application.
- Node 24.14.1 / npm 11.11.0. `npm ci` succeeded from the lockfile. An initial retry was needed because a running Vite process held a Windows native module; stopping it resolved the lock.
- `npm run check` passed: public-data validation (0 records), strict TypeScript application/tooling checks, ESLint, 7 Vitest tests across 2 files, and Vite production build.
- Tests cover name/provider search, empty input/no match, initial semantic page rendering, missing deadline labels, URL/date validation, pending/future/stale/expired records, duplicate rejection, CSV quoting/multiline text, explicit writes and preservation on rejected imports.
- `npm audit`: 0 known vulnerabilities at verification time.
- Headless installed Edge rendered at 375×850 and 1280×850. Document widths matched viewport widths (no horizontal overflow). Mobile and desktop screenshots were inspected. These local screenshots and the one-off browser script are ignored under reports/ and are not production assets.
- Public dataset is empty; fixtures are synthetic with reserved example.invalid URLs and remain in test files excluded from the application import graph.
- Repository diff and credential-pattern review performed before commit. No environment files, credentials, raw research CSVs, reports or dependency folders are intended for commit.
- No Netlify connection, production publication, DNS change or team messages were performed.

This is foundational verification, not final accessibility certification or full device coverage. Manual keyboard/screen-reader acceptance, real provider link checks, approved designs, verified data, and launch review remain scheduled work. Production assets require rebuilding when content changes; build validation holds expired/stale entries rather than publishing them automatically.
