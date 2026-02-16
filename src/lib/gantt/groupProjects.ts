/**
 * Project Grouping Logic for Gantt Chart
 *
 * Organizes projects by department, status, or phase for row layout.
 */

import type { ProcessedProject } from "@/lib/types";

export type GroupingDimension = "department" | "status" | "phase" | "none";

export interface ProjectGroup {
  label: string;
  projects: ProcessedProject[];
  color?: string;
}

const STATUS_COLORS: Record<string, string> = {
  Active: "#10B981",
  Queued: "#3B82F6",
  Backlog: "#6B7280",
  Paused: "#F59E0B",
  Complete: "#8B5CF6",
};

function getGroupColor(dimension: GroupingDimension, label: string): string {
  if (dimension === "status") {
    return STATUS_COLORS[label] ?? "#6B7280";
  }
  return "#6B7280";
}

/**
 * Group projects by selected dimension.
 * Returns flat list when dimension is 'none'.
 *
 * @param projects - Processed projects to group
 * @param dimension - Grouping dimension (department, status, phase, none)
 */
export function groupProjects(
  projects: ProcessedProject[],
  dimension: GroupingDimension
): ProjectGroup[] {
  if (dimension === "none") {
    return [{ label: "All Projects", projects }];
  }

  const grouped = projects.reduce(
    (acc, project) => {
      const key = project[dimension] as string;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(project);
      return acc;
    },
    {} as Record<string, ProcessedProject[]>
  );

  return Object.entries(grouped)
    .map(([label, projs]) => ({
      label,
      projects: projs,
      color: getGroupColor(dimension, label),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
