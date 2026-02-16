/**
 * Mock ProcessedProject for matrix component tests
 */

import type { ProcessedProject } from "@/lib/types";

export const mockProject: ProcessedProject = {
  id: "PRJ-001",
  title: "Quick Win Project",
  slug: "quick-win",
  owner: "Owner A",
  department: "Sales",
  phase: "Foundation",
  status: "Active",
  dates: {
    planned_start: new Date("2026-01-01"),
    planned_end: new Date("2026-06-01"),
  },
  scores: {
    strategic_value: 8.6,
    complexity: 3.2,
    confidence: 0.9,
  },
  matrix: {
    impactNormalized: 86,
    effortNormalized: 32,
    quadrant: "Quick Wins",
  },
  financials: {
    estimated_cost: 45000,
    projected_roi: 120000,
    currency: "USD",
  },
  tags: ["AI", "Automation"],
  related_projects: [],
};

export const mockProjects: ProcessedProject[] = [mockProject];
