/**
 * Matrix Tooltip Component
 *
 * Displays on hover: project title, quadrant label,
 * ROI (bonus requirement), and normalized scores.
 */

"use client";

import React from "react";
import type { TooltipProps } from "recharts";

interface TooltipPayloadItem {
  payload?: {
    id?: string;
    title?: string;
    quadrant?: string;
    x?: number;
    y?: number;
    roi?: number;
    cost?: number;
  };
}

/**
 * Custom tooltip for matrix scatter chart
 */
export function MatrixTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = (payload[0] as TooltipPayloadItem)?.payload;
  if (!data) return null;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const quadrantColors: Record<string, string> = {
    "Quick Wins": "text-green-700 bg-green-50 border-green-200",
    "Big Bets": "text-blue-700 bg-blue-50 border-blue-200",
    Fillers: "text-gray-700 bg-gray-50 border-gray-200",
    "Time Sinks": "text-amber-700 bg-amber-50 border-amber-200",
  };
  const colorClass =
    quadrantColors[data.quadrant ?? ""] ??
    "text-gray-700 bg-gray-50 border-gray-200";

  return (
    <div
      className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 max-w-xs"
      role="tooltip"
    >
      <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
        {data.title}
      </h3>

      <div
        className={`inline-block px-2 py-1 rounded text-xs font-semibold border mb-3 ${colorClass}`}
      >
        {data.quadrant}
      </div>

      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Impact:</span>
          <span className="font-medium text-gray-900">{data.y}/100</span>
        </div>
        <div className="flex justify-between">
          <span>Effort:</span>
          <span className="font-medium text-gray-900">{data.x}/100</span>
        </div>
        <div className="flex justify-between border-t pt-1 mt-1">
          <span>ROI:</span>
          <span className="font-medium text-green-600">
            {data.roi != null ? formatCurrency(data.roi) : "-"}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t text-xs text-gray-400 italic">
        Click for details
      </div>
    </div>
  );
}
