/**
 * Roadmap Gantt View Page
 *
 * Timeline visualization of all projects with scheduling data.
 */

import { loadAndTransformProjects } from "@/lib/content/transformProjects";
import { RoadmapClient } from "./RoadmapClient";

export default function RoadmapPage() {
  const result = loadAndTransformProjects({
    skipInvalid: true,
    logErrors: false,
  });

  const projectsWithTimeline = result.projects.filter(
    (p) => p.dates?.planned_start && p.dates?.planned_end
  );

  return (
    <RoadmapClient
      projects={projectsWithTimeline}
      totalProjects={result.projects.length}
    />
  );
}
