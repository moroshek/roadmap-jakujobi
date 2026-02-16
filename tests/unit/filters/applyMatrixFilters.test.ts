/**
 * Unit Tests for applyMatrixFilters
 */

import { describe, it, expect } from "vitest";
import {
  applyMatrixFilters,
  countActiveFilters,
  parseFiltersFromURL,
  serializeFiltersToURL,
} from "@/lib/filters/applyMatrixFilters";
import type { ProcessedProject } from "@/lib/types";

function createMockProject(
  overrides: Partial<ProcessedProject>
): ProcessedProject {
  return {
    id: "PRJ-001",
    title: "Test",
    slug: "test",
    owner: "Owner",
    department: "Manufacturing",
    phase: "Foundation",
    status: "Active",
    dates: {
      planned_start: new Date(),
      planned_end: new Date(),
    },
    scores: { strategic_value: 5, complexity: 5, confidence: 0.8 },
    matrix: { impactNormalized: 50, effortNormalized: 50, quadrant: "Big Bets" },
    financials: { estimated_cost: 100, projected_roi: 200, currency: "USD" },
    tags: [],
    related_projects: [],
    ...overrides,
  };
}

const mockProjects: ProcessedProject[] = [
  createMockProject({
    id: "PRJ-001",
    department: "Manufacturing",
    phase: "Foundation",
    status: "Active",
  }),
  createMockProject({
    id: "PRJ-002",
    department: "Sales",
    phase: "Scale",
    status: "Queued",
  }),
  createMockProject({
    id: "PRJ-003",
    department: "Sales",
    phase: "Acceleration",
    status: "Backlog",
  }),
  createMockProject({
    id: "PRJ-004",
    department: "After-Sales",
    phase: "Foundation",
    status: "Queued",
  }),
];

describe("applyMatrixFilters", () => {
  it("returns all projects when no filters applied", () => {
    const filters = { departments: [], phases: [], statuses: [] };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(4);
  });

  it("filters by single department", () => {
    const filters = {
      departments: ["Sales"],
      phases: [],
      statuses: [],
    };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.department === "Sales")).toBe(true);
  });

  it("filters by multiple departments (OR logic)", () => {
    const filters = {
      departments: ["Sales", "Manufacturing"],
      phases: [],
      statuses: [],
    };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(3);
  });

  it("applies AND logic across categories", () => {
    const filters = {
      departments: ["Sales"],
      phases: ["Scale"],
      statuses: [],
    };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("PRJ-002");
  });

  it("returns empty array when no matches", () => {
    const filters = {
      departments: ["Manufacturing"],
      phases: ["Scale"],
      statuses: [],
    };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(0);
  });

  it("filters by status", () => {
    const filters = {
      departments: [],
      phases: [],
      statuses: ["Queued"],
    };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(2);
  });
});

describe("countActiveFilters", () => {
  it("counts total active filters", () => {
    const filters = {
      departments: ["Sales", "Manufacturing"],
      phases: ["Foundation"],
      statuses: [],
    };
    expect(countActiveFilters(filters)).toBe(3);
  });

  it("returns 0 when no filters", () => {
    const filters = {
      departments: [],
      phases: [],
      statuses: [],
    };
    expect(countActiveFilters(filters)).toBe(0);
  });
});

describe("parseFiltersFromURL", () => {
  it("parses multiple values correctly", () => {
    const params = new URLSearchParams(
      "dept=Sales&dept=Manufacturing&phase=Foundation"
    );
    const result = parseFiltersFromURL(params);
    expect(result.departments).toEqual(["Sales", "Manufacturing"]);
    expect(result.phases).toEqual(["Foundation"]);
    expect(result.statuses).toEqual([]);
  });

  it("returns empty arrays for empty params", () => {
    const params = new URLSearchParams();
    const result = parseFiltersFromURL(params);
    expect(result).toEqual({
      departments: [],
      phases: [],
      statuses: [],
    });
  });
});

describe("serializeFiltersToURL", () => {
  it("serializes filters to query string", () => {
    const filters = {
      departments: ["Sales"],
      phases: ["Foundation"],
      statuses: [],
    };
    const result = serializeFiltersToURL(filters);
    expect(result).toContain("dept=Sales");
    expect(result).toContain("phase=Foundation");
  });
});
