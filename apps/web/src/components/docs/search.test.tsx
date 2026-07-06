import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchModal } from "./search";

vi.mock("@/lib/docs/search", () => ({
  searchDocs: vi.fn((query: string) => {
    if (query === "halftone") {
      return [
        { slug: "docs/effects/dotHalftone", title: "Dot Halftone", description: "A halftone effect", type: "effect" as const },
        { slug: "docs/api/core", title: "Core API", description: "Halftone rendering", type: "api" as const }
      ];
    }
    if (query === "test") {
      return [
        { slug: "docs/effects/someEffect", title: "Some Effect", description: "A test effect", type: "effect" as const }
      ];
    }
    return [];
  })
}));

describe("SearchModal", () => {
  it("does not render when closed", () => {
    const { container } = render(<SearchModal open={false} onClose={vi.fn()} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders when open", () => {
    render(<SearchModal open={true} onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search docs, effects, API...")).toBeInTheDocument();
  });

  it("focuses input when opened", async () => {
    render(<SearchModal open={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search docs, effects, API...");
    await waitFor(() => expect(document.activeElement).toBe(input));
  });

  it("shows search results for a query", () => {
    render(<SearchModal open={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search docs, effects, API...");
    fireEvent.change(input, { target: { value: "halftone" } });
    expect(screen.getByText("Dot Halftone")).toBeInTheDocument();
    expect(screen.getByText("A halftone effect")).toBeInTheDocument();
  });

  it("shows no results message for unmatched query", () => {
    render(<SearchModal open={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search docs, effects, API...");
    fireEvent.change(input, { target: { value: "xyznonexistent" } });
    expect(screen.getByText(/No results/)).toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    const onClose = vi.fn();
    render(<SearchModal open={true} onClose={onClose} />);
    const input = screen.getByPlaceholderText("Search docs, effects, API...");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("navigates with arrow keys", () => {
    render(<SearchModal open={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search docs, effects, API...");
    fireEvent.change(input, { target: { value: "test" } });
    expect(screen.getByText("Some Effect")).toBeInTheDocument();

    const firstItem = screen.getByText("Some Effect").closest("li");
    expect(firstItem?.getAttribute("aria-selected")).toBe("true");
  });

  it("has valid result links pointing to correct routes", () => {
    render(<SearchModal open={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search docs, effects, API...");
    fireEvent.change(input, { target: { value: "halftone" } });
    const link = screen.getByText("Dot Halftone").closest("a");
    expect(link?.getAttribute("href")).toBe("/docs/effects/dotHalftone");
  });

  it("closes when clicking backdrop", () => {
    const onClose = vi.fn();
    render(<SearchModal open={true} onClose={onClose} />);
    const backdrop = screen.getByRole("dialog").parentElement!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});
