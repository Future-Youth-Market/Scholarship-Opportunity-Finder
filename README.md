# FYM Scholarship Opportunity Finder
Student-led scholarship discovery platform built by Future Youth Market.

Phase 0 foundation prepared October 24, 2026 under explicit authorization. Official project timeline: October 26–December 6. This is not an official Week 1 Technical Lead assignment.

## Quick start
Use Node 24.14.1 (see `.nvmrc`) and npm. Run `npm ci`, then `npm run dev`. Open the local URL printed by Vite.

- `npm run check`: public data validation, TypeScript, ESLint, Vitest, production build.
- `npm run build`: compile to `dist`.
- `npm run preview`: serve the build locally.
- `npm run import:data -- path/to/export.csv`: validate and produce ignored report/candidate files.
- `npm run import:data -- path/to/export.csv --write`: explicitly replace public data only if every record passes.

React, TypeScript, Vite, Tailwind; local JSON; no accounts, backend, API keys, router, analytics, or paid dependencies. Installed versions are locked in package-lock.json. Run `npm ci` rather than recreating the lockfile.

The responsive neutral shell includes accessible navigation, search by scholarship/provider, typed cards, and empty states. Public data is intentionally empty. Final filters, detail pages, branding, research content, and publication await team input. No production deployment has been made.

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Team dependencies](docs/TEAM-DEPENDENCIES.md)
- [Open decisions](docs/OPEN-DECISIONS.md)
- [Data schema](docs/DATA-SCHEMA.md)
- [Data maintenance](docs/DATA-MAINTENANCE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Roadmap](docs/ROADMAP.md)
- [Verification](docs/VERIFICATION.md)

No application license has been selected on behalf of FYM. Dependency licenses do not decide the license for FYM's own work.
