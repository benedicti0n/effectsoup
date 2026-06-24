import { describe, expect, it } from "vitest";
import { createPixelBuffer, renderAscii } from "./index.js";

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
      if (output.data[i] > 200 && output.data[i + 1] < 50 && output.data[i + 2] < 50) {
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
});
