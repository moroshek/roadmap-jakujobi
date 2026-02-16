# Phase 5 Agent Handoff: Extended Features & Production Hardening

**Date:** 2026-02-15  
**Status:** Ready for Execution  
**Phase Window:** 160-240 minutes (80-minute extended timebox)  
**Your Mission:** Transform portfolio app into complete enterprise roadmap platform

---

## Quick Context

### ✅ What's Done (Phases 1-4 Complete)

**Phase 1 - Core Logic (50 tests):**
- Normalization: `normalizeScore()` converts 0-10 → 0-100
- Quadrant logic: `assignQuadrant()` with PRD boundaries
- Schema validation: Zod schema with strict typing

**Phase 2 - Data Pipeline (27 tests):**
- Markdown loading with gray-matter
- Transformation pipeline with validation
- 4 seeded projects in `_content/projects/`

**Phase 3 - Strategy Matrix (31 tests):**
- `/matrix` route with interactive scatter plot
- Recharts implementation with quadrant overlay
- Hover tooltips + click-to-expand modal
- MatrixContext for state management

**Phase 4 - Dashboard & Polish (32 tests):**
- `/` route with executive dashboard
- 4 metric cards (investment, ROI, active count, ROI multiplier)
- Phase distribution + status breakdown charts
- Matrix filters (department, phase, status)
- URL-driven filter state
- Responsive layouts (mobile/tablet/desktop)
- WCAG 2.1 AA accessibility

**Current Status:**
- ✅ **140 tests passing** (100% pass rate)
- ✅ **~90% test coverage**
- ✅ **Build succeeds** with static export
- ✅ **Zero TypeScript errors**
- ✅ **Three routes working:** `/`, `/matrix`

### 🎯 What's Next (Phase 5 Scope)

**3 Major Feature Tracks:**

1. **Track A: Roadmap Gantt View** (30 min) - Timeline visualization at `/roadmap`
2. **Track B: Project Library & Detail Pages** (25 min) - Searchable catalog at `/projects` and `/projects/[id]`
3. **Track C: Activity Feed & Search** (15 min) - Global search + updates stream
4. **Track D: Production Hardening** (10 min) - Performance, SEO, final QA

**Exit Goal:** Complete at least 2 of 3 feature tracks (A or B required), production-ready build

---

## Mission Summary

### Must-Have (Minimum Success - Tier 1)

**Pick ONE major track (A or B):**
- [ ] Gantt timeline view with grouping
- [ ] Project library with search and filters
- [ ] Project detail pages with dynamic routes

**Quality Gates:**
- [ ] Track D hardening complete (loading states, error boundaries)
- [ ] All existing tests still passing (140+)
- [ ] Build succeeds with static export
- [ ] No regressions in Phases 1-4

### Should-Have (Target Success - Tier 2)

- [ ] Both Track A and Track B complete
- [ ] Global search in header (Track C)
- [ ] 190+ tests passing
- [ ] >85% test coverage maintained
- [ ] Lighthouse score > 90

### Nice-to-Have (Stretch Success - Tier 3)

- [ ] All 3 feature tracks complete (A + B + C)
- [ ] Activity feed on dashboard
- [ ] SEO optimization
- [ ] 210+ tests passing
- [ ] Print-friendly layouts

---

## Architecture Quick Reference

| Decision | Choice | Why |
|----------|--------|-----|
| **Routes** | Next.js App Router with dynamic `[id]` | Already configured, supports SSG |
| **Data** | Reuse `loadAndTransformProjects()` | Single source of truth |
| **Gantt** | SVG-based custom rendering | Lightweight, full control, accessible |
| **Search** | Fuse.js (client-side fuzzy search) | Per PRD spec, <10KB, fast |
| **State** | URL params + React Context | Proven pattern from Phase 4 |
| **Testing** | Continue TDD, aim for >85% coverage | Maintain quality standards |

---

## File Structure Overview

### Track A: Gantt Timeline (11 files)

```
src/app/roadmap/
├── page.tsx                     (server component, loads data)
└── RoadmapClient.tsx           (client wrapper with grouping state)

src/components/roadmap/
├── GanttChart.tsx              (main SVG timeline)
├── GanttBar.tsx                (project bar with status color)
├── TimelineAxis.tsx            (date header with month labels)
├── TodayMarker.tsx             (vertical "today" line)
├── GroupingSelector.tsx        (dropdown: by dept/status/phase)
└── MilestoneIcon.tsx           (diamond markers)

src/lib/gantt/
├── calculateTimelineScale.ts   (date → pixel conversion)
├── groupProjects.ts            (organize by dimension)
└── extractMilestones.ts        (parse deliverables)

tests/unit/gantt/               (9 tests)
tests/integration/roadmap/      (4 tests)
```

### Track B: Project Library (14 files)

```
src/app/projects/
├── page.tsx                          (library server component)
├── ProjectLibraryClient.tsx         (client with filters/search)
└── [id]/
    └── page.tsx                     (dynamic detail page)

src/components/projects/
├── ProjectCard.tsx                   (card/row view item)
├── ProjectSearchBar.tsx             (search input)
├── ProjectFilters.tsx               (sidebar filters)
├── ViewToggle.tsx                   (card/table switcher)
├── SortSelector.tsx                 (sort dropdown)
├── ProjectHero.tsx                  (detail page header)
├── ProjectTabs.tsx                  (overview/metrics tabs)
└── ProjectSidebar.tsx               (metadata panel)

src/lib/projects/
├── searchProjects.ts                (Fuse.js wrapper)
├── sortProjects.ts                  (multi-field sorting)
└── filterProjects.ts                (extend Phase 4 filters)

tests/unit/projects/                 (26 tests)
tests/integration/projects/          (9 tests)
```

### Track C: Search & Feed (3 files)

```
src/components/layout/
└── GlobalSearch.tsx                 (header search with dropdown)

src/components/dashboard/
└── ActivityFeed.tsx                 (recent updates list)

tests/unit/layout/                   (4 tests)
tests/unit/dashboard/                (3 tests - feed)
```

### Track D: Hardening (5 files)

```
src/app/
├── loading.tsx                      (root loading state)
├── error.tsx                        (root error boundary)
├── matrix/loading.tsx
├── projects/loading.tsx
└── roadmap/loading.tsx
```

---

## Implementation Sequence (Time-Ordered)

### Decision Flow

**Start → Track A (Gantt)**  
↓ (30 min)  
**Minute 190: Track A complete?**  
├─ Yes → Track B (Library)  
└─ No → Pivot to Track B immediately  
↓ (25 min)  
**Minute 215: Track B complete?**  
├─ Yes → Track C (Search + Feed)  
└─ No → Skip to Track D  
↓ (15 min)  
**Minute 230: Begin Track D (Hardening)**  
↓ (10 min)  
**Minute 240: DONE - Start submission prep**

### Detailed Steps

| Step | Time | Cumulative | Task |
|------|------|------------|------|
| **5A.1** | 5 min | 165 | Timeline scale calculator |
| **5A.2** | 3 min | 168 | Project grouping logic |
| **5A.3** | 12 min | 180 | Gantt chart component |
| **5A.4** | 5 min | 185 | Supporting components |
| **5A.5** | 5 min | 190 | Roadmap page integration |
| **Gate 1** | - | 190 | A done? → Track B, else pivot |
| **5B.1** | 4 min | 194 | Install Fuse.js, search logic |
| **5B.2** | 8 min | 202 | Project library page |
| **5B.3** | 8 min | 210 | Project detail pages |
| **5B.4** | 5 min | 215 | Supporting components |
| **Gate 2** | - | 215 | B done? → Track C, else Track D |
| **5C.1** | 7 min | 222 | Global search in header |
| **5C.2** | 8 min | 230 | Activity feed component |
| **5D.1** | 5 min | 235 | Loading + error boundaries |
| **5D.2** | 3 min | 238 | SEO meta tags |
| **5D.3** | 2 min | 240 | Final QA |

---

## Quick Reference: Code Patterns

### Pattern 1: Timeline Scale Calculation

```typescript
// src/lib/gantt/calculateTimelineScale.ts
export function calculateTimelineScale(
  projects: ProcessedProject[],
  pixelsPerDay: number = 4
): TimelineScale {
  const dates = projects.flatMap(p => [
    new Date(p.start_date),
    new Date(p.end_date)
  ]);
  
  const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Add 2-week padding
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
```

### Pattern 2: Fuzzy Search with Fuse.js

```typescript
// src/lib/projects/searchProjects.ts
import Fuse from 'fuse.js';

const fuseOptions: Fuse.IFuseOptions<ProcessedProject> = {
  keys: [
    { name: 'title', weight: 1.0 },
    { name: 'id', weight: 0.8 },
    { name: 'tags', weight: 0.6 },
    { name: 'owner', weight: 0.4 }
  ],
  threshold: 0.3 // Strict matching per PRD 7.1
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
  return results.map(r => r.item);
}
```

### Pattern 3: Dynamic Route with Static Generation

```typescript
// src/app/projects/[id]/page.tsx
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const result = loadAndTransformProjects({ skipInvalid: true });
  return result.projects.map(p => ({ id: p.id }));
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const result = loadAndTransformProjects({ skipInvalid: true });
  const project = result.projects.find(p => p.id === params.id);
  
  if (!project) {
    notFound();
  }
  
  return (
    <main>
      <ProjectHero project={project} />
      <ProjectTabs project={project} />
      <ProjectSidebar project={project} />
    </main>
  );
}
```

### Pattern 4: SVG Gantt Bar Component

```typescript
// src/components/roadmap/GanttBar.tsx
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
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getStatusColor(project.status)}
        rx={4}
        className="hover:opacity-80 cursor-pointer"
      />
      <text
        x={x + 8}
        y={y + height / 2}
        dominantBaseline="middle"
        className="text-xs fill-white font-medium"
      >
        {project.title}
      </text>
    </g>
  );
}
```

### Pattern 5: Loading State

```typescript
// src/app/roadmap/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    </div>
  );
}
```

### Pattern 6: Error Boundary

```typescript
// src/app/error.tsx
'use client';

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## Validation Checklists

### Track A: Gantt View ✓

**Visual Checks:**
- [ ] `/roadmap` route renders without error
- [ ] Horizontal timeline with month labels visible
- [ ] All projects with dates appear as bars
- [ ] Bar widths proportional to duration
- [ ] Red "Today" marker at correct position
- [ ] Status colors applied (green/blue/gray/amber/purple)

**Interaction Checks:**
- [ ] Grouping selector changes layout
- [ ] Grouped view shows category headers
- [ ] Horizontal scrolling works smoothly
- [ ] Hover shows project details (optional)

**Test Checks:**
- [ ] `npm test` shows 29 new tests passing
- [ ] Integration test loads real projects
- [ ] Empty state works when no timeline data

**Fallback Plan:**
- If minute 185 and not done: Drop grouping, flat list only
- If minute 188 and still blocked: Pivot to Track B

---

### Track B: Library & Detail ✓

**Library Page Checks:**
- [ ] `/projects` route renders grid of project cards
- [ ] Search bar filters results as you type
- [ ] Fuzzy search returns relevant projects
- [ ] Sidebar filters update results (department/status/phase)
- [ ] Card/table view toggle works
- [ ] Sort selector reorders projects
- [ ] Empty state appears when no matches
- [ ] "Clear all filters" button resets view

**Detail Page Checks:**
- [ ] `/projects/PRJ-001` loads without error
- [ ] All projects have generated static pages
- [ ] Hero shows title, status badge, owner, department
- [ ] Tabs switch between Overview/Metrics/Updates
- [ ] Sidebar shows key stats and tags
- [ ] Breadcrumb navigation back to library works
- [ ] 404 page shows for invalid IDs

**Test Checks:**
- [ ] `npm test` shows 35 new tests passing
- [ ] Search tests cover fuzzy matching
- [ ] Integration tests load real project pages

**Fallback Plan:**
- If minute 210 and detail pages incomplete: Library only
- If minute 213 and still blocked: Drop table view, cards only
- If minute 215 and still blocked: Skip to Track D

---

### Track C: Search & Feed ✓

**Global Search Checks:**
- [ ] Search bar appears in header on all pages
- [ ] Typing shows dropdown with top 5 matches
- [ ] Clicking result navigates to detail page
- [ ] Dropdown closes on outside click
- [ ] Search clears when result selected

**Activity Feed Checks:**
- [ ] Feed appears on dashboard below metrics
- [ ] Shows 5 most recent activities
- [ ] Activities sorted by date (newest first)
- [ ] Empty state when no activities

**Test Checks:**
- [ ] 7 new tests passing (4 search + 3 feed)

**Fallback Plan:**
- If minute 228 and incomplete: Search only, skip feed
- If minute 230: Move to Track D

---

### Track D: Production Hardening ✓

**Performance Checks:**
- [ ] All routes have `loading.tsx` files
- [ ] All routes have error boundaries
- [ ] Build completes in <3 minutes
- [ ] Static export generates all HTML files
- [ ] No console warnings in production build

**SEO Checks:**
- [ ] Meta tags present in layout
- [ ] Title and description set
- [ ] Open Graph tags configured

**Final QA:**
- [ ] `npm test` → All passing (190-210+)
- [ ] `npm run build` → Success
- [ ] Manual test all routes (/, /matrix, /roadmap, /projects)
- [ ] Responsive at mobile/tablet/desktop
- [ ] No console errors in dev or prod
- [ ] Lighthouse score > 90 (if time)

---

## Common Gotchas & Solutions

### Gotcha 1: Dynamic Routes Not Generating

**Symptom:** `/projects/[id]` shows 404 in production build

**Solution:**
```typescript
// Must export generateStaticParams in page.tsx
export async function generateStaticParams() {
  const result = loadAndTransformProjects({ skipInvalid: true });
  return result.projects.map(p => ({ id: p.id }));
}
```

**Verify:** Check `out/projects/` folder has HTML files for each project

---

### Gotcha 2: SVG Text Not Rendering

**Symptom:** Gantt chart shows bars but no labels

**Solution:**
```typescript
// Use className for SVG text, not style prop
<text className="text-xs fill-white font-medium">
  {project.title}
</text>
```

---

### Gotcha 3: Fuse.js Search Not Finding Matches

**Symptom:** Search returns empty results for obvious matches

**Solution:**
```typescript
// Check threshold (lower = stricter, higher = fuzzier)
const fuseOptions = {
  threshold: 0.3, // Try 0.4-0.5 if too strict
  minMatchCharLength: 2 // Require at least 2 characters
};
```

---

### Gotcha 4: Tests Failing After Adding Fuse.js

**Symptom:** Test errors about missing Fuse.js module

**Solution:**
```bash
# Install Fuse.js and types
npm install fuse.js
npm install -D @types/fuse.js

# Mock in tests if needed
vi.mock('fuse.js', () => ({
  default: vi.fn()
}));
```

---

### Gotcha 5: Build Warnings About Client Components

**Symptom:** "× You're importing a component that needs X but one of its parents uses 'use client'"

**Solution:**
- Keep data loading in server components (page.tsx)
- Pass data as props to client components
- Only mark interactive components with 'use client'

---

## Time Management Tips

### Ahead of Schedule (>5 min buffer)

**If at minute 185 and Track A done:**
- ✅ Start Track B immediately
- ✅ Add extra tests for edge cases
- ✅ Polish error messages and empty states

**If at minute 210 and Track B done:**
- ✅ Start Track C (search + feed)
- ✅ Add loading skeletons to library
- ✅ Implement sort animations

---

### On Schedule (±2 min)

**If at minute 190 and Track A just complete:**
- ✅ Take 2-min break to review checklist
- ✅ Start Track B with confidence
- ✅ Write tests as you go (not at end)

**If at minute 215 and Track B just complete:**
- ✅ Quick manual test of library + detail pages
- ✅ Decide: Track C or skip to Track D?
- ✅ If energy high → Track C, if fatigued → Track D

---

### Behind Schedule (<5 min buffer)

**If at minute 195 and Track A incomplete:**
- 🚨 **PIVOT TO TRACK B IMMEDIATELY**
- Drop gantt features (grouping, milestones)
- Focus on library as primary deliverable

**If at minute 220 and Track B incomplete:**
- 🚨 **ABANDON FEATURES, START TRACK D**
- Ship what's working
- Focus on hardening existing features
- Ensure no regressions in Phases 1-4

**If at minute 235:**
- 🚨 **SUBMISSION PREP MODE**
- Stop coding new features
- Fix only blocking bugs
- Update README and create PR

---

## Testing Strategy

### Write Tests As You Go

**Don't wait until the end!** Write tests immediately after each component.

**Pattern:**
1. Create component file
2. Write 3-4 unit tests for component
3. Implement component to pass tests
4. Move to next component

**Time per component:**
- Component: 3-5 min
- Tests: 2-3 min
- **Total: 5-8 min per component**

### Test Priorities

**P1 - Must test:**
- Data transformations (scale calculation, search, grouping)
- Component rendering (does it render without error?)
- Integration tests (do pages load real data?)

**P2 - Should test:**
- User interactions (clicks, filters, sorting)
- Edge cases (empty data, invalid IDs)
- Error states

**P3 - Nice to test:**
- Animations
- Loading states
- Accessibility attributes

---

## Fallback Decision Tree

```
Start Phase 5 (minute 160)
│
├─ Track A: Gantt View
│  ├─ Minute 190: Complete? 
│  │  ├─ Yes → Track B
│  │  └─ No → Pivot to Track B
│  │
│  └─ Fallbacks if blocked:
│     ├─ Drop grouping (flat list)
│     ├─ Drop milestones (basic bars)
│     └─ Drop entirely, go to Track B
│
├─ Track B: Library + Detail
│  ├─ Minute 215: Complete?
│  │  ├─ Yes → Track C
│  │  └─ No → Skip to Track D
│  │
│  └─ Fallbacks if blocked:
│     ├─ Library only (no detail pages)
│     ├─ Cards only (no table view)
│     └─ Simple filtering (no fuzzy search)
│
├─ Track C: Search + Feed
│  ├─ Minute 230: Complete?
│  │  ├─ Yes → Track D
│  │  └─ Partial → Track D
│  │
│  └─ Fallbacks:
│     ├─ Search only (skip feed)
│     └─ Skip both if out of time
│
└─ Track D: Hardening
   ├─ Minute 240: HARD STOP
   │  └─ Begin submission prep
   │
   └─ Minimum:
      ├─ Loading states
      ├─ Error boundaries
      └─ Build verification
```

---

## Data Reference

### Available in _content/projects/

**PRJ-001: "Legacy ERP Replacement"**
- Impact: 8.6, Effort: 3.2
- Quadrant: Quick Wins
- Status: Active
- Phase: Foundation
- Department: Manufacturing

**PRJ-002: "AI-Powered Demand Forecasting"**
- Impact: 8.2, Effort: 9.1
- Quadrant: Big Bets  
- Status: Queued
- Phase: Acceleration
- Department: Supply Chain

**PRJ-003: "Regional Parts Hub"**
- Impact: 2.8, Effort: 3.9
- Quadrant: Fillers
- Status: Backlog
- Phase: Scale
- Department: Supply Chain

**PRJ-004: "Customer Portal 2.0"**
- Impact: 8.7, Effort: 4.1
- Quadrant: Time Sinks (actually Quick Wins - check math!)
- Status: Active
- Phase: Acceleration
- Department: After-Sales

### Expected Test Totals

- **Start:** 140 tests passing
- **After Track A:** 169 tests (+29)
- **After Track B:** 204 tests (+35)
- **After Track C:** 211 tests (+7)
- **Target:** 210+ tests

---

## Quick Commands

```bash
# Development
npm run dev                 # Start dev server (port 3000)

# Testing
npm test                    # Run all tests
npm run test:watch         # Watch mode (use during development!)
npm run test:coverage      # Check coverage (target: >85%)

# Building
npm run build              # Production build
npm run lint               # Check for lint errors

# Quality Gate
npm test && npm run build   # Must pass before submission
```

---

## Success Metrics

### Minimum Success ✅
- [ ] One major track complete (Gantt OR Library)
- [ ] Track D hardening done
- [ ] 160+ tests passing
- [ ] Build succeeds
- [ ] No regressions

### Target Success ✅✅
- [ ] Two major tracks complete (Gantt AND Library)
- [ ] Track C search complete
- [ ] 190+ tests passing
- [ ] >85% coverage
- [ ] Lighthouse > 90

### Stretch Success ✅✅✅
- [ ] All tracks complete
- [ ] 210+ tests passing
- [ ] All PRD features implemented
- [ ] Production-ready polish

---

**Let's build! Start with Track A (Gantt) at minute 160. Good luck! 🚀**
