import { describe, it, expect } from "vitest";
import { groupProjects } from "@/lib/gantt/groupProjects";
import type { ProcessedProject } from "@/lib/types";

function makeProject(overrides: Partial<ProcessedProject>): ProcessedProject {
  return {
    id: "PRJ-001",
    title: "Test",
    slug: "test",
    owner: "Test",
    department: "Manufacturing",
    phase: "Foundation",
    status: "Active",
    dates: {
      planned_start: new Date(),
      planned_end: new Date(),
    },
    scores: { strategic_value: 5, complexity: 5, confidence: 0.8 },
    matrix: {
      impactNormalized: 50,
      effortNormalized: 50,
      quadrant: "Big Bets",
    },
    financials: { estimated_cost: 0, projected_roi: 0, currency: "USD" },
    tags: [],
    related_projects: [],
    ...overrides,
  } as ProcessedProject;
}

describe("groupProjects", () => {
  it("groups by department correctly", () => {
    const projects = [
      makeProject({ id: "P1", department: "Sales" }),
      makeProject({ id: "P2", department: "Sales" }),
      makeProject({ id: "P3", department: "Manufacturing" }),
    ];

    const groups = groupProjects(projects, "department");

    expect(groups).toHaveLength(2);
    const sales = groups.find((g) => g.label === "Sales");
    const mfg = groups.find((g) => g.label === "Manufacturing");
    expect(sales?.projects).toHaveLength(2);
    expect(mfg?.projects).toHaveLength(1);
  });

  it("returns flat list when dimension is none", () => {
    const projects = [
      makeProject({ id: "P1" }),
      makeProject({ id: "P2" }),
    ];

    const groups = groupProjects(projects, "none");

    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe("All Projects");
    expect(groups[0].projects).toHaveLength(2);
  });

  it("sorts groups alphabetically", () => {
    const projects = [
      makeProject({ id: "P1", department: "Manufacturing" }),
      makeProject({ id: "P2", department: "Sales" }),
    ];

    const groups = groupProjects(projects, "department");

    expect(groups[0].label).toBe("Manufacturing");
    expect(groups[1].label).toBe("Sales");
  });
});
