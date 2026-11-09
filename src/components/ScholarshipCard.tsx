import { Link } from "react-router";
import type { Listing } from "../data/schema";
import { deadlineLabel } from "../lib/search";
export function ScholarshipCard({ scholarship: s }: { scholarship: Listing }) {
  const expired =
    !!s.deadline && s.deadline < new Date().toISOString().slice(0, 10);
  return (
    <article className="scholarship-card">
      <div className="card-top">
        <span className="eyebrow">{s.provider}</span>
        {s.reviewStatus !== "approved" && (
          <span className="review-badge">
            {s.reviewStatus === "needs-correction"
              ? "Needs correction"
              : "Pending review"}
          </span>
        )}
      </div>
      <h2>
        <Link to={`/scholarships/${s.id}`}>{s.name}</Link>
      </h2>
      <p className="deadline-label">
        {expired ? "Past deadline" : "Deadline"}
        <strong>{deadlineLabel(s)}</strong>
      </p>
      <p className="eligibility-summary">
        {s.eligibility ||
          "Eligibility details have not been provided. Confirm requirements with the provider."}
      </p>
      <div className="card-bottom">
        <div>
          <span className="eyebrow">Award information</span>
          <p>{s.award || "Not provided"}</p>
        </div>
        <Link
          className="text-action"
          to={`/scholarships/${s.id}`}
          aria-label={`View details for ${s.name}`}
        >
          View details <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
