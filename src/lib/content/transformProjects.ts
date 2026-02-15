/**
 * Project Transformation Pipeline
 *
 * This module orchestrates the transformation from raw markdown
 * frontmatter to fully processed, matrix-ready project objects.
 *
 * Pipeline stages:
 * 1. Parse raw frontmatter (from loadProjects)
 * 2. Validate with Zod schema (from validation/projectSchema)
 * 3. Normalize scores (from governance/matrix)
 * 4. Assign quadrants (from governance/matrix)
 * 5. Enrich with computed fields
 */

import { ProjectSchema } from "@/lib/validation/projectSchema";
import { normalizeScore, assignQuadrant } from "@/lib/governance/matrix";
import type { RawProjectFrontmatter, ProcessedProject } from "@/lib/types";
import { ZodError } from "zod";
import { readAllProjectFiles } from "./loadProjects";

/**
 * Parses a date string and returns a valid Date, or throws if invalid.
 * Defensive check: schema validates calendar dates, but this prevents
 * Invalid Date (NaN) from propagating if validation is bypassed.
 */
function parseValidDate(dateStr: string, fieldName: string): Date {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date for ${fieldName}: "${dateStr}" produces Invalid Date`);
  }
  return date;
}

/**
 * Validation result for a single project
 */
export interface ValidationResult {
  success: boolean;
  project?: ProcessedProject;
  errors?: string[];
  filename?: string;
}

/**
 * Transform a single raw project into a processed project
 *
 * @param rawFrontmatter - Unvalidated frontmatter object
 * @param filename - Source filename (for error reporting)
 * @returns ValidationResult with success status
 */
export function transformProject(
  rawFrontmatter: unknown,
  filename: string
): ValidationResult {
  try {
    const validated = ProjectSchema.parse(rawFrontmatter) as RawProjectFrontmatter;

    const impactNormalized = normalizeScore(validated.scores.strategic_value);
    const effortNormalized = normalizeScore(validated.scores.complexity);
    const quadrant = assignQuadrant(impactNormalized, effortNormalized);

    const dates = {
      planned_start: parseValidDate(validated.dates.planned_start, "planned_start"),
      planned_end: parseValidDate(validated.dates.planned_end, "planned_end"),
      actual_start: validated.dates.actual_start
        ? parseValidDate(validated.dates.actual_start, "actual_start")
        : undefined,
    };

    const processed: ProcessedProject = {
      id: validated.id,
      title: validated.title,
      slug: validated.slug,
      owner: validated.owner,
      department: validated.department,
      phase: validated.phase,
      status: validated.status,

      dates,

      scores: {
        strategic_value: validated.scores.strategic_value,
        complexity: validated.scores.complexity,
        confidence: validated.scores.confidence,
      },

      matrix: {
        impactNormalized,
        effortNormalized,
        quadrant,
      },

      financials: validated.financials,

      tags: validated.tags,
      related_projects: validated.related_projects,
    };

    return {
      success: true,
      project: processed,
      filename,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      return {
        success: false,
        errors: [`Validation failed for ${filename}`, ...errors],
        filename,
      };
    }

    return {
      success: false,
      errors: [`Unexpected error transforming ${filename}: ${String(error)}`],
      filename,
    };
  }
}

/**
 * Transform all projects from raw files
 *
 * @param rawProjects - Array of { filename, frontmatter, content }
 * @param options - Transformation options
 * @returns Object with successful projects and error list
 */
export function transformAllProjects(
  rawProjects: Array<{
    filename: string;
    frontmatter: unknown;
    content: string;
  }>,
  options: {
    skipInvalid?: boolean;
    logErrors?: boolean;
  } = {}
): {
  projects: ProcessedProject[];
  errors: Array<{ filename: string; messages: string[] }>;
  stats: {
    total: number;
    successful: number;
    failed: number;
  };
} {
  const projects: ProcessedProject[] = [];
  const errors: Array<{ filename: string; messages: string[] }> = [];

  for (const raw of rawProjects) {
    const result = transformProject(raw.frontmatter, raw.filename);

    if (result.success && result.project) {
      projects.push(result.project);
    } else if (result.errors) {
      const error = {
        filename: raw.filename,
        messages: result.errors,
      };
      errors.push(error);

      if (options.logErrors) {
        console.error(`[Transform Error] ${raw.filename}:`, result.errors);
      }

      if (!options.skipInvalid) {
        throw new Error(
          `Failed to transform ${raw.filename}: ${result.errors.join(", ")}`
        );
      }
    }
  }

  return {
    projects,
    errors,
    stats: {
      total: rawProjects.length,
      successful: projects.length,
      failed: errors.length,
    },
  };
}

/**
 * Load and transform all projects in one call
 * Convenience function combining loader + transformer
 */
export function loadAndTransformProjects(options?: {
  skipInvalid?: boolean;
  logErrors?: boolean;
}): {
  projects: ProcessedProject[];
  errors: Array<{ filename: string; messages: string[] }>;
  stats: {
    total: number;
    successful: number;
    failed: number;
  };
} {
  const rawProjects = readAllProjectFiles();
  return transformAllProjects(rawProjects, options);
}
