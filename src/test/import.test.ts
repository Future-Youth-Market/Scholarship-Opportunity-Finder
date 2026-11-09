/// <reference types="node" />
// @vitest-environment node
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { expect, it } from "vitest";
import { zipSync, strToU8 } from "fflate";
import { build } from "vite";
import {
  columns,
  normalizeRows,
  normalizeDate,
  contentHash,
  readSource,
} from "../../scripts/lib/importer";
import { selectListings } from "../../scripts/lib/review";
import { scholarshipDataPlugin } from "../../scripts/lib/data-plugin";
import type { ReviewDecision } from "../data/schema";
const testRoot = resolve("reports");
mkdirSync(testRoot, { recursive: true });
const row = [
  "SYNTHETIC Test Award",
  "SYNTHETIC Provider",
  "1000",
  new Date("2027-01-01T00:00:00Z"),
  " Nursing students\n- First-generation ",
  "US schools",
  "https://example.invalid",
  "https://example.invalid/apply",
  new Date("2026-11-07T00:00:00Z"),
  " Detailed\nnotes ",
];
const records = () => normalizeRows([columns, row], "2026-11-09");
function fixture(
  path: string,
  serial: number,
  epoch1904 = false,
  formula = false,
) {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cell = (value: string, i: number, r: number) =>
    `<c r="${String.fromCharCode(65 + i)}${r}" t="inlineStr"><is><t>${esc(value)}</t></is></c>`;
  const cells = row
    .map((v, i) =>
      i === 3
        ? `<c r="D2" s="1">${formula ? "<f>1+1</f>" : ""}<v>${serial}</v></c>`
        : cell(
            v instanceof Date ? v.toISOString().slice(0, 10) : String(v),
            i,
            2,
          ),
    )
    .join("");
  const files = {
    "[Content_Types].xml":
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>',
    "xl/workbook.xml": `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><workbookPr date1904="${epoch1904 ? 1 : 0}"/><sheets><sheet name="Scholarships" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels":
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
    "xl/styles.xml":
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cellXfs count="2"><xf numFmtId="0"/><xf numFmtId="14" applyNumberFormat="1"/></cellXfs></styleSheet>',
    "xl/worksheets/sheet1.xml": `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1">${columns.map((v, i) => cell(v, i, 1)).join("")}</row><row r="2">${cells}</row></sheetData></worksheet>`,
    "xl/vbaProject.bin": "SYNTHETIC VBA SENTINEL — NEVER EXECUTE",
  };
  writeFileSync(
    path,
    zipSync(
      Object.fromEntries(
        Object.entries(files).map(([key, value]) => [key, strToU8(value)]),
      ),
    ),
  );
}
it("normalizes whitespace, exact Excel dates, multiline text and stable IDs", () => {
  const [r] = records();
  expect(r.scholarship.deadline).toBe("2027-01-01");
  expect(r.scholarship.eligibility).toBe(
    "Nursing students\n- First-generation",
  );
  expect(r.scholarship.notes).toBe("Detailed\nnotes");
  expect(r.scholarship.award).toBe("1000");
  expect(r.warnings.join(" ")).toContain("currency");
  expect(r.contentHash).toBe(contentHash(r.scholarship));
  const moved = normalizeRows([columns, [], row]);
  expect(moved[0].scholarship.id).toBe(r.scholarship.id);
});
it("preserves partial and unknown dates instead of inventing precision", () => {
  expect(normalizeDate("January 2027")).toEqual({ text: "January 2027" });
  expect(normalizeDate("01/02/2027")).toEqual({ text: "01/02/2027" });
  expect(normalizeDate("2026-02-30")).toEqual({ text: "2026-02-30" });
  expect(normalizeDate(null)).toEqual({});
});
it("reports missing fields, unsafe links, duplicates, and missing optional values", () => {
  const missing = [...row];
  missing[0] = "";
  missing[6] = "javascript:alert(1)";
  expect(normalizeRows([columns, missing])[0].errors.length).toBeGreaterThan(1);
  expect(
    normalizeRows([columns, row, row]).every((r) =>
      r.errors.some((e) => e.includes("Duplicate")),
    ),
  ).toBe(true);
  const optional = [...row];
  optional[2] = "";
  optional[3] = "";
  optional[8] = "";
  expect(normalizeRows([columns, optional])[0].warnings.join(" ")).toContain(
    "lastChecked",
  );
});
it("defaults to pending, excludes unapproved records and invalidates changed-content approvals", () => {
  const data = records(),
    r = data[0];
  expect(selectListings(data, [], false)).toEqual([]);
  expect(selectListings(data, [], true)[0].reviewStatus).toBe("pending-review");
  const decision: ReviewDecision = {
    id: r.scholarship.id,
    contentHash: r.contentHash,
    status: "approved",
    reviewer: "SYNTHETIC reviewer",
    reviewedAt: "2026-11-09",
    note: "Synthetic test only",
  };
  expect(selectListings(data, [decision])).toHaveLength(1);
  expect(
    selectListings(data, [{ ...decision, status: "needs-correction" }]),
  ).toEqual([]);
  r.scholarship.notes = "Changed";
  r.contentHash = contentHash(r.scholarship);
  expect(selectListings(data, [decision])).toEqual([]);
});
it("parses XLSX/XLSM date systems and rejects formulas without executing VBA", async () => {
  const temp = mkdtempSync(join(testRoot, "fym-xlsx-"));
  try {
    for (const extension of ["xlsx", "xlsm"]) {
      const path = join(temp, `test.${extension}`);
      fixture(path, 46388);
      const data = await readSource(path);
      expect(normalizeRows(data)[0].scholarship.deadline).toBe("2027-01-01");
      fixture(path, 46388 - 1462, true);
      expect(
        normalizeRows(await readSource(path))[0].scholarship.deadline,
      ).toBe("2027-01-01");
      fixture(path, 46388, false, true);
      await expect(readSource(path)).rejects.toThrow("formulas");
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
it("CSV CLI writes private research only and preserves good datasets on failures", () => {
  const temp = mkdtempSync(join(testRoot, "fym-import-"));
  try {
    mkdirSync(join(temp, "src/data"), { recursive: true });
    const target = join(temp, "src/data/scholarships.json");
    writeFileSync(target, "[]\n");
    const csv = join(temp, "test.csv"),
      script = resolve("scripts/import-scholarships.ts");
    const quote = (v: unknown) =>
      '"' +
      String(v instanceof Date ? v.toISOString().slice(0, 10) : v).replace(
        /"/g,
        '""',
      ) +
      '"';
    writeFileSync(
      csv,
      columns.map(quote).join(",") + "\n" + row.map(quote).join(",") + "\n",
    );
    execFileSync(process.execPath, [script, csv, "--write"], { cwd: temp });
    expect(readFileSync(target, "utf8")).toBe("[]\n");
    const privatePath = join(temp, "data/private/research.json"),
      previous = readFileSync(privatePath, "utf8");
    expect(JSON.parse(previous)[0].scholarship.notes).toBe("Detailed\nnotes");
    writeFileSync(csv, "id,id\na,b\n");
    expect(
      spawnSync(process.execPath, [script, csv, "--write"], { cwd: temp })
        .status,
    ).toBe(1);
    expect(readFileSync(privatePath, "utf8")).toBe(previous);
    expect(
      readFileSync(join(temp, "reports/validation.txt"), "utf8"),
    ).toContain("IMPORT FAILED");
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
it("a real production bundle never contains private pending research", async () => {
  const temp = mkdtempSync(join(testRoot, "fym-build-"));
  try {
    for (const dir of ["data/private", "src/data"])
      mkdirSync(join(temp, dir), { recursive: true });
    writeFileSync(
      join(temp, "data/private/research.json"),
      JSON.stringify(records()),
    );
    writeFileSync(join(temp, "data/reviews.json"), "[]");
    writeFileSync(join(temp, "src/data/scholarships.json"), "[]");
    writeFileSync(
      join(temp, "index.html"),
      '<script type="module" src="/entry.js"></script>',
    );
    writeFileSync(
      join(temp, "entry.js"),
      'import data,{preview} from "virtual:fym-data"; console.log(data,preview)',
    );
    const output = await build({
      configFile: false,
      root: temp,
      plugins: [scholarshipDataPlugin(temp)],
      logLevel: "silent",
      build: { write: false },
    });
    const result = Array.isArray(output) ? output[0] : output;
    if (!("output" in result)) throw new Error("Unexpected build result");
    const text = result.output
      .map((o) => ("code" in o ? o.code : String(o.source)))
      .join("");
    expect(text).not.toContain("SYNTHETIC Test Award");
    expect(text).not.toContain("First-generation");
    expect(text).not.toContain("pending-review");
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

it("review and generation CLIs require acknowledgment and preserve publication on failed reapproval", () => {
  const temp = mkdtempSync(join(testRoot, "fym-review-"));
  try {
    for (const dir of ["data/private", "src/data"])
      mkdirSync(join(temp, dir), { recursive: true });
    const data = records(),
      id = data[0].scholarship.id;
    writeFileSync(
      join(temp, "data/private/research.json"),
      JSON.stringify(data),
    );
    writeFileSync(join(temp, "data/reviews.json"), "[]");
    const target = join(temp, "src/data/scholarships.json");
    writeFileSync(target, "[]\n");
    const review = resolve("scripts/review-data.ts"),
      generate = resolve("scripts/publish-data.ts");
    const args = [
      review,
      "set",
      id,
      "approved",
      "SYNTHETIC reviewer",
      "Synthetic approval test only",
    ];
    expect(spawnSync(process.execPath, args, { cwd: temp }).status).toBe(1);
    execFileSync(process.execPath, [...args, "--acknowledge-warnings"], {
      cwd: temp,
    });
    execFileSync(process.execPath, [generate], { cwd: temp });
    const published = readFileSync(target, "utf8");
    expect(JSON.parse(published)[0].reviewStatus).toBe("approved");
    data[0].scholarship.notes = "Changed after approval";
    data[0].contentHash = contentHash(data[0].scholarship);
    writeFileSync(
      join(temp, "data/private/research.json"),
      JSON.stringify(data),
    );
    expect(spawnSync(process.execPath, [generate], { cwd: temp }).status).toBe(
      1,
    );
    expect(readFileSync(target, "utf8")).toBe(published);
    execFileSync(process.execPath, [generate, "--allow-empty"], { cwd: temp });
    expect(JSON.parse(readFileSync(target, "utf8"))).toEqual([]);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
