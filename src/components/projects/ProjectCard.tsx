import Link from "next/link";
import type { ProcessedProject } from "@/lib/types";

interface ProjectCardProps {
  project: ProcessedProject;
  viewMode: "card" | "table";
}

function formatROI(roi: number): string {
  if (roi >= 1_000_000) {
    return `$${(roi / 1_000_000).toFixed(1)}M`;
  }
  if (roi >= 1_000) {
    return `$${(roi / 1_000).toFixed(0)}K`;
  }
  return `$${roi}`;
}

export function ProjectCard({ project, viewMode }: ProjectCardProps) {
  if (viewMode === "table") {
    return (
      <Link
        href={`/projects/${project.id}`}
        className="grid grid-cols-4 gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-colors items-center"
      >
        <span className="font-medium text-gray-900">{project.title}</span>
        <span className="text-sm text-gray-600">{project.department}</span>
        <span className="text-sm text-gray-600">{project.status}</span>
        <span className="text-sm text-gray-600">
          {formatROI(project.financials?.projected_roi ?? 0)}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-colors"
    >
      <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{project.id}</p>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 bg-gray-100 rounded">{project.department}</span>
        <span className="px-2 py-1 bg-gray-100 rounded">{project.status}</span>
        <span className="px-2 py-1 bg-gray-100 rounded">{project.phase}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-700">
        ROI: {formatROI(project.financials?.projected_roi ?? 0)}
      </p>
    </Link>
  );
}
