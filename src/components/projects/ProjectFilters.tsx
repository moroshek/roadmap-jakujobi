"use client";

import type { ProjectFilters as ProjectFiltersType } from "@/lib/projects/filterProjects";

interface ProjectFiltersProps {
  filters: ProjectFiltersType;
  onChange: (filters: ProjectFiltersType) => void;
  departments: string[];
  phases: string[];
  statuses: string[];
}

export function ProjectFilters({
  filters,
  onChange,
  departments,
  phases,
  statuses,
}: ProjectFiltersProps) {
  const toggle = (
    category: keyof ProjectFiltersType,
    value: string
  ) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [category]: updated });
  };

  const clearAll = () => {
    onChange({
      departments: [],
      statuses: [],
      phases: [],
    });
  };

  const activeCount =
    filters.departments.length +
    filters.phases.length +
    filters.statuses.length;

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
            onClick={clearAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All ({activeCount})
          </button>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Department</h4>
        <div className="space-y-2">
          {departments.map((dept) => (
            <label key={dept} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.departments.includes(dept)}
                onChange={() => toggle("departments", dept)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{dept}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Phase</h4>
        <div className="space-y-2">
          {phases.map((phase) => (
            <label key={phase} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.phases.includes(phase)}
                onChange={() => toggle("phases", phase)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{phase}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
        <div className="space-y-2">
          {statuses.map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.statuses.includes(status)}
                onChange={() => toggle("statuses", status)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </nav>
  );
}
