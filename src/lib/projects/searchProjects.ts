/**
 * Fuzzy Search for Projects (PRD Section 7.1)
 *
 * Uses Fuse.js for client-side fuzzy matching across title, id, tags, owner.
 */

import Fuse from "fuse.js";
import type { ProcessedProject } from "@/lib/types";

const fuseOptions = {
  keys: [
    { name: "title" as const, weight: 1.0 },
    { name: "id" as const, weight: 0.8 },
    { name: "tags" as const, weight: 0.6 },
    { name: "owner" as const, weight: 0.4 },
    { name: "department" as const, weight: 0.3 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};

/**
 * Search projects by fuzzy matching on title, id, tags, owner.
 * Returns all projects when query is empty or too short.
 *
 * @param projects - Projects to search
 * @param query - Search query (min 2 chars to trigger search)
 */
export function searchProjects(
  projects: ProcessedProject[],
  query: string
): ProcessedProject[] {
  if (!query || query.trim().length < 2) {
    return projects;
  }

  const fuse = new Fuse(projects, fuseOptions);
  const results = fuse.search(query);
  return results.map((r) => r.item);
}
