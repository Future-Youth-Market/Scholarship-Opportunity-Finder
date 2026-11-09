import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Header, Footer } from "./components/Layout";
import { Home } from "./pages/Home";
import { Directory } from "./pages/Directory";
import { Details } from "./pages/Details";
import { NotFound } from "./pages/NotFound";
import type { Listing } from "./data/schema";
import { site } from "./config";
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    document.title = `${pathname === "/scholarships" ? "Scholarships" : pathname.startsWith("/scholarships/") ? "Scholarship details" : "Home"} | ${site.name}`;
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo?.(0, 0);
      if (previousPath.current !== pathname)
        document.getElementById("main")?.focus();
    }
    previousPath.current = pathname;
  }, [pathname, hash]);
  return null;
}
export default function App({
  scholarships = [],
  preview = false,
  dataError = null,
}: {
  scholarships?: Listing[];
  preview?: boolean;
  dataError?: string | null;
}) {
  return (
    <>
      <RouteEffects />
      {preview && (
        <div className="preview-banner">
          <strong>LOCAL RESEARCH PREVIEW</strong>
          <span>
            Unapproved research is shown for team review. Not for public
            sharing.
          </span>
        </div>
      )}
      <Header />
      <main id="main" tabIndex={-1}>
        {dataError ? (
          <div className="container error-state" role="alert">
            <h1>Scholarships could not be loaded</h1>
            <p>{dataError}</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/scholarships"
              element={
                <Directory scholarships={scholarships} preview={preview} />
              }
            />
            <Route
              path="/scholarships/:id"
              element={<Details scholarships={scholarships} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
      <Footer />
    </>
  );
}
