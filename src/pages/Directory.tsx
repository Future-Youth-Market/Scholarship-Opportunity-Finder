import { useSearchParams } from "react-router";
import type { Listing } from "../data/schema";
import { PageContainer } from "../components/Layout";
import { SearchInput } from "../components/SearchInput";
import { ScholarshipCard } from "../components/ScholarshipCard";
import { EmptyState } from "../components/EmptyState";
import { matchesCriteria, searchScholarships, sortScholarships } from "../lib/search";
export function Directory({
  scholarships,
  preview,
}: {
  scholarships: Listing[];
  preview: boolean;
}) {
  const [params, setParams] = useSearchParams(),
    query = params.get("q") ?? "",
    requestedSort = params.get("sort"),
    sort = requestedSort === "name" || requestedSort === "award-high" || requestedSort === "award-low" ? requestedSort : "deadline";
  const location = params.get("location") ?? "";
  const age = params.get("age") ?? "";
  const award = params.get("award") ?? "";
  const parsedAge = /^\d{1,3}$/.test(age) && Number(age) <= 120 ? Number(age) : undefined;
  const minimumAward = /^\d+$/.test(award) ? Number(award) : 0;
  const criteriaActive = Boolean(location || age || award);
  const results = sortScholarships(
    searchScholarships(scholarships, query).filter((scholarship) =>
      matchesCriteria(scholarship, location, parsedAge, minimumAward),
    ),
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
              <option value="award-high">Award amount: high to low</option>
              <option value="award-low">Award amount: low to high</option>
            </select>
          </div>
        </div>
        <fieldset className="criteria-controls">
          <legend>Filter by criteria</legend>
          <div className="search-field">
            <label htmlFor="location">Location keyword</label>
            <input id="location" type="search" placeholder="e.g. Kentucky" value={location} onChange={(e) => update("location", e.target.value)} />
          </div>
          <div className="search-field">
            <label htmlFor="age">Your age</label>
            <input id="age" type="number" min="0" max="120" step="1" value={age} onChange={(e) => update("age", e.target.value)} />
          </div>
          <div className="search-field">
            <label htmlFor="award">Award ceiling at least ($)</label>
            <input id="award" type="number" min="0" step="1" value={award} onChange={(e) => update("award", e.target.value)} />
          </div>
          <p className="directory-note">Location matches words in the requirements. Age keeps records with unlisted or unclear limits. Award comparisons use stated dollar amounts or range ceilings.</p>
          {criteriaActive && (
            <button className="text-action" onClick={() => {
              const next = new URLSearchParams(params);
              for (const key of ["location", "age", "award"]) next.delete(key);
              setParams(next, { replace: true });
            }}>Clear filters</button>
          )}
        </fieldset>
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
        {sort === "deadline" && <p className="directory-note">
          Upcoming dates appear first, then past dates, then unknown dates. A
          future deadline does not confirm that applications are open.
        </p>}
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
              ? "Try a broader keyword or clear a filter."
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
