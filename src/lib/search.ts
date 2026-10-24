import type { Scholarship } from "../data/schema";
export function searchScholarships(
  data: readonly Scholarship[],
  query: string,
): Scholarship[] {
  const term = query.trim().toLocaleLowerCase();
  return data.filter((item) =>
    `${item.name} ${item.provider}`.toLocaleLowerCase().includes(term),
  );
}
