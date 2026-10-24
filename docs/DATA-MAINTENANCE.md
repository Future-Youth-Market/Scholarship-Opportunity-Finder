# Maintaining listings without editing application code

Avanthi owns content verification. Google Sheets is the research source of truth; its final template is pending. Keep internal research and unverified rows out of the export intended for publication. No automatic scraping or publishing is configured.

1. Start with the header-only `data/scholarships-template.csv` in Sheets. Confirm final columns with Avanthi before widespread use.
2. Verify each official provider and application page manually. Enter only supported claims; leave unknown optional information empty. Set lastVerified to the actual verification date and verificationStatus to `verified` only after verification.
3. Export the relevant sheet as CSV locally into `data/incoming/` (ignored). Never commit raw research, credentials, or private notes.
4. Run `npm ci`, then `npm run import:data -- data/incoming/export.csv`. Read `reports/validation.txt` and `reports/scholarships.candidate.json` (both ignored). CSV structural errors stop immediately with a console error. Row numbers refer to spreadsheet records starting at row 2; embedded newlines can occupy multiple physical lines.
5. Resolve every rejection in the Sheet, re-export, and re-run. Review warnings about missing information with Avanthi. Past deadlines, future verification dates and verification older than the provisional 90-day window block imports; unknown deadlines do not become upcoming dates. The policy requires team confirmation.
6. After human approval, run `npm run import:data -- data/incoming/export.csv --write`. With any rejected record this exits nonzero and preserves the existing public dataset. The candidate contains only valid rows for review, but partial publication is deliberately blocked. An empty, valid export can clear the dataset: review deletions before accepting.
7. Run `npm run check`. Review the JSON diff, including deletions and official URLs. Submit a Git branch/PR for technical and content review. This is an update proposal, not publication approval.
8. Obtain designated reviewer approval and Olivia's publication authorization before merging into any deployment-connected production branch. Preview and verify mobile behavior and external links. Follow deployment guide.

Suggested cadence pending approval: weekly checks during development and launch, then an agreed recurring manual content review. Record removals/corrections in PR descriptions and the shared operations tracker. For uncertain content remove it from the verified export pending review. Restore a prior approved dataset through a reviewed revert if an update is wrong. No local script can replace Avanthi's judgment.
