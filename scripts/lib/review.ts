import type {
  Listing,
  ResearchRecord,
  ReviewDecision,
} from "../../src/data/schema.ts";
import { isDate, validateScholarship } from "../../src/data/schema.ts";
import { contentHash } from "./importer.ts";
export function reviewStatus(
  record: ResearchRecord,
  decisions: ReviewDecision[],
) {
  const decision = decisions.find(
    (d) =>
      d.id === record.scholarship.id && d.contentHash === record.contentHash,
  );
  return decision?.status ?? "pending-review";
}
export function validateResearch(records: ResearchRecord[]): void {
  const ids = new Set<string>();
  for (const r of records) {
    if (ids.has(r.scholarship.id)) throw new Error("Duplicate research ID");
    ids.add(r.scholarship.id);
    if (
      contentHash(r.scholarship) !== r.contentHash ||
      r.errors.length ||
      validateScholarship(r.scholarship).length
    )
      throw new Error(`Invalid research record: ${r.scholarship.id}`);
  }
}
export function validateDecisions(decisions: ReviewDecision[]): void {
  const keys = new Set<string>();
  for (const d of decisions) {
    const key = `${d.id}:${d.contentHash}`;
    if (keys.has(key)) throw new Error(`Duplicate review decision: ${d.id}`);
    keys.add(key);
    if (
      !["approved", "pending-review", "needs-correction"].includes(d.status) ||
      !d.reviewer?.trim() ||
      !d.note?.trim() ||
      !isDate(d.reviewedAt) ||
      d.reviewedAt > new Date().toISOString().slice(0, 10) ||
      !/^[a-f0-9]{64}$/.test(d.contentHash)
    )
      throw new Error(`Invalid review decision: ${d.id}`);
  }
}
export function selectListings(
  records: ResearchRecord[],
  decisions: ReviewDecision[],
  preview = false,
): Listing[] {
  validateResearch(records);
  validateDecisions(decisions);
  return records
    .map((r) => ({
      ...r.scholarship,
      reviewStatus: reviewStatus(r, decisions),
    }))
    .filter((s) => preview || s.reviewStatus === "approved");
}

export function validatePublished(data: Listing[], reviews: ReviewDecision[]) {
  validateDecisions(reviews);
  if (!Array.isArray(data)) throw new Error("Public data must be an array");
  const ids = new Set<string>();
  for (const listing of data) {
    const { reviewStatus, ...s } = listing;
    if (validateScholarship(s).length || ids.has(s.id))
      throw new Error("Invalid or duplicate public record");
    ids.add(s.id);
    if (
      reviewStatus !== "approved" ||
      !reviews.some(
        (d) =>
          d.id === s.id &&
          d.contentHash === contentHash(s) &&
          d.status === "approved",
      )
    )
      throw new Error("Unapproved or changed record in public data");
  }
}
