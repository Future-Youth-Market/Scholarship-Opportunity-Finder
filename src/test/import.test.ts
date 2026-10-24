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
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, it } from "vitest";
it("CSV CLI preserves quoted text, reports rejected rows, and protects existing public data", () => {
  const temp = mkdtempSync(join(tmpdir(), "fym-import-"));
  const script = resolve("scripts/import-scholarships.ts");
  const headers =
    "id,name,provider,informationUrl,lastVerified,verificationStatus,notes\n";
  try {
    mkdirSync(join(temp, "src/data"), { recursive: true });
    const target = join(temp, "src/data/scholarships.json");
    writeFileSync(target, "[]\n");
    const csv = join(temp, "test.csv");
    writeFileSync(
      csv,
      headers +
        'synthetic,"SYNTHETIC, Award",SYNTHETIC Provider,https://example.invalid,' +
        new Date().toISOString().slice(0, 10) +
        ',verified,"line one\nline two"\n',
    );
    execFileSync(process.execPath, [script, csv], { cwd: temp });
    expect(readFileSync(target, "utf8")).toBe("[]\n");
    const candidate = JSON.parse(
      readFileSync(join(temp, "reports/scholarships.candidate.json"), "utf8"),
    );
    expect(candidate[0].name).toBe("SYNTHETIC, Award");
    expect(candidate[0].notes).toBe("line one\nline two");
    execFileSync(process.execPath, [script, csv, "--write"], { cwd: temp });
    const previous = readFileSync(target, "utf8");
    writeFileSync(
      csv,
      headers +
        "rejected,SYNTHETIC,SYNTHETIC,javascript:alert(1),2026-02-30,pending,\n",
    );
    expect(
      spawnSync(process.execPath, [script, csv, "--write"], { cwd: temp })
        .status,
    ).toBe(1);
    expect(readFileSync(target, "utf8")).toBe(previous);
    expect(
      readFileSync(join(temp, "reports/validation.txt"), "utf8"),
    ).toContain("REJECTED");
    writeFileSync(csv, "id,id\na,b\n");
    expect(
      spawnSync(process.execPath, [script, csv], { cwd: temp }).status,
    ).toBe(1);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
