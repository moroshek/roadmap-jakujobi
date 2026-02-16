/**
 * Project Filter Logic for Library Page
 *
 * Reuses matrix filter semantics: empty array = show all,
 * OR within category, AND across categories.
 */

import type { ProcessedProject } from "@/lib/types";
import { applyMatrixFilters } from "@/lib/filters/applyMatrixFilters";
import type { MatrixFilters } from "@/lib/filters/applyMatrixFilters";

export interface ProjectFilters {
  departments: string[];
  statuses: string[];
  phases: string[];
}

/**
 * Apply filters to project list for library view.
 */
export function applyProjectFilters(
  projects: ProcessedProject[],
  filters: ProjectFilters
): ProcessedProject[] {
  const matrixFilters: MatrixFilters = {
    departments: filters.departments,
    phases: filters.phases,
    statuses: filters.statuses,
  };
  return applyMatrixFilters(projects, matrixFilters);
}
