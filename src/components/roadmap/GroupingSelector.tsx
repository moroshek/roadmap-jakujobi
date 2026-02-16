"use client";

import type { GroupingDimension } from "@/lib/gantt/groupProjects";

interface GroupingSelectorProps {
  value: GroupingDimension;
  onChange: (value: GroupingDimension) => void;
}

const OPTIONS: { value: GroupingDimension; label: string }[] = [
  { value: "department", label: "Department" },
  { value: "status", label: "Status" },
  { value: "phase", label: "Phase" },
  { value: "none", label: "None" },
];

export function GroupingSelector({ value, onChange }: GroupingSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as GroupingDimension)}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      aria-label="Group projects by"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
