/**
 * Data Fetching Hook for Projects
 *
 * Loads projects from the API, which uses the P2 transformation pipeline.
 * Manages loading and error states for matrix display.
 */

"use client";

import { useState, useEffect } from "react";
import type { ProcessedProject } from "@/lib/types";

export interface UseProjectsReturn {
  projects: ProcessedProject[];
  loading: boolean;
  error: Error | null;
  isEmpty: boolean;
}

/**
 * Hook to load and transform projects for matrix display
 *
 * @param options - Optional fetch options
 * @returns Projects data with loading/error states
 */
export function useProjects(options?: { skipInvalid?: boolean }): UseProjectsReturn {
  const [projects, setProjects] = useState<ProcessedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/projects");

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.message || data.error || `HTTP ${res.status}: Failed to load projects`
          );
        }

        const data = await res.json();
        setProjects(data.projects || []);

        if (
          data.projects?.length === 0 &&
          process.env.NODE_ENV === "development"
        ) {
          console.warn("[useProjects] No projects returned from API");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load projects")
        );
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    isEmpty: !loading && !error && projects.length === 0,
  };
}
