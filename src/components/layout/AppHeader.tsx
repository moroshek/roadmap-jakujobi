import Link from "next/link";
import { loadAndTransformProjects } from "@/lib/content/transformProjects";
import { GlobalSearch } from "./GlobalSearch";

export function AppHeader() {
  const result = loadAndTransformProjects({
    skipInvalid: true,
    logErrors: false,
  });

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <nav className="flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/matrix"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Matrix
            </Link>
            <Link
              href="/roadmap"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Roadmap
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Projects
            </Link>
          </nav>

          <div className="flex-1 max-w-md mx-4">
            <GlobalSearch projects={result.projects} />
          </div>
        </div>
      </div>
    </header>
  );
}
