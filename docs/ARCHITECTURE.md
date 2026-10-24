# Architecture

## Audit
The supplied workspace was empty and not a Git checkout. The confirmed GitHub repository, Future-Youth-Market/Scholarship-Opportunity-Finder, contained only README.md and .gitignore at 34e23e9. No earlier website exists. The foundation branch retains that history and existing ignore rules.

## Structure and flow
`src/components` contains presentation controls and layout; `src/App.tsx` composes the single page. `src/lib/search.ts` contains pure keyword matching. `src/data/schema.ts` defines the model and shared validation. `src/data/scholarships.json` is the only public content source. `scripts` holds local import/build checks; `data` holds a header-only CSV template; `src/test` holds explicitly synthetic fixtures.

Research Google Sheet → local CSV → validation report and candidate JSON → human review → explicit import → reviewed Git commit → approved deployment. No direct Sheets connection or scraping. CSV parser supports quoted commas, escaped quotes, BOM and multiline text. Input values are preserved; blank optional cells are omitted. Extra columns and duplicate headers are errors. No automatic trimming, inferred dates, or currency conversions.

Build-time JSON is a provisional default appropriate to a small initial dataset. No asynchronous data loading means no artificial loading state. A single page with anchor navigation needs no React Router or SPA fallback. React escapes text; URLs are restricted to HTTPS without embedded credentials. URL syntax cannot prove official ownership, safety, or availability: researchers must open and verify each link.

## Stack and cost
React 19, TypeScript 6, Vite 8, Tailwind 4, Vitest 5 and ESLint 10 were installed and exercised together on Node 24.14.1. The official Vite scaffold selected these current versions. npm metadata checked October 24 showed recent releases and compatible Node/React requirements. Main dependencies use MIT; TypeScript uses Apache-2.0. Full resolved dependency versions are in package-lock.json. npm reported no known vulnerabilities at installation; this is a point-in-time result, not a guarantee.

Tailwind uses its official Vite plugin: https://tailwindcss.com/docs/installation/using-vite . Framework support: https://vite.dev/guide/ . Recheck dependency maintenance, engines, peer dependencies, licenses and `npm audit` before upgrades; verify changes with `npm run check`. No paid dependency or API is required. GitHub and Netlify have plan limits; see deployment guide. Do not add a database or authentication for V1.

Provisional safety holds reject past deadlines and verification older than 90 days. Avanthi and Olivia must approve or replace this policy. Unknown deadlines remain unknown and are never ranked as upcoming. Runtime data is compiled from validated JSON; malformed JSON/build validation stops release rather than displaying invented fallback records.
