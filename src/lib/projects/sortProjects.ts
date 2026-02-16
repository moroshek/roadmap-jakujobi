/**
 * Project Sorting Utilities
 *
 * Multi-field sorting for project library.
 */

import type { ProcessedProject } from "@/lib/types";

export type SortField =
  | "title"
  | "id"
  | "status"
  | "department"
  | "phase"
  | "roi"
  | "impact"
  | "planned_end";
export type SortOrder = "asc" | "desc";

/**
 * Sort projects by the given field and order.
 */
export function sortProjects(
  projects: ProcessedProject[],
  field: SortField,
  order: SortOrder
): ProcessedProject[] {
  const sorted = [...projects].sort((a, b) => {
    let cmp = 0;

    switch (field) {
      case "title":
        cmp = a.title.localeCompare(b.title);
        break;
      case "id":
        cmp = a.id.localeCompare(b.id);
        break;
      case "status":
        cmp = a.status.localeCompare(b.status);
        break;
      case "department":
        cmp = a.department.localeCompare(b.department);
        break;
      case "phase":
        cmp = a.phase.localeCompare(b.phase);
        break;
      case "roi":
        cmp =
          (a.financials?.projected_roi ?? 0) - (b.financials?.projected_roi ?? 0);
        break;
      case "impact":
        cmp =
          (a.matrix?.impactNormalized ?? 0) - (b.matrix?.impactNormalized ?? 0);
        break;
      case "planned_end":
        cmp =
          a.dates.planned_end.getTime() - b.dates.planned_end.getTime();
        break;
      default:
        cmp = a.title.localeCompare(b.title);
    }

    return order === "asc" ? cmp : -cmp;
  });

  return sorted;
}
