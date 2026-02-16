/**
 * Matrix Context for State Management
 *
 * Provides shared state for selected project (modal) and hover highlight
 * across matrix components.
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { ProcessedProject } from "@/lib/types";

export interface MatrixContextValue {
  selectedProject: ProcessedProject | null;
  setSelectedProject: (project: ProcessedProject | null) => void;
  hoveredProjectId: string | null;
  setHoveredProjectId: (id: string | null) => void;
}

const MatrixContext = createContext<MatrixContextValue | undefined>(
  undefined
);

/**
 * Provider component for matrix state
 */
export function MatrixProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] =
    useState<ProcessedProject | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  return (
    <MatrixContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        hoveredProjectId,
        setHoveredProjectId,
      }}
    >
      {children}
    </MatrixContext.Provider>
  );
}

/**
 * Hook to access matrix context
 *
 * @throws Error if used outside MatrixProvider
 */
export function useMatrix(): MatrixContextValue {
  const context = useContext(MatrixContext);

  if (!context) {
    throw new Error("useMatrix must be used within MatrixProvider");
  }

  return context;
}
