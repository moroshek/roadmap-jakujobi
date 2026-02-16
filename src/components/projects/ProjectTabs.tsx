"use client";

import { useState } from "react";
import type { ProcessedProject } from "@/lib/types";

interface ProjectTabsProps {
  project: ProcessedProject;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "metrics">("overview");

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px" aria-label="Project sections">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("metrics")}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
              activeTab === "metrics"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Metrics
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Project Summary</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Quadrant</dt>
                <dd className="font-medium">{project.matrix.quadrant}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Impact (Strategic Value)</dt>
                <dd className="font-medium">
                  {project.matrix.impactNormalized}/100
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Effort (Complexity)</dt>
                <dd className="font-medium">
                  {project.matrix.effortNormalized}/100
                </dd>
              </div>
            </dl>
          </div>
        )}

        {activeTab === "metrics" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Financials</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-gray-500 text-sm">Estimated Cost</dt>
                <dd className="font-medium">
                  {formatCurrency(project.financials.estimated_cost)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 text-sm">Projected ROI</dt>
                <dd className="font-medium">
                  {formatCurrency(project.financials.projected_roi)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 text-sm">Confidence</dt>
                <dd className="font-medium">
                  {(project.scores.confidence * 100).toFixed(0)}%
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
