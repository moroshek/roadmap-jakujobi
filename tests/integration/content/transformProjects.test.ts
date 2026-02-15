/**
 * Integration Tests for Project Transformation Pipeline
 *
 * These tests verify the complete data flow:
 * Raw markdown -> Parsed -> Validated -> Normalized -> Matrix-ready
 */

import { describe, it, expect } from "vitest";
import {
  transformProject,
  transformAllProjects,
  loadAndTransformProjects,
} from "@/lib/content/transformProjects";
import { readAllProjectFiles } from "@/lib/content/loadProjects";

describe("Project Transformation Pipeline", () => {
  describe("transformProject", () => {
    it("should transform valid project successfully", () => {
      const rawProjects = readAllProjectFiles();
      const firstRaw = rawProjects[0];

      const result = transformProject(firstRaw.frontmatter, firstRaw.filename);

      expect(result.success).toBe(true);
      expect(result.project).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it("should include normalized scores", () => {
      const rawProjects = readAllProjectFiles();
      const firstRaw = rawProjects[0];

      const result = transformProject(firstRaw.frontmatter, firstRaw.filename);

      expect(result.project?.matrix.impactNormalized).toBeGreaterThanOrEqual(0);
      expect(result.project?.matrix.impactNormalized).toBeLessThanOrEqual(100);
      expect(result.project?.matrix.effortNormalized).toBeGreaterThanOrEqual(0);
      expect(result.project?.matrix.effortNormalized).toBeLessThanOrEqual(100);
    });

    it("should include quadrant assignment", () => {
      const rawProjects = readAllProjectFiles();
      const firstRaw = rawProjects[0];

      const result = transformProject(firstRaw.frontmatter, firstRaw.filename);

      const validQuadrants = ["Quick Wins", "Big Bets", "Fillers", "Time Sinks"];
      expect(validQuadrants).toContain(result.project?.matrix.quadrant);
    });

    it("should convert date strings to Date objects", () => {
      const rawProjects = readAllProjectFiles();
      const firstRaw = rawProjects[0];

      const result = transformProject(firstRaw.frontmatter, firstRaw.filename);

      expect(result.project?.dates.planned_start).toBeInstanceOf(Date);
      expect(result.project?.dates.planned_end).toBeInstanceOf(Date);
    });

    it("should handle validation errors gracefully", () => {
      const invalidFrontmatter = {
        id: "INVALID",
        title: "Test",
      };

      const result = transformProject(invalidFrontmatter, "test.md");

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it("should reject invalid calendar dates (e.g., 2025-02-30)", () => {
      const rawProjects = readAllProjectFiles();
      const firstRaw = rawProjects[0];
      const frontmatterWithBadDate = {
        ...(firstRaw.frontmatter as object),
        dates: {
          planned_start: "2025-02-30",
          planned_end: "2026-07-15",
        },
      };

      const result = transformProject(frontmatterWithBadDate, firstRaw.filename);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.some((e) => e.toLowerCase().includes("date"))).toBe(
        true
      );
    });
  });

  describe("transformAllProjects", () => {
    it("should transform all 4 seeded projects", () => {
      const rawProjects = readAllProjectFiles();
      const result = transformAllProjects(rawProjects);

      expect(result.stats.total).toBe(4);
      expect(result.stats.successful).toBe(4);
      expect(result.stats.failed).toBe(0);
      expect(result.projects).toHaveLength(4);
      expect(result.errors).toHaveLength(0);
    });

    it("should include all required fields in processed projects", () => {
      const rawProjects = readAllProjectFiles();
      const result = transformAllProjects(rawProjects);

      result.projects.forEach((project) => {
        expect(project.id).toBeTruthy();
        expect(project.title).toBeTruthy();
        expect(project.slug).toBeTruthy();
        expect(project.owner).toBeTruthy();
        expect(project.department).toBeTruthy();
        expect(project.phase).toBeTruthy();
        expect(project.status).toBeTruthy();

        expect(project.dates.planned_start).toBeInstanceOf(Date);
        expect(project.dates.planned_end).toBeInstanceOf(Date);

        expect(project.scores.strategic_value).toBeGreaterThanOrEqual(0);
        expect(project.scores.strategic_value).toBeLessThanOrEqual(10);
        expect(project.scores.complexity).toBeGreaterThanOrEqual(0);
        expect(project.scores.complexity).toBeLessThanOrEqual(10);

        expect(project.matrix.impactNormalized).toBeGreaterThanOrEqual(0);
        expect(project.matrix.impactNormalized).toBeLessThanOrEqual(100);
        expect(project.matrix.effortNormalized).toBeGreaterThanOrEqual(0);
        expect(project.matrix.effortNormalized).toBeLessThanOrEqual(100);
        expect(project.matrix.quadrant).toBeTruthy();

        expect(project.financials).toBeDefined();
        expect(project.financials.currency).toBeTruthy();
      });
    });
  });

  describe("Seeded Projects Verification", () => {
    it("should map PRJ-001 to Quick Wins quadrant", () => {
      const rawProjects = readAllProjectFiles();
      const prj001 = rawProjects.find(
        (p) => (p.frontmatter as { id?: string })?.id === "PRJ-001"
      );

      expect(prj001).toBeDefined();
      const result = transformProject(prj001!.frontmatter, prj001!.filename);

      expect(result.success).toBe(true);
      expect(result.project?.matrix.impactNormalized).toBe(86);
      expect(result.project?.matrix.effortNormalized).toBe(32);
      expect(result.project?.matrix.quadrant).toBe("Quick Wins");
    });

    it("should map PRJ-002 to Big Bets quadrant", () => {
      const rawProjects = readAllProjectFiles();
      const prj002 = rawProjects.find(
        (p) => (p.frontmatter as { id?: string })?.id === "PRJ-002"
      );

      expect(prj002).toBeDefined();
      const result = transformProject(prj002!.frontmatter, prj002!.filename);

      expect(result.success).toBe(true);
      expect(result.project?.matrix.impactNormalized).toBe(91);
      expect(result.project?.matrix.effortNormalized).toBe(82);
      expect(result.project?.matrix.quadrant).toBe("Big Bets");
    });

    it("should map PRJ-003 to Fillers quadrant", () => {
      const rawProjects = readAllProjectFiles();
      const prj003 = rawProjects.find(
        (p) => (p.frontmatter as { id?: string })?.id === "PRJ-003"
      );

      expect(prj003).toBeDefined();
      const result = transformProject(prj003!.frontmatter, prj003!.filename);

      expect(result.success).toBe(true);
      expect(result.project?.matrix.impactNormalized).toBe(39);
      expect(result.project?.matrix.effortNormalized).toBe(28);
      expect(result.project?.matrix.quadrant).toBe("Fillers");
    });

    it("should map PRJ-004 to Time Sinks quadrant", () => {
      const rawProjects = readAllProjectFiles();
      const prj004 = rawProjects.find(
        (p) => (p.frontmatter as { id?: string })?.id === "PRJ-004"
      );

      expect(prj004).toBeDefined();
      const result = transformProject(prj004!.frontmatter, prj004!.filename);

      expect(result.success).toBe(true);
      expect(result.project?.matrix.impactNormalized).toBe(41);
      expect(result.project?.matrix.effortNormalized).toBe(87);
      expect(result.project?.matrix.quadrant).toBe("Time Sinks");
    });

    it("should have exactly one project per quadrant", () => {
      const result = loadAndTransformProjects();

      const quadrants = result.projects.map((p) => p.matrix.quadrant);
      const uniqueQuadrants = new Set(quadrants);

      expect(uniqueQuadrants.size).toBe(4);
      expect(uniqueQuadrants.has("Quick Wins")).toBe(true);
      expect(uniqueQuadrants.has("Big Bets")).toBe(true);
      expect(uniqueQuadrants.has("Fillers")).toBe(true);
      expect(uniqueQuadrants.has("Time Sinks")).toBe(true);
    });
  });

  describe("loadAndTransformProjects", () => {
    it("should load and transform in one call", () => {
      const result = loadAndTransformProjects();

      expect(result.projects).toHaveLength(4);
      expect(result.stats.successful).toBe(4);
      expect(result.stats.failed).toBe(0);
    });

    it("should return consistent results", () => {
      const result1 = loadAndTransformProjects();
      const result2 = loadAndTransformProjects();

      expect(result1.projects.length).toBe(result2.projects.length);
      expect(result1.projects[0].id).toBe(result2.projects[0].id);
    });
  });
});
