import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ApiSignature, ParamsTable } from "./apiTable";

describe("ApiSignature", () => {
  it("renders the signature", () => {
    render(<ApiSignature signature="fn(a: number): void" />);
    expect(screen.getByText("fn(a: number): void")).toBeInTheDocument();
  });

  it("renders children as description", () => {
    render(<ApiSignature signature="fn()">Does something</ApiSignature>);
    expect(screen.getByText("Does something")).toBeInTheDocument();
  });
});

describe("ParamsTable", () => {
  it("renders parameter rows", () => {
    const params = [
      { name: "width", type: "number", description: "Width in pixels" },
      { name: "height", type: "number", description: "Height in pixels" }
    ];

    render(<ParamsTable params={params} />);
    expect(screen.getByText("width")).toBeInTheDocument();
    expect(screen.getByText("height")).toBeInTheDocument();
    expect(screen.getByText("Width in pixels")).toBeInTheDocument();
    expect(screen.getByText("Height in pixels")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<ParamsTable params={[]} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders type as InlineCode", () => {
    render(<ParamsTable params={[{ name: "x", type: "string", description: "desc" }]} />);
    expect(screen.getByText("string")).toBeInTheDocument();
  });

  it("handles empty params array", () => {
    const { container } = render(<ParamsTable params={[]} />);
    expect(container.querySelector("tbody")?.children.length).toBe(0);
  });
});
