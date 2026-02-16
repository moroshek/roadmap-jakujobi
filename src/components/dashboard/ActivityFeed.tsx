import Link from "next/link";
import type { ProcessedProject } from "@/lib/types";

interface Activity {
  date: Date;
  type: "created" | "updated" | "completed";
  projectId: string;
  projectTitle: string;
  description: string;
}

function generateActivities(projects: ProcessedProject[]): Activity[] {
  return projects
    .flatMap((project) => {
      const activities: Activity[] = [
        {
          date: project.dates.planned_start,
          type: "created",
          projectId: project.id,
          projectTitle: project.title,
          description: `Project created in ${project.phase} phase`,
        },
      ];

      if (project.status === "Complete") {
        activities.push({
          date: project.dates.planned_end,
          type: "completed",
          projectId: project.id,
          projectTitle: project.title,
          description: "Project completed successfully",
        });
      }

      return activities;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
}

interface ActivityFeedProps {
  projects: ProcessedProject[];
}

export function ActivityFeed({ projects }: ActivityFeedProps) {
  const activities = generateActivities(projects);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <div key={`${activity.projectId}-${activity.type}-${idx}`} className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/projects/${activity.projectId}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600 block truncate"
                >
                  {activity.projectTitle}
                </Link>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.date.toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
