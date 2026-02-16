"use client";

import type { SortField, SortOrder } from "@/lib/projects/sortProjects";

interface SortSelectorProps {
  field: SortField;
  order: SortOrder;
  onFieldChange: (field: SortField) => void;
  onOrderChange: (order: SortOrder) => void;
}

const FIELDS: { value: SortField; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "status", label: "Status" },
  { value: "department", label: "Department" },
  { value: "phase", label: "Phase" },
  { value: "roi", label: "ROI" },
  { value: "impact", label: "Impact" },
  { value: "planned_end", label: "End Date" },
];

export function SortSelector({
  field,
  order,
  onFieldChange,
  onOrderChange,
}: SortSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={field}
        onChange={(e) => onFieldChange(e.target.value as SortField)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        aria-label="Sort by"
      >
        {FIELDS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
      <select
        value={order}
        onChange={(e) => onOrderChange(e.target.value as SortOrder)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        aria-label="Sort order"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
