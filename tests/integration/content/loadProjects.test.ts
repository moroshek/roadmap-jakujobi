/**
 * Integration Tests for Project Loading
 *
 * These tests verify the content layer works correctly
 * with the real seeded data in _content/projects/
 */

import { describe, it, expect } from "vitest";
import {
  readAllProjectFiles,
  readProjectFile,
  getProjectCount,
  getProjectsPath,
} from "@/lib/content/loadProjects";
import fs from "fs";

describe("Content Loading Integration", () => {
  describe("readAllProjectFiles", () => {
    it("should read all 4 seeded project files", () => {
      const projects = readAllProjectFiles();

      expect(projects).toHaveLength(4);
    });

    it("should return projects with expected structure", () => {
      const projects = readAllProjectFiles();

      projects.forEach((project) => {
        expect(project).toHaveProperty("filename");
        expect(project).toHaveProperty("frontmatter");
        expect(project).toHaveProperty("content");
        expect(project.filename).toMatch(/^PRJ-\d{3}\.md$/);
      });
    });

    it("should parse frontmatter correctly", () => {
      const projects = readAllProjectFiles();
      const firstProject = projects[0];

      expect(firstProject.frontmatter).toHaveProperty("id");
      expect(firstProject.frontmatter).toHaveProperty("title");
      expect(firstProject.frontmatter).toHaveProperty("scores");
    });

    it("should include markdown content body", () => {
      const projects = readAllProjectFiles();

      projects.forEach((project) => {
        expect(project.content).toBeTruthy();
        expect(typeof project.content).toBe("string");
      });
    });
  });

  describe("readProjectFile", () => {
    it("should read a specific project by ID", () => {
      const project = readProjectFile("PRJ-001");

      expect(project).not.toBeNull();
      expect(project?.filename).toBe("PRJ-001.md");
      expect((project?.frontmatter as { id?: string })?.id).toBe("PRJ-001");
    });

    it("should return null for non-existent project", () => {
      const project = readProjectFile("PRJ-999");

      expect(project).toBeNull();
    });
  });

  describe("getProjectCount", () => {
    it("should return correct count of projects", () => {
      const count = getProjectCount();

      expect(count).toBe(4);
    });
  });

  describe("path resolution", () => {
    it("should resolve correct projects path", () => {
      const projectsPath = getProjectsPath();

      expect(projectsPath).toContain("_content");
      expect(projectsPath).toContain("projects");
      expect(fs.existsSync(projectsPath)).toBe(true);
    });
  });
});
