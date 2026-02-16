import { describe, it, expect } from "vitest";
import { searchProjects } from "@/lib/projects/searchProjects";
import type { ProcessedProject } from "@/lib/types";

function makeProject(overrides: Partial<ProcessedProject>): ProcessedProject {
  return {
    id: "PRJ-001",
    title: "Factory Predictive Maintenance",
    slug: "factory-pm",
    owner: "VP Manufacturing",
    department: "Manufacturing",
    phase: "Foundation",
    status: "Active",
    dates: {
      planned_start: new Date(),
      planned_end: new Date(),
    },
    scores: { strategic_value: 8.6, complexity: 3.2, confidence: 0.87 },
    matrix: {
      impactNormalized: 86,
      effortNormalized: 32,
      quadrant: "Quick Wins",
    },
    financials: { estimated_cost: 620000, projected_roi: 2100000, currency: "USD" },
    tags: ["IoT", "Maintenance"],
    related_projects: [],
    ...overrides,
  } as ProcessedProject;
}

describe("searchProjects", () => {
  const projects = [
    makeProject({ id: "PRJ-001", title: "Factory Predictive Maintenance" }),
    makeProject({ id: "PRJ-002", title: "Battery Supply Risk Hedging" }),
  ];

  it("returns all projects when query is empty", () => {
    const result = searchProjects(projects, "");
    expect(result).toHaveLength(2);
  });

  it("returns all projects when query has less than 2 chars", () => {
    const result = searchProjects(projects, "F");
    expect(result).toHaveLength(2);
  });

  it("finds exact title match", () => {
    const result = searchProjects(projects, "Factory Predictive");
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].title).toContain("Factory");
  });

  it("searches by id", () => {
    const result = searchProjects(projects, "PRJ-001");
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe("PRJ-001");
  });
});
