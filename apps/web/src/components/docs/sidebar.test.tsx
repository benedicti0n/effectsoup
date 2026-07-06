import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DocsSidebar } from "./sidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/docs/getting-started/playground")
}));

vi.mock("@/lib/docs/navigation", () => ({
  getSections: vi.fn(() => [
    {
      id: "getting-started",
      title: "Getting Started",
      pages: [
        { slug: "docs/getting-started/playground", title: "Using the Playground" },
        { slug: "docs/getting-started/packages", title: "Installing the Packages" }
      ]
    },
    {
      id: "effects",
      title: "Effects",
      pages: [
        { slug: "docs/effects", title: "All Effects" }
      ]
    }
  ])
}));

describe("DocsSidebar", () => {
  it("renders section titles", () => {
    const onSearch = vi.fn();
    render(<DocsSidebar onSearchOpen={onSearch} />);
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Effects")).toBeInTheDocument();
  });

  it("renders page links", () => {
    const onSearch = vi.fn();
    render(<DocsSidebar onSearchOpen={onSearch} />);
    expect(screen.getByText("Using the Playground")).toBeInTheDocument();
    expect(screen.getByText("Installing the Packages")).toBeInTheDocument();
    expect(screen.getByText("All Effects")).toBeInTheDocument();
  });

  it("activates the current page link", () => {
    const onSearch = vi.fn();
    render(<DocsSidebar onSearchOpen={onSearch} />);
    const activeLink = screen.getByText("Using the Playground").closest("a");
    expect(activeLink?.className).toContain("bg-soft-stone");
    expect(activeLink?.className).toContain("font-medium");
  });

  it("renders search button", () => {
    const onSearch = vi.fn();
    render(<DocsSidebar onSearchOpen={onSearch} />);
    expect(screen.getByText("Search docs...")).toBeInTheDocument();
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });
});
