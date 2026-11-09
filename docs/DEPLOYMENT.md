# Netlify deployment — approval required

No hosting connection, domain/DNS change or production publication was performed. Local development is the only preview of pending research.

## Local previews

- `npm run dev`: private research preview on 127.0.0.1. Do not expose it on a public host or tunnel. Import private research first for 13 local records; another clone has none until an authorized import.
- `npm run build` followed by `npm run preview`: production-equivalent preview with approved data only. Currently shows a truthful empty directory because no research is approved.

## Netlify Deploy Preview

1. Confirm hosting/account/branch arrangement with Olivia and the existing organization owner. Use the existing GitHub repository; no duplicate repositories.
2. Check the current Netlify Free plan terms and account usage. Use the Free plan only; do not select paid add-ons, seats, analytics or billing upgrades.
3. Repository connection/import may trigger an initial production deployment. Do not connect or merge to a production-connected branch without authorization. Arrange production publishing controls with the account owner before connection; if this cannot be assured, stay with local preview.
4. After authorization, configure base as repository root, build as `npm run check`, publish as `dist`, Node 24.14.1. Commit package-lock.json and use npm's lockfile installation. No credentials or environment variables are needed by the application.
5. Enable PR Deploy Previews on the approved feature branch. They use the same approved-only build as production. There is deliberately no environment switch to include pending research in public preview builds. Preview links may be public. Share only approved content and never upload source exports/reports.
6. Inspect `/`, `/scholarships`, a published `/scholarships/:id`, and a refreshed deep link. `netlify.toml` rewrites client routes to index.html. Unknown IDs show a not-found page. Validate provider links and keyboard/mobile behavior.
7. Obtain Olivia's final publication approval before production publish/merge. Record the approved SHA and decision in the shared project process. Verify the production URL after release. No DNS changes are implied.

## Budget and maintenance

Netlify's Free plan is metered; do not assume unlimited traffic, deployment usage, preview requests or team seats. The Phase 0 check recorded 300 monthly credits/one concurrent build; recheck https://www.netlify.com/pricing/ and account-specific terms before connecting. Existing/legacy accounts can differ. Do not enable paid capacity or auto-recharge. Monitor usage notifications, batch reviewed updates and agree a response if limits interrupt availability. No forms, functions, database or third-party tracking are required.

Production builds validate approved snapshots and matching content hashes even when the private research dataset is absent on Netlify. Only `dist` is deployed, not the repository or ignored local files. Deploy Previews are not a substitute for content approval. Roll back using a previously approved deploy or a reviewed revert of the public JSON **and** its matching review evidence; recheck content freshness.
