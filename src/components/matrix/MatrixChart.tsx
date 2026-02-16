/**
 * Strategy Matrix Scatter Chart
 *
 * Renders the core scatter plot with X=Effort, Y=Impact,
 * color-coded points by quadrant, and interaction handlers.
 */

"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ProcessedProject } from "@/lib/types";
import { useMatrix } from "@/contexts/MatrixContext";
import { MatrixTooltip } from "./MatrixTooltip";

export interface MatrixChartProps {
  projects: ProcessedProject[];
  className?: string;
}

const QUADRANT_COLORS: Record<string, string> = {
  "Quick Wins": "#10B981",
  "Big Bets": "#3B82F6",
  Fillers: "#6B7280",
  "Time Sinks": "#F59E0B",
};

function getQuadrantColor(
  quadrant: string,
  isSelected: boolean,
  isHovered: boolean
): string {
  const base = QUADRANT_COLORS[quadrant] ?? "#6B7280";
  if (isSelected || isHovered) return base;
  return base + "CC";
}

/**
 * MatrixChart Component
 */
export function MatrixChart({ projects, className = "" }: MatrixChartProps) {
  const {
    selectedProject,
    setSelectedProject,
    hoveredProjectId,
    setHoveredProjectId,
  } = useMatrix();

  const chartData = projects.map((project) => ({
    id: project.id,
    x: project.matrix.effortNormalized,
    y: project.matrix.impactNormalized,
    title: project.title,
    quadrant: project.matrix.quadrant,
    roi: project.financials.projected_roi,
    cost: project.financials.estimated_cost,
    project,
  }));

  const handleClick = (data: { project?: ProcessedProject }) => {
    if (data?.project) {
      setSelectedProject(data.project);
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            stroke="#6B7280"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            label={{
              value: "Effort / Complexity ->",
              position: "bottom",
              offset: 40,
              style: { fill: "#374151", fontSize: 14, fontWeight: 600 },
            }}
          />

          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            stroke="#6B7280"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            label={{
              value: "Impact / Strategic Value",
              angle: -90,
              position: "left",
              offset: 40,
              style: { fill: "#374151", fontSize: 14, fontWeight: 600 },
            }}
          />

          <Tooltip content={<MatrixTooltip />} cursor={{ strokeDasharray: "3 3" }} />

          <Scatter
            data={chartData}
            onClick={(entry) => handleClick(entry)}
            onMouseEnter={(entry) => setHoveredProjectId(entry?.id ?? null)}
            onMouseLeave={() => setHoveredProjectId(null)}
            style={{ cursor: "pointer" }}
          >
            {chartData.map((entry) => {
              const isSelected = selectedProject?.id === entry.id;
              const isHovered = hoveredProjectId === entry.id;
              const r = isSelected ? 12 : isHovered ? 10 : 8;

              return (
                <Cell
                  key={entry.id}
                  fill={getQuadrantColor(
                    entry.quadrant,
                    isSelected,
                    isHovered
                  )}
                  r={r}
                />
              );
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
