/**
 * MatrixFilters - Interactive filter panel for Strategy Matrix
 *
 * Multi-select checkboxes for department, phase, and status.
 * State is persisted via URL params for shareable links.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  parseFiltersFromURL,
  serializeFiltersToURL,
  countActiveFilters,
} from "@/lib/filters/applyMatrixFilters";

export interface MatrixFiltersProps {
  departments: string[];
  phases: string[];
  statuses: string[];
}

export function MatrixFilters({ departments, phases, statuses }: MatrixFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilters = parseFiltersFromURL(searchParams);
  const activeCount = countActiveFilters(currentFilters);

  const toggleFilter = (
    category: "departments" | "phases" | "statuses",
    value: string
  ) => {
    const current = currentFilters[category];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters = { ...currentFilters, [category]: updated };
    const queryString = serializeFiltersToURL(newFilters);
    const path = queryString ? `/matrix?${queryString}` : "/matrix";
    router.push(path);
  };

  const clearAllFilters = () => {
    router.push("/matrix");
  };

  return (
    <nav
      className="bg-white rounded-lg shadow p-6 border border-gray-200"
      aria-label="Project filters"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded min-h-[44px] min-w-[44px] px-2"
            aria-label={`Clear all ${activeCount} filters`}
          >
            Clear All ({activeCount})
          </button>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Department</h4>
        <div className="space-y-2" role="group" aria-labelledby="dept-label">
          <span id="dept-label" className="sr-only">
            Filter by department
          </span>
          {departments.map((dept) => (
            <label
              key={dept}
              className="flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <input
                type="checkbox"
                checked={currentFilters.departments.includes(dept)}
                onChange={() => toggleFilter("departments", dept)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                aria-label={dept}
              />
              <span className="text-sm text-gray-700">{dept}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Phase</h4>
        <div className="space-y-2" role="group" aria-labelledby="phase-label">
          <span id="phase-label" className="sr-only">
            Filter by phase
          </span>
          {phases.map((phase) => (
            <label
              key={phase}
              className="flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <input
                type="checkbox"
                checked={currentFilters.phases.includes(phase)}
                onChange={() => toggleFilter("phases", phase)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                aria-label={phase}
              />
              <span className="text-sm text-gray-700">{phase}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
        <div className="space-y-2" role="group" aria-labelledby="status-label">
          <span id="status-label" className="sr-only">
            Filter by status
          </span>
          {statuses.map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <input
                type="checkbox"
                checked={currentFilters.statuses.includes(status)}
                onChange={() => toggleFilter("statuses", status)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                aria-label={status}
              />
              <span className="text-sm text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </nav>
  );
}
