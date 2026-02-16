/**
 * Timeline Scale Calculator for Gantt Chart
 *
 * Converts date ranges to pixel positions for SVG rendering.
 * Uses dates.planned_start and dates.planned_end from ProcessedProject.
 */

import type { ProcessedProject } from "@/lib/types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface TimelineScale {
  startDate: Date;
  endDate: Date;
  dayWidth: number;
  totalWidth: number;
}

export interface ProjectPosition {
  x: number;
  width: number;
  y: number;
}

/**
 * Get start and end dates from a processed project.
 */
function getProjectDateRange(project: ProcessedProject): { start: Date; end: Date } {
  return {
    start: project.dates.planned_start,
    end: project.dates.planned_end,
  };
}

/**
 * Calculate timeline scale for Gantt chart rendering.
 * Adds 2-week padding before earliest and after latest project.
 *
 * @param projects - Projects with dates.planned_start and dates.planned_end
 * @param pixelsPerDay - Pixels per day for horizontal scale
 */
export function calculateTimelineScale(
  projects: ProcessedProject[],
  pixelsPerDay = 4
): TimelineScale {
  if (projects.length === 0) {
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setDate(defaultStart.getDate() - 14);
    const defaultEnd = new Date(now);
    defaultEnd.setDate(defaultEnd.getDate() + 14);
    const totalDays = 28;
    return {
      startDate: defaultStart,
      endDate: defaultEnd,
      dayWidth: pixelsPerDay,
      totalWidth: totalDays * pixelsPerDay,
    };
  }

  const dates = projects.flatMap((p) => {
    const { start, end } = getProjectDateRange(p);
    return [start.getTime(), end.getTime()];
  });

  const minTime = Math.min(...dates);
  const maxTime = Math.max(...dates);

  const startDate = new Date(minTime);
  const endDate = new Date(maxTime);
  startDate.setDate(startDate.getDate() - 14);
  endDate.setDate(endDate.getDate() + 14);

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);

  return {
    startDate,
    endDate,
    dayWidth: pixelsPerDay,
    totalWidth: totalDays * pixelsPerDay,
  };
}

/**
 * Calculate pixel position for a project bar.
 */
export function calculateProjectPosition(
  project: ProcessedProject,
  scale: TimelineScale,
  rowIndex: number,
  rowHeight = 40
): ProjectPosition {
  const { start, end } = getProjectDateRange(project);
  const startTime = start.getTime();
  const endTime = end.getTime();
  const scaleStartTime = scale.startDate.getTime();

  const daysFromStart = (startTime - scaleStartTime) / MS_PER_DAY;
  const durationDays = (endTime - startTime) / MS_PER_DAY;

  return {
    x: Math.max(0, daysFromStart * scale.dayWidth),
    width: Math.max(1, durationDays * scale.dayWidth),
    y: rowIndex * rowHeight,
  };
}

/**
 * Calculate today marker position in pixels.
 */
export function calculateTodayPosition(scale: TimelineScale): number | null {
  const now = new Date().getTime();
  const scaleStartTime = scale.startDate.getTime();
  const scaleEndTime = scale.endDate.getTime();

  if (now < scaleStartTime || now > scaleEndTime) {
    return null;
  }

  const daysFromStart = (now - scaleStartTime) / MS_PER_DAY;
  return daysFromStart * scale.dayWidth;
}
