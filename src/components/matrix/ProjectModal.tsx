/**
 * Project Detail Modal
 *
 * Displayed when user clicks a matrix point.
 * Shows full project information: metadata, dates, scores, financials.
 */

"use client";

import React, { useEffect } from "react";
import { useMatrix } from "@/contexts/MatrixContext";
import type { ProcessedProject } from "@/lib/types";

/**
 * ProjectModal Component
 */
export function ProjectModal() {
  const { selectedProject, setSelectedProject } = useMatrix();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedProject, setSelectedProject]);

  if (!selectedProject) return null;

  const project = selectedProject;

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: project.financials.currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statusColors: Record<string, string> = {
    Active: "bg-green-100 text-green-800 border-green-300",
    Queued: "bg-blue-100 text-blue-800 border-blue-300",
    Paused: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Complete: "bg-gray-100 text-gray-800 border-gray-300",
    Backlog: "bg-purple-100 text-purple-800 border-purple-300",
  };
  const statusClass = statusColors[project.status] ?? statusColors.Backlog;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={() => setSelectedProject(null)}
        aria-hidden="true"
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2
                id="modal-title"
                className="text-xl font-bold text-gray-900 mb-2"
              >
                {project.title}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold border ${statusClass}`}
                >
                  {project.status}
                </span>
                <span className="text-sm text-gray-600">{project.id}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{project.owner}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {project.department}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phase
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{project.phase}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quadrant
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {project.matrix.quadrant}
                </dd>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Planned Start:</span>
                  <span className="font-medium">
                    {formatDate(project.dates.planned_start)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Planned End:</span>
                  <span className="font-medium">
                    {formatDate(project.dates.planned_end)}
                  </span>
                </div>
                {project.dates.actual_start && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actual Start:</span>
                    <span className="font-medium">
                      {formatDate(project.dates.actual_start)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Strategic Scores
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      Impact / Strategic Value
                    </span>
                    <span className="font-medium">
                      {project.scores.strategic_value}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${project.matrix.impactNormalized}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      Effort / Complexity
                    </span>
                    <span className="font-medium">
                      {project.scores.complexity}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${project.matrix.effortNormalized}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Confidence</span>
                    <span className="font-medium">
                      {(project.scores.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${project.scores.confidence * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Financial Impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Estimated Cost
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(project.financials.estimated_cost)}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Projected ROI
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    {formatCurrency(project.financials.projected_roi)}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 text-center">
                ROI Multiplier:{" "}
                {(
                  project.financials.projected_roi /
                  project.financials.estimated_cost
                ).toFixed(2)}
                x
              </div>
            </div>

            {project.tags.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.related_projects.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Related Projects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.related_projects.map((relatedId) => (
                    <span
                      key={relatedId}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 text-xs font-medium"
                    >
                      {relatedId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
            <button
              onClick={() => setSelectedProject(null)}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
