import { describe, expect, it } from "vitest";
import { allPresets, freePresets, premiumPresets } from "./index.js";
import { createPixelBuffer } from "@imageeffects/core";

describe("presets", () => {
  it("has 16 presets total", () => {
    expect(allPresets.length).toBe(16);
  });

  it("has 8 free and 8 premium presets", () => {
    expect(freePresets.length).toBe(8);
    expect(premiumPresets.length).toBe(8);
  });

  it("every preset resolves valid defaults", () => {
    for (const preset of allPresets) {
      const resolved = preset.intensityMapper(preset.defaultIntensity, {});
      expect(resolved.intensity).toBe(preset.defaultIntensity);
      expect(resolved.advancedOverrides).toEqual({});
    }
  });

  it("every preset pipeline produces output at requested size", () => {
    const source = createPixelBuffer(100, 100, [128, 128, 128, 255]);
    for (const preset of allPresets) {
      const resolved = preset.intensityMapper(50, {});
      const pipeline = preset.createPipeline(resolved);
      const output = pipeline(source, resolved);
      expect(output.width).toBe(source.width);
      expect(output.height).toBe(source.height);
      expect(output.data.length).toBe(source.data.length);
    }
  });

  it("advanced overrides take precedence", () => {
    const preset = allPresets[0];
    if (!preset) return;
    const resolved = preset.intensityMapper(50, { contrast: 42 });
    expect(resolved.contrast).toBe(42);
  });
});
