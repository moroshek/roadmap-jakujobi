/**
 * Project Validation Schema
 *
 * Defines strict validation rules for project frontmatter using Zod.
 * Ensures data integrity before transformation.
 */

import { z } from "zod";

/**
 * Valid project status values
 */
const projectStatusSchema = z.enum([
  "Backlog",
  "Queued",
  "Active",
  "Paused",
  "Complete",
]);

/**
 * Validates that a string is a calendrically valid date in YYYY-MM-DD format.
 * Rejects invalid dates like 2025-02-30 or 2025-13-01 that would produce
 * Invalid Date or silently roll over to wrong dates.
 */
function isValidCalendarDate(str: string): boolean {
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12) return false;

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Date string in ISO format (YYYY-MM-DD), must be a valid calendar date
 */
const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine(isValidCalendarDate, "Date must be a valid calendar date (e.g., 2025-02-30 and 2025-13-01 are invalid)");

/**
 * Score between 0 and 10 (inclusive)
 */
const scoreSchema = z
  .number()
  .min(0, "Score must be >= 0")
  .max(10, "Score must be <= 10");

/**
 * Confidence score between 0 and 1 (inclusive)
 */
const confidenceSchema = z
  .number()
  .min(0, "Confidence must be >= 0")
  .max(1, "Confidence must be <= 1");

/**
 * Valid departments (from AutoNova Motors tenant config)
 */
const departmentSchema = z.enum([
  "Manufacturing",
  "Supply Chain",
  "Sales",
  "After-Sales",
]);

/**
 * Valid phases (from config)
 */
const phaseSchema = z.enum(["Foundation", "Acceleration", "Scale"]);

/**
 * Project ID format: PRJ-XXX where XXX is 3 digits
 */
const projectIdSchema = z
  .string()
  .regex(/^PRJ-\d{3}$/, "Project ID must be in format PRJ-XXX (e.g., PRJ-001)");

/**
 * Complete project frontmatter schema
 */
export const ProjectSchema = z.object({
  id: projectIdSchema,
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  owner: z.string().min(1, "Owner is required"),
  department: departmentSchema,
  phase: phaseSchema,
  status: projectStatusSchema,

  dates: z.object({
    planned_start: dateStringSchema,
    planned_end: dateStringSchema,
    actual_start: dateStringSchema.optional(),
  }),

  scores: z.object({
    strategic_value: scoreSchema,
    complexity: scoreSchema,
    confidence: confidenceSchema,
  }),

  financials: z.object({
    estimated_cost: z.number().min(0, "Cost must be >= 0"),
    projected_roi: z.number().min(0, "ROI must be >= 0"),
    currency: z.string().length(3, "Currency must be 3-letter code (e.g., USD)"),
  }),

  tags: z.array(z.string()),
  related_projects: z.array(z.string()),
});

/**
 * Type inference from schema
 */
export type ValidatedProjectFrontmatter = z.infer<typeof ProjectSchema>;

/**
 * Validates project frontmatter and returns typed result
 *
 * @param data - Raw frontmatter object
 * @returns Validated data or throws ZodError
 */
export function validateProject(data: unknown): ValidatedProjectFrontmatter {
  return ProjectSchema.parse(data);
}

/**
 * Safely validates project frontmatter without throwing
 *
 * @param data - Raw frontmatter object
 * @returns Success result with data, or error result with issues
 */
export function safeValidateProject(data: unknown) {
  return ProjectSchema.safeParse(data);
}
