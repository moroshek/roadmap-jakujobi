"use client";

interface ProjectSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ProjectSearchBar({
  value,
  onChange,
  className = "",
}: ProjectSearchBarProps) {
  return (
    <input
      type="search"
      placeholder="Search projects..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      aria-label="Search projects"
    />
  );
}
