"use client";

import { useState } from "react";
import type { ProcessedProject } from "@/lib/types";
import { GanttChart } from "@/components/roadmap/GanttChart";
import { GroupingSelector } from "@/components/roadmap/GroupingSelector";
import type { GroupingDimension } from "@/lib/gantt/groupProjects";
import Link from "next/link";

interface RoadmapClientProps {
  projects: ProcessedProject[];
  totalProjects: number;
}

export function RoadmapClient({
  projects,
  totalProjects,
}: RoadmapClientProps) {
  const [groupBy, setGroupBy] = useState<GroupingDimension>("department");

  const missingTimeline = totalProjects - projects.length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Portfolio Roadmap
            </h1>
            <p className="text-gray-600 mt-1">
              Timeline view of {projects.length} projects
              {missingTimeline > 0 && (
                <span className="text-amber-600 ml-2">
                  ({missingTimeline} projects missing timeline data)
                </span>
              )}
            </p>
          </div>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Group by:
          </label>
          <GroupingSelector value={groupBy} onChange={setGroupBy} />
        </div>

        <GanttChart
          projects={projects}
          groupBy={groupBy}
          className="border rounded-lg shadow-sm"
        />
      </div>
    </main>
  );
}
