"use client";

import type { ProcessedProject } from "@/lib/types";

interface GanttBarProps {
  project: ProcessedProject;
  x: number;
  y: number;
  width: number;
  height: number;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Active: "#10B981",
    Queued: "#3B82F6",
    Backlog: "#6B7280",
    Paused: "#F59E0B",
    Complete: "#8B5CF6",
  };
  return colors[status] ?? "#6B7280";
}

export function GanttBar({ project, x, y, width, height }: GanttBarProps) {
  const color = getStatusColor(project.status);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        rx={4}
        className="transition-opacity hover:opacity-80 cursor-pointer"
      />
      <text
        x={x + 8}
        y={y + height / 2}
        dominantBaseline="middle"
        className="text-xs fill-white font-medium"
        style={{ pointerEvents: "none" }}
      >
        {project.title}
      </text>
    </g>
  );
}
