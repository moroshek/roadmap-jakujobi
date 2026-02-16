import { describe, it, expect } from "vitest";
import {
  calculateTimelineScale,
  calculateProjectPosition,
  calculateTodayPosition,
} from "@/lib/gantt/calculateTimelineScale";
import type { ProcessedProject } from "@/lib/types";

function makeProject(
  overrides: Partial<ProcessedProject> & {
    dates: { planned_start: Date; planned_end: Date };
  }
): ProcessedProject {
  return {
    id: "PRJ-001",
    title: "Test Project",
    slug: "test",
    owner: "Test",
    department: "Test",
    phase: "Foundation",
    status: "Active",
    dates: overrides.dates,
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

describe("calculateTimelineScale", () => {
  it("calculates correct date range with padding for multiple projects", () => {
    const projects = [
      makeProject({
        dates: {
          planned_start: new Date("2026-01-01"),
          planned_end: new Date("2026-03-31"),
        },
      }),
      makeProject({
        dates: {
          planned_start: new Date("2026-02-15"),
          planned_end: new Date("2026-06-30"),
        },
      }),
    ];

    const scale = calculateTimelineScale(projects, 4);

    expect(scale.startDate.getTime()).toBeLessThan(
      new Date("2026-01-01").getTime()
    );
    expect(scale.endDate.getTime()).toBeGreaterThan(
      new Date("2026-06-30").getTime()
    );
    expect(scale.dayWidth).toBe(4);
    expect(scale.totalWidth).toBeGreaterThan(0);
  });

  it("returns default scale for empty projects", () => {
    const scale = calculateTimelineScale([]);

    expect(scale.startDate).toBeInstanceOf(Date);
    expect(scale.endDate).toBeInstanceOf(Date);
    expect(scale.totalWidth).toBe(28 * 4);
  });
});

describe("calculateProjectPosition", () => {
  it("maps project dates to pixel positions", () => {
    const project = makeProject({
      dates: {
        planned_start: new Date("2026-01-15"),
        planned_end: new Date("2026-02-15"),
      },
    });

    const scale = calculateTimelineScale([project], 4);
    const position = calculateProjectPosition(project, scale, 0);

    expect(position.x).toBeGreaterThanOrEqual(0);
    expect(position.width).toBeGreaterThan(0);
    expect(position.y).toBe(0);
  });
});

describe("calculateTodayPosition", () => {
  it("returns null when today is outside scale range", () => {
    const project = makeProject({
      dates: {
        planned_start: new Date("2020-01-01"),
        planned_end: new Date("2020-06-30"),
      },
    });

    const scale = calculateTimelineScale([project]);
    const pos = calculateTodayPosition(scale);

    expect(pos).toBeNull();
  });
});
