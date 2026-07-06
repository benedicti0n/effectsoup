import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Callout } from "./callout";

describe("Callout", () => {
  it("renders children", () => {
    render(<Callout>Hello world</Callout>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders a title when provided", () => {
    render(<Callout title="Note">Content</Callout>);
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders all variants without error", () => {
    const variants = ["note", "tip", "warning", "info"] as const;
    for (const v of variants) {
      render(<Callout variant={v}>{v} callout</Callout>);
      expect(screen.getByText(`${v} callout`)).toBeInTheDocument();
    }
  });
});
