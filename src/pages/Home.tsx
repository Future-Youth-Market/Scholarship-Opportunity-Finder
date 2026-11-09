import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { PageContainer } from "../components/Layout";
import { site } from "../config";
export function Home() {
  const [query, setQuery] = useState(""),
    navigate = useNavigate();
  return (
    <>
      <section className="hero textured">
        <PageContainer>
          <p className="eyebrow hero-kicker">
            Less searching. More possibility.
          </p>
          <h1>
            Your future,
            <br />
            <span>curated.</span>
          </h1>
          <p className="hero-description">
            Scholarship discovery, with a little more clarity. Explore
            opportunities, understand the requirements, and take your next step.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/scholarships">
              Browse Scholarships <span aria-hidden="true">↗</span>
            </Link>
            <a className="button secondary" href="#how-it-works">
              How It Works
            </a>
          </div>
          <p className="hero-note">
            A student-led directory. No accounts. No personalized matching.
          </p>
        </PageContainer>
        <span className="hero-side-note" aria-hidden="true">
          A brighter next chapter
        </span>
      </section>
      <PageContainer>
        <section className="home-search" aria-labelledby="begin-search">
          <div>
            <p className="eyebrow">Start somewhere good</p>
            <h2 id="begin-search">What are you looking for?</h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(
                `/scholarships${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`,
              );
            }}
          >
            <label className="visually-hidden" htmlFor="home-search">
              Search by name, organization, or eligibility keyword
            </label>
            <input
              id="home-search"
              type="search"
              placeholder="Try “nursing” or a scholarship name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="button primary" type="submit">
              Search <span aria-hidden="true">↗</span>
            </button>
          </form>
        </section>
        <section
          id="how-it-works"
          className="how-section"
          aria-labelledby="how-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Your next step, made simpler</p>
            <h2 id="how-heading">A clearer path forward.</h2>
            <p>
              {site.organization} brings scholarship research together so you
              can spend more time on what comes next.
            </p>
          </div>
          <div className="steps">
            <article>
              <span className="step-number">01</span>
              <h3>Explore the possibilities</h3>
              <p>
                Browse scholarships and search names, organizations, or keywords
                from eligibility requirements.
              </p>
            </article>
            <article>
              <span className="step-number">02</span>
              <h3>Read the details</h3>
              <p>
                Check awards, dates, restrictions, and the full requirements. A
                keyword match does not confirm eligibility.
              </p>
            </article>
            <article>
              <span className="step-number">03</span>
              <h3>Go to the source</h3>
              <p>
                Confirm the latest requirements and apply directly on the
                provider’s website. You stay in control.
              </p>
            </article>
          </div>
        </section>
      </PageContainer>
    </>
  );
}
