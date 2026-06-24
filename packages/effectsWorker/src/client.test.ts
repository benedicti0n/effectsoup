import { describe, expect, it } from "vitest";
import type { RenderResultMessage } from "./types.js";

describe("worker types", () => {
  it("has a render result message type", () => {
    const message: RenderResultMessage = {
      type: "renderResult",
      renderVersion: 1,
      output: {
        width: 1,
        height: 1,
        data: new Uint8ClampedArray([0, 0, 0, 255])
      }
    };
    expect(message.renderVersion).toBe(1);
  });
});
