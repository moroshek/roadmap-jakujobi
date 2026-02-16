/**
 * PhaseDistribution - Bar chart showing project count per phase
 */

import React from "react";

export interface PhaseItem {
  name: string;
  count: number;
  color: string;
}

export interface PhaseDistributionProps {
  phases: PhaseItem[];
}

export function PhaseDistribution({ phases }: PhaseDistributionProps) {
  const maxCount = phases.length > 0 ? Math.max(...phases.map((p) => p.count)) : 0;

  return (
    <div
      className="bg-white rounded-lg shadow p-6 border border-gray-200"
      role="region"
      aria-labelledby="phase-distribution-heading"
    >
      <h3
        id="phase-distribution-heading"
        className="text-lg font-semibold text-gray-900 mb-4"
      >
        Projects by Phase
      </h3>
      {phases.length === 0 ? (
        <p className="text-sm text-gray-500">No phase data available</p>
      ) : (
        <div className="space-y-3">
          {phases.map((phase) => (
            <div key={phase.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {phase.name}
                </span>
                <span className="text-sm text-gray-600">{phase.count}</span>
              </div>
              <div
                className="w-full bg-gray-200 rounded-full h-2"
                role="progressbar"
                aria-valuenow={phase.count}
                aria-valuemin={0}
                aria-valuemax={maxCount}
                aria-label={`${phase.name}: ${phase.count} projects`}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: maxCount > 0 ? `${(phase.count / maxCount) * 100}%` : "0%",
                    backgroundColor: phase.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
