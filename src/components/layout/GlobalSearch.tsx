"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ProcessedProject } from "@/lib/types";
import { searchProjects } from "@/lib/projects/searchProjects";

interface GlobalSearchProps {
  projects: ProcessedProject[];
}

export function GlobalSearch({ projects }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ProcessedProject[]>([]);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const matches = searchProjects(projects, query).slice(0, 5);
      setResults(matches);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, projects]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (projectId: string) => {
    router.push(`/projects/${projectId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative w-full max-w-md" role="search">
      <input
        type="search"
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        aria-label="Search projects"
        aria-expanded={isOpen}
        aria-controls="search-results"
      />

      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {results.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => handleSelect(project.id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              role="option"
            >
              <div className="font-medium text-gray-900">{project.title}</div>
              <div className="text-sm text-gray-500">
                {project.department} - {project.status}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
