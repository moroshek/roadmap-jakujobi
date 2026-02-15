/**
 * Type definitions for Roadmap Engine
 *
 * These types define the data contracts between:
 * - Content layer (markdown files)
 * - Governance layer (transformation logic)
 * - Presentation layer (UI components)
 */

// === Raw Input Types (from Markdown frontmatter) ===

export type ProjectStatus =
  | "Backlog"
  | "Queued"
  | "Active"
  | "Paused"
  | "Complete";

export interface RawProjectFrontmatter {
  id: string;
  title: string;
  slug: string;
  owner: string;
  department: string;
  phase: string;
  status: ProjectStatus;
  dates: {
    planned_start: string;
    planned_end: string;
    actual_start?: string;
  };
  scores: {
    strategic_value: number; // Raw score 0-10
    complexity: number; // Raw score 0-10
    confidence: number; // 0-1
  };
  financials: {
    estimated_cost: number;
    projected_roi: number;
    currency: string;
  };
  tags: string[];
  related_projects: string[];
}

// === Processed Types (after transformation) ===

export type QuadrantLabel =
  | "Quick Wins"
  | "Big Bets"
  | "Fillers"
  | "Time Sinks";

export interface ProcessedProject {
  // Core identity
  id: string;
  title: string;
  slug: string;
  owner: string;
  department: string;
  phase: string;
  status: ProjectStatus;

  // Dates
  dates: {
    planned_start: Date;
    planned_end: Date;
    actual_start?: Date;
  };

  // Raw scores (unchanged)
  scores: {
    strategic_value: number; // 0-10
    complexity: number; // 0-10
    confidence: number; // 0-1
  };

  // Matrix-specific computed fields
  matrix: {
    impactNormalized: number; // 0-100
    effortNormalized: number; // 0-100
    quadrant: QuadrantLabel;
  };

  // Financials
  financials: {
    estimated_cost: number;
    projected_roi: number;
    currency: string;
  };

  // Relationships
  tags: string[];
  related_projects: string[];
}

// === Matrix Data Point (for chart rendering) ===

export interface MatrixDataPoint {
  id: string;
  title: string;
  x: number; // effortNormalized (0-100)
  y: number; // impactNormalized (0-100)
  quadrant: QuadrantLabel;
  department: string;
  phase: string;
  status: ProjectStatus;
  financials: {
    estimated_cost: number;
    projected_roi: number;
    currency: string;
  };
}

// === Config Types ===

export interface TenantConfig {
  tenant_id: string;
  meta: {
    title: string;
    logo_url: string;
    favicon_url: string;
  };
  governance: {
    fiscal_year_start: string;
    max_concurrent_projects: number;
    phases: string[];
    departments: string[];
  };
}
