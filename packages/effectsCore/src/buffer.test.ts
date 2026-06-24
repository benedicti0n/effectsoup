import { describe, expect, it } from "vitest";
import {
  clampByte,
  clonePixelBuffer,
  createPixelBuffer,
  fillPixelBuffer
} from "./buffer.js";

describe("buffer", () => {
  it("creates a zero-initialized buffer", () => {
    const buffer = createPixelBuffer(2, 2);
    expect(buffer.width).toBe(2);
    expect(buffer.height).toBe(2);
    expect(buffer.data.length).toBe(16);
    expect([...buffer.data].every((v) => v === 0)).toBe(true);
  });

  it("creates a filled buffer", () => {
    const buffer = createPixelBuffer(2, 2, [255, 0, 0, 255]);
    expect(buffer.data[0]).toBe(255);
    expect(buffer.data[1]).toBe(0);
    expect(buffer.data[2]).toBe(0);
    expect(buffer.data[3]).toBe(255);
  });

  it("clones a buffer", () => {
    const buffer = createPixelBuffer(2, 2, [10, 20, 30, 255]);
    const clone = clonePixelBuffer(buffer);
    expect(clone.data).not.toBe(buffer.data);
    expect([...clone.data]).toEqual([...buffer.data]);
  });

  it("fills a buffer in-place", () => {
    const buffer = createPixelBuffer(2, 2);
    fillPixelBuffer(buffer, [1, 2, 3, 4]);
    expect(buffer.data[0]).toBe(1);
    expect(buffer.data[4]).toBe(1);
  });

  it("clamps values to 0-255", () => {
    expect(clampByte(-10)).toBe(0);
    expect(clampByte(300)).toBe(255);
    expect(clampByte(128)).toBe(128);
  });

  it("rejects invalid dimensions", () => {
    expect(() => createPixelBuffer(0, 1)).toThrow();
  });
});
