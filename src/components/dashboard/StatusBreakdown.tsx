/**
 * StatusBreakdown - Grid showing project count per status
 */

import React from "react";

export interface StatusBreakdownProps {
  statuses: {
    active: number;
    queued: number;
    backlog: number;
    paused: number;
    complete: number;
  };
}

export function StatusBreakdown({ statuses }: StatusBreakdownProps) {
  return (
    <div
      className="bg-white rounded-lg shadow p-6 border border-gray-200"
      role="region"
      aria-labelledby="status-breakdown-heading"
    >
      <h3
        id="status-breakdown-heading"
        className="text-lg font-semibold text-gray-900 mb-4"
      >
        Status Overview
      </h3>
      <div
        className="grid grid-cols-2 gap-4"
        role="list"
        aria-label="Project counts by status"
      >
        <div role="listitem">
          <p className="text-2xl font-bold text-green-600">{statuses.active}</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div role="listitem">
          <p className="text-2xl font-bold text-blue-600">{statuses.queued}</p>
          <p className="text-sm text-gray-600">Queued</p>
        </div>
        <div role="listitem">
          <p className="text-2xl font-bold text-gray-600">{statuses.backlog}</p>
          <p className="text-sm text-gray-600">Backlog</p>
        </div>
        <div role="listitem">
          <p className="text-2xl font-bold text-amber-600">{statuses.paused}</p>
          <p className="text-sm text-gray-600">Paused</p>
        </div>
        <div role="listitem" className="col-span-2">
          <p className="text-2xl font-bold text-purple-600">{statuses.complete}</p>
          <p className="text-sm text-gray-600">Complete</p>
        </div>
      </div>
    </div>
  );
}
