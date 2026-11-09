import { Link, useParams } from "react-router";
import type { Listing } from "../data/schema";
import { validUrl } from "../data/schema";
import { PageContainer } from "../components/Layout";
import { ResearchText } from "../components/ResearchText";
import { deadlineLabel, formatDate } from "../lib/search";
import { NotFound } from "./NotFound";
function ExternalLink({
  url,
  children,
}: {
  url?: string;
  children: React.ReactNode;
}) {
  return url && validUrl(url) ? (
    <a className="button primary" href={url}>
      {children} <span aria-hidden="true">↗</span>
      <span className="visually-hidden"> (external website)</span>
    </a>
  ) : (
    <p>Link not available. Confirm with the provider.</p>
  );
}
export function Details({ scholarships }: { scholarships: Listing[] }) {
  const { id } = useParams(),
    s = scholarships.find((item) => item.id === id);
  if (!s) return <NotFound />;
  const expired =
    !!s.deadline && s.deadline < new Date().toISOString().slice(0, 10);
  return (
    <PageContainer>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/scholarships">← All scholarships</Link>
      </nav>
      <header className="detail-heading">
        <p className="eyebrow">{s.provider}</p>
        <h1>{s.name}</h1>
        {s.reviewStatus !== "approved" && (
          <p className="review-badge">
            {s.reviewStatus === "needs-correction"
              ? "Needs correction"
              : "Pending research review"}{" "}
            · Local preview only
          </p>
        )}
      </header>
      <div className="detail-layout">
        <div>
          <section className="detail-section">
            <h2>Who can apply?</h2>
            <ResearchText text={s.eligibility} />
          </section>
          <section className="detail-section">
            <h2>Additional restrictions</h2>
            <ResearchText text={s.restrictions} />
          </section>
          {s.notes && (
            <section className="detail-section">
              <h2>Research notes</h2>
              <ResearchText text={s.notes} />
            </section>
          )}
          <aside className="provider-reminder">
            <h2>Before you apply</h2>
            <p>
              Confirm all requirements, award terms, dates, and application
              availability directly with the scholarship provider. Research may
              change. FYM does not guarantee eligibility or an award.
            </p>
          </aside>
        </div>
        <aside className="detail-facts" aria-label="Scholarship at a glance">
          <h2>The key details</h2>
          <dl>
            <div>
              <dt>Award information</dt>
              <dd>{s.award || "Not provided"}</dd>
            </div>
            <div>
              <dt>{expired ? "Past deadline" : "Deadline"}</dt>
              <dd>{deadlineLabel(s)}</dd>
            </div>
            <div>
              <dt>Last checked by research team</dt>
              <dd>
                {s.lastChecked ? (
                  <time dateTime={s.lastChecked}>
                    {formatDate(s.lastChecked)}
                  </time>
                ) : (
                  s.lastCheckedText || "Not provided"
                )}
              </dd>
            </div>
          </dl>
          <p className="small-copy">
            A check date records research activity; it does not confirm that
            applications are open.
          </p>
          <div className="detail-links">
            <ExternalLink url={s.applicationUrl}>
              Application website
            </ExternalLink>
            <ExternalLink url={s.informationUrl}>
              Official provider website
            </ExternalLink>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
