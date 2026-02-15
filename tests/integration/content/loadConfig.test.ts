/**
 * Integration Tests for Configuration Loading
 *
 * Verifies that config.json is loaded and parsed correctly
 */

import { describe, it, expect } from "vitest";
import {
  loadConfig,
  getAllowedDepartments,
  getAllowedPhases,
  isModuleEnabled,
} from "@/lib/content/loadConfig";

describe("Configuration Loading", () => {
  describe("loadConfig", () => {
    it("should load config.json successfully", () => {
      const config = loadConfig();

      expect(config).toBeDefined();
      expect(config.tenant_id).toBeTruthy();
      expect(config.meta).toBeDefined();
      expect(config.meta.title).toBeTruthy();
    });

    it("should include governance configuration", () => {
      const config = loadConfig();

      expect(config.governance).toBeDefined();
    });
  });

  describe("getAllowedDepartments", () => {
    it("should return array of departments", () => {
      const departments = getAllowedDepartments();

      expect(Array.isArray(departments)).toBe(true);
    });
  });

  describe("getAllowedPhases", () => {
    it("should return array of phases", () => {
      const phases = getAllowedPhases();

      expect(Array.isArray(phases)).toBe(true);
      expect(phases.length).toBeGreaterThan(0);
    });
  });

  describe("isModuleEnabled", () => {
    it("should check matrix module flag", () => {
      const enabled = isModuleEnabled("matrix");

      expect(typeof enabled).toBe("boolean");
    });
  });
});
