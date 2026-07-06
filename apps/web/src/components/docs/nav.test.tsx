import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DocsBreadcrumbs, DocsPrevNext } from "./nav";

vi.mock("@/lib/docs/navigation", () => ({
  getSectionForPage: vi.fn((slug: string) => {
    if (slug === "docs/getting-started/playground") {
      return {
        section: { id: "getting-started", title: "Getting Started", pages: [] }
      };
    }
    return null;
  }),
  getPreviousNext: vi.fn((slug: string) => {
    if (slug === "docs/getting-started/playground") {
      return {
        prev: null,
        next: { slug: "docs/getting-started/packages", title: "Installing the Packages" }
      };
    }
    return { prev: null, next: null };
  })
}));

describe("DocsBreadcrumbs", () => {
  it("renders breadcrumb for known page", () => {
    render(<DocsBreadcrumbs slug="docs/getting-started/playground" />);
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
  });

  it("renders nothing for unknown page", () => {
    const { container } = render(<DocsBreadcrumbs slug="docs/unknown" />);
    expect(container.innerHTML).toBe("");
  });
});

describe("DocsPrevNext", () => {
  it("renders next link", () => {
    render(<DocsPrevNext slug="docs/getting-started/playground" />);
    expect(screen.getByText(/Installing the Packages/)).toBeInTheDocument();
    expect(screen.getByText(/→/)).toBeInTheDocument();
  });

  it("renders nothing when no prev/next", () => {
    const { container } = render(<DocsPrevNext slug="docs/unknown" />);
    const nav = container.querySelector("nav");
    expect(nav?.querySelector("a")).toBeNull();
  });
});
