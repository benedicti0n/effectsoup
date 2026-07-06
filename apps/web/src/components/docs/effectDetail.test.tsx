import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EffectDetailPage } from "./effectDetail";

const mockEffect = {
  id: "dotHalftone",
  name: "Dot Halftone",
  description: "A colored dot halftone effect",
  category: "printPaper",
  defaultIntensity: 50,
  usesIntensity: true,
  advancedControlSchema: [
    { id: "dotSize", name: "Dot Size", type: "range" as const, min: 2, max: 32, step: 1, defaultValue: 8 }
  ]
};

const mockCategory = {
  name: "Print & Paper",
  description: "Effects that simulate print media",
  bestFor: "editorial photos",
  idealImages: "High-contrast images with strong tonal separation"
};

describe("EffectDetailPage", () => {
  it("renders effect name and description", () => {
    render(
      <EffectDetailPage
        effect={mockEffect}
        premium={false}
        category={mockCategory}
        relatedEffects={[]}
      />
    );
    expect(screen.getByText("Dot Halftone")).toBeInTheDocument();
    expect(screen.getByText("A colored dot halftone effect")).toBeInTheDocument();
  });

  it("shows Premium badge for premium effects", () => {
    render(
      <EffectDetailPage
        effect={mockEffect}
        premium={true}
        category={mockCategory}
        relatedEffects={[]}
      />
    );
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });

  it("renders advanced control table", () => {
    render(
      <EffectDetailPage
        effect={mockEffect}
        premium={false}
        category={mockCategory}
        relatedEffects={[]}
      />
    );
    expect(screen.getByText("Dot Size")).toBeInTheDocument();
    expect(screen.getByText("2 – 32 (step 1)")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders related effects when provided", () => {
    render(
      <EffectDetailPage
        effect={mockEffect}
        premium={false}
        category={mockCategory}
        relatedEffects={[
          { id: "pixelGrid", name: "Pixel Grid", description: "Grid effect" }
        ]}
      />
    );
    expect(screen.getByText("Pixel Grid")).toBeInTheDocument();
    expect(screen.getByText("Grid effect")).toBeInTheDocument();
  });

  it("renders breadcrumb link to effects catalog", () => {
    render(
      <EffectDetailPage
        effect={mockEffect}
        premium={false}
        category={mockCategory}
        relatedEffects={[]}
      />
    );
    expect(screen.getByText("Effects Catalog")).toBeInTheDocument();
  });

  it("shows callout with playground link", () => {
    render(
      <EffectDetailPage
        effect={mockEffect}
        premium={false}
        category={mockCategory}
        relatedEffects={[]}
      />
    );
    expect(screen.getByText(/Open this effect in the playground/)).toBeInTheDocument();
  });
});
