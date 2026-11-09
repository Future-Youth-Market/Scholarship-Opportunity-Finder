import { StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "../App";
import { isDate, validUrl } from "../data/schema";
import type { Listing } from "../data/schema";
import { searchScholarships, sortScholarships } from "../lib/search";
const record: Listing = {
  id: "synthetic-only",
  name: "SYNTHETIC Test Award",
  provider: "SYNTHETIC Provider",
  eligibility: "First-generation nursing students\n- U.S. residents",
  informationUrl: "https://example.invalid",
  lastChecked: "2026-11-07",
  reviewStatus: "pending-review",
};
function view(
  path: string,
  data: Listing[] = [record],
  preview = true,
  error: string | null = null,
) {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App scholarships={data} preview={preview} dataError={error} />
    </MemoryRouter>,
  );
}
describe("validation and discovery", () => {
  it("validates dates and safe URLs", () => {
    expect(isDate("2024-02-29")).toBe(true);
    expect(isDate("2026-02-30")).toBe(false);
    expect(validUrl("javascript:alert(1)")).toBe(false);
    expect(validUrl("https://user:pass@example.invalid")).toBe(false);
    expect(validUrl("https://example.invalid")).toBe(true);
  });
  it("matches case-insensitive partial name/provider/eligibility and restrictions", () => {
    for (const q of ["test AW", "provider", "NURS", "first-gen", ""])
      expect(searchScholarships([record], q)).toHaveLength(1);
    expect(searchScholarships([record], "absent")).toEqual([]);
  });
  it("sorts upcoming, past, and unknown without mutating source", () => {
    const records = [
      { ...record, id: "unknown", name: "A unknown" },
      { ...record, id: "old", deadline: "2025-01-01" },
      { ...record, id: "near", deadline: "2027-01-01" },
      { ...record, id: "far", deadline: "2027-02-01" },
    ];
    expect(
      sortScholarships(records, "deadline", "2026-11-09").map((s) => s.id),
    ).toEqual(["near", "far", "old", "unknown"]);
    expect(records[0].id).toBe("unknown");
    expect(sortScholarships(records, "name")[0].name).toBe("A unknown");
  });
});
describe("pages", () => {
  it("renders the homepage and working browse navigation", () => {
    view("/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Your future,curated.",
    );
    expect(
      screen.getByRole("link", { name: /Browse Scholarships/ }),
    ).toHaveAttribute("href", "/scholarships");
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
  });
  it("supports directory search, results count, clear search and sort", () => {
    view("/scholarships");
    expect(screen.getByRole("status")).toHaveTextContent("1 opportunity");
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "unmatched" },
    });
    expect(screen.getByText("No matching scholarships")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("status")).toHaveTextContent("1 opportunity");
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "name" },
    });
    expect(screen.getByRole("combobox")).toHaveValue("name");
  });
  it("reads query parameters and renders the full detail route safely", () => {
    view("/scholarships/synthetic-only");
    expect(
      screen.getByRole("heading", { name: record.name }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("First-generation nursing students"),
    ).toBeInTheDocument();
    expect(screen.getByRole("list")).toHaveTextContent("U.S. residents");
    expect(screen.getByText("Deadline not provided")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Official provider website/ }),
    ).toHaveAttribute("href", record.informationUrl);
  });
  it("handles nonexistent routes and missing record IDs", () => {
    view("/scholarships/unknown");
    expect(
      screen.getByRole("heading", { name: "Page not found." }),
    ).toBeInTheDocument();
  });
  it("shows a truthful production empty state without preview labels", () => {
    view("/scholarships", [], false);
    expect(
      screen.getByText("Scholarships are being reviewed"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("LOCAL RESEARCH PREVIEW"),
    ).not.toBeInTheDocument();
  });
  it("shows an actionable local data error", () => {
    view("/scholarships", [], true, "Fix the import and restart.");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Fix the import and restart.",
    );
  });
  it("preserves notes as text, never HTML", () => {
    view("/scholarships/synthetic-only", [
      { ...record, notes: "<script>alert(1)</script>" },
    ]);
    expect(screen.getByText("<script>alert(1)</script>")).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });
});

it("keeps initial navigation before main and focuses main only after a route change", () => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  render(
    <StrictMode>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </StrictMode>,
  );
  expect(screen.getByRole("main")).not.toHaveFocus();
  fireEvent.click(screen.getByRole("link", { name: "Browse Scholarships" }));
  expect(screen.getByRole("main")).toHaveFocus();
});
