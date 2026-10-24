# Deployment readiness — no deployment performed

## Local preview
Use Node 24.14.1. Run `npm ci`, `npm run check`, then `npm run preview -- --host 127.0.0.1`. Open the printed localhost URL. This requires no hosting account and is the current default preview.

## Netlify connection, after hosting approval
1. Olivia confirms the intended account, domain arrangement and who may publish. Use the Free plan; do not add billing upgrades, DNS changes, paid services or analytics.
2. An authorized repository owner connects the existing Future-Youth-Market/Scholarship-Opportunity-Finder GitHub repository to Netlify. Grant only necessary repository access; do not change organization permissions without authorization.
3. Verify `netlify.toml`: build `npm run check`, publish `dist`, Node 24.14.1; dependency installation uses the committed lockfile. No secrets/environment variables are needed.
4. Connecting a repository may trigger a production deploy. Until publication is approved, keep work local. Before authorizing any connection/import, verify the current Netlify UI's controls for preventing automatic production publishing; do not assume a new project is private or harmless. Stop if a nonproduction setup cannot be assured.
5. Once authorized, enable PR Deploy Previews for the foundation branch, confirm production remains gated, and review the generated preview URL. Preview links may be publicly reachable: use approved content only. No custom domain is needed for review.
6. Test preview keyboard navigation, narrow-screen layout, search, empty states, source links and the displayed verification dates. Olivia grants final publication approval before the approved branch is published. Never merge into an automatically deploying production branch before that approval.
7. After approval, publish the reviewed commit and check the live URL. Record release SHA and approval. For rollback, use the last approved deploy or reviewed Git revert; inspect data freshness before republishing.

Single-page anchor navigation needs no SPA rewrite. Add routing/fallback only if multiple pages are approved.

## Free-tier operations
Checked October 24, 2026: Netlify lists a Free plan with 300 credits per month and one concurrent build. Traffic and production deployments consume shared usage; previews also generate requests. Recheck https://www.netlify.com/pricing/ and https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/ before connection. Existing accounts may have different legacy terms. Do not assume unlimited bandwidth, deployment frequency, team seats or uptime. Use free reviewer roles where available; do not assume developer collaboration seats are free.

Monitor account usage and notifications; batch approved content updates and avoid unnecessary rebuilds. Free hard limits may interrupt service; agree a response with Olivia rather than purchasing upgrades. Avoid forms, serverless functions, databases and additional metered services. GitHub Actions usage also depends on repository/account plan; no Actions workflow is required or configured for Phase 0. Maintainers must run checks before review/merge and enable available branch protections when authorized.
