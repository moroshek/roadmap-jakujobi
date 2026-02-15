# Architecture Plan

**Date:** 2026-02-15  
**Status:** Approved  
**Pattern:** Hybrid (runtime read + prebuild-ready structure)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Content Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ _content/   │  │ _content/   │  │ _content/               │  │
│  │ config.json │  │ projects/   │  │ interviews/            │  │
│  │ (tenant)    │  │ *.md        │  │ (future)               │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Build Pipeline (Lib)                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ content/         │  │ governance/      │  │ validation/  │  │
│  │ loadProjects.ts  │  │ matrix.ts        │  │ schema.ts    │  │
│  │ loadConfig.ts    │  │ status.ts        │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                  │
│  Output: ProcessedProject[] with normalized scores + quadrants │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Presentation Layer                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ app/             │  │ components/      │  │ lib/         │  │
│  │ layout.tsx      │  │ StrategyMatrix   │  │ types.ts     │  │
│  │ page.tsx        │  │ FilterSidebar    │  │ context.ts   │  │
│  │ matrix/         │  │ Tooltip          │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with sidebar + topbar
│   ├── page.tsx                # Dashboard (bonus: metric cards)
│   ├── matrix/
│   │   ├── page.tsx            # /matrix route
│   │   └── StrategyMatrix.tsx  # Scatter plot component
│   └── globals.css             # Tailwind + custom styles
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── Tooltip.tsx
│   └── matrix/
│       ├── ScatterChart.tsx    # Recharts wrapper
│       ├── QuadrantBackground.tsx
│       └── MatrixTooltip.tsx
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── context/
│   │   └── RoadmapContext.tsx  # Global state provider
│   ├── content/
│   │   ├── loadProjects.ts     # Parse markdown files
│   │   └── loadConfig.ts      # Load tenant config
│   ├── governance/
│   │   ├── matrix.ts           # Normalize + quadrant logic
│   │   └── status.ts          # Temporal status logic
│   └── validation/
│       └── projectSchema.ts    # Zod schemas
└── scripts/                    # Future: prebuild scripts
```

---

## Data Contracts

### Input: Raw Project Frontmatter
```typescript
interface RawProjectFrontmatter {
  id: string;
  title: string;
  slug: string;
  owner: string;
  department: string;
  phase: string;
  status: 'Backlog' | 'Queued' | 'Active' | 'Paused' | 'Complete';
  dates: {
    planned_start: string;
    planned_end: string;
    actual_start?: string;
  };
  scores: {
    strategic_value: number;  // 0-10
    complexity: number;        // 0-10
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
```

### Output: Processed Project
```typescript
interface ProcessedProject {
  id: string;
  title: string;
  slug: string;
  owner: string;
  department: string;
  phase: string;
  status: ProjectStatus;
  dates: {
    planned_start: Date;
    planned_end: Date;
    actual_start?: Date;
  };
  scores: {
    strategic_value: number;     // 0-10 (raw)
    complexity: number;          // 0-10 (raw)
    confidence: number;          // 0-1 (raw)
  };
  matrix: {
    impactNormalized: number;    // 0-100
    effortNormalized: number;    // 0-100
    quadrant: QuadrantLabel;     // 'Quick Wins' | 'Big Bets' | 'Fillers' | 'Time Sinks'
  };
  financials: {
    estimated_cost: number;
    projected_roi: number;
    currency: string;
  };
  tags: string[];
  related_projects: string[];
}

type QuadrantLabel = 'Quick Wins' | 'Big Bets' | 'Fillers' | 'Time Sinks';
```

---

## Key Module Responsibilities

### `src/lib/content/loadProjects.ts`
- Read all `.md` files from `_content/projects/`
- Parse frontmatter with gray-matter
- Return array of raw project objects

### `src/lib/validation/projectSchema.ts`
- Zod schema for frontmatter validation
- Strict type checking
- Error messages for invalid fields

### `src/lib/governance/matrix.ts`
- `normalizeScore(value: number): number` - clamp 0-10, multiply by 10
- `assignQuadrant(impact: number, effort: number): QuadrantLabel`
- `transformToMatrixData(projects: ProcessedProject[]): MatrixDataPoint[]`

### `src/app/matrix/StrategyMatrix.tsx`
- Recharts ScatterChart wrapper
- Custom tooltip rendering
- Quadrant background zones

### `src/app/matrix/page.tsx`
- Server component that loads data
- Passes data to client StrategyMatrix
- Handles filter state

---

## Error Handling Strategy

| Layer      | Error           | Behavior                                                       |
| ---------- | --------------- | -------------------------------------------------------------- |
| Parser     | File read error | Log warning, skip file (CI fails)                              |
| Validation | Schema error    | Log error with file name, skip invalid (warn locally, fail CI) |
| Transform  | NaN/Infinity    | Clamp to 0 or 100                                              |
| Render     | No data         | Show empty state                                               |

---

## Future Prebuild Migration Path

Architecture supports future prebuild:
1. `src/scripts/build-data.ts` can be added later
2. Outputs `public/master_data.json`
3. Change `loadProjects.ts` to fetch JSON in production
4. Current implementation remains functional for dev mode

---

## Testing Architecture

```
tests/
├── unit/
│   ├── governance/
│   │   ├── matrix.normalize.test.ts
│   │   ├── matrix.quadrant.test.ts
│   │   └── status.update.test.ts
│   └── validation/
│       ├── schema.valid.test.ts
│       └── schema.invalid.test.ts
├── integration/
│   └── matrix/
│       └── matrix.render.test.tsx
└── fixtures/
    └── projects/
        ├── valid-project.md
        └── invalid-project.md
```

---

## Notes

- All transformation logic lives in `src/lib/governance/` (not UI)
- UI components are thin wrappers around Recharts
- Context provides read-only access to processed data
- TypeScript moderate strictness: `strict: true` but relaxed on some any-casts
