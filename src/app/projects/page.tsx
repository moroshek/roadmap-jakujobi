/**
 * Project Library Page
 *
 * Searchable catalog of all projects with filters and sort.
 */

import { loadAndTransformProjects } from "@/lib/content/transformProjects";
import { ProjectLibraryClient } from "./ProjectLibraryClient";

export default function ProjectLibraryPage() {
  const result = loadAndTransformProjects({
    skipInvalid: true,
    logErrors: false,
  });

  return <ProjectLibraryClient projects={result.projects} />;
}
