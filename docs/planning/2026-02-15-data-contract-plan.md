# Data Contract Plan

**Date:** 2026-02-15  
**Status:** Approved  
**Purpose:** Define exact data structures, validation rules, and transformation logic

---

## 1. Frontmatter Schema (Input Contract)

### Project Frontmatter (from `_content/projects/*.md`)

```yaml
---
id: "PRJ-001"
title: "Factory Predictive Maintenance Rollout"
slug: "factory-predictive-maintenance-rollout"
owner: "VP Manufacturing"
department: "Manufacturing"
phase: "Foundation"
status: "Active"
dates:
  planned_start: "2026-02-01"
  planned_end: "2026-07-15"
  actual_start: "2026-02-10"
scores:
  strategic_value: 8.6    # 0-10 scale (Y-axis source)
  complexity: 3.2         # 0-10 scale (X-axis source)
  confidence: 0.87       # 0-1 scale (risk indicator)
financials:
  estimated_cost: 620000
  projected_roi: 2100000
  currency: "USD"
tags: ["IoT", "Maintenance", "Uptime"]
related_projects: ["PRJ-002", "PRJ-004"]
---
```

### Zod Schema Validation Rules

```typescript
const ProjectSchema = z.object({
  id: z.string().regex(/^PRJ-\d{3}$/, "ID must be PRJ-XXX format"),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  owner: z.string().min(1),
  department: z.enum(["Manufacturing", "Supply Chain", "Sales", "After-Sales"]),
  phase: z.enum(["Foundation", "Acceleration", "Scale"]),
  status: z.enum(["Backlog", "Queued", "Active", "Paused", "Complete"]),
  dates: z.object({
    planned_start: z.string().datetime(),
    planned_end: z.string().datetime(),
    actual_start: z.string().datetime().optional(),
  }),
  scores: z.object({
    strategic_value: z.number().min(0).max(10),
    complexity: z.number().min(0).max(10),
    confidence: z.number().min(0).max(1),
  }),
  financials: z.object({
    estimated_cost: z.number().nonnegative(),
    projected_roi: z.number(),
    currency: z.string().length(3),
  }),
  tags: z.array(z.string()),
  related_projects: z.array(z.string()),
});
```

---

## 2. Transformation Rules

### Score Normalization (0-10 → 0-100)

```typescript
function normalizeScore(value: number): number {
  // Step 1: Clamp to valid range
  const clamped = Math.max(0, Math.min(10, value));
  // Step 2: Normalize to 0-100
  return Math.round(clamped * 10);
}
```

| Input | Clamped | Output |
| ----- | ------- | ------ |
| -5    | 0       | 0      |
| 0     | 0       | 0      |
| 5     | 5       | 50     |
| 8.6   | 8.6     | 86     |
| 10    | 10      | 100    |
| 15    | 10      | 100    |

### Quadrant Assignment Logic

```
┌────────────────────────────────────────────┐
│                  HIGH IMPACT (≥50)          │
│                                            │
│   QUICK WINS          BIG BETS             │
│   impact ≥ 50        impact ≥ 50           │
│   effort < 50        effort ≥ 50           │
│                                            │
├────────────────────────────────────────────┤
│                   LOW IMPACT (<50)          │
│                                            │
│   FILLERS            TIME SINKS            │
│   impact < 50        impact < 50           │
│   effort < 50        effort ≥ 50           │
│                                            │
└────────────────────────────────────────────┘
      LOW EFFORT      HIGH EFFORT
        (<50)           (≥50)
```

```typescript
type QuadrantLabel = 'Quick Wins' | 'Big Bets' | 'Fillers' | 'Time Sinks';

function assignQuadrant(impact: number, effort: number): QuadrantLabel {
  if (impact >= 50 && effort < 50) return 'Quick Wins';
  if (impact >= 50 && effort >= 50) return 'Big Bets';
  if (impact < 50 && effort < 50) return 'Fillers';
  return 'Time Sinks'; // impact < 50 && effort >= 50
}
```

### Boundary Conditions (Critical Test Cases)

| Impact | Effort | Expected Quadrant | Reason                  |
| ------ | ------ | ----------------- | ----------------------- |
| 50     | 49     | Quick Wins        | effort < 50             |
| 50     | 50     | Big Bets          | effort >= 50            |
| 49     | 50     | Time Sinks        | impact < 50             |
| 0      | 0      | Fillers           | both < 50               |
| 100    | 100    | Big Bets          | both >= 50              |
| 100    | 0      | Quick Wins        | high impact, low effort |

---

## 3. Output Contract (Processed Project)

```typescript
interface ProcessedProject {
  // Core identifiers
  id: string;
  title: string;
  slug: string;
  owner: string;
  
  // Taxonomy
  department: string;
  phase: string;
  status: ProjectStatus;
  
  // Dates
  dates: {
    planned_start: Date;
    planned_end: Date;
    actual_start?: Date;
  };
  
  // Original scores (preserved)
  scores: {
    strategic_value: number;
    complexity: number;
    confidence: number;
  };
  
  // Matrix data (computed)
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

type ProjectStatus = 'Backlog' | 'Queued' | 'Active' | 'Paused' | 'Complete';
```

---

## 4. Chart Data Contract

```typescript
interface MatrixDataPoint {
  id: string;
  x: number;              // effortNormalized (0-100)
  y: number;              // impactNormalized (0-100)
  quadrant: QuadrantLabel;
  title: string;
  department: string;
  phase: string;
  status: ProjectStatus;
  financials: {
    estimated_cost: number;
    projected_roi: number;
    currency: string;
  };
}
```

---

## 5. Config Contract (Tenant Configuration)

```typescript
interface TenantConfig {
  tenant_id: string;
  meta: {
    title: string;
    logo_url: string;
    favicon_url: string;
  };
  design_tokens: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
    typography: {
      heading_font: string;
      body_font: string;
    };
  };
  modules: {
    enable_matrix: boolean;
    enable_gantt: boolean;
    enable_blog: boolean;
  };
  governance: {
    fiscal_year_start: string;
    max_concurrent_projects: number;
    phases: string[];
  };
  taxonomies: {
    departments: string[];
    statuses: string[];
  };
}
```

---

## 6. Error Contract

```typescript
interface ValidationError {
  file: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ParseError {
  file: string;
  message: string;
}
```

---

## 7. Filter State Contract

```typescript
interface FilterState {
  departments: string[];
  phases: string[];
  statuses: string[];
}

// Empty array = no filter (show all)
const defaultFilters: FilterState = {
  departments: [],
  phases: [],
  statuses: [],
};
```

---

## Validation Behavior

| Scenario               | Dev Mode       | CI Mode        |
| ---------------------- | -------------- | -------------- |
| Invalid frontmatter    | Warning + skip | **FAIL BUILD** |
| Missing required field | Warning + skip | **FAIL BUILD** |
| Out-of-range score     | Clamp + warn   | Warn           |
| Invalid date format    | Error + skip   | **FAIL BUILD** |

---

## Notes

- All numeric fields use native JavaScript numbers (no BigInt)
- Dates stored as ISO 8601 strings in frontmatter, Date objects in runtime
- Quadrant boundaries use >= and < for clean separation
- ROI displayed as formatted currency in tooltips
