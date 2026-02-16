/**
 * Strategy Matrix Page
 *
 * Route: /matrix
 *
 * Server component that loads projects and config at build time.
 * Filtering is applied client-side via URL params (static export compatible).
 */

import { Suspense } from "react";
import { loadAndTransformProjects } from "@/lib/content/transformProjects";
import { loadConfig } from "@/lib/content/loadConfig";
import { MatrixPageWithFilters } from "@/components/matrix/MatrixPageWithFilters";

function MatrixContent() {
  const result = loadAndTransformProjects({
    skipInvalid: true,
    logErrors: false,
  });
  const config = loadConfig();

  const departments =
    config.taxonomies?.departments ?? config.governance?.departments ?? [];
  const phases = config.governance?.phases ?? [
    "Foundation",
    "Acceleration",
    "Scale",
  ];
  const statuses = config.taxonomies?.statuses ?? [
    "Backlog",
    "Queued",
    "Active",
    "Paused",
    "Complete",
  ];

  return (
    <MatrixPageWithFilters
      projects={result.projects}
      departments={departments}
      phases={phases}
      statuses={statuses}
    />
  );
}

export default function MatrixPage() {
  return (
    <main
      className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
      role="main"
      aria-label="Strategy Matrix"
    >
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div className="text-gray-600">Loading...</div>}>
          <MatrixContent />
        </Suspense>
      </div>
    </main>
  );
}