"use client";

import type { ProcessedProject } from "@/lib/types";
import {
  calculateTimelineScale,
  calculateProjectPosition,
  calculateTodayPosition,
} from "@/lib/gantt/calculateTimelineScale";
import {
  groupProjects,
  type GroupingDimension,
  type ProjectGroup,
} from "@/lib/gantt/groupProjects";
import { GanttBar } from "./GanttBar";
import { TimelineAxis } from "./TimelineAxis";
import { TodayMarker } from "./TodayMarker";

interface GanttChartProps {
  projects: ProcessedProject[];
  groupBy: GroupingDimension;
  className?: string;
}

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 60;
const GROUP_HEADER_HEIGHT = 30;

export function GanttChart({
  projects,
  groupBy,
  className = "",
}: GanttChartProps) {
  if (projects.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
      >
        <p className="text-gray-500">
          No projects with timeline data available
        </p>
      </div>
    );
  }

  const scale = calculateTimelineScale(projects, 3);
  const groups = groupProjects(projects, groupBy);
  const todayX = calculateTodayPosition(scale);

  let currentY = HEADER_HEIGHT;
  const groupedPositions: Array<{
    group: ProjectGroup;
    startY: number;
    projects: Array<{ project: ProcessedProject; y: number }>;
  }> = [];

  groups.forEach((group) => {
    const groupStartY = currentY;
    if (groupBy !== "none") {
      currentY += GROUP_HEADER_HEIGHT;
    }

    const projectPositions = group.projects.map((project, idx) => {
      const y = currentY + idx * ROW_HEIGHT;
      return { project, y };
    });

    currentY += group.projects.length * ROW_HEIGHT;

    groupedPositions.push({
      group,
      startY: groupStartY,
      projects: projectPositions,
    });
  });

  const totalHeight = currentY + 20;

  return (
    <div className={`overflow-x-auto overflow-y-auto ${className}`}>
      <svg
        width={scale.totalWidth}
        height={totalHeight}
        className="border border-gray-200 bg-white"
        aria-label="Gantt chart timeline"
      >
        <TimelineAxis scale={scale} height={HEADER_HEIGHT} />

        {todayX !== null && (
          <TodayMarker
            x={todayX}
            height={totalHeight}
            topOffset={HEADER_HEIGHT}
          />
        )}

        {groupedPositions.map(({ group, startY, projects: projs }) => (
          <g key={group.label}>
            {groupBy !== "none" && (
              <g>
                <rect
                  x={0}
                  y={startY}
                  width={scale.totalWidth}
                  height={GROUP_HEADER_HEIGHT}
                  fill="#F3F4F6"
                />
                <text
                  x={10}
                  y={startY + GROUP_HEADER_HEIGHT / 2}
                  dominantBaseline="middle"
                  className="text-sm font-semibold fill-gray-700"
                >
                  {group.label} ({group.projects.length})
                </text>
              </g>
            )}

            {projs.map(({ project, y }) => {
              const position = calculateProjectPosition(
                project,
                scale,
                0,
                ROW_HEIGHT
              );

              return (
                <GanttBar
                  key={project.id}
                  project={project}
                  x={position.x}
                  y={y}
                  width={position.width}
                  height={ROW_HEIGHT - 10}
                />
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
