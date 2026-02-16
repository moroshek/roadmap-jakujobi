import type { ProcessedProject } from "@/lib/types";

interface ProjectHeroProps {
  project: ProcessedProject;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
          {project.id}
        </span>
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
          {project.status}
        </span>
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
          {project.phase}
        </span>
      </div>
      <p className="text-gray-600 text-sm">
        {project.owner} - {project.department}
      </p>
    </div>
  );
}
