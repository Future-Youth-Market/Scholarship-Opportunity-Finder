import type { Scholarship } from "../data/schema";
export type SortOrder = "deadline" | "name" | "award-high" | "award-low";
export function searchScholarships<T extends Scholarship>(
  data: readonly T[],
  query: string,
): T[] {
  const term = query.trim().toLocaleLowerCase();
  return data.filter((s) =>
    [s.name, s.provider, s.eligibility, s.restrictions]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(term),
  );
}
// Only compare explicit dollar amounts. The first value in an annual breakdown
// is the headline award; a range is compared by its upper endpoint.
export function awardAmount(award?: string): number | undefined {
  const match = award?.match(/^(?:up to\s+)?\$([\d,]+)(?:\s*[-–—]\s*\$([\d,]+))?(?=\s|\(|$)/i);
  return match ? Number((match[2] ?? match[1]).replaceAll(",", "")) : undefined;
}

export function matchesCriteria(
  scholarship: Scholarship,
  location: string,
  age: number | undefined,
  minimumAward: number,
): boolean {
  const text = [scholarship.eligibility, scholarship.restrictions].filter(Boolean).join("\n");
  const normalize = (value: string) => value.toLowerCase().replace(/[.]/g, "").replace(/\s+/g, " ").trim();
  if (location.trim() && !normalize(text).includes(normalize(location))) return false;
  if (minimumAward && (awardAmount(scholarship.award) ?? 0) < minimumAward) return false;
  if (age === undefined) return true;

  // Read explicit limits in eligibility text. Conditional restrictions such as
  // parental consent remain on the detail page.
  const eligibility = scholarship.eligibility ?? "";
  const range = eligibility.match(/\bages?\s*:?\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\b/i);
  const under = eligibility.match(/\bunder\s+(?:the age\s+(?:of\s+)?)?(\d{1,2})\b/i);
  const younger = eligibility.match(/\b(\d{1,2})\s+or younger\b/i);
  const older = eligibility.match(/\b(\d{1,2})\s+or older\b/i);
  if (range && (age < Number(range[1]) || age > Number(range[2]))) return false;
  if (under && age >= Number(under[1])) return false;
  if (younger && age > Number(younger[1])) return false;
  if (older && age < Number(older[1])) return false;
  return true;
}

export function sortScholarships<T extends Scholarship>(
  data: readonly T[],
  order: SortOrder,
  today = new Date().toISOString().slice(0, 10),
): T[] {
  const name = (a: T, b: T) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }) ||
    a.id.localeCompare(b.id);
  const group = (s: T) => (!s.deadline ? 2 : s.deadline < today ? 1 : 0);
  return [...data].sort((a, b) => {
    if (order === "name") return name(a, b);
    if (order === "award-high" || order === "award-low") {
      const left = awardAmount(a.award);
      const right = awardAmount(b.award);
      if (left === undefined) return right === undefined ? name(a, b) : 1;
      if (right === undefined) return -1;
      return (order === "award-high" ? right - left : left - right) || name(a, b);
    }
    const difference = group(a) - group(b);
    if (difference) return difference;
    if (a.deadline && b.deadline && a.deadline !== b.deadline)
      return group(a) === 1
        ? b.deadline.localeCompare(a.deadline)
        : a.deadline.localeCompare(b.deadline);
    return name(a, b);
  });
}
export function formatDate(value?: string): string {
  return value
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(value + "T00:00:00Z"))
    : "Not provided";
}
export function deadlineLabel(s: Scholarship): string {
  return s.deadline
    ? formatDate(s.deadline)
    : s.deadlineText
      ? `${s.deadlineText} (date unconfirmed)`
      : "Deadline not provided";
}
