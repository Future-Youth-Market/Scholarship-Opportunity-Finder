import type {
  ResearchRecord,
  ReviewDecision,
  ReviewStatus,
} from "../src/data/schema.ts";
import { readJson, atomicWrite } from "./lib/files.ts";
import {
  selectListings,
  validateResearch,
  validateDecisions,
} from "./lib/review.ts";
const [action, ...args] = process.argv.slice(2);
const records = readJson<ResearchRecord[]>("data/private/research.json", []),
  decisions = readJson<ReviewDecision[]>("data/reviews.json", []);
validateResearch(records);
validateDecisions(decisions);
if (action === "list") {
  for (const s of selectListings(records, decisions, true))
    console.log(`${s.id} | ${s.reviewStatus} | ${s.name}`);
} else if (action === "set") {
  const [id, status, reviewer, note, ...flags] = args;
  if (
    !id ||
    !["approved", "pending-review", "needs-correction"].includes(status) ||
    !reviewer?.trim() ||
    !note?.trim() ||
    flags.some((f) => f !== "--acknowledge-warnings")
  )
    throw new Error(
      'Usage: npm run review:data -- set ID approved|pending-review|needs-correction "Reviewer" "Decision note" [--acknowledge-warnings]',
    );
  const record = records.find((r) => r.scholarship.id === id);
  if (!record) throw new Error("Unknown scholarship ID");
  if (
    status === "approved" &&
    record.warnings.length &&
    !flags.includes("--acknowledge-warnings")
  )
    throw new Error(
      "Review these flags before approval: " + record.warnings.join("; "),
    );
  const next = decisions.filter(
    (d) => !(d.id === id && d.contentHash === record.contentHash),
  );
  next.push({
    id,
    contentHash: record.contentHash,
    status: status as ReviewStatus,
    reviewer,
    reviewedAt: new Date().toISOString().slice(0, 10),
    note,
  });
  validateDecisions(next);
  atomicWrite("data/reviews.json", next);
  console.log("Review decision saved. Regenerate public data separately.");
} else throw new Error("Use review:data -- list or review:data -- set ...");
