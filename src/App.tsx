import { useState } from "react";
import { Header, Footer, PageContainer } from "./components/Layout";
import { SearchInput } from "./components/SearchInput";
import { EmptyState } from "./components/EmptyState";
import { ScholarshipCard } from "./components/ScholarshipCard";
import data from "./data/scholarships.json";
import type { Scholarship } from "./data/schema";
import { searchScholarships } from "./lib/search";
export default function App({
  scholarships = data,
}: {
  scholarships?: Scholarship[];
}) {
  const [query, setQuery] = useState("");
  const results = searchScholarships(scholarships, query);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <PageContainer>
          <section id="about" className="py-10">
            <p className="mb-3">Project in development</p>
            <h1 className="text-3xl font-bold">
              Scholarship Opportunity Finder
            </h1>
            <p className="mt-4 max-w-2xl">
              FYM is building a clearer way for students to discover scholarship
              opportunities, understand key requirements, and visit official
              providers.
            </p>
            <p className="mt-3">
              This early foundation is awaiting verified listings and team
              design input.
            </p>
          </section>
          <section id="opportunities" aria-labelledby="opportunities-heading">
            <h2
              id="opportunities-heading"
              className="mb-5 text-2xl font-semibold"
            >
              Scholarship opportunities
            </h2>
            <SearchInput value={query} onChange={setQuery} />
            <p className="my-4" role="status">
              {results.length} opportunities shown
            </p>
            <div className="grid gap-4">
              {results.map((s) => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
              {!results.length && (
                <EmptyState
                  title={
                    scholarships.length
                      ? "No matching scholarships"
                      : "Verified listings are not available yet"
                  }
                >
                  {scholarships.length
                    ? "Try another scholarship or provider name."
                    : "The research team is preparing the first verified scholarship listings."}
                </EmptyState>
              )}
            </div>
          </section>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
