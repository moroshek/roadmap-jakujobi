/**
 * MatrixPageWithFilters - Client wrapper that applies URL-driven filters
 *
 * With static export, filtering must happen client-side since searchParams
 * are only known at runtime. This component reads URL params, filters
 * projects, and renders the layout with sidebar.
 */

"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { MatrixPageClient } from "./MatrixPageClient";
import { MatrixFilters } from "./MatrixFilters";
import {
  applyMatrixFilters,
  parseFiltersFromURL,
} from "@/lib/filters/applyMatrixFilters";
import type { ProcessedProject } from "@/lib/types";

export interface MatrixPageWithFiltersProps {
  projects: ProcessedProject[];
  departments: string[];
  phases: string[];
  statuses: string[];
}

export function MatrixPageWithFilters({
  projects,
  departments,
  phases,
  statuses,
}: MatrixPageWithFiltersProps) {
  const searchParams = useSearchParams();
  const filters = useMemo(
    () =>
      searchParams
        ? parseFiltersFromURL(searchParams)
        : { departments: [], phases: [], statuses: [] },
    [searchParams]
  );
  const filteredProjects = useMemo(
    () => applyMatrixFilters(projects, filters),
    [projects, filters]
  );

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <MatrixFilters
            departments={departments}
            phases={phases}
            statuses={statuses}
          />
        </aside>

        <div className="lg:col-span-3">
          {filteredProjects.length > 0 ? (
            <MatrixPageClient projects={filteredProjects} />
          ) : (
            <div
              className="bg-white rounded-lg shadow p-6 border border-gray-200 text-center py-12"
              role="status"
            >
              <p className="text-gray-600 text-lg">
                No projects match current filters
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
