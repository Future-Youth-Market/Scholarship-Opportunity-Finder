import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { extname } from "node:path";
import { parse } from "csv-parse/sync";
import readExcelFile from "read-excel-file/node";
import { unzipSync, strFromU8 } from "fflate";
import {
  isDate,
  validUrl,
  validateScholarship,
} from "../../src/data/schema.ts";
import type { Scholarship, ResearchRecord } from "../../src/data/schema.ts";
export const columns = [
  "Scholarship Name",
  "Organization",
  "Award Amount",
  "Deadline",
  "Eligibility",
  "Restrictions",
  "Official Link",
  "Application Link",
  "Last Checked",
  "Notes",
];
export function clean(value: unknown): string {
  return value == null
    ? ""
    : String(value)
        .replace(/\r\n?/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim();
}
export function contentHash(s: Scholarship): string {
  return createHash("sha256")
    .update(
      JSON.stringify(
        Object.fromEntries(
          Object.entries(s).sort(([a], [b]) => a.localeCompare(b)),
        ),
      ),
    )
    .digest("hex");
}
export function stableId(name: string, provider: string): string {
  const identity = `${name.toLowerCase()}|${provider.toLowerCase()}`;
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70)
    .replace(/-$/, "");
  return `${slug || "scholarship"}-${createHash("sha256").update(identity).digest("hex").slice(0, 10)}`;
}
export function normalizeDate(value: unknown): {
  date?: string;
  text?: string;
} {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return { text: "Invalid Excel date" };
    // The reader interprets the workbook's date system and number formats in UTC.
    if (value.getUTCHours() || value.getUTCMinutes() || value.getUTCSeconds())
      return { text: value.toISOString() };
    return { date: value.toISOString().slice(0, 10) };
  }
  const text = clean(value);
  if (!text) return {};
  // Accept only unambiguous exact calendar dates; partial/localized dates remain source text.
  if (isDate(text)) return { date: text };
  return { text };
}
export function normalizeRows(
  rows: unknown[][],
  today = new Date().toISOString().slice(0, 10),
): ResearchRecord[] {
  if (!rows.length) throw new Error("Input has no header row");
  const headers = rows[0].map(clean);
  if (new Set(headers).size !== headers.length)
    throw new Error("Duplicate spreadsheet headers");
  for (const key of columns)
    if (!headers.includes(key)) throw new Error(`Missing column: ${key}`);
  for (const key of headers)
    if (!columns.includes(key)) throw new Error(`Unknown column: ${key}`);
  const records: ResearchRecord[] = [];
  rows.slice(1).forEach((row, index) => {
    if (!row.some((value) => clean(value))) return;
    const get = (key: string) => row[headers.indexOf(key)];
    const deadline = normalizeDate(get("Deadline")),
      checked = normalizeDate(get("Last Checked"));
    const name = clean(get("Scholarship Name")),
      provider = clean(get("Organization"));
    const s: Scholarship = {
      id: stableId(name, provider),
      name,
      provider,
      informationUrl: clean(get("Official Link")),
    };
    for (const [key, column] of [
      ["award", "Award Amount"],
      ["eligibility", "Eligibility"],
      ["restrictions", "Restrictions"],
      ["applicationUrl", "Application Link"],
      ["notes", "Notes"],
    ] as const) {
      const value = clean(get(column));
      if (value) s[key] = value;
    }
    if (deadline.date) s.deadline = deadline.date;
    if (deadline.text) s.deadlineText = deadline.text;
    if (checked.date) s.lastChecked = checked.date;
    if (checked.text) s.lastCheckedText = checked.text;
    const errors = validateScholarship(s),
      warnings: string[] = [];
    if (
      row.length > headers.length &&
      row.slice(headers.length).some((v) => clean(v))
    )
      errors.push("Unexpected extra cells");
    for (const key of [
      "award",
      "eligibility",
      "deadline",
      "lastChecked",
    ] as const)
      if (!s[key])
        warnings.push(
          `${key} is missing or imprecise; confirm with the provider`,
        );
    if (s.deadlineText)
      warnings.push(`Unparsed deadline preserved: ${s.deadlineText}`);
    if (s.lastCheckedText)
      warnings.push(`Unparsed Last Checked preserved: ${s.lastCheckedText}`);
    if (s.lastChecked && s.lastChecked > today)
      errors.push("Last Checked is in the future");
    if (s.deadline && s.deadline < today)
      warnings.push(
        "Deadline is in the past; do not imply applications are open",
      );
    if (
      s.lastChecked &&
      (Date.parse(today) - Date.parse(s.lastChecked)) / 86400000 > 90
    )
      warnings.push("Last Checked is over 90 days old; research review needed");
    if (
      typeof get("Award Amount") === "number" ||
      /^\d+(\.\d+)?$/.test(s.award ?? "")
    )
      warnings.push(
        "Numeric award has no explicit currency; preserved without adding a currency symbol",
      );
    if (s.name.includes("Regan"))
      warnings.push(
        "Name contains Regan; confirm spelling against the source (not automatically changed)",
      );
    if (
      validUrl(s.informationUrl) &&
      s.applicationUrl &&
      validUrl(s.applicationUrl)
    ) {
      const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");
      if (host(s.informationUrl) !== host(s.applicationUrl))
        warnings.push(
          "Application uses a different domain; confirm provider authorization",
        );
      if (
        /legacy/i.test(s.name) &&
        /\/mvs(?:\.|\/|$)/i.test(new URL(s.applicationUrl).pathname)
      )
        warnings.push(
          "Possible program mismatch: Legacy name links to an MVS application path",
        );
    }
    records.push({
      scholarship: s,
      contentHash: contentHash(s),
      sourceRow: index + 2,
      warnings,
      errors,
    });
  });
  const counts = new Map<string, number>();
  for (const r of records)
    counts.set(r.scholarship.id, (counts.get(r.scholarship.id) ?? 0) + 1);
  for (const r of records)
    if ((counts.get(r.scholarship.id) ?? 0) > 1)
      r.errors.push("Duplicate name/provider pair; resolve every copy");
  const urls = new Map<string, number>();
  for (const r of records)
    if (r.scholarship.applicationUrl)
      urls.set(
        r.scholarship.applicationUrl,
        (urls.get(r.scholarship.applicationUrl) ?? 0) + 1,
      );
  for (const r of records)
    if (
      r.scholarship.applicationUrl &&
      (urls.get(r.scholarship.applicationUrl) ?? 0) > 1
    )
      r.warnings.push(
        "Application URL is shared by multiple records; confirm distinct programs",
      );
  return records;
}
export async function readSource(
  path: string,
  sheetName?: string,
): Promise<unknown[][]> {
  const extension = extname(path).toLowerCase();
  const bytes = readFileSync(path);
  if (bytes.length > 10 * 1024 * 1024)
    throw new Error("Export exceeds the 10 MB import limit");
  if (extension === ".csv")
    return parse(bytes, {
      bom: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });
  if (![".xlsx", ".xlsm"].includes(extension))
    throw new Error("Supported inputs: .xlsx, .xlsm, .csv");
  // Read ZIP/XML only. No Office process, VBA engine, formula evaluation or external-link fetching.
  let expanded = 0;
  const files = unzipSync(bytes, {
    filter(entry) {
      expanded += entry.originalSize;
      if (expanded > 50 * 1024 * 1024)
        throw new Error("Workbook expands beyond the 50 MB safety limit");
      return true;
    },
  });
  for (const [name, data] of Object.entries(files))
    if (
      /^xl\/worksheets\/.*\.xml$/.test(name) &&
      /<(?:\w+:)?f(?:\s|\/?>)/.test(strFromU8(data))
    )
      throw new Error(
        "Workbook contains formulas. Export static values for review; cached results are not trusted.",
      );
  const sheets = await readExcelFile(bytes);
  const sheet = sheetName
    ? sheets.find((s) => s.sheet === sheetName)
    : sheets.length === 1
      ? sheets[0]
      : undefined;
  if (!sheet)
    throw new Error(
      `Choose one worksheet with --sheet. Available: ${sheets.map((s) => s.sheet).join(", ")}`,
    );
  return sheet.data;
}
