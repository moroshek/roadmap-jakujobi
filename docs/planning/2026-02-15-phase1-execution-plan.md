# Phase 1 Execution Plan: TDD Core Logic

**Date:** 2026-02-15  
**Status:** Ready for Execution  
**Time Window:** 25-75 minutes (50-minute hard limit)  
**Strategy:** Test-Driven Development (TDD) - Write tests first, implement second  
**Exit Gate:** All unit tests green, core logic matches PRD exactly

---

## Executive Summary

Phase 1 is the foundation of the entire Roadmap Engine. We build the deterministic governance logic using a strict TDD approach. No UI work happens in this phase. By the end of P1, we will have:

1. Complete type system for the application
2. Matrix normalization logic (0-10 to 0-100 conversion)
3. Quadrant assignment logic (matching PRD table exactly)
4. Zod validation schema for project frontmatter
5. Comprehensive unit tests covering all edge cases

**Critical Success Factor:** If P1 tests don't pass, the entire matrix feature will fail. This phase cannot be skipped or rushed.

---

## Context & Prerequisites

### What Already Exists (P0 Complete)
- Next.js 14 app with App Router structure
- TypeScript + Tailwind configured
- Vitest testing harness ready (`vitest.config.ts`, `tests/setup.ts`)
- `_content/projects/` has 4 seeded projects (PRJ-001 to PRJ-004)
- `_content/config.json` contains tenant configuration
- Routes `/` and `/matrix` have placeholder pages

### What We're Building in P1
The "brain" of the matrix feature - pure logic functions that:
- Transform raw scores (0-10) into chart coordinates (0-100)
- Assign quadrant labels based on PRD boundaries
- Validate project data integrity

### Why TDD Matters Here
These functions are deterministic (same input always produces same output). Testing them before implementing ensures we catch logic errors early, before they propagate to the UI layer.

---

## Implementation Roadmap

### Timeline Breakdown

| Task | Time Estimate | Cumulative |
|------|---------------|------------|
| Create type definitions | 5 min | 5 min |
| Write + implement normalization tests | 10 min | 15 min |
| Write + implement quadrant tests | 15 min | 30 min |
| Write + implement validation schema tests | 15 min | 45 min |
| Integration check + buffer | 5 min | 50 min |

---

## File-by-File Implementation Guide

### File 1: `src/lib/types.ts`

**Purpose:** Central type definitions for the entire application.

**What to Create:**

```typescript
/**
 * Type definitions for Roadmap Engine
 * 
 * These types define the data contracts between:
 * - Content layer (markdown files)
 * - Governance layer (transformation logic)
 * - Presentation layer (UI components)
 */

// === Raw Input Types (from Markdown frontmatter) ===

export type ProjectStatus = 'Backlog' | 'Queued' | 'Active' | 'Paused' | 'Complete';

export interface RawProjectFrontmatter {
  id: string;
  title: string;
  slug: string;
  owner: string;
  department: string;
  phase: string;
  status: ProjectStatus;
  dates: {
    planned_start: string;
    planned_end: string;
    actual_start?: string;
  };
  scores: {
    strategic_value: number;  // Raw score 0-10
    complexity: number;        // Raw score 0-10
    confidence: number;       // 0-1
  };
  financials: {
    estimated_cost: number;
    projected_roi: number;
    currency: string;
  };
  tags: string[];
  related_projects: string[];
}

// === Processed Types (after transformation) ===

export type QuadrantLabel = 'Quick Wins' | 'Big Bets' | 'Fillers' | 'Time Sinks';

export interface ProcessedProject {
  // Core identity
  id: string;
  title: string;
  slug: string;
  owner: string;
  department: string;
  phase: string;
  status: ProjectStatus;
  
  // Dates
  dates: {
    planned_start: Date;
    planned_end: Date;
    actual_start?: Date;
  };
  
  // Raw scores (unchanged)
  scores: {
    strategic_value: number;  // 0-10
    complexity: number;       // 0-10
    confidence: number;       // 0-1
  };
  
  // Matrix-specific computed fields
  matrix: {
    impactNormalized: number;    // 0-100
    effortNormalized: number;    // 0-100
    quadrant: QuadrantLabel;
  };
  
  // Financials
  financials: {
    estimated_cost: number;
    projected_roi: number;
    currency: string;
  };
  
  // Relationships
  tags: string[];
  related_projects: string[];
}

// === Matrix Data Point (for chart rendering) ===

export interface MatrixDataPoint {
  id: string;
  title: string;
  x: number;           // effortNormalized (0-100)
  y: number;           // impactNormalized (0-100)
  quadrant: QuadrantLabel;
  department: string;
  phase: string;
  status: ProjectStatus;
  financials: {
    estimated_cost: number;
    projected_roi: number;
    currency: string;
  };
}

// === Config Types ===

export interface TenantConfig {
  tenant_id: string;
  meta: {
    title: string;
    logo_url: string;
    favicon_url: string;
  };
  governance: {
    fiscal_year_start: string;
    max_concurrent_projects: number;
    phases: string[];
    departments: string[];
  };
}
```

**Validation:**
- File compiles without TypeScript errors
- Run: `npx tsc --noEmit` to verify

**Time Estimate:** 5 minutes

---

### File 2: `tests/unit/governance/matrix.normalize.test.ts`

**Purpose:** Test normalization logic BEFORE implementing it.

**TDD Cycle:**
1. Write these tests (they will fail)
2. Run `npm run test:unit` and watch them fail
3. Implement `normalizeScore` in `src/lib/governance/matrix.ts`
4. Run tests again and watch them pass

**What to Create:**

```typescript
import { describe, test, expect } from 'vitest';
import { normalizeScore } from '@/lib/governance/matrix';

describe('normalizeScore', () => {
  describe('basic transformations', () => {
    test('should return 0 for input 0', () => {
      expect(normalizeScore(0)).toBe(0);
    });

    test('should return 100 for input 10', () => {
      expect(normalizeScore(10)).toBe(100);
    });

    test('should return 50 for input 5', () => {
      expect(normalizeScore(5)).toBe(50);
    });

    test('should multiply by 10 for mid-range values', () => {
      expect(normalizeScore(2.5)).toBe(25);
      expect(normalizeScore(7.5)).toBe(75);
    });
  });

  describe('decimal handling', () => {
    test('should handle decimal inputs correctly', () => {
      expect(normalizeScore(8.6)).toBe(86);
      expect(normalizeScore(3.2)).toBe(32);
      expect(normalizeScore(1.5)).toBe(15);
    });

    test('should round to nearest integer', () => {
      expect(normalizeScore(5.5)).toBe(55);
      expect(normalizeScore(5.4)).toBe(54);
      expect(normalizeScore(5.6)).toBe(56);
    });
  });

  describe('clamping behavior', () => {
    test('should clamp negative values to 0', () => {
      expect(normalizeScore(-1)).toBe(0);
      expect(normalizeScore(-5)).toBe(0);
      expect(normalizeScore(-100)).toBe(0);
    });

    test('should clamp values over 10 to 100', () => {
      expect(normalizeScore(10.1)).toBe(100);
      expect(normalizeScore(15)).toBe(100);
      expect(normalizeScore(100)).toBe(100);
    });

    test('should handle boundary values exactly', () => {
      expect(normalizeScore(0)).toBe(0);
      expect(normalizeScore(10)).toBe(100);
    });
  });

  describe('edge cases', () => {
    test('should handle very small positive values', () => {
      expect(normalizeScore(0.1)).toBe(1);
      expect(normalizeScore(0.01)).toBe(0);  // Rounds to 0
    });

    test('should handle values just under 10', () => {
      expect(normalizeScore(9.9)).toBe(99);
      expect(normalizeScore(9.99)).toBe(100);  // Rounds to 100
    });
  });
});
```

**Expected Behavior:** All tests fail initially (function doesn't exist yet).

**Time Estimate:** 10 minutes (includes writing tests + implementation)

---

### File 3: `src/lib/governance/matrix.ts` (Part 1: Normalization)

**Purpose:** Implement the normalization function to make tests pass.

**Implementation Strategy:**
1. Clamp input to [0, 10] range
2. Multiply by 10 to get [0, 100]
3. Round to nearest integer

**What to Create:**

```typescript
/**
 * Matrix Governance Logic
 * 
 * This module contains the core business logic for the Strategy Matrix.
 * All functions are pure (deterministic) and thoroughly tested.
 */

import type { QuadrantLabel, ProcessedProject, MatrixDataPoint } from '@/lib/types';

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
```

**Validation:**
- Run: `npm run test:unit tests/unit/governance/matrix.normalize.test.ts`
- All tests should pass
- Run: `npm run test:unit` (all tests) - should still pass

**Time Estimate:** Included in test writing time above

---

### File 4: `tests/unit/governance/matrix.quadrant.test.ts`

**Purpose:** Test quadrant assignment logic BEFORE implementing it.

**Critical PRD Reference:**

| Quadrant Name | Impact (Y) | Effort (X) |
|--------------|------------|------------|
| Quick Wins | >= 50 | < 50 |
| Big Bets | >= 50 | >= 50 |
| Fillers | < 50 | < 50 |
| Time Sinks | < 50 | >= 50 |

**What to Create:**

```typescript
import { describe, test, expect } from 'vitest';
import { assignQuadrant } from '@/lib/governance/matrix';

describe('assignQuadrant', () => {
  describe('Quick Wins (high impact, low effort)', () => {
    test('should assign Quick Wins for impact >= 50, effort < 50', () => {
      expect(assignQuadrant(50, 0)).toBe('Quick Wins');
      expect(assignQuadrant(50, 49)).toBe('Quick Wins');
      expect(assignQuadrant(100, 0)).toBe('Quick Wins');
      expect(assignQuadrant(75, 25)).toBe('Quick Wins');
    });

    test('should match seeded project PRJ-001', () => {
      // PRJ-001: strategic_value = 8.6 -> 86, complexity = 3.2 -> 32
      expect(assignQuadrant(86, 32)).toBe('Quick Wins');
    });
  });

  describe('Big Bets (high impact, high effort)', () => {
    test('should assign Big Bets for impact >= 50, effort >= 50', () => {
      expect(assignQuadrant(50, 50)).toBe('Big Bets');
      expect(assignQuadrant(50, 100)).toBe('Big Bets');
      expect(assignQuadrant(100, 50)).toBe('Big Bets');
      expect(assignQuadrant(100, 100)).toBe('Big Bets');
    });

    test('should match seeded project PRJ-002', () => {
      // PRJ-002: strategic_value = 9.1 -> 91, complexity = 8.2 -> 82
      expect(assignQuadrant(91, 82)).toBe('Big Bets');
    });
  });

  describe('Fillers (low impact, low effort)', () => {
    test('should assign Fillers for impact < 50, effort < 50', () => {
      expect(assignQuadrant(0, 0)).toBe('Fillers');
      expect(assignQuadrant(49, 0)).toBe('Fillers');
      expect(assignQuadrant(0, 49)).toBe('Fillers');
      expect(assignQuadrant(49, 49)).toBe('Fillers');
    });

    test('should match seeded project PRJ-003', () => {
      // PRJ-003: strategic_value = 3.9 -> 39, complexity = 2.8 -> 28
      expect(assignQuadrant(39, 28)).toBe('Fillers');
    });
  });

  describe('Time Sinks (low impact, high effort)', () => {
    test('should assign Time Sinks for impact < 50, effort >= 50', () => {
      expect(assignQuadrant(0, 50)).toBe('Time Sinks');
      expect(assignQuadrant(49, 50)).toBe('Time Sinks');
      expect(assignQuadrant(0, 100)).toBe('Time Sinks');
      expect(assignQuadrant(25, 75)).toBe('Time Sinks');
    });

    test('should match seeded project PRJ-004', () => {
      // PRJ-004: strategic_value = 4.1 -> 41, complexity = 8.7 -> 87
      expect(assignQuadrant(41, 87)).toBe('Time Sinks');
    });
  });

  describe('boundary conditions (critical for correctness)', () => {
    test('exactly 50 impact, below 50 effort -> Quick Wins', () => {
      expect(assignQuadrant(50, 0)).toBe('Quick Wins');
      expect(assignQuadrant(50, 49)).toBe('Quick Wins');
    });

    test('exactly 50 on both axes -> Big Bets', () => {
      expect(assignQuadrant(50, 50)).toBe('Big Bets');
    });

    test('below 50 impact, exactly 50 effort -> Time Sinks', () => {
      expect(assignQuadrant(0, 50)).toBe('Time Sinks');
      expect(assignQuadrant(49, 50)).toBe('Time Sinks');
    });

    test('below 50 on both axes -> Fillers', () => {
      expect(assignQuadrant(0, 0)).toBe('Fillers');
      expect(assignQuadrant(49, 49)).toBe('Fillers');
    });

    test('extreme values', () => {
      expect(assignQuadrant(100, 100)).toBe('Big Bets');
      expect(assignQuadrant(0, 0)).toBe('Fillers');
      expect(assignQuadrant(100, 0)).toBe('Quick Wins');
      expect(assignQuadrant(0, 100)).toBe('Time Sinks');
    });
  });

  describe('realistic scenarios', () => {
    test('high-value automation project (low effort)', () => {
      expect(assignQuadrant(85, 30)).toBe('Quick Wins');
    });

    test('major infrastructure overhaul (high impact, high cost)', () => {
      expect(assignQuadrant(90, 95)).toBe('Big Bets');
    });

    test('minor UI tweak (low impact, quick)', () => {
      expect(assignQuadrant(20, 15)).toBe('Fillers');
    });

    test('legacy system maintenance (low value, high effort)', () => {
      expect(assignQuadrant(30, 80)).toBe('Time Sinks');
    });
  });
});
```

**Expected Behavior:** All tests fail initially.

**Time Estimate:** 15 minutes (includes writing tests + implementation)

---

### File 5: `src/lib/governance/matrix.ts` (Part 2: Quadrant Logic)

**Purpose:** Implement quadrant assignment to make tests pass.

**Add to existing `matrix.ts`:**

```typescript
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
    return 'Quick Wins';
  }
  
  if (isHighImpact && isHighEffort) {
    return 'Big Bets';
  }
  
  if (!isHighImpact && !isHighEffort) {
    return 'Fillers';
  }
  
  // !isHighImpact && isHighEffort
  return 'Time Sinks';
}
```

**Validation:**
- Run: `npm run test:unit tests/unit/governance/matrix.quadrant.test.ts`
- All tests should pass
- Run: `npm run test:unit` - all previous tests should still pass

**Time Estimate:** Included in test writing time above

---

### File 6: `src/lib/governance/matrix.ts` (Part 3: Transform Helper)

**Purpose:** High-level function to transform a ProcessedProject into MatrixDataPoint.

**Add to existing `matrix.ts`:**

```typescript
/**
 * Transforms a processed project into a matrix data point
 * 
 * This function applies both normalization and quadrant assignment.
 * 
 * @param project - A processed project with raw scores
 * @returns Matrix data point ready for chart rendering
 */
export function transformToMatrixPoint(project: ProcessedProject): MatrixDataPoint {
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
export function transformToMatrixData(projects: ProcessedProject[]): MatrixDataPoint[] {
  return projects.map(transformToMatrixPoint);
}
```

**Note:** No separate test file needed - this is tested implicitly through integration tests later.

**Time Estimate:** 2 minutes

---

### File 7: `src/lib/validation/projectSchema.ts`

**Purpose:** Zod schema for validating project frontmatter.

**What to Create:**

```typescript
/**
 * Project Validation Schema
 * 
 * Defines strict validation rules for project frontmatter using Zod.
 * Ensures data integrity before transformation.
 */

import { z } from 'zod';

/**
 * Valid project status values
 */
const projectStatusSchema = z.enum(['Backlog', 'Queued', 'Active', 'Paused', 'Complete']);

/**
 * Date string in ISO format (YYYY-MM-DD)
 */
const dateStringSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Date must be in YYYY-MM-DD format'
);

/**
 * Score between 0 and 10 (inclusive)
 */
const scoreSchema = z.number()
  .min(0, 'Score must be >= 0')
  .max(10, 'Score must be <= 10');

/**
 * Confidence score between 0 and 1 (inclusive)
 */
const confidenceSchema = z.number()
  .min(0, 'Confidence must be >= 0')
  .max(1, 'Confidence must be <= 1');

/**
 * Valid departments (from AutoNova Motors tenant)
 */
const departmentSchema = z.enum([
  'Manufacturing',
  'Supply Chain',
  'Sales & Marketing',
  'R&D',
  'IT',
  'Finance',
  'HR',
]);

/**
 * Valid phases (from config)
 */
const phaseSchema = z.enum(['Foundation', 'Acceleration', 'Scale']);

/**
 * Project ID format: PRJ-XXX where XXX is 3 digits
 */
const projectIdSchema = z.string().regex(
  /^PRJ-\d{3}$/,
  'Project ID must be in format PRJ-XXX (e.g., PRJ-001)'
);

/**
 * Complete project frontmatter schema
 */
export const ProjectSchema = z.object({
  id: projectIdSchema,
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  owner: z.string().min(1, 'Owner is required'),
  department: departmentSchema,
  phase: phaseSchema,
  status: projectStatusSchema,
  
  dates: z.object({
    planned_start: dateStringSchema,
    planned_end: dateStringSchema,
    actual_start: dateStringSchema.optional(),
  }),
  
  scores: z.object({
    strategic_value: scoreSchema,
    complexity: scoreSchema,
    confidence: confidenceSchema,
  }),
  
  financials: z.object({
    estimated_cost: z.number().min(0, 'Cost must be >= 0'),
    projected_roi: z.number().min(0, 'ROI must be >= 0'),
    currency: z.string().length(3, 'Currency must be 3-letter code (e.g., USD)'),
  }),
  
  tags: z.array(z.string()),
  related_projects: z.array(z.string()),
});

/**
 * Type inference from schema
 */
export type ValidatedProjectFrontmatter = z.infer<typeof ProjectSchema>;

/**
 * Validates project frontmatter and returns typed result
 * 
 * @param data - Raw frontmatter object
 * @returns Validated data or throws ZodError
 */
export function validateProject(data: unknown): ValidatedProjectFrontmatter {
  return ProjectSchema.parse(data);
}

/**
 * Safely validates project frontmatter without throwing
 * 
 * @param data - Raw frontmatter object
 * @returns Success result with data, or error result with issues
 */
export function safeValidateProject(data: unknown) {
  return ProjectSchema.safeParse(data);
}
```

**Time Estimate:** 8 minutes

---

### File 8: `tests/unit/validation/projectSchema.test.ts`

**Purpose:** Validate that schema correctly accepts/rejects data.

**What to Create:**

```typescript
import { describe, test, expect } from 'vitest';
import { ProjectSchema, validateProject, safeValidateProject } from '@/lib/validation/projectSchema';

describe('ProjectSchema', () => {
  const validProject = {
    id: 'PRJ-001',
    title: 'Factory Predictive Maintenance',
    slug: 'factory-predictive-maintenance',
    owner: 'VP Manufacturing',
    department: 'Manufacturing',
    phase: 'Foundation',
    status: 'Active',
    dates: {
      planned_start: '2026-02-01',
      planned_end: '2026-07-15',
    },
    scores: {
      strategic_value: 8.6,
      complexity: 3.2,
      confidence: 0.87,
    },
    financials: {
      estimated_cost: 620000,
      projected_roi: 2100000,
      currency: 'USD',
    },
    tags: ['IoT', 'AI'],
    related_projects: [],
  };

  describe('valid projects', () => {
    test('should accept complete valid project', () => {
      const result = ProjectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    test('should accept project with optional actual_start', () => {
      const withActualStart = {
        ...validProject,
        dates: { ...validProject.dates, actual_start: '2026-02-05' },
      };
      const result = ProjectSchema.safeParse(withActualStart);
      expect(result.success).toBe(true);
    });

    test('should accept all valid departments', () => {
      const departments = [
        'Manufacturing',
        'Supply Chain',
        'Sales & Marketing',
        'R&D',
        'IT',
        'Finance',
        'HR',
      ];

      departments.forEach((dept) => {
        const project = { ...validProject, department: dept };
        const result = ProjectSchema.safeParse(project);
        expect(result.success).toBe(true);
      });
    });

    test('should accept all valid phases', () => {
      const phases = ['Foundation', 'Acceleration', 'Scale'];

      phases.forEach((phase) => {
        const project = { ...validProject, phase };
        const result = ProjectSchema.safeParse(project);
        expect(result.success).toBe(true);
      });
    });

    test('should accept all valid statuses', () => {
      const statuses = ['Backlog', 'Queued', 'Active', 'Paused', 'Complete'];

      statuses.forEach((status) => {
        const project = { ...validProject, status };
        const result = ProjectSchema.safeParse(project);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('invalid projects', () => {
    test('should reject invalid ID format', () => {
      const invalid = { ...validProject, id: 'INVALID' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject empty title', () => {
      const invalid = { ...validProject, title: '' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject invalid department', () => {
      const invalid = { ...validProject, department: 'InvalidDept' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject invalid phase', () => {
      const invalid = { ...validProject, phase: 'InvalidPhase' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject invalid status', () => {
      const invalid = { ...validProject, status: 'InvalidStatus' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject strategic_value > 10', () => {
      const invalid = {
        ...validProject,
        scores: { ...validProject.scores, strategic_value: 15 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject strategic_value < 0', () => {
      const invalid = {
        ...validProject,
        scores: { ...validProject.scores, strategic_value: -1 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject complexity > 10', () => {
      const invalid = {
        ...validProject,
        scores: { ...validProject.scores, complexity: 12 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject confidence > 1', () => {
      const invalid = {
        ...validProject,
        scores: { ...validProject.scores, confidence: 1.5 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject invalid date format', () => {
      const invalid = {
        ...validProject,
        dates: { ...validProject.dates, planned_start: '02/01/2026' },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject negative cost', () => {
      const invalid = {
        ...validProject,
        financials: { ...validProject.financials, estimated_cost: -1000 },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject invalid currency format', () => {
      const invalid = {
        ...validProject,
        financials: { ...validProject.financials, currency: 'USDOLLAR' },
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const invalid = { id: 'PRJ-001', title: 'Test' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('validation helpers', () => {
    test('validateProject should throw on invalid data', () => {
      const invalid = { ...validProject, id: 'INVALID' };
      expect(() => validateProject(invalid)).toThrow();
    });

    test('validateProject should return typed data on valid input', () => {
      const result = validateProject(validProject);
      expect(result.id).toBe('PRJ-001');
      expect(result.title).toBe('Factory Predictive Maintenance');
    });

    test('safeValidateProject should not throw on invalid data', () => {
      const invalid = { ...validProject, id: 'INVALID' };
      const result = safeValidateProject(invalid);
      expect(result.success).toBe(false);
    });

    test('safeValidateProject should return success=true on valid data', () => {
      const result = safeValidateProject(validProject);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('PRJ-001');
      }
    });
  });
});
```

**Time Estimate:** 7 minutes

---

## Validation & Testing

### Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run specific test file
npm run test:unit tests/unit/governance/matrix.normalize.test.ts

# Watch mode (auto-rerun on changes)
npm run test:unit -- --watch

# Coverage report
npm run test:coverage
```

### Expected Test Results

**After completing P1, you should see:**

```
✓ tests/unit/governance/matrix.normalize.test.ts (15 tests)
  ✓ normalizeScore
    ✓ basic transformations (4 tests)
    ✓ decimal handling (3 tests)
    ✓ clamping behavior (6 tests)
    ✓ edge cases (2 tests)

✓ tests/unit/governance/matrix.quadrant.test.ts (29 tests)
  ✓ assignQuadrant
    ✓ Quick Wins (6 tests)
    ✓ Big Bets (6 tests)
    ✓ Fillers (6 tests)
    ✓ Time Sinks (6 tests)
    ✓ boundary conditions (5 tests)

✓ tests/unit/validation/projectSchema.test.ts (28 tests)
  ✓ ProjectSchema
    ✓ valid projects (6 tests)
    ✓ invalid projects (18 tests)
    ✓ validation helpers (4 tests)

Test Files  3 passed (3)
     Tests  72 passed (72)
   Duration  <1s
```

### Exit Gate Checklist

- [ ] All 72 unit tests pass
- [ ] `normalizeScore(0) === 0` and `normalizeScore(10) === 100`
- [ ] `assignQuadrant(86, 32) === 'Quick Wins'` (matches PRJ-001)
- [ ] `assignQuadrant(91, 82) === 'Big Bets'` (matches PRJ-002)
- [ ] `assignQuadrant(39, 28) === 'Fillers'` (matches PRJ-003)
- [ ] `assignQuadrant(41, 87) === 'Time Sinks'` (matches PRJ-004)
- [ ] ProjectSchema accepts valid seeded project data
- [ ] ProjectSchema rejects invalid data (wrong departments, out-of-range scores)
- [ ] No TypeScript compilation errors
- [ ] Test execution time < 5 seconds

---

## Troubleshooting Guide

### Issue: Tests fail with "Cannot find module '@/lib/...'"

**Solution:** Check `tsconfig.json` has path alias configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Zod validation errors are unclear

**Solution:** Use `safeParse` and inspect errors:

```typescript
const result = ProjectSchema.safeParse(data);
if (!result.success) {
  console.log(JSON.stringify(result.error.issues, null, 2));
}
```

### Issue: Tests pass but coverage is low

**Solution:** Check coverage report:

```bash
npm run test:coverage
```

Target: 100% coverage for `src/lib/governance/matrix.ts` and `src/lib/validation/projectSchema.ts`.

### Issue: Normalization produces unexpected decimals

**Solution:** Verify `Math.round()` is used in `normalizeScore`. JavaScript floating point can cause issues without rounding.

---

## Handoff to Phase 2

### What Gets Passed to P2

1. **Complete type system** (`src/lib/types.ts`)
2. **Tested governance functions** (`src/lib/governance/matrix.ts`)
3. **Validation schema** (`src/lib/validation/projectSchema.ts`)
4. **72 passing unit tests** (proof of correctness)

### What P2 Will Build On

- P2 will create `loadProjects.ts` that uses `ProjectSchema` to validate files
- P2 will use `normalizeScore` and `assignQuadrant` to transform data
- P2 will produce `ProcessedProject[]` that includes the `matrix` field computed by P1 logic

### Critical Dependencies

P3 (Matrix UI) **cannot start** until P2 completes. P2 **cannot start** until P1 passes. This is why P1 correctness is non-negotiable.

---

## Success Criteria Summary

| Criterion | Requirement | How to Verify |
|-----------|-------------|---------------|
| Type Safety | All files compile | `npx tsc --noEmit` |
| Test Coverage | 100% for core logic | `npm run test:coverage` |
| Test Pass Rate | 100% (72/72 tests) | `npm run test:unit` |
| PRD Compliance | Quadrant logic matches PRD table | Manual review of `assignQuadrant` implementation |
| Boundary Correctness | 50 splits quadrants correctly | Tests explicitly check boundaries |
| Performance | Tests complete in < 5 seconds | Stopwatch during test run |

---

## Time Tracking

| Checkpoint | Target Time | Validation |
|------------|-------------|------------|
| Types created | 5 min | File exists and compiles |
| Normalization tests + impl | 15 min | Tests pass |
| Quadrant tests + impl | 30 min | Tests pass |
| Schema tests + impl | 45 min | Tests pass |
| Final validation | 50 min | All 72 tests green |

**If behind schedule at 40 minutes:**
- Skip some edge case tests (keep core boundary tests)
- Focus on PRD-matching tests (seeded projects)

**If ahead of schedule at 40 minutes:**
- Add more edge case tests
- Add JSDoc comments to all functions
- Run linter and fix warnings

---

## Agent Execution Checklist

Use this checklist to track progress through P1:

```markdown
## P1 Execution Progress

### Setup
- [ ] Verify P0 is complete (`npm run dev` works)
- [ ] Verify test harness works (`npm run test:unit` runs)

### File Creation (Sequential)
- [ ] Create `src/lib/types.ts`
- [ ] Create `tests/unit/governance/matrix.normalize.test.ts`
- [ ] Create `src/lib/governance/matrix.ts` (normalizeScore)
- [ ] Run tests - normalization tests pass
- [ ] Create `tests/unit/governance/matrix.quadrant.test.ts`
- [ ] Update `src/lib/governance/matrix.ts` (assignQuadrant)
- [ ] Run tests - quadrant tests pass
- [ ] Add transform helpers to `matrix.ts`
- [ ] Create `src/lib/validation/projectSchema.ts`
- [ ] Create `tests/unit/validation/projectSchema.test.ts`
- [ ] Run tests - all 72 tests pass

### Validation
- [ ] Run `npm run test:unit` - all green
- [ ] Run `npx tsc --noEmit` - no errors
- [ ] Verify seeded project quadrants match PRD
- [ ] Check test execution time < 5 seconds

### Exit Gate
- [ ] All tests pass (72/72)
- [ ] No TypeScript errors
- [ ] Ready to hand off to P2
```

---

## Notes for Agent

1. **Follow TDD strictly:** Write test first, see it fail, implement, see it pass.
2. **Don't skip boundary tests:** The 50/50 split is the most critical edge case.
3. **Use seeded project values:** PRJ-001 through PRJ-004 provide real-world test cases.
4. **Don't optimize prematurely:** Simple, readable code is better than clever code.
5. **If stuck, ask questions:** Better to clarify requirements than implement wrong logic.

---

## Quick Reference

### Seeded Project Data

| ID | Strategic Value | Complexity | Normalized Impact | Normalized Effort | Quadrant |
|----|----------------|------------|-------------------|-------------------|----------|
| PRJ-001 | 8.6 | 3.2 | 86 | 32 | Quick Wins |
| PRJ-002 | 9.1 | 8.2 | 91 | 82 | Big Bets |
| PRJ-003 | 3.9 | 2.8 | 39 | 28 | Fillers |
| PRJ-004 | 4.1 | 8.7 | 41 | 87 | Time Sinks |

### PRD Quadrant Rules

```
        Impact >= 50
            ^
            |
   Quick Wins | Big Bets
            |
Effort < 50 | Effort >= 50
            |
   Fillers   | Time Sinks
            |
        Impact < 50
```

---

**End of Phase 1 Execution Plan**

This document should be sufficient for an autonomous agent to complete Phase 1 without additional guidance. All requirements, examples, test cases, and validation criteria are explicitly defined.
