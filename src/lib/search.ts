import type { Scholarship } from "../data/schema";
export type SortOrder = "deadline" | "name";
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
