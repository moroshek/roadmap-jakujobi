/**
 * Matrix Page Client Component
 *
 * Receives pre-loaded projects from server and renders the interactive matrix.
 * Used with static export where data is loaded at build time.
 */

"use client";

import React from "react";
import { MatrixProvider } from "@/contexts/MatrixContext";
import { MatrixChart } from "./MatrixChart";
import { QuadrantOverlay } from "./QuadrantOverlay";
import { ProjectModal } from "./ProjectModal";
import type { ProcessedProject } from "@/lib/types";

export interface MatrixPageClientProps {
  projects: ProcessedProject[];
}

export function MatrixPageClient({ projects }: MatrixPageClientProps) {
  const isEmpty = projects.length === 0;

  if (isEmpty) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-lg p-12 text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-blue-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No Projects Found
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Add markdown files to{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            _content/projects/
          </code>{" "}
          to see them visualized in the matrix.
        </p>
        <div className="text-sm text-gray-500">
          Expected format: PRJ-001.md with frontmatter containing scores, dates,
          and metadata.
        </div>
      </div>
    );
  }

  return (
    <MatrixProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Strategy Matrix
            </h1>
            <p className="mt-2 text-gray-600">
              Visualizing {projects.length} project
              {projects.length !== 1 ? "s" : ""} across impact and effort
              dimensions
            </p>
          </div>

          <div className="hidden md:flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  projects.filter((p) => p.matrix.quadrant === "Quick Wins")
                    .length
                }
              </div>
              <div className="text-xs text-gray-500">Quick Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  projects.filter((p) => p.matrix.quadrant === "Big Bets")
                    .length
                }
              </div>
              <div className="text-xs text-gray-500">Big Bets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {
                  projects.filter((p) => p.matrix.quadrant === "Fillers")
                    .length
                }
              </div>
              <div className="text-xs text-gray-500">Fillers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {
                  projects.filter((p) => p.matrix.quadrant === "Time Sinks")
                    .length
                }
              </div>
              <div className="text-xs text-gray-500">Time Sinks</div>
            </div>
          </div>
        </div>

        <div className="relative bg-white rounded-lg shadow-lg p-6 min-h-[600px]">
          <QuadrantOverlay />
          <MatrixChart projects={projects} className="relative z-10" />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <strong>Tip:</strong> Hover over points to see details, or click to
          view full project information.
        </div>

        <ProjectModal />
      </div>
    </MatrixProvider>
  );
}
