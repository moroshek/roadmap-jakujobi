# API and Component Documentation

Reference for key component APIs, library functions, and data schemas.

---

## Key Component APIs

### Matrix Components

#### MatrixChart

Renders the Strategy Matrix scatter plot (Impact vs Effort).

| Prop | Type | Description |
|------|------|-------------|
| `projects` | `ProcessedProject[]` | Projects to display on the chart |
| `className` | `string?` | Optional CSS classes |

- **X-Axis:** Effort (complexity), 0-100
- **Y-Axis:** Impact (strategic value), 0-100
- Points are color-coded by quadrant. Uses Recharts `ScatterChart`.

#### MatrixTooltip

Custom tooltip for chart points.

| Prop | Type | Description |
|------|------|-------------|
| `active` | `boolean` | Whether tooltip is visible |
| `payload` | `Array<{ payload: object }>` | Recharts payload (includes project, quadrant, ROI) |

Shows project title, quadrant label, and projected ROI.

#### MatrixFilters

Filter panel for Department, Phase, Status.

| Prop | Type | Description |
|------|------|-------------|
| `filters` | `MatrixFilters` | Current filter state |
| `onChange` | `(filters: MatrixFilters) => void` | Called when filters change |
| `availableDepartments` | `string[]` | Options for department dropdown |
| `availablePhases` | `string[]` | Options for phase dropdown |

Filter state is typically synced with URL query params (`dept`, `phase`, `status`).

#### ProjectModal

Full-detail modal shown when a project point is clicked.

| Prop | Type | Description |
|------|------|-------------|
| `project` | `ProcessedProject \| null` | Project to display; `null` closes modal |
| `onClose` | `() => void` | Called when modal is closed |

---

### Dashboard Components

#### MetricCard

Displays a single metric with label and optional subtitle.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Metric name |
| `value` | `string \| number` | Main value |
| `subtitle` | `string?` | Optional secondary text |

#### PhaseDistribution

Bar chart showing project count per phase.

| Prop | Type | Description |
|------|------|-------------|
| `phases` | `Array<{ name: string; count: number; color: string }>` | Phase data and colors |

#### StatusBreakdown

Grid showing counts per status (Active, Queued, Backlog, Paused, Complete).

| Prop | Type | Description |
|------|------|-------------|
| `statuses` | `{ active, queued, backlog, paused, complete }` | Count per status |

#### ActivityFeed

Shows recent project activity (e.g., last 5 projects by date).

| Prop | Type | Description |
|------|------|-------------|
| `projects` | `ProcessedProject[]` | Projects to derive activity from |

---

### Project Library Components

#### ProjectSearchBar

Fuzzy search input for projects.

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Current search query |
| `onChange` | `(value: string) => void` | Called on input change |
| `placeholder` | `string?` | Placeholder text |

#### ProjectFilters

Multi-select filters for status, department, phase.

| Prop | Type | Description |
|------|------|-------------|
| `projects` | `ProcessedProject[]` | Source data for filter options |
| `filters` | `FilterState` | Current filter state |
| `onChange` | `(f: FilterState) => void` | Called when filters change |

#### ProjectCard

Card display for a single project.

| Prop | Type | Description |
|------|------|-------------|
| `project` | `ProcessedProject` | Project to render |

---

### Roadmap Components

#### GanttChart

Timeline visualization with horizontal bars.

| Prop | Type | Description |
|------|------|-------------|
| `projects` | `ProcessedProject[]` | Projects to display |
| `groupBy` | `"department" \| "status" \| "phase"` | Row grouping |
| `width` | `number` | Chart width in pixels |

#### GanttBar

Single project bar on the timeline.

| Prop | Type | Description |
|------|------|-------------|
| `project` | `ProcessedProject` | Project data |
| `startPx` | `number` | Start position in pixels |
| `widthPx` | `number` | Bar width in pixels |
| `color` | `string` | Bar color (by status) |

---

### Layout Components

#### AppHeader

Global header with navigation and optional search.

Contains links to Dashboard, Matrix, Roadmap, Projects.

#### GlobalSearch

Global search dropdown (cmd+k trigger).

| Prop | Type | Description |
|------|------|-------------|
| `projects` | `ProcessedProject[]` | Projects to search |

---

## Library Functions Reference

### Governance (`src/lib/governance/matrix.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `normalizeScore` | `(value: number) => number` | Maps raw 0-10 score to 0-100. Clamps out-of-range. |
| `assignQuadrant` | `(impact: number, effort: number) => QuadrantLabel` | Returns quadrant from normalized impact/effort. See PRD quadrant rules. |
| `transformToMatrixPoint` | `(project: ProcessedProject) => MatrixDataPoint` | Converts project to chart data point |
| `transformToMatrixData` | `(projects: ProcessedProject[]) => MatrixDataPoint[]` | Batch transform |

### Content Loaders (`src/lib/content/`)

| Function | Module | Description |
|----------|--------|-------------|
| `getContentPath` | loadProjects | Returns absolute path to `_content` |
| `getProjectsPath` | loadProjects | Returns path to `_content/projects` |
| `readAllProjectFiles` | loadProjects | Reads all `.md` files; returns `{ filename, frontmatter, content }[]` |
| `readProjectFile` | loadProjects | Reads single project by ID |
| `getProjectCount` | loadProjects | Returns count of project files |
| `loadConfig` | loadConfig | Loads `_content/config.json` |
| `getAllowedDepartments` | loadConfig | Returns department list from config |
| `getAllowedPhases` | loadConfig | Returns phase list from config |
| `isModuleEnabled` | loadConfig | Checks if matrix/gantt/blog is enabled |

### Transformation (`src/lib/content/transformProjects.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `transformProject` | `(rawFrontmatter, filename) => ValidationResult` | Validates and transforms single project |
| `transformAllProjects` | `(rawProjects, options?) => { projects, errors, stats }` | Batch transform with optional skipInvalid |
| `loadAndTransformProjects` | `(options?) => { projects, errors, stats }` | Load files and transform in one call |

### Validation (`src/lib/validation/projectSchema.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `validateProject` | `(data: unknown) => ValidatedProjectFrontmatter` | Throws on invalid data |
| `safeValidateProject` | `(data: unknown) => SafeParseResult` | Returns result without throwing |

### Filters (`src/lib/filters/applyMatrixFilters.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `applyMatrixFilters` | `(projects, filters) => ProcessedProject[]` | Filters projects by department, phase, status. OR within category, AND across. |
| `countActiveFilters` | `(filters) => number` | Total active filter count |
| `parseFiltersFromURL` | `(searchParams) => MatrixFilters` | Parses `dept`, `phase`, `status` from URL |
| `serializeFiltersToURL` | `(filters) => string` | Serializes to query string |

### Search (`src/lib/projects/searchProjects.ts`)

| Function | Signature | Description |
|----------|-----------|-------------|
| `searchProjects` | `(projects, query) => ProcessedProject[]` | Fuse.js fuzzy search. Min 2 chars. Keys: title (1.0), id (0.8), tags (0.6), owner (0.4), department (0.3). Threshold 0.3. |

### Gantt (`src/lib/gantt/`)

| Function | Module | Description |
|----------|--------|-------------|
| `groupProjects` | groupProjects | Groups projects by department, status, or phase |
| `calculateTimelineScale` | calculateTimelineScale | Computes pixel scale for date range |

---

## Data Schema Reference

### ProcessedProject

Core type for projects after transformation.

```typescript
interface ProcessedProject {
  id: string;           // e.g., "PRJ-001"
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
    strategic_value: number;  // 0-10
    complexity: number;      // 0-10
    confidence: number;      // 0-1
  };
  matrix: {
    impactNormalized: number;  // 0-100
    effortNormalized: number;  // 0-100
    quadrant: QuadrantLabel;
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

### ProjectStatus

```typescript
type ProjectStatus = "Backlog" | "Queued" | "Active" | "Paused" | "Complete";
```

### QuadrantLabel

```typescript
type QuadrantLabel = "Quick Wins" | "Big Bets" | "Fillers" | "Time Sinks";
```

### MatrixDataPoint

Chart-ready representation.

```typescript
interface MatrixDataPoint {
  id: string;
  title: string;
  x: number;        // effort 0-100
  y: number;        // impact 0-100
  quadrant: QuadrantLabel;
  department: string;
  phase: string;
  status: ProjectStatus;
  financials: { estimated_cost: number; projected_roi: number; currency: string };
}
```

### TenantConfig (config.json)

```typescript
interface TenantConfig {
  tenant_id: string;
  meta: { title: string; logo_url?: string; favicon_url?: string };
  design_tokens?: { colors?: {...}; typography?: {...} };
  modules?: { enable_matrix?: boolean; enable_gantt?: boolean; enable_blog?: boolean };
  governance?: {
    fiscal_year_start?: string;
    max_concurrent_projects?: number;
    phases?: string[];
    departments?: string[];
  };
  taxonomies?: { departments?: string[]; statuses?: string[] };
}
```

### Raw Project Frontmatter (Markdown)

Required fields in each `_content/projects/*.md`:

- `id`, `title`, `slug`, `owner`, `department`, `phase`, `status`
- `dates.planned_start`, `dates.planned_end` (YYYY-MM-DD)
- `scores.strategic_value`, `scores.complexity` (0-10), `scores.confidence` (0-1)
- `financials.estimated_cost`, `financials.projected_roi`, `financials.currency`
- `tags` (string[]), `related_projects` (string[])

See `ProjectSchema` in `src/lib/validation/projectSchema.ts` for full validation rules.
