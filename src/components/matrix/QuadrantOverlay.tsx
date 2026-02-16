/**
 * Quadrant Overlay Component
 *
 * Renders four background zones with labels:
 * Top-left: Quick Wins, Top-right: Big Bets,
 * Bottom-left: Fillers, Bottom-right: Time Sinks
 * Split at x=50, y=50 per PRD Section 2.1
 */

"use client";

import React from "react";

export interface QuadrantOverlayProps {
  className?: string;
}

/**
 * QuadrantOverlay Component
 *
 * Renders as an absolutely positioned overlay behind the chart
 */
export function QuadrantOverlay({ className = "" }: QuadrantOverlayProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div className="relative w-full h-full">
        <div
          className="absolute left-0 top-0 w-1/2 h-1/2 bg-green-50 border-r border-b border-gray-200"
          style={{ opacity: 0.3 }}
        >
          <div className="absolute top-4 left-4 text-green-700 font-semibold text-sm">
            Quick Wins
          </div>
        </div>

        <div
          className="absolute right-0 top-0 w-1/2 h-1/2 bg-blue-50 border-l border-b border-gray-200"
          style={{ opacity: 0.3 }}
        >
          <div className="absolute top-4 right-4 text-blue-700 font-semibold text-sm">
            Big Bets
          </div>
        </div>

        <div
          className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-gray-50 border-r border-t border-gray-200"
          style={{ opacity: 0.3 }}
        >
          <div className="absolute bottom-4 left-4 text-gray-700 font-semibold text-sm">
            Fillers
          </div>
        </div>

        <div
          className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-amber-50 border-l border-t border-gray-200"
          style={{ opacity: 0.3 }}
        >
          <div className="absolute bottom-4 right-4 text-amber-700 font-semibold text-sm">
            Time Sinks
          </div>
        </div>
      </div>
    </div>
  );
}
