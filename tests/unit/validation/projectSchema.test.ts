import { describe, test, expect } from "vitest";
import {
  ProjectSchema,
  validateProject,
  safeValidateProject,
} from "@/lib/validation/projectSchema";

describe("ProjectSchema", () => {
  const validProject = {
    id: "PRJ-001",
    title: "Factory Predictive Maintenance",
    slug: "factory-predictive-maintenance",
    owner: "VP Manufacturing",
    department: "Manufacturing",
    phase: "Foundation",
    status: "Active",
    dates: {
      planned_start: "2026-02-01",
      planned_end: "2026-07-15",
    },
    scores: {
      strategic_value: 8.6,
      complexity: 3.2,
      confidence: 0.87,
    },
    financials: {
      estimated_cost: 620000,
      projected_roi: 2100000,
      currency: "USD",
    },
    tags: ["IoT", "AI"],
    related_projects: [],
  };

  describe("valid projects", () => {
    test("should accept complete valid project", () => {
      const result = ProjectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    test("should accept project with optional actual_start", () => {
      const withActualStart = {
        ...validProject,
        dates: { ...validProject.dates, actual_start: "2026-02-05" },
      };
      const result = ProjectSchema.safeParse(withActualStart);
      expect(result.success).toBe(true);
    });

    test("should accept all valid departments", () => {
      const departments = [
        "Manufacturing",
        "Supply Chain",
        "Sales",
        "After-Sales",
      ];

      departments.forEach((dept) => {
        const project = { ...validProject, department: dept };
        const result = ProjectSchema.safeParse(project);
        expect(result.success).toBe(true);
      });
    });

    test("should accept all valid phases", () => {
      const phases = ["Foundation", "Acceleration", "Scale"];

      phases.forEach((phase) => {
        const project = { ...validProject, phase };
        const result = ProjectSchema.safeParse(project);
        expect(result.success).toBe(true);
      });
    });

    test("should accept all valid statuses", () => {
      const statuses = ["Backlog", "Queued", "Active", "Paused", "Complete"];

      statuses.forEach((status) => {
        const project = { ...validProject, status };
        const result = ProjectSchema.safeParse(project);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("invalid projects", () => {
    test("should reject invalid ID format", () => {
      const invalid = { ...validProject, id: "INVALID" };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject empty title", () => {
      const invalid = { ...validProject, title: "" };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject invalid department", () => {
      const invalid = { ...validProject, department: "InvalidDept" };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject invalid phase", () => {
      const invalid = { ...validProject, phase: "InvalidPhase" };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject invalid status", () => {
      const invalid = { ...validProject, status: "InvalidStatus" };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject strategic_value > 10", () => {
      const invalid = {
        ...validProject,
        scores: { ...validProject.scores, strategic_value: 15 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject strategic_value < 0", () => {
      const invalid = {
        ...validProject,
        scores: { ...validProject.scores, strategic_value: -1 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject complexity > 10", () => {
      const invalid = {
        ...validProject,
        scores: { ...validProject.scores, complexity: 12 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject confidence > 1", () => {
      const invalid = {
        ...validProject,
        scores: { ...validProject.scores, confidence: 1.5 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject invalid date format", () => {
      const invalid = {
        ...validProject,
        dates: { ...validProject.dates, planned_start: "02/01/2026" },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject negative cost", () => {
      const invalid = {
        ...validProject,
        financials: { ...validProject.financials, estimated_cost: -1000 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject invalid currency format", () => {
      const invalid = {
        ...validProject,
        financials: { ...validProject.financials, currency: "USDOLLAR" },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test("should reject missing required fields", () => {
      const invalid = { id: "PRJ-001", title: "Test" };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("validation helpers", () => {
    test("validateProject should throw on invalid data", () => {
      const invalid = { ...validProject, id: "INVALID" };
      expect(() => validateProject(invalid)).toThrow();
    });

    test("validateProject should return typed data on valid input", () => {
      const result = validateProject(validProject);
      expect(result.id).toBe("PRJ-001");
      expect(result.title).toBe("Factory Predictive Maintenance");
    });

    test("safeValidateProject should not throw on invalid data", () => {
      const invalid = { ...validProject, id: "INVALID" };
      const result = safeValidateProject(invalid);
      expect(result.success).toBe(false);
    });

    test("safeValidateProject should return success=true on valid data", () => {
      const result = safeValidateProject(validProject);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("PRJ-001");
      }
    });
  });
});
