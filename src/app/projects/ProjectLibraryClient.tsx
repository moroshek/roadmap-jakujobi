"use client";

import { useState, useMemo } from "react";
import type { ProcessedProject } from "@/lib/types";
import { searchProjects } from "@/lib/projects/searchProjects";
import {
  sortProjects,
  type SortField,
  type SortOrder,
} from "@/lib/projects/sortProjects";
import {
  applyProjectFilters,
  type ProjectFilters as ProjectFiltersType,
} from "@/lib/projects/filterProjects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectSearchBar } from "@/components/projects/ProjectSearchBar";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ViewToggle } from "@/components/projects/ViewToggle";
import { SortSelector } from "@/components/projects/SortSelector";
import Link from "next/link";

function getUniqueValues(
  projects: ProcessedProject[],
  key: keyof ProcessedProject
): string[] {
  const values = new Set(projects.map((p) => p[key] as string));
  return Array.from(values).sort();
}

interface ProjectLibraryClientProps {
  projects: ProcessedProject[];
}

export function ProjectLibraryClient({ projects }: ProjectLibraryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filters, setFilters] = useState<ProjectFiltersType>({
    departments: [],
    statuses: [],
    phases: [],
  });

  const departments = useMemo(
    () => getUniqueValues(projects, "department"),
    [projects]
  );
  const phases = useMemo(
    () => getUniqueValues(projects, "phase"),
    [projects]
  );
  const statuses = useMemo(
    () => getUniqueValues(projects, "status"),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    let result = applyProjectFilters(projects, filters);
    result = searchProjects(result, searchQuery);
    result = sortProjects(result, sortField, sortOrder);
    return result;
  }, [projects, filters, searchQuery, sortField, sortOrder]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({ departments: [], statuses: [], phases: [] });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Project Library</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <ProjectSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 max-w-md"
          />
          <ViewToggle value={viewMode} onChange={setViewMode} />
          <SortSelector
            field={sortField}
            order={sortOrder}
            onFieldChange={setSortField}
            onOrderChange={setSortOrder}
          />
        </div>

        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <ProjectFilters
              filters={filters}
              onChange={setFilters}
              departments={departments}
              phases={phases}
              statuses={statuses}
            />
          </aside>

          <div className="flex-1 min-w-0">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No projects match your filters</p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "card"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-2"
                }
              >
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            <p className="mt-6 text-sm text-gray-600">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
