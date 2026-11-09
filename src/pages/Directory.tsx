import { useSearchParams } from "react-router";
import type { Listing } from "../data/schema";
import { PageContainer } from "../components/Layout";
import { SearchInput } from "../components/SearchInput";
import { ScholarshipCard } from "../components/ScholarshipCard";
import { EmptyState } from "../components/EmptyState";
import { searchScholarships, sortScholarships } from "../lib/search";
export function Directory({
  scholarships,
  preview,
}: {
  scholarships: Listing[];
  preview: boolean;
}) {
  const [params, setParams] = useSearchParams(),
    query = params.get("q") ?? "",
    sort = params.get("sort") === "name" ? "name" : "deadline";
  const results = sortScholarships(
    searchScholarships(scholarships, query),
    sort,
  );
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  return (
    <PageContainer>
      <section className="page-intro">
        <p className="eyebrow">Find your next possibility</p>
        <h1>
          Scholarships,
          <br />
          without the overwhelm.
        </h1>
        <p>Explore the details. Check the requirements. Take it from there.</p>
      </section>
      <section aria-label="Scholarship directory">
        <div className="directory-controls">
          <SearchInput value={query} onChange={(v) => update("q", v)} />
          <div className="sort-field">
            <label htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="deadline">Nearest upcoming deadline</option>
              <option value="name">Scholarship name A–Z</option>
            </select>
          </div>
        </div>
        <div className="results-meta">
          <p role="status" aria-live="polite">
            {results.length}{" "}
            {results.length === 1 ? "opportunity" : "opportunities"}
            {query ? ` matching “${query}”` : " to explore"}
          </p>
          {query && (
            <button className="text-action" onClick={() => update("q", "")}>
              Clear search
            </button>
          )}
        </div>
        <p className="directory-note">
          Upcoming dates appear first, then past dates, then unknown dates. A
          future deadline does not confirm that applications are open.
        </p>
        {results.length ? (
          <div className="scholarship-grid">
            {results.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              scholarships.length
                ? "No matching scholarships"
                : preview
                  ? "Research preview is empty"
                  : "Scholarships are being reviewed"
            }
          >
            {scholarships.length
              ? "Try a broader keyword, organization, or scholarship name."
              : preview
                ? "Import a research export to preview listings locally."
                : "The team is reviewing scholarship research. Approved listings will appear here when publication is authorized."}
          </EmptyState>
        )}
        <p className="directory-disclaimer">
          Read every requirement with the official provider. Search results are
          not a determination of eligibility.
        </p>
      </section>
    </PageContainer>
  );
}
