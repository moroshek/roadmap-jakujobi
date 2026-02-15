import { describe, test, expect } from "vitest";
import { normalizeScore } from "@/lib/governance/matrix";

describe("normalizeScore", () => {
  describe("basic transformations", () => {
    test("should return 0 for input 0", () => {
      expect(normalizeScore(0)).toBe(0);
    });

    test("should return 100 for input 10", () => {
      expect(normalizeScore(10)).toBe(100);
    });

    test("should return 50 for input 5", () => {
      expect(normalizeScore(5)).toBe(50);
    });

    test("should multiply by 10 for mid-range values", () => {
      expect(normalizeScore(2.5)).toBe(25);
      expect(normalizeScore(7.5)).toBe(75);
    });
  });

  describe("decimal handling", () => {
    test("should handle decimal inputs correctly", () => {
      expect(normalizeScore(8.6)).toBe(86);
      expect(normalizeScore(3.2)).toBe(32);
      expect(normalizeScore(1.5)).toBe(15);
    });

    test("should round to nearest integer", () => {
      expect(normalizeScore(5.5)).toBe(55);
      expect(normalizeScore(5.4)).toBe(54);
      expect(normalizeScore(5.6)).toBe(56);
    });
  });

  describe("clamping behavior", () => {
    test("should clamp negative values to 0", () => {
      expect(normalizeScore(-1)).toBe(0);
      expect(normalizeScore(-5)).toBe(0);
      expect(normalizeScore(-100)).toBe(0);
    });

    test("should clamp values over 10 to 100", () => {
      expect(normalizeScore(10.1)).toBe(100);
      expect(normalizeScore(15)).toBe(100);
      expect(normalizeScore(100)).toBe(100);
    });

    test("should handle boundary values exactly", () => {
      expect(normalizeScore(0)).toBe(0);
      expect(normalizeScore(10)).toBe(100);
    });
  });

  describe("edge cases", () => {
    test("should handle very small positive values", () => {
      expect(normalizeScore(0.1)).toBe(1);
      expect(normalizeScore(0.01)).toBe(0); // Rounds to 0
    });

    test("should handle values just under 10", () => {
      expect(normalizeScore(9.9)).toBe(99);
      expect(normalizeScore(9.99)).toBe(100); // Rounds to 100
    });
  });
});
