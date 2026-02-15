/**
 * Configuration Loader for Tenant Settings
 *
 * Loads _content/config.json which contains:
 * - Tenant metadata
 * - Design tokens (colors, fonts)
 * - Feature flags
 * - Governance rules
 */

import fs from "fs";
import path from "path";
import { getContentPath } from "./loadProjects";

/**
 * Tenant configuration structure
 * Based on PRD Section 3.1 and actual config.json schema
 */
export interface TenantConfig {
  tenant_id: string;
  meta: {
    title: string;
    logo_url?: string;
    favicon_url?: string;
  };
  design_tokens?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
    };
    typography?: {
      heading_font?: string;
      body_font?: string;
    };
  };
  modules?: {
    enable_matrix?: boolean;
    enable_gantt?: boolean;
    enable_blog?: boolean;
  };
  governance?: {
    fiscal_year_start?: string;
    max_concurrent_projects?: number;
    phases?: string[];
    departments?: string[];
  };
  taxonomies?: {
    departments?: string[];
    statuses?: string[];
  };
}

/**
 * Load tenant configuration from _content/config.json
 *
 * @returns Parsed configuration object
 * @throws Error if config.json doesn't exist or is invalid JSON
 */
export function loadConfig(): TenantConfig {
  const configPath = path.join(getContentPath(), "config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  try {
    const configContent = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configContent) as TenantConfig;

    if (!config.tenant_id) {
      throw new Error("Config missing required field: tenant_id");
    }
    if (!config.meta?.title) {
      throw new Error("Config missing required field: meta.title");
    }

    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in config.json: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get allowed departments from config
 * Falls back to taxonomies.departments or governance.departments
 */
export function getAllowedDepartments(): string[] {
  const config = loadConfig();
  return (
    config.taxonomies?.departments ??
    config.governance?.departments ??
    []
  );
}

/**
 * Get allowed phases from config
 * Falls back to default phases if not configured
 */
export function getAllowedPhases(): string[] {
  const config = loadConfig();
  return (
    config.governance?.phases ?? ["Foundation", "Acceleration", "Scale"]
  );
}

/**
 * Check if a specific module is enabled
 */
export function isModuleEnabled(
  moduleName: "matrix" | "gantt" | "blog"
): boolean {
  const config = loadConfig();
  const key =
    `enable_${moduleName}` as keyof NonNullable<TenantConfig["modules"]>;
  return config.modules?.[key] ?? false;
}
