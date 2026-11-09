export type ReviewStatus = "pending-review" | "approved" | "needs-correction";
export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  award?: string;
  deadline?: string;
  deadlineText?: string;
  eligibility?: string;
  restrictions?: string;
  informationUrl: string;
  applicationUrl?: string;
  lastChecked?: string;
  lastCheckedText?: string;
  notes?: string;
}
export interface ResearchRecord {
  scholarship: Scholarship;
  contentHash: string;
  sourceRow: number;
  warnings: string[];
  errors: string[];
}
export interface ReviewDecision {
  id: string;
  contentHash: string;
  status: ReviewStatus;
  reviewer: string;
  reviewedAt: string;
  note: string;
}
export interface Listing extends Scholarship {
  reviewStatus: ReviewStatus;
}
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
      !url.password &&
      !/\s/.test(value)
    );
  } catch {
    return false;
  }
}
export function validateScholarship(s: Scholarship): string[] {
  const errors: string[] = [];
  for (const key of ["id", "name", "provider", "informationUrl"] as const)
    if (typeof s[key] !== "string" || !s[key].trim())
      errors.push(`Missing ${key}`);
  if (!/^[a-z0-9-]+$/.test(s.id ?? "")) errors.push("ID must be URL-safe");
  for (const key of ["informationUrl", "applicationUrl"] as const)
    if (s[key] && !validUrl(s[key]))
      errors.push(
        `${key} must be an absolute HTTPS URL without credentials or whitespace`,
      );
  for (const key of ["deadline", "lastChecked"] as const)
    if (s[key] && !isDate(s[key]))
      errors.push(`${key} must be a real YYYY-MM-DD date`);
  for (const [key, value] of Object.entries(s))
    if (typeof value !== "string") errors.push(`${key} must be text`);
  return errors;
}
