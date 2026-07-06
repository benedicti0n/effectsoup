import { describe, expect, it, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { DocsPageShell } from "./pageShell";

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

vi.mock("@/lib/docs/navigation", () => ({
  getSectionForPage: vi.fn(() => ({
    section: { id: "test", title: "Test Section", pages: [] }
  })),
  getPreviousNext: vi.fn(() => ({
    prev: null,
    next: null
  }))
}));

describe("DocsPageShell", () => {
  it("renders children", () => {
    render(
      <DocsPageShell slug="docs/test">
        <h1>Test Page</h1>
      </DocsPageShell>
    );
    expect(screen.getByText("Test Page")).toBeInTheDocument();
  });

  it("renders breadcrumbs", () => {
    render(
      <DocsPageShell slug="docs/test">
        <p>Content</p>
      </DocsPageShell>
    );
    expect(screen.getByText("Test Section")).toBeInTheDocument();
  });

  it("renders TOC when content has headings", () => {
    render(
      <DocsPageShell slug="docs/test">
        <div id="docs-content">
          <h2 id="intro">Introduction</h2>
          <p>Content</p>
        </div>
      </DocsPageShell>
    );
    expect(screen.getByText("On this page")).toBeInTheDocument();
  });
});
