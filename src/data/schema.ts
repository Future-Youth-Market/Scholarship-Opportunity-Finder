export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  award?: string;
  deadline?: string;
  eligibility?: string;
  restrictions?: string;
  informationUrl: string;
  applicationUrl?: string;
  lastVerified: string;
  notes?: string;
  categories?: string;
}
export const fields = [
  "id",
  "name",
  "provider",
  "award",
  "deadline",
  "eligibility",
  "restrictions",
  "informationUrl",
  "applicationUrl",
  "lastVerified",
  "notes",
  "categories",
] as const;
export const required = [
  "id",
  "name",
  "provider",
  "informationUrl",
  "lastVerified",
] as const;
export function isDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function validUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
export function validateRecords(
  rows: Record<string, unknown>[],
  today = new Date().toISOString().slice(0, 10),
) {
  const reports: { row: number; errors: string[]; warnings: string[] }[] = [];
  const valid: Scholarship[] = [];
  const counts = (key: string) =>
    rows.reduce((map, row) => {
      const v = row[key];
      if (typeof v === "string" && v) map.set(v, (map.get(v) ?? 0) + 1);
      return map;
    }, new Map<string, number>());
  const ids = counts("id");
  const identities = rows.map(
    (r) =>
      `${String(r.name).toLowerCase()}|${String(r.provider).toLowerCase()}`,
  );
  rows.forEach((row, index) => {
    const errors: string[] = [],
      warnings: string[] = [];
    for (const key of Object.keys(row))
      if (
        ![...fields, "verificationStatus"].includes(
          key as (typeof fields)[number],
        )
      )
        errors.push(`Unknown column: ${key}`);
    for (const [key, value] of Object.entries(row))
      if (typeof value !== "string") errors.push(`${key} must be text`);
    for (const key of required)
      if (typeof row[key] !== "string" || !row[key].trim())
        errors.push(`Missing ${key}`);
    if (row.verificationStatus !== "verified")
      errors.push("verificationStatus must be verified");
    for (const key of ["informationUrl", "applicationUrl"])
      if (row[key] && !validUrl(String(row[key])))
        errors.push(`${key} must be an absolute HTTPS URL without credentials`);
    for (const key of ["deadline", "lastVerified"])
      if (row[key] && !isDate(String(row[key])))
        errors.push(`${key} must be a real YYYY-MM-DD date`);
    if (row.lastVerified && String(row.lastVerified) > today)
      errors.push("lastVerified is in the future");
    if (
      (ids.get(String(row.id)) ?? 0) > 1 ||
      identities.filter((v) => v === identities[index]).length > 1
    )
      errors.push(
        "Duplicate ID or scholarship/provider pair; resolve all copies",
      );
    for (const key of ["award", "deadline", "eligibility"])
      if (!row[key]) warnings.push(`${key} unavailable`);
    if (
      row.deadline &&
      isDate(String(row.deadline)) &&
      String(row.deadline) < today
    )
      errors.push("Past deadline: hold for research review");
    if (
      row.lastVerified &&
      isDate(String(row.lastVerified)) &&
      (Date.parse(today) - Date.parse(String(row.lastVerified))) / 86400000 > 90
    )
      errors.push("Verification older than provisional 90-day review window");
    if (!errors.length) {
      const result: Record<string, string> = {};
      for (const key of fields) if (row[key]) result[key] = String(row[key]);
      valid.push(result as unknown as Scholarship);
    }
    reports.push({ row: index + 2, errors, warnings });
  });
  return { valid, reports };
}
