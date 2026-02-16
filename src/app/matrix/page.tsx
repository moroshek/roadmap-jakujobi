/**
 * Strategy Matrix Page
 *
 * Route: /matrix
 *
 * Server component that loads projects at build time and passes
 * to client component for interactive chart. Compatible with static export.
 */

import { loadAndTransformProjects } from "@/lib/content/transformProjects";
import { MatrixPageClient } from "@/components/matrix/MatrixPageClient";

export default function MatrixPage() {
  const result = loadAndTransformProjects({
    skipInvalid: true,
    logErrors: false,
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <MatrixPageClient projects={result.projects} />
      </div>
    </main>
  );
}
