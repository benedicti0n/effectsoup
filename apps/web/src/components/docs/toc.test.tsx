import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { TableOfContents } from "./toc";

const originalIntersectionObserver = globalThis.IntersectionObserver;

beforeAll(() => {
  globalThis.IntersectionObserver = class MockObserver {
    constructor() { /* noop */ }
    observe() { /* noop */ }
    unobserve() { /* noop */ }
    disconnect() { /* noop */ }
  } as unknown as typeof IntersectionObserver;
});

afterAll(() => {
  globalThis.IntersectionObserver = originalIntersectionObserver;
});

describe("TableOfContents", () => {
  it("renders nothing when items are empty", () => {
    const { container } = render(<TableOfContents items={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders TOC items", () => {
    const items = [
      { id: "intro", text: "Introduction", level: 2 as const },
      { id: "details", text: "Details", level: 3 as const }
    ];

    render(<TableOfContents items={items} />);
    expect(screen.getByText("On this page")).toBeInTheDocument();
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("indents level 3 items", () => {
    const items = [
      { id: "sub", text: "Sub Section", level: 3 as const }
    ];

    render(<TableOfContents items={items} />);
    const link = screen.getByText("Sub Section").closest("a");
    expect(link?.className).toContain("pl-4");
  });

  it("renders anchor links", () => {
    const items = [
      { id: "intro", text: "Introduction", level: 2 as const }
    ];

    render(<TableOfContents items={items} />);
    const link = screen.getByText("Introduction").closest("a");
    expect(link?.getAttribute("href")).toBe("#intro");
  });
});
