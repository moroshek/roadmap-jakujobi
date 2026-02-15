import { describe, test, expect } from "vitest";
import { assignQuadrant } from "@/lib/governance/matrix";

describe("assignQuadrant", () => {
  describe("Quick Wins (high impact, low effort)", () => {
    test("should assign Quick Wins for impact >= 50, effort < 50", () => {
      expect(assignQuadrant(50, 0)).toBe("Quick Wins");
      expect(assignQuadrant(50, 49)).toBe("Quick Wins");
      expect(assignQuadrant(100, 0)).toBe("Quick Wins");
      expect(assignQuadrant(75, 25)).toBe("Quick Wins");
    });

    test("should match seeded project PRJ-001", () => {
      // PRJ-001: strategic_value = 8.6 -> 86, complexity = 3.2 -> 32
      expect(assignQuadrant(86, 32)).toBe("Quick Wins");
    });
  });

  describe("Big Bets (high impact, high effort)", () => {
    test("should assign Big Bets for impact >= 50, effort >= 50", () => {
      expect(assignQuadrant(50, 50)).toBe("Big Bets");
      expect(assignQuadrant(50, 100)).toBe("Big Bets");
      expect(assignQuadrant(100, 50)).toBe("Big Bets");
      expect(assignQuadrant(100, 100)).toBe("Big Bets");
    });

    test("should match seeded project PRJ-002", () => {
      // PRJ-002: strategic_value = 9.1 -> 91, complexity = 8.2 -> 82
      expect(assignQuadrant(91, 82)).toBe("Big Bets");
    });
  });

  describe("Fillers (low impact, low effort)", () => {
    test("should assign Fillers for impact < 50, effort < 50", () => {
      expect(assignQuadrant(0, 0)).toBe("Fillers");
      expect(assignQuadrant(49, 0)).toBe("Fillers");
      expect(assignQuadrant(0, 49)).toBe("Fillers");
      expect(assignQuadrant(49, 49)).toBe("Fillers");
    });

    test("should match seeded project PRJ-003", () => {
      // PRJ-003: strategic_value = 3.9 -> 39, complexity = 2.8 -> 28
      expect(assignQuadrant(39, 28)).toBe("Fillers");
    });
  });

  describe("Time Sinks (low impact, high effort)", () => {
    test("should assign Time Sinks for impact < 50, effort >= 50", () => {
      expect(assignQuadrant(0, 50)).toBe("Time Sinks");
      expect(assignQuadrant(49, 50)).toBe("Time Sinks");
      expect(assignQuadrant(0, 100)).toBe("Time Sinks");
      expect(assignQuadrant(25, 75)).toBe("Time Sinks");
    });

    test("should match seeded project PRJ-004", () => {
      // PRJ-004: strategic_value = 4.1 -> 41, complexity = 8.7 -> 87
      expect(assignQuadrant(41, 87)).toBe("Time Sinks");
    });
  });

  describe("boundary conditions (critical for correctness)", () => {
    test("exactly 50 impact, below 50 effort -> Quick Wins", () => {
      expect(assignQuadrant(50, 0)).toBe("Quick Wins");
      expect(assignQuadrant(50, 49)).toBe("Quick Wins");
    });

    test("exactly 50 on both axes -> Big Bets", () => {
      expect(assignQuadrant(50, 50)).toBe("Big Bets");
    });

    test("below 50 impact, exactly 50 effort -> Time Sinks", () => {
      expect(assignQuadrant(0, 50)).toBe("Time Sinks");
      expect(assignQuadrant(49, 50)).toBe("Time Sinks");
    });

    test("below 50 on both axes -> Fillers", () => {
      expect(assignQuadrant(0, 0)).toBe("Fillers");
      expect(assignQuadrant(49, 49)).toBe("Fillers");
    });

    test("extreme values", () => {
      expect(assignQuadrant(100, 100)).toBe("Big Bets");
      expect(assignQuadrant(0, 0)).toBe("Fillers");
      expect(assignQuadrant(100, 0)).toBe("Quick Wins");
      expect(assignQuadrant(0, 100)).toBe("Time Sinks");
    });
  });

  describe("realistic scenarios", () => {
    test("high-value automation project (low effort)", () => {
      expect(assignQuadrant(85, 30)).toBe("Quick Wins");
    });

    test("major infrastructure overhaul (high impact, high cost)", () => {
      expect(assignQuadrant(90, 95)).toBe("Big Bets");
    });

    test("minor UI tweak (low impact, quick)", () => {
      expect(assignQuadrant(20, 15)).toBe("Fillers");
    });

    test("legacy system maintenance (low value, high effort)", () => {
      expect(assignQuadrant(30, 80)).toBe("Time Sinks");
    });
  });
});
