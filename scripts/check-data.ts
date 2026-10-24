import { readFileSync } from "node:fs";
import { validateRecords } from "../src/data/schema.ts";
const rows: unknown = JSON.parse(
  readFileSync("src/data/scholarships.json", "utf8"),
);
if (
  !Array.isArray(rows) ||
  rows.some((r) => !r || typeof r !== "object" || Array.isArray(r))
)
  throw new Error("Dataset must be an array of records");
const result = validateRecords(
  rows.map((r) => ({ ...r, verificationStatus: "verified" })),
);
if (result.reports.some((r) => r.errors.length))
  throw new Error(JSON.stringify(result.reports, null, 2));
console.log(
  `Public data valid: ${result.valid.length} records. Official-source verification remains a human responsibility.`,
);
