import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
import { site } from "../config";
export function PageContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container ${className}`}>{children}</div>;
}
export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <PageContainer className="header-inner">
        <Link to="/" className="brand" aria-label={`${site.name} home`}>
          <span className="brand-mark" aria-hidden="true">
            FYM
          </span>
          <span>
            {site.name}
            <small>A Future Youth Market project</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/scholarships">Scholarships</NavLink>
          <Link to="/#how-it-works">How it works</Link>
        </nav>
      </PageContainer>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <PageContainer>
        <div className="footer-top">
          <p className="footer-title">
            A little clarity.
            <br />A world of possibility.
          </p>
          <div>
            <Link to="/scholarships">Browse scholarships</Link>
            <p>
              Built by students, for students.
              <br />
              {site.organization}
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{site.name}</span>
          <p>
            Apply directly with providers. FYM does not process applications or
            guarantee eligibility or awards.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
