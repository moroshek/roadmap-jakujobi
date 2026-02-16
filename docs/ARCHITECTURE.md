# Architecture

Data pipeline, component hierarchy, and build/runtime separation.

---

## Data Pipeline Flowchart

```
_content/projects/*.md          _content/config.json
        |                                |
        v                                v
+-------------------+           +-------------------+
|  readAllProjectFiles()        |  loadConfig()      |
|  (loadProjects.ts)           |  (loadConfig.ts)   |
+-------------------+           +-------------------+
        |                                |
        v                                |
+-------------------+                    |
|  gray-matter parse|                    |
|  (frontmatter +   |                    |
|   content)        |                    |
+-------------------+                    |
        |                                |
        v                                |
+-------------------+                    |
|  ProjectSchema    |                    |
|  (Zod validation) |                    |
|  projectSchema.ts |                    |
+-------------------+                    |
        |                                |
        v                                |
+-------------------+                    |
|  transformProject |                    |
|  - normalizeScore |                    |
|  - assignQuadrant |                    |
|  transformProjects.ts                  |
+-------------------+                    |
        |                                |
        v                                |
+-------------------+                    |
|  ProcessedProject[]                    |
|  (matrix-ready data)                   |
+-------------------+                    |
        |                                |
        +----------+---------------------+
        |          |
        v          v
+-------------+  +-------------------+
| MatrixChart |  | Dashboard, Gantt,  |
| Roadmap,    |  | Project Library    |
| Projects   |  | (all consume same  |
+-------------+  |  ProcessedProject) |
                 +-------------------+
```

---

## Pipeline Stages

| Stage | Module | Input | Output |
|-------|--------|-------|--------|
| 1. Read | loadProjects | File system | `{ filename, frontmatter, content }[]` |
| 2. Parse | gray-matter | Raw markdown | Structured frontmatter (unvalidated) |
| 3. Validate | projectSchema | Unknown | RawProjectFrontmatter (or error) |
| 4. Transform | transformProjects | Raw frontmatter | ProcessedProject |
| 5. Enrich | governance/matrix | Raw scores | impactNormalized, effortNormalized, quadrant |
| 6. Consume | React components | ProcessedProject[] | Rendered UI |

---

## Component Hierarchy

```
RootLayout (layout.tsx)
  |
  +-- AppHeader
  |     +-- nav links (Dashboard, Matrix, Roadmap, Projects)
  |     +-- GlobalSearch (optional)
  |
  +-- {children} (page content)

Pages:
  / (Dashboard)
    +-- MetricCard x4
    +-- PhaseDistribution
    +-- StatusBreakdown
    +-- ActivityFeed

  /matrix
    +-- MatrixPageWithFilters (client)
          +-- MatrixFilters (Department, Phase, Status)
          +-- MatrixPageClient
                +-- MatrixContext (selectedProject, hoveredProjectId)
                +-- QuadrantOverlay
                +-- MatrixChart
                |     +-- Recharts ScatterChart
                |     +-- MatrixTooltip
                +-- ProjectModal

  /roadmap
    +-- RoadmapClient
          +-- GroupingSelector
          +-- GanttChart
          |     +-- TimelineAxis
          |     +-- TodayMarker
          |     +-- GanttBar (per project)

  /projects
    +-- ProjectLibraryClient
          +-- ProjectSearchBar
          +-- ProjectFilters
          +-- ViewToggle (card/table)
          +-- SortSelector
          +-- ProjectCard (or table rows)

  /projects/[id]
    +-- ProjectHero
    +-- ProjectTabs (Overview, Plan, Updates)
    +-- ProjectSidebar
```

---

## Build vs Runtime Separation

### Build Time (Static Generation)

- **When:** During `npm run build` (or Next.js static export)
- **What runs:**
  - `loadConfig()` - reads `_content/config.json`
  - `readAllProjectFiles()` - reads all markdown from `_content/projects/`
  - `transformAllProjects()` / `loadAndTransformProjects()` - validates and transforms
  - Next.js generates static HTML for each page
- **Output:** `out/` directory with static HTML, JS, CSS
- **No server** required at runtime for content

### Runtime (Client)

- **When:** User loads page in browser
- **What runs:**
  - React hydration
  - Client-side filtering (`applyMatrixFilters`)
  - Client-side search (`searchProjects` via Fuse.js)
  - URL param parsing for matrix filters
  - Recharts rendering, modal state, hover/click handlers
- **Data:** All project data is embedded in the page at build time (no runtime API calls for content)

### Key Insight

- Content is **read-only** at runtime.
- To update projects, edit markdown in `_content/projects/` and rebuild.
- No database; the "database" is the build artifact.

---

## Directory Structure

```
roadmap-jakujobi/
  src/
    app/              # Next.js App Router
      layout.tsx
      page.tsx        # Dashboard
      matrix/
      roadmap/
      projects/
      projects/[id]/
    components/
      matrix/
      dashboard/
      projects/
      roadmap/
      layout/
    lib/
      content/        # Loaders & transformers
      governance/     # Matrix logic
      validation/     # Zod schemas
      filters/        # Filter logic
      projects/       # Search, sort, filter
      gantt/          # Timeline calculations
      hooks/
    contexts/
  _content/           # Tenant content (changes per client)
    config.json
    projects/
    interviews/
    assets/
  tests/
    unit/
    integration/
  docs/
```

---

## Contexts

| Context | Purpose |
|---------|---------|
| MatrixContext | Holds `selectedProject` and `hoveredProjectId` for Matrix chart interactions. Used by MatrixChart, MatrixTooltip, ProjectModal. |

---

## Dependencies

| Package | Role |
|---------|------|
| Next.js 14 | App Router, static export |
| React 18 | UI |
| Recharts | Scatter chart (Matrix) |
| Fuse.js | Fuzzy search |
| gray-matter | Frontmatter parsing |
| Zod | Schema validation |
| Tailwind CSS | Styling |
