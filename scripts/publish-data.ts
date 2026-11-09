import type { ResearchRecord, ReviewDecision } from "../src/data/schema.ts";
import { readJson, atomicWrite } from "./lib/files.ts";
import { selectListings } from "./lib/review.ts";
if (process.argv.slice(2).some((flag) => flag !== "--allow-empty"))
  throw new Error("Only --allow-empty is supported");
const records = readJson<ResearchRecord[]>("data/private/research.json");
const decisions = readJson<ReviewDecision[]>("data/reviews.json");
const approved = selectListings(records, decisions);
if (!approved.length && !process.argv.includes("--allow-empty"))
  throw new Error(
    "No approved records. To deliberately clear public data, use --allow-empty. Existing data preserved.",
  );
atomicWrite("src/data/scholarships.json", approved);
console.log(
  `Generated ${approved.length} approved listings. This does not deploy or authorize publication.`,
);
