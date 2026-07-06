import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CodeBlock, InlineCode } from "./code";

describe("CodeBlock", () => {
  it("renders code content", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("renders language label when provided", () => {
    render(<CodeBlock code="const x = 1;" language="typescript" />);
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("shows copy button and toggles state on click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true
    });

    render(<CodeBlock code="hello" />);
    const btn = screen.getByLabelText("Copy code");
    expect(btn).toHaveTextContent("Copy");

    fireEvent.click(btn);
    expect(writeText).toHaveBeenCalledWith("hello");
  });
});

describe("InlineCode", () => {
  it("renders children", () => {
    render(<InlineCode>PixelBuffer</InlineCode>);
    expect(screen.getByText("PixelBuffer")).toBeInTheDocument();
  });
});
