import Link from "next/link";
import type { ProcessedProject } from "@/lib/types";

interface ProjectSidebarProps {
  project: ProcessedProject;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  return (
    <aside className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Details</h3>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-gray-500">Timeline</dt>
          <dd className="font-medium">
            {formatDate(project.dates.planned_start)} -{" "}
            {formatDate(project.dates.planned_end)}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Owner</dt>
          <dd className="font-medium">{project.owner}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Department</dt>
          <dd className="font-medium">{project.department}</dd>
        </div>
      </dl>

      {project.tags && project.tags.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.related_projects && project.related_projects.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">
            Related Projects
          </h4>
          <ul className="space-y-1">
            {project.related_projects.map((id) => (
              <li key={id}>
                <Link
                  href={`/projects/${id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {id}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/projects"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Back to Library
        </Link>
      </div>
    </aside>
  );
}
