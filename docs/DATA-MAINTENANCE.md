# Research updates and content review

Avanthi owns source research; Olivia controls publication approval. Last Checked is not a publication decision. No real record was approved automatically.

## Repeatable update

1. Update the team's Google Sheet. Confirm provider pages, full eligibility, restrictions, amounts, dates and links. Keep private/student information out of export Notes.
2. Export Excel (.xlsx or .xlsm) or CSV. Save privately under ignored `data/incoming/`. Never execute workbook macros. No Excel or Python is required by the importer.
3. Run `npm ci`, then `npm run import:data -- "data/incoming/export.xlsm"`. For a multi-sheet export append `--sheet "Scholarships"`. This is a dry run.
4. Read ignored `reports/validation.txt` and `reports/research.candidate.json`. Fix rejected cells in Sheets, re-export and repeat. Review warnings about incomplete data, unknown dates, currency, link domains and possible mismatches. Structural/read failures also produce a report. No last-known-good data is overwritten on failure.
5. Run the same command with `--write` once the export validates. This replaces **private local research only**. No public file changes. Blank rows are skipped. A header-only export can clear local research, so inspect the report and row count first.
6. Start/restart `npm run dev`. The localhost preview shows all valid imported entries with a prominent preview banner and per-record review labels. Review full detail routes with Olivia and Avanthi. This dev server must not be exposed, tunneled or uploaded to public hosting.
7. Run `npm run review:data -- list` to get IDs and states. An authorized content reviewer records a decision without editing TypeScript:

```sh
npm run review:data -- set RECORD-ID approved "Actual reviewer name" "Source links checked; content approved for the stated cycle"
```

For records with warnings, the command stops and prints them. Resolve the source problem first where appropriate. If an authorized reviewer has deliberately accepted the remaining warnings, rerun with `--acknowledge-warnings`. Never use a made-up reviewer name or approve simply because a Last Checked date exists. To hold a record use `needs-correction` or `pending-review` in place of `approved`, with a reason. Decisions are stored in `data/reviews.json`. No genuine approval has been entered in this implementation.

8. Run `npm run generate:data`. It writes only exact-content approved entries into `src/data/scholarships.json`. With no approved records it refuses to clear an existing dataset unless `--allow-empty` is explicitly supplied. This generates content, not a deployment or publication authorization.
9. Run `npm run check`, then `npm run build` and `npm run preview` to inspect exactly the approved public view. Review additions, changes and removals in the Git diff. Check provider links manually and mobile usability.
10. Submit the public snapshot and review decisions on a feature branch for content/technical review. Never commit raw exports, `data/private`, or reports. Obtain Olivia's publication approval before merging/deploying through the approved hosting arrangement. Follow DEPLOYMENT.md.

## Changes, rejections and rollback

Any content change resets that entry to pending unless its exact hash already has an explicit decision. A previously published snapshot is preserved until deliberate regeneration; it does not silently adopt new research. To remove a previously approved record, mark its matching decision needs-correction/pending, regenerate, inspect the removal and publish the approved correction. If nothing is approved, deliberately use `npm run generate:data -- --allow-empty`. A revoked snapshot fails release validation until corrected.

Imports are all-or-nothing for private replacement; reports can contain valid and rejected candidates for review, but neither a partial candidate nor a failed import overwrites the working datasets. Corrupted review JSON or mismatched content also stops generation before writing. Atomic sibling-file rename preserves the old file on write failure.

Restore a prior approved JSON snapshot and its matching review evidence via reviewed Git revert for rollback. Recheck freshness before redeployment. Keep source exports in the team's agreed private shared location so another maintainer can reproduce a local preview; they are intentionally not in this repository. Suggested maintenance cadence is weekly during launch, then agree an ongoing schedule and reviewer backup with Avanthi/Olivia. Report blockers in Arjun's tracker.
