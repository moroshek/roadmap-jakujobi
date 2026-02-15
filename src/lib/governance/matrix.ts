/**
 * Matrix Governance Logic
 *
 * This module contains the core business logic for the Strategy Matrix.
 * All functions are pure (deterministic) and thoroughly tested.
 */

import type {
  QuadrantLabel,
  ProcessedProject,
  MatrixDataPoint,
} from "@/lib/types";

/**
 * Normalizes a raw score (0-10) to chart coordinates (0-100)
 *
 * @param value - Raw score from 0-10 scale
 * @returns Normalized score from 0-100 scale
 *
 * @example
 * normalizeScore(0) // 0
 * normalizeScore(5) // 50
 * normalizeScore(10) // 100
 * normalizeScore(-1) // 0 (clamped)
 * normalizeScore(15) // 100 (clamped)
 */
export function normalizeScore(value: number): number {
  // Step 1: Clamp to valid range [0, 10]
  const clamped = Math.max(0, Math.min(10, value));

  // Step 2: Scale to [0, 100]
  const scaled = clamped * 10;

  // Step 3: Round to nearest integer
  return Math.round(scaled);
}

/**
 * Assigns a quadrant label based on normalized impact and effort scores
 *
 * PRD Quadrant Rules:
 * - Quick Wins: impact >= 50, effort < 50
 * - Big Bets: impact >= 50, effort >= 50
 * - Fillers: impact < 50, effort < 50
 * - Time Sinks: impact < 50, effort >= 50
 *
 * @param impact - Normalized impact score (0-100)
 * @param effort - Normalized effort score (0-100)
 * @returns Quadrant label
 *
 * @example
 * assignQuadrant(86, 32) // 'Quick Wins'
 * assignQuadrant(91, 82) // 'Big Bets'
 * assignQuadrant(39, 28) // 'Fillers'
 * assignQuadrant(41, 87) // 'Time Sinks'
 */
export function assignQuadrant(impact: number, effort: number): QuadrantLabel {
  const isHighImpact = impact >= 50;
  const isHighEffort = effort >= 50;

  if (isHighImpact && !isHighEffort) {
    return "Quick Wins";
  }

  if (isHighImpact && isHighEffort) {
    return "Big Bets";
  }

  if (!isHighImpact && !isHighEffort) {
    return "Fillers";
  }

  // !isHighImpact && isHighEffort
  return "Time Sinks";
}

/**
 * Transforms a processed project into a matrix data point
 *
 * This function applies both normalization and quadrant assignment.
 *
 * @param project - A processed project with raw scores
 * @returns Matrix data point ready for chart rendering
 */
export function transformToMatrixPoint(
  project: ProcessedProject
): MatrixDataPoint {
  return {
    id: project.id,
    title: project.title,
    x: project.matrix.effortNormalized,
    y: project.matrix.impactNormalized,
    quadrant: project.matrix.quadrant,
    department: project.department,
    phase: project.phase,
    status: project.status,
    financials: project.financials,
  };
}

/**
 * Batch transform multiple projects to matrix points
 *
 * @param projects - Array of processed projects
 * @returns Array of matrix data points
 */
export function transformToMatrixData(
  projects: ProcessedProject[]
): MatrixDataPoint[] {
  return projects.map(transformToMatrixPoint);
}
