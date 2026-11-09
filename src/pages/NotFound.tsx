import { Link } from "react-router";
import { PageContainer } from "../components/Layout";
export function NotFound() {
  return (
    <PageContainer>
      <section className="not-found">
        <p className="eyebrow">Let’s find another path</p>
        <h1>Page not found.</h1>
        <p>
          This page may have moved, or this scholarship may not be published.
        </p>
        <Link className="button primary" to="/scholarships">
          Browse scholarships
        </Link>
      </section>
    </PageContainer>
  );
}
