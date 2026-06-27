import { describe, expect, it } from "vitest";
import { ASCII_CHARSET_PRESETS, createPixelBuffer, normalizeCustomCharset, renderAscii, renderLuminousAsciiBloom, renderSymbolGlow } from "./index.js";

describe("renderAscii", () => {
  it("renders monochrome ASCII at source size", () => {
    const source = createPixelBuffer(50, 50, [128, 128, 128, 255]);
    const output = renderAscii(source, {
      fontSize: 10,
      inkColor: [255, 255, 255, 255],
      backgroundColor: [0, 0, 0, 255]
    });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
    expect(output.data.length).toBe(source.data.length);
  });

  it("uses source color in source color mode", () => {
    const source = createPixelBuffer(40, 40, [255, 0, 0, 255]);
    const output = renderAscii(source, {
      fontSize: 8,
      inkColor: [255, 255, 255, 255],
      backgroundColor: [0, 0, 0, 255],
      colorMode: "source"
    });
    // Some glyph pixels should carry the source red color.
    let foundRed = false;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i] > 100 && output.data[i + 1] < 50 && output.data[i + 2] < 50) {
        foundRed = true;
        break;
      }
    }
    expect(foundRed).toBe(true);
  });

  it("throws on empty charset", () => {
    const source = createPixelBuffer(10, 10, [128, 128, 128, 255]);
    expect(() =>
      renderAscii(source, {
        fontSize: 8,
        inkColor: [255, 255, 255, 255],
        backgroundColor: [0, 0, 0, 255],
        charset: ""
      })
    ).toThrow("charset must not be empty");
  });

  it("uses a multi-character ordered ramp by default", () => {
    const source = createPixelBuffer(60, 60, [128, 128, 128, 255]);
    const output = renderAscii(source, {
      fontSize: 8,
      inkColor: [255, 255, 255, 255],
      backgroundColor: [0, 0, 0, 255],
      charset: ASCII_CHARSET_PRESETS.dense
    });
    expect(ASCII_CHARSET_PRESETS.dense.length).toBeGreaterThan(10);
    // Ensure something was drawn (not all background).
    let drawnPixels = 0;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i] > 0) drawnPixels++;
    }
    expect(drawnPixels).toBeGreaterThan(0);
  });

  it("supports a custom character set", () => {
    const source = createPixelBuffer(40, 40, [255, 255, 255, 255]);
    const output = renderAscii(source, {
      fontSize: 8,
      inkColor: [255, 255, 255, 255],
      backgroundColor: [0, 0, 0, 255],
      charset: normalizeCustomCharset("XO")
    });
    let foundXOrO = false;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i] > 0) {
        foundXOrO = true;
        break;
      }
    }
    expect(foundXOrO).toBe(true);
  });

  it("falls back to dense preset for invalid custom charset", () => {
    expect(normalizeCustomCharset(" ")).toBe(ASCII_CHARSET_PRESETS.dense);
    expect(normalizeCustomCharset("")).toBe(ASCII_CHARSET_PRESETS.dense);
    expect(normalizeCustomCharset("   ")).toBe(ASCII_CHARSET_PRESETS.dense);
  });

  it("respects a density map by skipping low-density cells", () => {
    const source = createPixelBuffer(40, 40, [200, 200, 200, 255]);
    // Left half of the density map is black (no symbols), right half is white.
    const densityMap = createPixelBuffer(40, 40, [0, 0, 0, 255]);
    for (let y = 0; y < 40; y++) {
      for (let x = 20; x < 40; x++) {
        const idx = (y * 40 + x) * 4;
        densityMap.data[idx] = 255;
        densityMap.data[idx + 1] = 255;
        densityMap.data[idx + 2] = 255;
      }
    }

    const output = renderAscii(source, {
      fontSize: 8,
      inkColor: [255, 255, 255, 255],
      backgroundColor: [0, 0, 0, 255],
      charset: "@",
      densityMap
    });

    let leftDrawn = 0;
    let rightDrawn = 0;
    for (let y = 0; y < 40; y++) {
      for (let x = 0; x < 40; x++) {
        const idx = (y * 40 + x) * 4;
        if (output.data[idx] > 50) {
          if (x < 20) leftDrawn++;
          else rightDrawn++;
        }
      }
    }
    expect(rightDrawn).toBeGreaterThan(leftDrawn * 4);
  });
});

describe("renderSymbolGlow", () => {
  it("renders luminous symbols over a blurred base at source size", () => {
    const source = createPixelBuffer(60, 60, [128, 128, 128, 255]);
    const output = renderSymbolGlow(source, {
      cellSize: 10,
      blur: 8,
      brightness: 1.05,
      charset: " .e/+*=2"
    });
    expect(output.width).toBe(source.width);
    expect(output.height).toBe(source.height);
  });

  it("draws more symbols in bright regions than dark regions", () => {
    const source = createPixelBuffer(60, 40, [0, 0, 0, 255]);
    for (let i = 0; i < source.data.length; i += 4) {
      const x = (i / 4) % 60;
      if (x >= 30) {
        source.data[i] = 230;
        source.data[i + 1] = 230;
        source.data[i + 2] = 230;
      }
    }

    const output = renderSymbolGlow(source, {
      cellSize: 8,
      blur: 8,
      brightness: 1.0,
      charset: " .e/+*=2",
      colorMode: "monochrome"
    });

    let leftDrawn = 0;
    let rightDrawn = 0;
    for (let i = 0; i < output.data.length; i += 4) {
      const x = (i / 4) % 60;
      if (output.data[i] > 80 || output.data[i + 1] > 80 || output.data[i + 2] > 80) {
        if (x < 30) leftDrawn++;
        else rightDrawn++;
      }
    }
    expect(rightDrawn).toBeGreaterThan(leftDrawn * 3);
  });

  it("uses source color in colored mode", () => {
    const source = createPixelBuffer(50, 50, [200, 50, 50, 255]);
    const output = renderSymbolGlow(source, {
      cellSize: 8,
      blur: 6,
      brightness: 1.0,
      charset: " .e/+*=2",
      colorMode: "colored",
      colorBoost: 0
    });

    let foundRed = false;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i] > 120 && output.data[i + 1] < 80 && output.data[i + 2] < 80) {
        foundRed = true;
        break;
      }
    }
    expect(foundRed).toBe(true);
  });
});

describe("renderLuminousAsciiBloom", () => {
  it("produces a clearly visible glyph layer at default settings", () => {
    const source = createPixelBuffer(60, 60, [128, 128, 128, 255]);
    const output = renderLuminousAsciiBloom(source, {
      fontSize: 10,
      density: 10,
      bloomRadius: 10,
      glowAmount: 0.6
    });

    let glyphLike = 0;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i] > 40 || output.data[i + 1] > 40 || output.data[i + 2] > 40) {
        glyphLike++;
      }
    }
    expect(glyphLike).toBeGreaterThan(output.data.length / 4 * 0.1);
  });

  it("blooms bright regions more than dark regions", () => {
    // Left half dark, right half bright.
    const source = createPixelBuffer(60, 40, [40, 40, 40, 255]);
    for (let i = 0; i < source.data.length; i += 4) {
      const x = (i / 4) % 60;
      if (x >= 30) {
        source.data[i] = 220;
        source.data[i + 1] = 220;
        source.data[i + 2] = 220;
      }
    }

    const output = renderLuminousAsciiBloom(source, {
      fontSize: 8,
      density: 10,
      bloomRadius: 8,
      glowAmount: 0.8
    });

    let leftBright = 0;
    let rightBright = 0;
    for (let i = 0; i < output.data.length; i += 4) {
      const x = (i / 4) % 60;
      if (output.data[i] > 120) {
        if (x < 30) leftBright++;
        else rightBright++;
      }
    }
    expect(rightBright).toBeGreaterThan(leftBright * 2);
  });

  it("keeps crisp glyph content after bloom composition", () => {
    const source = createPixelBuffer(50, 50, [180, 180, 180, 255]);
    const output = renderLuminousAsciiBloom(source, {
      fontSize: 8,
      density: 10,
      bloomRadius: 8,
      glowAmount: 0.6
    });

    // There should be both bright glyph pixels and darker base pixels, not a uniform haze.
    let bright = 0;
    let dark = 0;
    for (let i = 0; i < output.data.length; i += 4) {
      if (output.data[i] > 120) bright++;
      if (output.data[i] < 50) dark++;
    }
    expect(bright).toBeGreaterThan(0);
    expect(dark).toBeGreaterThan(0);
  });
});
