import { mkdirSync, writeFileSync } from "node:fs";
import { readSource, normalizeRows } from "./lib/importer.ts";
import { atomicWrite } from "./lib/files.ts";
const args = process.argv.slice(2),
  input = args.shift();
if (!input)
  throw new Error(
    "Usage: npm run import:data -- export.xlsm [--sheet Scholarships] [--write]",
  );
let write = false,
  sheet: string | undefined;
while (args.length) {
  const flag = args.shift();
  if (flag === "--write") write = true;
  else if (flag === "--sheet" && args.length) sheet = args.shift();
  else throw new Error(`Unknown or incomplete flag: ${flag}`);
}
mkdirSync("reports", { recursive: true });
try {
  const records = normalizeRows(await readSource(input, sheet));
  const rejected = records.filter((r) => r.errors.length).length;
  const report = [
    `Records: ${records.length}. Valid: ${records.length - rejected}. Rejected: ${rejected}. All new/changed records pending review.`,
    ...records.map(
      (r) =>
        `Row ${r.sourceRow}: ${r.scholarship.name}\n  ${r.errors.length ? "REJECTED: " + r.errors.join("; ") : "VALID"}\n  Review: ${r.warnings.join("; ") || "No automated flags; human review still required"}`,
    ),
  ].join("\n");
  writeFileSync("reports/validation.txt", report + "\n");
  atomicWrite("reports/research.candidate.json", records);
  console.log(report);
  if (rejected) process.exitCode = 1;
  else if (write) {
    atomicWrite("data/private/research.json", records);
    console.log(
      "Private research updated. Public data unchanged. Restart dev server to reload.",
    );
  }
} catch (error) {
  writeFileSync(
    "reports/validation.txt",
    `IMPORT FAILED: ${error instanceof Error ? error.message : String(error)}\nPrivate research and published data unchanged.\n`,
  );
  throw error;
}
