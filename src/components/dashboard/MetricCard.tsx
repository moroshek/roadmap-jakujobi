/**
 * MetricCard - Reusable metric display card for dashboard
 *
 * Displays a label, primary value, and optional subtitle in a card layout.
 */

import React from "react";

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon,
}: MetricCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow p-6 border border-gray-200"
      role="article"
      aria-labelledby={`metric-${label.replace(/\s/g, "-")}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            id={`metric-${label.replace(/\s/g, "-")}`}
            className="text-sm font-medium text-gray-600"
          >
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && <div className="text-gray-400" aria-hidden="true">{icon}</div>}
      </div>
    </div>
  );
}
