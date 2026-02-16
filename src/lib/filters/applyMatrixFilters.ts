/**
 * Matrix Filter Logic
 *
 * Pure functions for filtering projects by department, phase, and status.
 * Filter state is persisted via URL query params for shareable links.
 */

import type { ProcessedProject } from "@/lib/types";

export interface MatrixFilters {
  departments: string[];
  phases: string[];
  statuses: string[];
}

/**
 * Apply filters to project list.
 * - Empty array = no filter (show all)
 * - Within category: OR logic (Sales OR Manufacturing)
 * - Across categories: AND logic (Sales AND Foundation)
 *
 * @param projects - Processed projects from transform pipeline
 * @param filters - Filter criteria from URL or UI
 * @returns Filtered array of projects
 */
export function applyMatrixFilters(
  projects: ProcessedProject[],
  filters: MatrixFilters
): ProcessedProject[] {
  return projects.filter((project) => {
    const departmentMatch =
      filters.departments.length === 0 ||
      filters.departments.includes(project.department);

    const phaseMatch =
      filters.phases.length === 0 ||
      filters.phases.includes(project.phase);

    const statusMatch =
      filters.statuses.length === 0 ||
      filters.statuses.includes(project.status);

    return departmentMatch && phaseMatch && statusMatch;
  });
}

/**
 * Count total active filters across all categories.
 *
 * @param filters - Current filter state
 * @returns Number of active filters
 */
export function countActiveFilters(filters: MatrixFilters): number {
  return (
    filters.departments.length +
    filters.phases.length +
    filters.statuses.length
  );
}

/**
 * Parse URL search params into filter object.
 * Query keys: dept, phase, status (multi-value supported).
 *
 * @param searchParams - URLSearchParams from router or request
 * @returns MatrixFilters object
 */
export function parseFiltersFromURL(searchParams: URLSearchParams): MatrixFilters {
  return {
    departments: searchParams.getAll("dept"),
    phases: searchParams.getAll("phase"),
    statuses: searchParams.getAll("status"),
  };
}

/**
 * Serialize filters to URL query string.
 *
 * @param filters - Filter object to serialize
 * @returns Query string (e.g. "dept=Sales&phase=Foundation")
 */
export function serializeFiltersToURL(filters: MatrixFilters): string {
  const params = new URLSearchParams();
  filters.departments.forEach((d) => params.append("dept", d));
  filters.phases.forEach((p) => params.append("phase", p));
  filters.statuses.forEach((s) => params.append("status", s));
  return params.toString();
}
