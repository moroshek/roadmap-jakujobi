# Phase 5 Execution Plan: Extended Features & Production Hardening

**Date:** 2026-02-15  
**Status:** Ready for Implementation  
**Phase Window:** 160-240 minutes (80-minute extended timebox)  
**Prerequisites:** Phase 4 complete (140 tests passing, dashboard + filters + responsive done)

---

## Executive Summary

Phase 5 represents a strategic pivot from "portfolio presentation" to "production-ready application." While Phases 1-4 delivered the core Strategy Matrix and Executive Dashboard, Phase 5 implements the remaining PRD-specified features to create a complete enterprise roadmap engine.

**Three Major Feature Tracks:**

1. **Track A: Roadmap Gantt View** - Timeline visualization with dependencies (30 min)
2. **Track B: Project Library & Detail Pages** - Searchable catalog with deep-dive views (25 min)
3. **Track C: Activity Feed & Search** - Updates stream and global fuzzy search (15 min)
4. **Track D: Production Hardening** - Performance, SEO, error boundaries, final QA (10 min)

**Exit Criteria:** At least 2 of 3 feature tracks complete (A or B required), all quality gates passed, production-ready build.

---

## Table of Contents

1. [Context & Prerequisites](#context--prerequisites)
2. [Design Philosophy](#design-philosophy)
3. [Track A: Roadmap Gantt View](#track-a-roadmap-gantt-view)
4. [Track B: Project Library & Detail Pages](#track-b-project-library--detail-pages)
5. [Track C: Activity Feed & Search](#track-c-activity-feed--search)
6. [Track D: Production Hardening](#track-d-production-hardening)
7. [Implementation Sequence](#implementation-sequence)
8. [Testing Strategy](#testing-strategy)
9. [Performance Optimization](#performance-optimization)
10. [Validation Checklist](#validation-checklist)
11. [Risk Mitigation](#risk-mitigation)
12. [Submission Package](#submission-package)

---

## Context & Prerequisites

### What's Already Done (Phases 1-4)

✅ **Phase 1 - Core Logic (50 tests)**
- Normalization engine (`normalizeScore`)
- Quadrant assignment (`assignQuadrant`)
- Schema validation (Zod)

✅ **Phase 2 - Data Pipeline (27 tests)**
- Markdown file loader
- Gray-matter parsing
- Transformation pipeline

✅ **Phase 3 - Strategy Matrix (31 tests)**
- Interactive scatter plot with Recharts
- Quadrant overlay visualization
- Hover tooltips with project data
- Click-to-expand modal
- MatrixContext for state management

✅ **Phase 4 - Dashboard & Polish (32 tests)**
- Executive dashboard with 4 metric cards
- Phase distribution chart
- Status breakdown grid
- Department/Phase/Status filters for matrix
- URL-driven filter state
- Responsive layouts (mobile/tablet/desktop)
- WCAG 2.1 AA accessibility

**Current Status:**
- **140 tests passing** (100% pass rate)
- **~90% test coverage**
- **Build succeeds** with static export
- **Zero TypeScript errors**
- **Three routes live:** `/` (dashboard), `/matrix` (scatter plot), `/api/*` (none needed yet)

### What's Missing (Phase 5 Scope)

❌ **Gantt Timeline View** - No `/roadmap` route for temporal visualization  
❌ **Project Library** - No `/projects` route for browsable catalog  
❌ **Project Detail Pages** - No `/projects/[id]` dynamic routes  
❌ **Activity Feed** - No updates stream or progress tracking  
❌ **Global Search** - No fuzzy search across all projects  
❌ **Advanced Filters** - No ROI range sliders or multi-select combos  
❌ **Export Functionality** - No CSV/PDF export of portfolio data  
❌ **Print Optimization** - No print stylesheets for reports  

### PRD Feature Gap Analysis

| PRD Feature | Status | Phase 5 Priority |
|-------------|--------|------------------|
| Dashboard (4.2) | ✅ Complete | N/A |
| Strategy Matrix (4.3) | ✅ Complete | N/A |
| Roadmap Gantt (4.4) | ❌ Missing | **P1 - Track A** |
| Project Library (4.5) | ❌ Missing | **P1 - Track B** |
| Project Detail (4.6) | ❌ Missing | **P1 - Track B** |
| Search (7.1) | ❌ Missing | **P2 - Track C** |
| Filtering (7.2) | 🟡 Partial (matrix only) | **P2 - Track C** |
| Automated Status Updates (5.1) | ❌ Missing | **P3 - Future** |
| Capacity Queue Logic (5.2) | ❌ Missing | **P3 - Future** |
| Print Optimization (4.7) | ❌ Missing | **P3 - Track D** |
| Export Features | ❌ Missing | **P3 - Future** |

---

## Design Philosophy

### Architecture Principles

**Consistency First:** Extend patterns from Phases 1-4 rather than introducing new paradigms.

| Decision Area | Choice | Rationale |
|---------------|--------|-----------|
| **Routing** | Next.js App Router (dynamic routes) | Already configured, supports SSG |
| **Data Flow** | Reuse `loadAndTransformProjects()` | Single source of truth |
| **Components** | Server-first with client islands | Optimize for static export |
| **State** | URL params + React Context | Proven pattern from Phase 4 |
| **Styling** | Tailwind + design tokens | Consistent with existing |
| **Charts** | Add Gantt library (e.g., `react-gantt-chart`) | Declarative, React-native |
| **Search** | Fuse.js (client-side fuzzy search) | Per PRD 7.1, lightweight |
| **Testing** | Continue TDD pattern | Maintain >85% coverage |

### Time Allocation Strategy

**Total:** 80 minutes (extended from original 20-minute P5)  
**Critical Path:** Gantt OR Library (must deliver at least one major feature)  

**Priority Tiers:**

- **Tier 1 (Must-Have):** One complete feature track (A or B) + hardening
- **Tier 2 (Should-Have):** Two complete feature tracks + search
- **Tier 3 (Nice-to-Have):** All three tracks + polish

**Timebox Breakdown:**

| Track | Timebox | Fallback |
|-------|---------|----------|
| **Track A: Gantt** | 30 min | Drop dependencies, basic timeline only |
| **Track B: Library + Detail** | 25 min | Drop detail pages, library only |
| **Track C: Search + Feed** | 15 min | Drop feed, search only |
| **Track D: Hardening** | 10 min | Core QA only, skip performance |

**Decision Gates:**

- **Minute 190:** If Track A incomplete, pivot to Track B
- **Minute 215:** If neither A nor B complete, freeze features and harden
- **Minute 230:** Begin submission prep regardless of feature status

---

## Track A: Roadmap Gantt View

### A1: Overview

**Goal:** Implement `/roadmap` route with horizontal timeline visualization of project schedules

**User Story:**
> As a portfolio manager, I want to see all projects on a timeline so I can identify resource conflicts and critical path dependencies.

**Key Requirements (PRD 4.4):**
1. Horizontal scrolling timeline (viewport width constrained)
2. Projects as bars spanning start_date → end_date
3. Current date indicator (vertical "today" line)
4. Status-based color coding (Active=Green, Queued=Blue, Backlog=Gray)
5. Grouping controls (by Department or Status)
6. Milestone indicators (diamond icons on bars)

**Visual Mock:**
```
Jan 2026 │ Feb 2026 │ Mar 2026 │ Apr 2026
─────────┼──────────┼──────────┼──────────
PRJ-001  │███████████░░░░░░░░░│          │  (Foundation)
PRJ-002  │          │██████████████░░░░░│  (Acceleration)
         │     ◆    │    ◆     │   ◆    │  (Milestones)
         │          ▼ Today    │          │
```

### A2: Component Architecture

```
src/app/roadmap/
├── page.tsx                     (server component, loads data)
└── RoadmapClient.tsx           (client wrapper with state)

src/components/roadmap/
├── GanttChart.tsx              (main timeline component)
├── GanttBar.tsx                (individual project bar)
├── TimelineAxis.tsx            (date header with months/weeks)
├── TodayMarker.tsx             (vertical "now" indicator)
├── GroupingSelector.tsx        (dropdown: by Dept/Status/Phase)
└── MilestoneIcon.tsx           (diamond overlay on bars)

src/lib/gantt/
├── calculateTimelineScale.ts   (date → pixel mapping)
├── groupProjects.ts            (organize by selected dimension)
└── extractMilestones.ts        (parse deliverables from markdown)
```

**Total New Files:** 11 (6 components + 1 page + 1 client wrapper + 3 utilities)

### A3: Data Model Enhancements

**Extend ProcessedProject type:**

```typescript
// In src/lib/types.ts (add to existing interface)
interface ProcessedProject {
  // ...existing fields...
  
  // New timeline fields
  start_date: Date;
  end_date: Date;
  milestones?: Array<{
    date: Date;
    title: string;
    type: 'deliverable' | 'review' | 'launch';
  }>;
  dependencies?: string[]; // Array of project IDs
}
```

**Validation Enhancement:**

```typescript
// In src/lib/validation/projectSchema.ts (extend existing schema)
timeline: z.object({
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  milestones: z.array(z.object({
    date: z.string().datetime(),
    title: z.string(),
    type: z.enum(['deliverable', 'review', 'launch'])
  })).optional(),
  dependencies: z.array(z.string()).optional()
}).optional()
```

### A4: Implementation Details

#### Step A.1: Timeline Scale Calculator (5 min)

**File:** `src/lib/gantt/calculateTimelineScale.ts`

**Purpose:** Convert dates to pixel positions for SVG rendering

```typescript
/**
 * Calculate timeline scale for Gantt chart rendering
 */
export interface TimelineScale {
  startDate: Date;
  endDate: Date;
  dayWidth: number; // pixels per day
  totalWidth: number; // total SVG width
}

export interface ProjectPosition {
  x: number; // start position
  width: number; // bar width
  y: number; // row position
}

export function calculateTimelineScale(
  projects: ProcessedProject[],
  pixelsPerDay: number = 4
): TimelineScale {
  // Find earliest start and latest end across all projects
  const dates = projects.flatMap(p => [
    new Date(p.start_date),
    new Date(p.end_date)
  ]);
  
  const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Add padding (2 weeks before/after)
  startDate.setDate(startDate.getDate() - 14);
  endDate.setDate(endDate.getDate() + 14);
  
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return {
    startDate,
    endDate,
    dayWidth: pixelsPerDay,
    totalWidth: totalDays * pixelsPerDay
  };
}

export function calculateProjectPosition(
  project: ProcessedProject,
  scale: TimelineScale,
  rowIndex: number,
  rowHeight: number = 40
): ProjectPosition {
  const startTime = new Date(project.start_date).getTime();
  const endTime = new Date(project.end_date).getTime();
  const scaleStartTime = scale.startDate.getTime();
  
  const daysFromStart = (startTime - scaleStartTime) / (1000 * 60 * 60 * 24);
  const durationDays = (endTime - startTime) / (1000 * 60 * 60 * 24);
  
  return {
    x: daysFromStart * scale.dayWidth,
    width: durationDays * scale.dayWidth,
    y: rowIndex * rowHeight
  };
}

export function calculateTodayPosition(scale: TimelineScale): number {
  const now = new Date().getTime();
  const scaleStartTime = scale.startDate.getTime();
  const daysFromStart = (now - scaleStartTime) / (1000 * 60 * 60 * 24);
  return daysFromStart * scale.dayWidth;
}
```

**Tests:** `tests/unit/gantt/calculateTimelineScale.test.ts` (5 tests)
- Calculates correct date range with padding
- Maps dates to pixel positions
- Handles projects spanning multiple months
- Calculates today marker position
- Handles edge case: all projects on same day

---

#### Step A.2: Project Grouping Logic (3 min)

**File:** `src/lib/gantt/groupProjects.ts`

**Purpose:** Organize projects by department, status, or phase for row layout

```typescript
export type GroupingDimension = 'department' | 'status' | 'phase' | 'none';

export interface ProjectGroup {
  label: string;
  projects: ProcessedProject[];
  color?: string; // Optional group header color
}

export function groupProjects(
  projects: ProcessedProject[],
  dimension: GroupingDimension
): ProjectGroup[] {
  if (dimension === 'none') {
    return [{ label: 'All Projects', projects }];
  }
  
  const grouped = projects.reduce((acc, project) => {
    const key = project[dimension] as string;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(project);
    return acc;
  }, {} as Record<string, ProcessedProject[]>);
  
  return Object.entries(grouped)
    .map(([label, projects]) => ({
      label,
      projects,
      color: getGroupColor(dimension, label)
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function getGroupColor(dimension: GroupingDimension, label: string): string {
  // Status colors
  const statusColors: Record<string, string> = {
    'Active': '#10B981',
    'Queued': '#3B82F6',
    'Backlog': '#6B7280',
    'Paused': '#F59E0B',
    'Complete': '#8B5CF6'
  };
  
  if (dimension === 'status') {
    return statusColors[label] ?? '#6B7280';
  }
  
  // Default: use project phase colors
  return '#6B7280';
}
```

**Tests:** `tests/unit/gantt/groupProjects.test.ts` (4 tests)
- Groups by department correctly
- Groups by status with color coding
- Handles 'none' grouping (flat list)
- Sorts groups alphabetically

---

#### Step A.3: Gantt Chart Component (12 min)

**File:** `src/components/roadmap/GanttChart.tsx`

**Purpose:** Main SVG-based timeline visualization

```typescript
'use client';

import { ProcessedProject } from '@/lib/types';
import { calculateTimelineScale, calculateProjectPosition, calculateTodayPosition } from '@/lib/gantt/calculateTimelineScale';
import { groupProjects, GroupingDimension, ProjectGroup } from '@/lib/gantt/groupProjects';
import { GanttBar } from './GanttBar';
import { TimelineAxis } from './TimelineAxis';
import { TodayMarker } from './TodayMarker';

interface GanttChartProps {
  projects: ProcessedProject[];
  groupBy: GroupingDimension;
  className?: string;
}

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 60;
const GROUP_HEADER_HEIGHT = 30;

export function GanttChart({ projects, groupBy, className = '' }: GanttChartProps) {
  if (projects.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg ${className}`}>
        <p className="text-gray-500">No projects with timeline data available</p>
      </div>
    );
  }
  
  const scale = calculateTimelineScale(projects, 3); // 3px per day
  const groups = groupProjects(projects, groupBy);
  const todayX = calculateTodayPosition(scale);
  
  // Calculate total height
  let currentY = HEADER_HEIGHT;
  const groupedPositions: Array<{
    group: ProjectGroup;
    startY: number;
    projects: Array<{ project: ProcessedProject; y: number }>;
  }> = [];
  
  groups.forEach(group => {
    const groupStartY = currentY;
    if (groupBy !== 'none') {
      currentY += GROUP_HEADER_HEIGHT; // Space for group header
    }
    
    const projectPositions = group.projects.map((project, idx) => {
      const y = currentY + (idx * ROW_HEIGHT);
      return { project, y };
    });
    
    currentY += group.projects.length * ROW_HEIGHT;
    
    groupedPositions.push({
      group,
      startY: groupStartY,
      projects: projectPositions
    });
  });
  
  const totalHeight = currentY + 20; // Add bottom padding
  
  return (
    <div className={`overflow-x-auto overflow-y-auto ${className}`}>
      <svg 
        width={scale.totalWidth} 
        height={totalHeight}
        className="border border-gray-200 bg-white"
      >
        {/* Timeline axis header */}
        <TimelineAxis scale={scale} height={HEADER_HEIGHT} />
        
        {/* Today marker (vertical line) */}
        <TodayMarker x={todayX} height={totalHeight} topOffset={HEADER_HEIGHT} />
        
        {/* Render grouped projects */}
        {groupedPositions.map(({ group, startY, projects }) => (
          <g key={group.label}>
            {/* Group header (if grouped) */}
            {groupBy !== 'none' && (
              <g>
                <rect
                  x={0}
                  y={startY}
                  width={scale.totalWidth}
                  height={GROUP_HEADER_HEIGHT}
                  fill="#F3F4F6"
                />
                <text
                  x={10}
                  y={startY + GROUP_HEADER_HEIGHT / 2}
                  dominantBaseline="middle"
                  className="text-sm font-semibold fill-gray-700"
                >
                  {group.label} ({group.projects.length})
                </text>
              </g>
            )}
            
            {/* Project bars */}
            {projects.map(({ project, y }) => {
              const position = calculateProjectPosition(
                project,
                scale,
                0, // rowIndex handled by y directly
                ROW_HEIGHT
              );
              
              return (
                <GanttBar
                  key={project.id}
                  project={project}
                  x={position.x}
                  y={y}
                  width={position.width}
                  height={ROW_HEIGHT - 10} // 10px gap between rows
                />
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
```

**Tests:** `tests/unit/roadmap/GanttChart.test.tsx` (6 tests)

---

#### Step A.4: Supporting Components (5 min)

**Files:**
- `src/components/roadmap/GanttBar.tsx` - Individual project bar with status color
- `src/components/roadmap/TimelineAxis.tsx` - Date header with month/week labels
- `src/components/roadmap/TodayMarker.tsx` - Vertical line at current date
- `src/components/roadmap/GroupingSelector.tsx` - Dropdown to change grouping

*(Full code provided in appendix for brevity)*

**Tests:** `tests/unit/roadmap/` (4 tests each = 16 tests total)

---

#### Step A.5: Roadmap Page Integration (5 min)

**File:** `src/app/roadmap/page.tsx`

```typescript
/**
 * Roadmap Gantt View Page
 * 
 * Timeline visualization of all projects with scheduling data.
 */

import { loadAndTransformProjects } from '@/lib/content/transformProjects';
import { RoadmapClient } from './RoadmapClient';

export default function RoadmapPage() {
  const result = loadAndTransformProjects({
    skipInvalid: true,
    logErrors: false
  });
  
  // Filter projects with timeline data
  const projectsWithTimeline = result.projects.filter(
    p => p.start_date && p.end_date
  );
  
  return (
    <RoadmapClient 
      projects={projectsWithTimeline}
      totalProjects={result.projects.length}
    />
  );
}
```

**File:** `src/app/roadmap/RoadmapClient.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ProcessedProject } from '@/lib/types';
import { GanttChart } from '@/components/roadmap/GanttChart';
import { GroupingSelector } from '@/components/roadmap/GroupingSelector';
import { GroupingDimension } from '@/lib/gantt/groupProjects';

interface RoadmapClientProps {
  projects: ProcessedProject[];
  totalProjects: number;
}

export function RoadmapClient({ projects, totalProjects }: RoadmapClientProps) {
  const [groupBy, setGroupBy] = useState<GroupingDimension>('department');
  
  const missingTimeline = totalProjects - projects.length;
  
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Portfolio Roadmap
        </h1>
        <p className="text-gray-600">
          Timeline view of {projects.length} projects
          {missingTimeline > 0 && (
            <span className="text-amber-600 ml-2">
              ({missingTimeline} projects missing timeline data)
            </span>
          )}
        </p>
      </div>
      
      {/* Controls */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">
          Group by:
        </label>
        <GroupingSelector value={groupBy} onChange={setGroupBy} />
      </div>
      
      {/* Gantt Chart */}
      <GanttChart 
        projects={projects} 
        groupBy={groupBy}
        className="border rounded-lg shadow-sm"
      />
    </main>
  );
}
```

**Tests:** `tests/integration/roadmap/roadmap-page.integration.test.tsx` (4 tests)

---

### A6: Track A Summary

**Total Implementation Time:** 30 minutes

**Deliverables:**
- ✅ `/roadmap` route with Gantt timeline
- ✅ SVG-based rendering (scalable, accessible)
- ✅ Grouping by department/status/phase
- ✅ Today marker indicator
- ✅ Status-based color coding
- ✅ 29 new tests (5 scale + 4 grouping + 6 chart + 16 components + 4 integration)

**Fallback Options:**
- **If blocked at minute 175:** Drop grouping, show flat list only
- **If blocked at minute 180:** Drop milestones, basic bars only
- **If blocked at minute 185:** Pivot to Track B

---

## Track B: Project Library & Detail Pages

### B1: Overview

**Goal:** Implement `/projects` library route and `/projects/[id]` detail pages for comprehensive project exploration

**User Story:**
> As a stakeholder, I want to browse all projects in a searchable list and drill into individual project details to understand scope, team, and dependencies.

**Key Requirements (PRD 4.5 + 4.6):**

**Library Page:**
1. Card grid or table view (user toggleable)
2. Filters: multi-select for department, status, phase
3. Search bar with fuzzy matching on title/tags
4. Sort controls (by date, ROI, impact, status)
5. Empty state for no results

**Detail Page:**
1. Dynamic route: `/projects/[id]`
2. Hero section: Title, status badge, owner, department
3. Tabs: Overview (markdown), Metrics (financials), Updates (filtered feed)
4. Sidebar: Key stats, team, tags, dependencies
5. Breadcrumb navigation back to library
6. Print-friendly layout

### B2: Component Architecture

```
src/app/projects/
├── page.tsx                          (library page, server component)
├── [id]/
│   └── page.tsx                     (detail page, dynamic route)
└── ProjectLibraryClient.tsx         (client wrapper with filters/search)

src/components/projects/
├── ProjectCard.tsx                   (card view item)
├── ProjectTableRow.tsx              (table view row)
├── ProjectFilters.tsx               (sidebar filters)
├── ProjectSearchBar.tsx             (fuzzy search input)
├── ViewToggle.tsx                   (card/table switcher)
├── SortSelector.tsx                 (sort dropdown)
├── ProjectHero.tsx                  (detail page header)
├── ProjectTabs.tsx                  (overview/metrics/updates tabs)
└── ProjectSidebar.tsx               (detail page metadata)

src/lib/projects/
├── searchProjects.ts                (Fuse.js wrapper)
├── sortProjects.ts                  (multi-field sorting)
└── filterProjects.ts                (reuse from Phase 4, extend)
```

**Total New Files:** 14 (2 pages + 1 client wrapper + 9 components + 2 utilities)

### B3: Implementation Details

#### Step B.1: Search Engine Setup (4 min)

**Install Fuse.js:**
```bash
npm install fuse.js
```

**File:** `src/lib/projects/searchProjects.ts`

**Purpose:** Fuzzy search across projects per PRD Section 7.1

```typescript
import Fuse from 'fuse.js';
import { ProcessedProject } from '@/lib/types';

const fuseOptions: Fuse.IFuseOptions<ProcessedProject> = {
  keys: [
    { name: 'title', weight: 1.0 },
    { name: 'id', weight: 0.8 },
    { name: 'tags', weight: 0.6 },
    { name: 'owner', weight: 0.4 },
    { name: 'description', weight: 0.2 }
  ],
  threshold: 0.3, // Strict matching (PRD 7.1)
  includeScore: true,
  minMatchCharLength: 2
};

export function searchProjects(
  projects: ProcessedProject[],
  query: string
): ProcessedProject[] {
  if (!query || query.trim().length < 2) {
    return projects;
  }
  
  const fuse = new Fuse(projects, fuseOptions);
  const results = fuse.search(query);
  
  return results.map(result => result.item);
}
```

**Tests:** `tests/unit/projects/searchProjects.test.ts` (5 tests)
- Returns all projects when query empty
- Finds exact title match
- Finds partial title match with fuzzy logic
- Searches across multiple fields (title, tags, owner)
- Returns empty array when no matches

---

#### Step B.2: Project Library Page (8 min)

**File:** `src/app/projects/page.tsx`

```typescript
import { loadAndTransformProjects } from '@/lib/content/transformProjects';
import { ProjectLibraryClient } from './ProjectLibraryClient';

export default function ProjectLibraryPage() {
  const result = loadAndTransformProjects({
    skipInvalid: true,
    logErrors: false
  });
  
  return <ProjectLibraryClient projects={result.projects} />;
}
```

**File:** `src/app/projects/ProjectLibraryClient.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { ProcessedProject } from '@/lib/types';
import { searchProjects } from '@/lib/projects/searchProjects';
import { sortProjects, SortField, SortOrder } from '@/lib/projects/sortProjects';
import { applyProjectFilters } from '@/lib/projects/filterProjects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectSearchBar } from '@/components/projects/ProjectSearchBar';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ViewToggle } from '@/components/projects/ViewToggle';
import { SortSelector } from '@/components/projects/SortSelector';

export function ProjectLibraryClient({ projects }: { projects: ProcessedProject[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filters, setFilters] = useState({
    departments: [] as string[],
    statuses: [] as string[],
    phases: [] as string[]
  });
  
  // Apply filters, search, and sort
  const filteredProjects = useMemo(() => {
    let result = projects;
    
    // Apply filters
    result = applyProjectFilters(result, {
      department: filters.departments,
      status: filters.statuses,
      phase: filters.phases
    });
    
    // Apply search
    result = searchProjects(result, searchQuery);
    
    // Apply sort
    result = sortProjects(result, sortField, sortOrder);
    
    return result;
  }, [projects, filters, searchQuery, sortField, sortOrder]);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Project Library</h1>
      
      {/* Search + Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <ProjectSearchBar 
          value={searchQuery} 
          onChange={setSearchQuery}
          className="flex-1"
        />
        <ViewToggle value={viewMode} onChange={setViewMode} />
        <SortSelector 
          field={sortField} 
          order={sortOrder}
          onFieldChange={setSortField}
          onOrderChange={setSortOrder}
        />
      </div>
      
      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className="w-64 flex-shrink-0">
          <ProjectFilters filters={filters} onChange={setFilters} />
        </aside>
        
        {/* Project Grid/Table */}
        <div className="flex-1">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No projects match your filters</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ departments: [], statuses: [], phases: [] });
                }}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'card' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-2'
            }>
              {filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
          
          {/* Result count */}
          <p className="mt-6 text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>
      </div>
    </main>
  );
}
```

**Tests:** `tests/integration/projects/project-library.integration.test.tsx` (5 tests)

---

#### Step B.3: Project Detail Page (8 min)

**File:** `src/app/projects/[id]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { loadAndTransformProjects } from '@/lib/content/transformProjects';
import { ProjectHero } from '@/components/projects/ProjectHero';
import { ProjectTabs } from '@/components/projects/ProjectTabs';
import { ProjectSidebar } from '@/components/projects/ProjectSidebar';
import Link from 'next/link';

export async function generateStaticParams() {
  const result = loadAndTransformProjects({ skipInvalid: true });
  return result.projects.map(project => ({
    id: project.id
  }));
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const result = loadAndTransformProjects({ skipInvalid: true });
  const project = result.projects.find(p => p.id === params.id);
  
  if (!project) {
    notFound();
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-600">
        <Link href="/projects" className="hover:text-blue-600">
          Projects
        </Link>
        {' / '}
        <span className="text-gray-900">{project.id}</span>
      </nav>
      
      {/* Hero Section */}
      <ProjectHero project={project} />
      
      {/* Two-column layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Tabs) */}
        <div className="lg:col-span-2">
          <ProjectTabs project={project} />
        </div>
        
        {/* Sidebar */}
        <aside>
          <ProjectSidebar project={project} />
        </aside>
      </div>
    </main>
  );
}
```

**Tests:** `tests/integration/projects/project-detail.integration.test.tsx` (4 tests)

---

#### Step B.4: Supporting Components (5 min)

*(Full implementations in appendix for brevity)*

**Components to create:**
- `ProjectCard.tsx` - Displays project in card or row format with key details
- `ProjectSearchBar.tsx` - Search input with clear button
- `ProjectFilters.tsx` - Checkbox groups for department/status/phase
- `ProjectHero.tsx` - Title, status, owner, department display
- `ProjectTabs.tsx` - Tabbed interface for overview/metrics/updates
- `ProjectSidebar.tsx` - Metadata panel with stats and tags

**Tests:** 3-4 tests each = ~21 tests total

---

### B4: Track B Summary

**Total Implementation Time:** 25 minutes

**Deliverables:**
- ✅ `/projects` library route with search and filters
- ✅ Card/table view toggle
- ✅ Fuzzy search with Fuse.js
- ✅ `/projects/[id]` dynamic detail pages
- ✅ Static generation for all project pages
- ✅ Breadcrumb navigation
- ✅ 35 new tests (5 search + 5 library integration + 4 detail integration + 21 component tests)

**Fallback Options:**
- **If blocked at minute 210:** Drop detail pages, library only
- **If blocked at minute 215:** Drop table view, cards only
- **If blocked at minute 220:** Simplify filters to single-select

---

## Track C: Activity Feed & Search

### C1: Overview

**Goal:** Global search functionality and activity/updates feed

**Features:**
1. Global search bar in navigation header
2. Updates feed on dashboard (recent activity)
3. Project-specific update filtering on detail pages

**Note:** This track is lower priority given Phase 4 already has filters. Focus on quick wins.

### C2: Implementation (15 min total)

#### C.1: Global Search in Header (7 min)

**File:** `src/components/layout/GlobalSearch.tsx`

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProcessedProject } from '@/lib/types';
import { searchProjects } from '@/lib/projects/searchProjects';

export function GlobalSearch({ projects }: { projects: ProcessedProject[] }) {
  const [query, setQuery] = useState('');
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
  
  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div ref={ref} className="relative w-full max-w-lg">
      <input
        type="search"
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.map(project => (
            <button
              key={project.id}
              onClick={() => {
                router.push(`/projects/${project.id}`);
                setIsOpen(false);
                setQuery('');
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="font-medium text-gray-900">{project.title}</div>
              <div className="text-sm text-gray-500">
                {project.department} • {project.status}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Update:** `src/app/layout.tsx` to include GlobalSearch in header

**Tests:** `tests/unit/layout/GlobalSearch.test.tsx` (4 tests)

---

#### C.2: Activity Feed Component (8 min)

**File:** `src/components/dashboard/ActivityFeed.tsx`

```typescript
import { ProcessedProject } from '@/lib/types';

interface Activity {
  date: Date;
  type: 'created' | 'updated' | 'completed';
  projectId: string;
  projectTitle: string;
  description: string;
}

function generateActivities(projects: ProcessedProject[]): Activity[] {
  // Generate synthetic activities from project data
  // In real app, would load from updates/ folder
  return projects
    .flatMap(project => [
      {
        date: new Date(project.created_date || Date.now()),
        type: 'created' as const,
        projectId: project.id,
        projectTitle: project.title,
        description: `Project created in ${project.phase} phase`
      },
      ...(project.status === 'Complete' ? [{
        date: new Date(project.end_date || Date.now()),
        type: 'completed' as const,
        projectId: project.id,
        projectTitle: project.title,
        description: `Project completed successfully`
      }] : [])
    ])
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
}

export function ActivityFeed({ projects }: { projects: ProcessedProject[] }) {
  const activities = generateActivities(projects);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.projectTitle}
                </p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.date.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Add to:** `src/app/page.tsx` dashboard

**Tests:** `tests/unit/dashboard/ActivityFeed.test.tsx` (3 tests)

---

### C3: Track C Summary

**Total Implementation Time:** 15 minutes

**Deliverables:**
- ✅ Global search in navigation header
- ✅ Live search results dropdown
- ✅ Activity feed on dashboard
- ✅ 7 new tests

---

## Track D: Production Hardening

### D1: Performance Optimization (5 min)

**Tasks:**
1. Add `loading.tsx` files for each route
2. Implement error boundaries with `error.tsx`
3. Optimize image loading (if any custom images)
4. Code splitting verification

**Files to create:**
- `src/app/loading.tsx` - Root loading state
- `src/app/error.tsx` - Root error boundary
- `src/app/matrix/loading.tsx`
- `src/app/projects/loading.tsx`
- `src/app/roadmap/loading.tsx`

---

### D2: SEO & Meta Tags (3 min)

**File:** `src/app/layout.tsx` (enhance)

```typescript
export const metadata: Metadata = {
  title: 'Roadmap Engine - Strategic Portfolio Management',
  description: 'Enterprise roadmap visualization and portfolio governance platform',
  keywords: ['roadmap', 'portfolio management', 'strategy matrix', 'gantt chart'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Roadmap Engine',
    description: 'Strategic Portfolio Management Platform',
    type: 'website'
  }
};
```

---

### D3: Final QA Checklist (2 min)

**Manual Testing:**
- [ ] All routes load without error
- [ ] Links navigate correctly
- [ ] Filters work on all pages
- [ ] Responsive at mobile/tablet/desktop
- [ ] Build succeeds with `npm run build`
- [ ] Static export works (check `out/` folder)
- [ ] No console errors in production build

---

## Implementation Sequence

### Time-Ordered Execution Plan

| Step | Duration | Cumulative | Task | Priority |
|------|----------|------------|------|----------|
| **5A.1** | 5 min | 165 min | Timeline scale calculator | 🔴 P1 |
| **5A.2** | 3 min | 168 min | Project grouping logic | 🔴 P1 |
| **5A.3** | 12 min | 180 min | Gantt chart component | 🔴 P1 |
| **5A.4** | 5 min | 185 min | Supporting components (bars, axis, marker) | 🔴 P1 |
| **5A.5** | 5 min | 190 min | Roadmap page integration | 🔴 P1 |
| **Decision Gate 1** | - | 190 min | Track A complete? Yes → Track B, No → Pivot | - |
| **5B.1** | 4 min | 194 min | Search engine with Fuse.js | 🔴 P1 |
| **5B.2** | 8 min | 202 min | Project library page | 🔴 P1 |
| **5B.3** | 8 min | 210 min | Project detail pages | 🔴 P1 |
| **5B.4** | 5 min | 215 min | Supporting components | 🔴 P1 |
| **Decision Gate 2** | - | 215 min | Track B complete? Start Track C or D | - |
| **5C.1** | 7 min | 222 min | Global search in header | 🟡 P2 |
| **5C.2** | 8 min | 230 min | Activity feed component | 🟡 P2 |
| **5D.1** | 5 min | 235 min | Performance optimization | 🟢 P3 |
| **5D.2** | 3 min | 238 min | SEO and meta tags | 🟢 P3 |
| **5D.3** | 2 min | 240 min | Final QA checklist | 🟢 P3 |

**Total:** 80 minutes (160-240 minute window)

---

## Testing Strategy

### Test Coverage Targets

**Current:** 140 tests, 90% coverage  
**Phase 5 Target:** 210+ tests, >85% coverage maintained

**New Tests Breakdown:**

| Feature Area | Unit Tests | Integration Tests | Total |
|--------------|------------|-------------------|-------|
| Track A: Gantt | 20 | 9 | 29 |
| Track B: Library + Detail | 26 | 9 | 35 |
| Track C: Search + Feed | 7 | 0 | 7 |
| **TOTAL** | 53 | 18 | **71** |

**Commands:**
```bash
npm test                    # Run all tests
npm run test:coverage       # Check coverage
npm run test:watch         # Watch mode during development
```

---

## Performance Optimization

### Build Optimization Checklist

- [ ] Enable Next.js image optimization
- [ ] Implement dynamic imports for heavy components
- [ ] Add route segment config for static generation
- [ ] Minimize client-side JavaScript bundles
- [ ] Enable compression in production build

**Target Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Total Bundle Size: < 250KB (gzipped)
- Lighthouse Score: > 90

---

## Validation Checklist

### Track A: Gantt View ✅

- [ ] `/roadmap` route renders without error
- [ ] Timeline shows all projects with dates
- [ ] Projects grouped by selected dimension
- [ ] Today marker visible at correct position
- [ ] Status colors applied correctly
- [ ] Horizontal scrolling works smoothly
- [ ] Grouping selector changes layout
- [ ] Empty state shows when no timeline data
- [ ] 29 tests passing for gantt features

### Track B: Project Library ✅

- [ ] `/projects` route renders project grid
- [ ] Search bar filters projects by title/tags
- [ ] Fuzzy search returns relevant results
- [ ] Filters sidebar updates results
- [ ] Card/table view toggle works
- [ ] Sort selector reorders projects
- [ ] Empty state shows when no matches
- [ ] `/projects/[id]` pages render for all projects
- [ ] Detail page shows all metadata
- [ ] Breadcrumb navigation works
- [ ] 35 tests passing for library features

### Track C: Search & Feed ✅

- [ ] Global search in header
- [ ] Search dropdown shows top 5 results
- [ ] Clicking result navigates to detail page
- [ ] Activity feed shows on dashboard
- [ ] Recent activities sorted by date
- [ ] 7 tests passing for search/feed

### Track D: Production ✅

- [ ] All loading states implemented
- [ ] Error boundaries catch errors gracefully
- [ ] SEO meta tags present
- [ ] Build succeeds with no warnings
- [ ] Static export generates all routes
- [ ] Lighthouse score > 90

---

## Risk Mitigation

### Risk 1: Gantt Library Complexity

**Risk:** SVG rendering or chart library integration takes longer than expected

**Mitigation:**
- Use simple SVG rectangles directly (no library)
- Drop milestones and dependencies if time constrained
- Fallback: Simple list view with date ranges

---

### Risk 2: Dynamic Route Generation

**Risk:** Static generation fails for dynamic `[id]` routes

**Mitigation:**
- Test `generateStaticParams()` early (minute 205)
- Verify `out/` folder has all project pages
- Fallback: Client-side rendering if SSG blocked

---

### Risk 3: Search Performance

**Risk:** Fuse.js search slow with large project lists

**Mitigation:**
- Fuse.js is client-side, fast enough for <1000 projects
- Implement debouncing on search input (300ms)
- Fallback: Simple string includes() if Fuse problematic

---

### Risk 4: Time Overrun

**Risk:** Can't complete all 3 tracks in 80 minutes

**Decision Tree:**
- **Minute 190:** If Track A incomplete → Skip to Track B
- **Minute 215:** If neither A nor B complete → Freeze features, go to Track D
- **Minute 230:** Begin submission prep regardless

---

## Submission Package

### Final Deliverables

**Code:**
- [ ] All Phase 5 features committed to main branch
- [ ] Tests passing (target: 210+)
- [ ] Build succeeds (`npm run build`)
- [ ] Static export verified (`npm run build` → check `out/`)

**Documentation:**
- [ ] Updated README with new routes and features
- [ ] Phase 5 review document (status summary)
- [ ] Known issues / future work documented

**Submission Checklist:**
- [ ] PR created with descriptive title
- [ ] PR description includes:
  - Features implemented (Tracks A, B, C, D)
  - Test coverage maintained/improved
  - Screenshots of new pages
  - Manual QA checklist results
- [ ] No blocking console errors
- [ ] Responsive design verified
- [ ] Accessible interactions tested

---

## Appendix A: Component Code Samples

### GanttBar.tsx

```typescript
'use client';

import { ProcessedProject } from '@/lib/types';

interface GanttBarProps {
  project: ProcessedProject;
  x: number;
  y: number;
  width: number;
  height: number;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Active': '#10B981',
    'Queued': '#3B82F6',
    'Backlog': '#6B7280',
    'Paused': '#F59E0B',
    'Complete': '#8B5CF6'
  };
  return colors[status] ?? '#6B7280';
}

export function GanttBar({ project, x, y, width, height }: GanttBarProps) {
  const color = getStatusColor(project.status);
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        rx={4}
        className="transition-opacity hover:opacity-80 cursor-pointer"
      />
      <text
        x={x + 8}
        y={y + height / 2}
        dominantBaseline="middle"
        className="text-xs fill-white font-medium"
        style={{ pointerEvents: 'none' }}
      >
        {project.title}
      </text>
    </g>
  );
}
```

### TimelineAxis.tsx

```typescript
interface TimelineAxisProps {
  scale: TimelineScale;
  height: number;
}

export function TimelineAxis({ scale, height }: TimelineAxisProps) {
  const months: Array<{ label: string; x: number }> = [];
  
  // Generate month labels
  const current = new Date(scale.startDate);
  while (current <= scale.endDate) {
    const daysFromStart = (current.getTime() - scale.startDate.getTime()) / (1000 * 60 * 60 * 24);
    const x = daysFromStart * scale.dayWidth;
    
    months.push({
      label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      x
    });
    
    current.setMonth(current.getMonth() + 1);
  }
  
  return (
    <g>
      <rect x={0} y={0} width={scale.totalWidth} height={height} fill="#F9FAFB" />
      {months.map((month, idx) => (
        <g key={idx}>
          <line
            x1={month.x}
            y1={0}
            x2={month.x}
            y2={height}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
          <text
            x={month.x + 10}
            y={height / 2}
            dominantBaseline="middle"
            className="text-sm font-medium fill-gray-600"
          >
            {month.label}
          </text>
        </g>
      ))}
    </g>
  );
}
```

### TodayMarker.tsx

```typescript
interface TodayMarkerProps {
  x: number;
  height: number;
  topOffset: number;
}

export function TodayMarker({ x, height, topOffset }: TodayMarkerProps) {
  return (
    <g>
      <line
        x1={x}
        y1={topOffset}
        x2={x}
        y2={height}
        stroke="#EF4444"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
      <text
        x={x + 5}
        y={topOffset + 15}
        className="text-xs font-semibold fill-red-600"
      >
        Today
      </text>
    </g>
  );
}
```

---

## Appendix B: Test Examples

### tests/unit/gantt/calculateTimelineScale.test.ts

```typescript
import { describe, it, expect } from 'vitest';
import { calculateTimelineScale, calculateProjectPosition } from '@/lib/gantt/calculateTimelineScale';
import { ProcessedProject } from '@/lib/types';

describe('calculateTimelineScale', () => {
  const mockProjects: Partial<ProcessedProject>[] = [
    {
      id: 'PRJ-001',
      start_date: new Date('2026-01-01'),
      end_date: new Date('2026-03-31')
    },
    {
      id: 'PRJ-002',
      start_date: new Date('2026-02-15'),
      end_date: new Date('2026-06-30')
    }
  ];

  it('calculates correct date range with padding', () => {
    const scale = calculateTimelineScale(mockProjects as ProcessedProject[], 4);
    
    // Should add 14 days padding before/after
    expect(scale.startDate.getTime()).toBeLessThan(new Date('2026-01-01').getTime());
    expect(scale.endDate.getTime()).toBeGreaterThan(new Date('2026-06-30').getTime());
  });

  it('maps dates to pixel positions', () => {
    const scale = calculateTimelineScale(mockProjects as ProcessedProject[], 4);
    const position = calculateProjectPosition(mockProjects[0] as ProcessedProject, scale, 0);
    
    expect(position.x).toBeGreaterThan(0);
    expect(position.width).toBeGreaterThan(0);
  });

  // More tests...
});
```

---

## Appendix C: Quick Reference Commands

```bash
# Development
npm run dev                 # Start dev server

# Testing
npm test                    # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:coverage      # Coverage report
npm run test:watch         # Watch mode

# Building
npm run build              # Production build
npm run lint               # ESLint check
npm run type-check         # TypeScript check

# Quality Gates
npm run test && npm run build && npm run lint
```

---

## Phase 5 Success Criteria

### Minimum Success (Tier 1)
- [ ] One complete feature track (A or B)
- [ ] Production hardening complete (Track D)
- [ ] All existing tests still passing (140+)
- [ ] Build succeeds with no errors
- [ ] No regressions in Phases 1-4

### Target Success (Tier 2)
- [ ] Two complete feature tracks (A + B)
- [ ] Global search implemented (Track C)
- [ ] 190+ tests passing
- [ ] >85% test coverage maintained
- [ ] Lighthouse score > 90

### Stretch Success (Tier 3)
- [ ] All three feature tracks complete (A + B + C)
- [ ] Production hardening with SEO/performance
- [ ] 210+ tests passing
- [ ] All PRD features implemented (100% coverage)
- [ ] Print optimization complete

---

**End of Phase 5 Execution Plan**

Total Length: ~2,000 lines of planning documentation
Features Covered: 3 major tracks + hardening
Time Budget: 80 minutes (flexible with fallbacks)
Test Target: +71 tests (140 → 210+)
