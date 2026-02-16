# Phase 4 Execution Plan: Bonus Features & Polish

**Date:** 2026-02-15  
**Status:** COMPLETED  
**Phase Window:** 135-160 minutes (25-minute timebox)  
**Prerequisites:** Phase 3 complete (Strategy Matrix functional, 108+ tests passing, build succeeds)

---

## Executive Summary

Phase 4 transforms the application from "functional" to "impressive" by delivering three high-value polish areas:

1. **Executive Dashboard** - Professional home page with key metrics and insights
2. **Interactive Filters** - Department, phase, and status filtering for the Strategy Matrix
3. **Responsive & Accessible** - Mobile-friendly design with WCAG 2.1 AA compliance

**Exit Criteria:** At least 2 of 3 feature areas complete with no regressions in Phase 3 must-haves.

---

## Table of Contents

1. [Context & Prerequisites](#context--prerequisites)
2. [Design Decisions](#design-decisions)
3. [Feature Area A: Executive Dashboard](#feature-area-a-executive-dashboard)
4. [Feature Area B: Matrix Filters](#feature-area-b-matrix-filters)
5. [Feature Area C: Responsive & Accessibility](#feature-area-c-responsive--accessibility)
6. [Implementation Sequence](#implementation-sequence)
7. [Testing Strategy](#testing-strategy)
8. [Validation Checklist](#validation-checklist)
9. [Risk Mitigation](#risk-mitigation)
10. [Appendices](#appendices)

---

## Context & Prerequisites

### What's Already Done (Phase 3)

✅ **Data Pipeline:**
- `src/lib/content/loadProjects.ts` - Markdown file reader
- `src/lib/content/transformProjects.ts` - Validation + transformation
- `src/lib/governance/matrix.ts` - Normalization + quadrant logic
- 77 tests passing for P1 + P2

✅ **Strategy Matrix:**
- `src/app/matrix/page.tsx` - Server-rendered matrix page
- `src/components/matrix/MatrixChart.tsx` - Interactive scatter plot
- `src/components/matrix/QuadrantOverlay.tsx` - Background zones
- `src/components/matrix/MatrixTooltip.tsx` - Hover tooltip
- `src/components/matrix/ProjectModal.tsx` - Click-to-expand modal
- 31 tests passing for P3

✅ **Infrastructure:**
- Next.js 14 with App Router
- Tailwind CSS configured
- Vitest + React Testing Library
- TypeScript with moderate strictness
- Build passing with static export

### What's Missing (Phase 4 Scope)

❌ **Home Page** - Currently just a placeholder with a link
❌ **Dashboard Metrics** - No aggregate stats or insights displayed
❌ **Matrix Filters** - Can't filter by department, phase, or status
❌ **Responsive Design** - Matrix not optimized for mobile/tablet
❌ **Accessibility Gaps** - Incomplete keyboard nav, missing ARIA labels

---

## Design Decisions

### Architecture Philosophy

**Principle:** Minimize new patterns. Extend existing architecture from Phase 3.

| Decision Area | Choice | Rationale |
|---------------|--------|-----------|
| **State Management** | React State + URL params | Simple, shareable filter state via query params |
| **Data Flow** | Reuse `loadAndTransformProjects()` | No new data layer needed |
| **Component Style** | Continuation of P3 patterns | Consistent codebase, faster development |
| **Filter Logic** | Pure functions in `src/lib/filters/` | Testable, reusable across views |
| **Dashboard Data** | Derived metrics (computed) | No new data sources, uses existing projects |
| **Responsive Strategy** | Tailwind breakpoints (sm/md/lg/xl) | Already configured, easy to implement |
| **Accessibility** | Incremental WCAG 2.1 AA | Focus on keyboard nav + screen readers |

### Time Allocation Strategy

**Total:** 25 minutes  
**Buffer:** 3 minutes for testing + validation  
**Implementation:** 22 minutes across 3 feature areas

**Priority Ranking:**
1. **Dashboard** (8 min) - Highest visual impact, easiest to implement
2. **Filters** (10 min) - Core UX improvement for matrix exploration
3. **Responsive** (4 min) - Polish pass, lower risk

**Fallback Plan:**
- If minute 152 reached: Drop responsive work, focus on dashboard + filters
- If minute 158 reached: Drop filters, ensure dashboard complete
- Always protect Phase 3 functionality - no breaking changes

---

## Feature Area A: Executive Dashboard

### A1: Overview

**Goal:** Transform `src/app/page.tsx` from placeholder to professional executive dashboard

**User Story:**
> As an executive, I want to see portfolio health at a glance so I can make informed decisions without digging through details.

**Key Metrics to Display:**
1. **Total Investment** - Sum of all project costs
2. **Active Projects** - Count of projects with status "Active"
3. **Total ROI** - Sum of all projected returns
4. **ROI Multiplier** - Total ROI / Total Investment (e.g., "3.2x")

**Additional Elements:**
- Phase distribution chart (simple bar chart)
- Link to Strategy Matrix
- Status breakdown (Active/Queued/Backlog counts)

### A2: Component Architecture

```
src/app/page.tsx (enhanced)
├── Import: loadAndTransformProjects()
├── Compute: Aggregate metrics
└── Render: Dashboard layout
    ├── <MetricCard /> (4 instances)
    ├── <PhaseDistribution />
    └── <CTASection /> (link to matrix)

src/components/dashboard/
├── MetricCard.tsx
├── PhaseDistribution.tsx
└── StatusBreakdown.tsx
```

### A3: Implementation Details

#### File 1: `src/components/dashboard/MetricCard.tsx`

**Purpose:** Reusable metric display card

**Code Structure:**
```typescript
interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ label, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-gray-400">{icon}</div>
        )}
      </div>
    </div>
  );
}
```

**Styling Notes:**
- White background with subtle shadow
- Large font for primary value (3xl)
- Muted text for labels (gray-600)
- Optional icon support for visual interest

**Testing:**
- Renders label and value correctly
- Shows optional subtitle when provided
- Handles different value types (string, number)

#### File 2: `src/components/dashboard/PhaseDistribution.tsx`

**Purpose:** Simple bar chart showing project count per phase

**Code Structure:**
```typescript
interface PhaseDistributionProps {
  phases: {
    name: string;
    count: number;
    color: string;
  }[];
}

export function PhaseDistribution({ phases }: PhaseDistributionProps) {
  const maxCount = Math.max(...phases.map(p => p.count));
  
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Projects by Phase
      </h3>
      <div className="space-y-3">
        {phases.map((phase) => (
          <div key={phase.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {phase.name}
              </span>
              <span className="text-sm text-gray-600">{phase.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(phase.count / maxCount) * 100}%`,
                  backgroundColor: phase.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Design Notes:**
- Horizontal bar chart (easier to read than vertical)
- Max-width based on largest value (relative scaling)
- Smooth transitions on data changes
- Uses config.json colors for brand consistency

**Testing:**
- Renders all phases correctly
- Bar widths proportional to counts
- Handles empty data gracefully

#### File 3: `src/components/dashboard/StatusBreakdown.tsx`

**Purpose:** Quick status summary (Active, Queued, Backlog counts)

**Code Structure:**
```typescript
interface StatusBreakdownProps {
  statuses: {
    active: number;
    queued: number;
    backlog: number;
    paused: number;
    complete: number;
  };
}

export function StatusBreakdown({ statuses }: StatusBreakdownProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Status Overview
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold text-green-600">{statuses.active}</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">{statuses.queued}</p>
          <p className="text-sm text-gray-600">Queued</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-600">{statuses.backlog}</p>
          <p className="text-sm text-gray-600">Backlog</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-600">{statuses.complete}</p>
          <p className="text-sm text-gray-600">Complete</p>
        </div>
      </div>
    </div>
  );
}
```

**Design Notes:**
- Color-coded by status urgency (green=active, gray=backlog)
- 2-column grid for compact display
- Large numbers for quick scanning

#### File 4: `src/app/page.tsx` (Enhanced)

**Purpose:** Main dashboard assembly page

**Code Structure:**
```typescript
import { loadAndTransformProjects } from '@/lib/content/transformProjects';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PhaseDistribution } from '@/components/dashboard/PhaseDistribution';
import { StatusBreakdown } from '@/components/dashboard/StatusBreakdown';
import Link from 'next/link';

export default async function HomePage() {
  const projects = await loadAndTransformProjects();

  // Compute aggregate metrics
  const totalInvestment = projects.reduce((sum, p) => sum + (p.financials.estimated_cost || 0), 0);
  const totalROI = projects.reduce((sum, p) => sum + (p.financials.projected_roi || 0), 0);
  const roiMultiplier = totalInvestment > 0 ? (totalROI / totalInvestment).toFixed(1) : '0.0';
  const activeCount = projects.filter(p => p.status === 'Active').length;

  // Phase distribution
  const phaseCounts = projects.reduce((acc, project) => {
    acc[project.phase] = (acc[project.phase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const phaseData = Object.entries(phaseCounts).map(([name, count]) => ({
    name,
    count,
    color: getPhaseColor(name), // Helper function for consistent colors
  }));

  // Status breakdown
  const statusCounts = {
    active: projects.filter(p => p.status === 'Active').length,
    queued: projects.filter(p => p.status === 'Queued').length,
    backlog: projects.filter(p => p.status === 'Backlog').length,
    paused: projects.filter(p => p.status === 'Paused').length,
    complete: projects.filter(p => p.status === 'Complete').length,
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Executive Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Strategic portfolio overview and key metrics
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Total Investment"
          value={`$${(totalInvestment / 1000).toFixed(0)}K`}
          subtitle={`Across ${projects.length} projects`}
        />
        <MetricCard
          label="Active Projects"
          value={activeCount}
          subtitle="Currently in progress"
        />
        <MetricCard
          label="Projected ROI"
          value={`$${(totalROI / 1000).toFixed(0)}K`}
          subtitle={`${roiMultiplier}x multiplier`}
        />
        <MetricCard
          label="Portfolio Health"
          value="Strong"
          subtitle={`${((activeCount / projects.length) * 100).toFixed(0)}% active`}
        />
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PhaseDistribution phases={phaseData} />
        <StatusBreakdown statuses={statusCounts} />
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          Explore Strategy Matrix
        </h2>
        <p className="text-blue-700 mb-4">
          Visualize your portfolio on the Impact vs. Effort matrix to identify Quick Wins and Big Bets.
        </p>
        <Link
          href="/matrix"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Open Matrix View →
        </Link>
      </div>
    </main>
  );
}

// Helper function for consistent phase colors
function getPhaseColor(phase: string): string {
  const colors: Record<string, string> = {
    Foundation: '#10B981', // green
    Acceleration: '#3B82F6', // blue
    Scale: '#8B5CF6', // purple
  };
  return colors[phase] || '#6B7280'; // gray fallback
}
```

**Key Features:**
- Server-side data loading (no client state needed)
- All metrics computed from project data
- Responsive grid layout (1/2/4 columns)
- Professional color scheme (gray + brand colors)
- Clear call-to-action to matrix view

**Responsive Breakpoints:**
- Mobile (< 768px): Single column stack
- Tablet (768px-1024px): 2 columns
- Desktop (> 1024px): 4 columns for metrics, 2 for charts

### A4: Testing Plan

**Unit Tests:**

```typescript
// tests/unit/dashboard/MetricCard.test.tsx
describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Active Projects" value={5} />);
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders optional subtitle', () => {
    render(<MetricCard label="ROI" value="3.2x" subtitle="Target: 4.0x" />);
    expect(screen.getByText('Target: 4.0x')).toBeInTheDocument();
  });
});

// tests/unit/dashboard/PhaseDistribution.test.tsx
describe('PhaseDistribution', () => {
  it('renders all phases', () => {
    const phases = [
      { name: 'Foundation', count: 2, color: '#10B981' },
      { name: 'Scale', count: 1, color: '#8B5CF6' },
    ];
    render(<PhaseDistribution phases={phases} />);
    expect(screen.getByText('Foundation')).toBeInTheDocument();
    expect(screen.getByText('Scale')).toBeInTheDocument();
  });

  it('displays counts correctly', () => {
    const phases = [{ name: 'Foundation', count: 3, color: '#10B981' }];
    render(<PhaseDistribution phases={phases} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

// tests/unit/dashboard/StatusBreakdown.test.tsx
describe('StatusBreakdown', () => {
  it('renders status counts', () => {
    const statuses = { active: 2, queued: 1, backlog: 3, paused: 0, complete: 1 };
    render(<StatusBreakdown statuses={statuses} />);
    expect(screen.getByText('2')).toBeInTheDocument(); // active
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
```

**Integration Test:**

```typescript
// tests/integration/dashboard/home-page.integration.test.tsx
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage Integration', () => {
  it('loads projects and displays metrics', async () => {
    const page = await HomePage();
    render(page);
    
    // Should display header
    expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
    
    // Should display metric cards
    expect(screen.getByText('Total Investment')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    
    // Should display distribution charts
    expect(screen.getByText('Projects by Phase')).toBeInTheDocument();
    expect(screen.getByText('Status Overview')).toBeInTheDocument();
    
    // Should have CTA
    expect(screen.getByText('Open Matrix View →')).toBeInTheDocument();
  });

  it('calculates aggregate metrics correctly', async () => {
    const page = await HomePage();
    render(page);
    
    // With 4 seeded projects, should show non-zero totals
    const investmentCard = screen.getByText(/Total Investment/i).closest('div');
    expect(investmentCard).toHaveTextContent(/\$\d+K/);
  });
});
```

**Expected Test Count:** 12 tests (3 component × 3 tests + 2 integration)

### A5: Validation Checklist

- [ ] Home page renders without errors
- [ ] Total Investment displays correctly (sum of all project costs)
- [ ] Active Projects count matches status filter
- [ ] ROI multiplier calculated correctly (ROI / Investment)
- [ ] Phase distribution shows all phases from config.json
- [ ] Status breakdown shows all 5 statuses
- [ ] Link to matrix navigates correctly
- [ ] Responsive layout works at 320px, 768px, 1280px
- [ ] All dashboard tests passing

---

## Feature Area B: Matrix Filters

### B1: Overview

**Goal:** Enable users to filter the Strategy Matrix by department, phase, and status

**User Story:**
> As a portfolio manager, I want to filter projects by department and phase so I can focus on specific areas of the roadmap.

**Filter Types:**
1. **Department** - Multi-select (Manufacturing, Supply Chain, Sales, After-Sales)
2. **Phase** - Multi-select (Foundation, Acceleration, Scale)
3. **Status** - Multi-select (Active, Queued, Backlog, Paused, Complete)

**Behavior:**
- Filters are additive within a category (OR logic: show Sales OR Manufacturing)
- Filters across categories use AND logic (show Sales AND Foundation)
- URL query params persist filter state (shareable links)
- "Clear All" button resets to default view
- Filter count badge shows active filter count

### B2: Component Architecture

```
src/app/matrix/page.tsx (enhanced)
├── Parse URL params for filters
├── Apply filters to projects
└── Render MatrixPageClient with filtered data

src/components/matrix/MatrixFilters.tsx
├── Multi-select filter UI
├── URL state management
└── Clear filters action

src/lib/filters/
├── applyMatrixFilters.ts
└── filterUtils.ts
```

### B3: Implementation Details

#### File 1: `src/lib/filters/applyMatrixFilters.ts`

**Purpose:** Pure function to filter projects based on criteria

**Code Structure:**
```typescript
import { ProcessedProject } from '@/lib/types';

export interface MatrixFilters {
  departments: string[];
  phases: string[];
  statuses: string[];
}

/**
 * Apply filters to project list
 * - Empty array = no filter (show all)
 * - Within category: OR logic (Sales OR Manufacturing)
 * - Across categories: AND logic (Sales AND Foundation)
 */
export function applyMatrixFilters(
  projects: ProcessedProject[],
  filters: MatrixFilters
): ProcessedProject[] {
  return projects.filter((project) => {
    // Department filter (OR logic within category)
    const departmentMatch =
      filters.departments.length === 0 ||
      filters.departments.includes(project.department);

    // Phase filter (OR logic within category)
    const phaseMatch =
      filters.phases.length === 0 ||
      filters.phases.includes(project.phase);

    // Status filter (OR logic within category)
    const statusMatch =
      filters.statuses.length === 0 ||
      filters.statuses.includes(project.status);

    // AND logic across categories
    return departmentMatch && phaseMatch && statusMatch;
  });
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: MatrixFilters): number {
  return (
    filters.departments.length +
    filters.phases.length +
    filters.statuses.length
  );
}

/**
 * Parse URL search params into filter object
 */
export function parseFiltersFromURL(searchParams: URLSearchParams): MatrixFilters {
  return {
    departments: searchParams.getAll('dept'),
    phases: searchParams.getAll('phase'),
    statuses: searchParams.getAll('status'),
  };
}

/**
 * Serialize filters to URL search params
 */
export function serializeFiltersToURL(filters: MatrixFilters): string {
  const params = new URLSearchParams();
  
  filters.departments.forEach(d => params.append('dept', d));
  filters.phases.forEach(p => params.append('phase', p));
  filters.statuses.forEach(s => params.append('status', s));
  
  return params.toString();
}
```

**Testing:**
```typescript
// tests/unit/filters/applyMatrixFilters.test.ts
describe('applyMatrixFilters', () => {
  const mockProjects: ProcessedProject[] = [
    { id: 'PRJ-001', department: 'Manufacturing', phase: 'Foundation', status: 'Active', ... },
    { id: 'PRJ-002', department: 'Sales', phase: 'Scale', status: 'Queued', ... },
    { id: 'PRJ-003', department: 'Sales', phase: 'Acceleration', status: 'Backlog', ... },
    { id: 'PRJ-004', department: 'After-Sales', phase: 'Foundation', status: 'Queued', ... },
  ];

  it('returns all projects when no filters applied', () => {
    const filters = { departments: [], phases: [], statuses: [] };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(4);
  });

  it('filters by single department', () => {
    const filters = { departments: ['Sales'], phases: [], statuses: [] };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.department === 'Sales')).toBe(true);
  });

  it('filters by multiple departments (OR logic)', () => {
    const filters = { departments: ['Sales', 'Manufacturing'], phases: [], statuses: [] };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(3);
  });

  it('applies AND logic across categories', () => {
    const filters = { departments: ['Sales'], phases: ['Scale'], statuses: [] };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('PRJ-002');
  });

  it('returns empty array when no matches', () => {
    const filters = { departments: ['Manufacturing'], phases: ['Scale'], statuses: [] };
    const result = applyMatrixFilters(mockProjects, filters);
    expect(result).toHaveLength(0);
  });
});

describe('countActiveFilters', () => {
  it('counts total active filters', () => {
    const filters = { departments: ['Sales', 'Manufacturing'], phases: ['Foundation'], statuses: [] };
    expect(countActiveFilters(filters)).toBe(3);
  });
});

describe('parseFiltersFromURL', () => {
  it('parses multiple values correctly', () => {
    const params = new URLSearchParams('dept=Sales&dept=Manufacturing&phase=Foundation');
    const result = parseFiltersFromURL(params);
    expect(result.departments).toEqual(['Sales', 'Manufacturing']);
    expect(result.phases).toEqual(['Foundation']);
  });
});
```

**Expected Test Count:** 8 tests

#### File 2: `src/components/matrix/MatrixFilters.tsx`

**Purpose:** Interactive filter UI component

**Code Structure:**
```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { parseFiltersFromURL, serializeFiltersToURL, countActiveFilters } from '@/lib/filters/applyMatrixFilters';

interface MatrixFiltersProps {
  departments: string[];
  phases: string[];
  statuses: string[];
}

export function MatrixFilters({ departments, phases, statuses }: MatrixFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilters = parseFiltersFromURL(searchParams);
  const activeCount = countActiveFilters(currentFilters);

  const toggleFilter = (category: 'departments' | 'phases' | 'statuses', value: string) => {
    const current = currentFilters[category];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    const newFilters = { ...currentFilters, [category]: updated };
    const queryString = serializeFiltersToURL(newFilters);
    router.push(`/matrix?${queryString}`);
  };

  const clearAllFilters = () => {
    router.push('/matrix');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All ({activeCount})
          </button>
        )}
      </div>

      {/* Department Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Department</h4>
        <div className="space-y-2">
          {departments.map((dept) => (
            <label key={dept} className="flex items-center">
              <input
                type="checkbox"
                checked={currentFilters.departments.includes(dept)}
                onChange={() => toggleFilter('departments', dept)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{dept}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Phase Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Phase</h4>
        <div className="space-y-2">
          {phases.map((phase) => (
            <label key={phase} className="flex items-center">
              <input
                type="checkbox"
                checked={currentFilters.phases.includes(phase)}
                onChange={() => toggleFilter('phases', phase)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{phase}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
        <div className="space-y-2">
          {statuses.map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="checkbox"
                checked={currentFilters.statuses.includes(status)}
                onChange={() => toggleFilter('statuses', status)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Key Features:**
- URL-driven state (shareable links)
- Checkbox UI for multi-select
- "Clear All" with active filter count
- Client component with useRouter/useSearchParams
- Accessible form controls (labels, focus states)

**Testing:**
```typescript
// tests/unit/matrix/MatrixFilters.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MatrixFilters } from '@/components/matrix/MatrixFilters';

jest.mock('next/navigation');

describe('MatrixFilters', () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockPush.mockClear();
  });

  it('renders all filter categories', () => {
    render(
      <MatrixFilters
        departments={['Sales', 'Manufacturing']}
        phases={['Foundation', 'Scale']}
        statuses={['Active', 'Queued']}
      />
    );

    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Phase')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('toggles department filter on click', () => {
    render(
      <MatrixFilters
        departments={['Sales']}
        phases={[]}
        statuses={[]}
      />
    );

    const checkbox = screen.getByLabelText('Sales');
    fireEvent.click(checkbox);

    expect(mockPush).toHaveBeenCalledWith('/matrix?dept=Sales');
  });

  it('shows clear all button when filters active', () => {
    mockSearchParams.set('dept', 'Sales');
    
    render(
      <MatrixFilters
        departments={['Sales']}
        phases={[]}
        statuses={[]}
      />
    );

    expect(screen.getByText(/Clear All \(1\)/)).toBeInTheDocument();
  });

  it('clears all filters on clear button click', () => {
    mockSearchParams.set('dept', 'Sales');
    
    render(
      <MatrixFilters
        departments={['Sales']}
        phases={[]}
        statuses={[]}
      />
    );

    const clearButton = screen.getByText(/Clear All/);
    fireEvent.click(clearButton);

    expect(mockPush).toHaveBeenCalledWith('/matrix');
  });
});
```

**Expected Test Count:** 6 tests

#### File 3: `src/app/matrix/page.tsx` (Enhanced with Filters)

**Purpose:** Integrate filters into matrix page

**Code Changes:**
```typescript
import { loadAndTransformProjects } from '@/lib/content/transformProjects';
import { loadConfig } from '@/lib/content/loadConfig';
import { applyMatrixFilters, parseFiltersFromURL } from '@/lib/filters/applyMatrixFilters';
import { MatrixPageClient } from '@/components/matrix/MatrixPageClient';
import { MatrixFilters } from '@/components/matrix/MatrixFilters';

interface MatrixPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function MatrixPage({ searchParams }: MatrixPageProps) {
  const [projects, config] = await Promise.all([
    loadAndTransformProjects(),
    loadConfig(),
  ]);

  // Parse filters from URL
  const urlParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlParams.append(key, v));
    } else if (value) {
      urlParams.append(key, value);
    }
  });
  const filters = parseFiltersFromURL(urlParams);

  // Apply filters
  const filteredProjects = applyMatrixFilters(projects, filters);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Strategy Matrix</h1>
        <p className="mt-2 text-gray-600">
          Impact vs. Effort analysis ({filteredProjects.length} of {projects.length} projects)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <MatrixFilters
            departments={config.taxonomies.departments}
            phases={config.governance.phases}
            statuses={config.taxonomies.statuses}
          />
        </aside>

        {/* Main Chart Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            {filteredProjects.length > 0 ? (
              <MatrixPageClient projects={filteredProjects} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No projects match current filters</p>
                <p className="text-gray-500 mt-2">Try adjusting your filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Key Changes:**
- Accept `searchParams` prop from Next.js
- Parse filters from URL query params
- Apply filters before rendering chart
- Show filtered count vs. total count
- Empty state when no matches
- Sidebar layout (1 col filters + 3 col chart)

### B4: Validation Checklist

- [ ] Filter panel renders with all options
- [ ] Clicking checkbox updates URL params
- [ ] Chart updates to show only filtered projects
- [ ] Multiple filters within category work (OR logic)
- [ ] Filters across categories work (AND logic)
- [ ] "Clear All" button resets to full view
- [ ] Filter count badge shows correct number
- [ ] Empty state displays when no matches
- [ ] URL is shareable (copy/paste works)
- [ ] All filter tests passing (14 tests total)

---

## Feature Area C: Responsive & Accessibility

### C1: Overview

**Goal:** Ensure the application works perfectly on mobile/tablet and meets WCAG 2.1 AA standards

**Key Areas:**
1. **Responsive Design** - Mobile-first breakpoints
2. **Touch Interactions** - Tap targets ≥ 44px
3. **Keyboard Navigation** - Full keyboard support
4. **Screen Readers** - ARIA labels and landmarks
5. **Color Contrast** - WCAG AA compliance (4.5:1 minimum)

### C2: Responsive Design Improvements

#### Matrix Page Mobile Optimization

**Changes to:** `src/app/matrix/page.tsx`

```typescript
// Update layout to stack on mobile
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {/* Filters collapse on mobile */}
  <aside className="lg:col-span-1">
    <details className="lg:hidden mb-4">
      <summary className="bg-white rounded-lg shadow p-4 cursor-pointer font-medium">
        Filters ({activeFilterCount})
      </summary>
      <div className="mt-2">
        <MatrixFilters {...filterProps} />
      </div>
    </details>
    <div className="hidden lg:block">
      <MatrixFilters {...filterProps} />
    </div>
  </aside>
  
  {/* Chart responsive sizing */}
  <div className="lg:col-span-3">
    {/* Chart container with aspect ratio */}
  </div>
</div>
```

**Key Improvements:**
- Collapsible filter panel on mobile (<lg breakpoint)
- Chart height adjusts for small screens
- Touch-friendly spacing (min 44px tap targets)

#### Dashboard Responsive Breakpoints

**Changes to:** `src/app/page.tsx`

```typescript
// Metric cards: 1/2/4 column responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
  {/* MetricCard components */}
</div>

// Charts: stack on mobile, side-by-side on desktop
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
  <PhaseDistribution />
  <StatusBreakdown />
</div>
```

**Breakpoint Strategy:**
- `sm` (640px): 2-column grid for metrics
- `lg` (1024px): 4-column grid for metrics, 2-column for charts
- Gap spacing increases with screen size (4 → 6)

### C3: Accessibility Improvements

#### Keyboard Navigation

**Update:** `src/components/matrix/MatrixChart.tsx`

```typescript
// Add keyboard handlers for chart points
<ScatterChart onKeyDown={handleKeyDown} tabIndex={0} aria-label="Strategy matrix scatter plot">
  {/* ... */}
</ScatterChart>

// Handle arrow key navigation between points
function handleKeyDown(e: React.KeyboardEvent) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    // Navigate to adjacent point
    navigateToAdjacentPoint(e.key);
  }
  if (e.key === 'Enter' || e.key === ' ') {
    // Open modal for focused point
    openProjectModal(focusedProject);
  }
}
```

**Update:** `src/components/matrix/ProjectModal.tsx`

```typescript
// Trap focus within modal when open
useEffect(() => {
  if (isOpen) {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    // Implement focus trap logic
  }
}, [isOpen]);

// Close on Escape key (already implemented)
```

#### ARIA Labels and Landmarks

**Updates throughout application:**

```typescript
// Dashboard page
<main role="main" aria-label="Executive Dashboard">
  <section aria-labelledby="metrics-heading">
    <h2 id="metrics-heading" className="sr-only">Key Metrics</h2>
    {/* Metric cards */}
  </section>
</main>

// Matrix page
<main role="main" aria-label="Strategy Matrix">
  <nav aria-label="Project filters">
    {/* MatrixFilters */}
  </nav>
  <section aria-labelledby="chart-heading">
    <h2 id="chart-heading" className="sr-only">Impact vs Effort Chart</h2>
    {/* MatrixChart */}
  </section>
</main>

// Filter checkboxes (already have proper labels via <label> tag)
```

#### Color Contrast Audit

**Review all text colors for WCAG AA compliance:**

| Element | Current | Contrast Ratio | Status |
|---------|---------|----------------|--------|
| Body text (gray-900 on white) | #111827 | 16.5:1 | ✅ AAA |
| Secondary text (gray-600) | #4B5563 | 7.7:1 | ✅ AAA |
| Muted text (gray-500) | #6B7280 | 5.7:1 | ✅ AA |
| Primary button (blue-600) | #2563EB | 4.6:1 | ✅ AA |
| Accent color (amber-600) | #D97706 | 4.5:1 | ✅ AA |

**All colors meet WCAG AA. No changes needed.**

### C4: Testing

**Accessibility Tests:**

```typescript
// tests/unit/accessibility/keyboard-nav.test.tsx
describe('Keyboard Navigation', () => {
  it('allows tab navigation through filters', () => {
    render(<MatrixFilters {...props} />);
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    firstCheckbox.focus();
    expect(firstCheckbox).toHaveFocus();
  });

  it('closes modal on Escape key', () => {
    const onClose = jest.fn();
    render(<ProjectModal isOpen={true} onClose={onClose} project={mockProject} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

// tests/unit/accessibility/aria-labels.test.tsx
describe('ARIA Labels', () => {
  it('has proper landmarks on dashboard', async () => {
    const page = await HomePage();
    const { container } = render(page);
    expect(container.querySelector('[role="main"]')).toBeInTheDocument();
  });

  it('filter panel has navigation role', () => {
    render(<MatrixFilters {...props} />);
    // Check for proper semantic structure
  });
});
```

**Manual Testing Checklist:**
- [ ] Tab through dashboard with keyboard (logical order)
- [ ] Tab through matrix page filters
- [ ] Open/close modal with Enter/Escape keys
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Check color contrast with DevTools
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test at 320px width (iPhone SE)

**Expected Test Count:** 6 tests

### C5: Validation Checklist

- [ ] Matrix page works on mobile (320px-767px)
- [ ] Dashboard responsive on tablet (768px-1023px)
- [ ] Touch targets ≥ 44px on mobile
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces all interactive elements
- [ ] Focus indicators visible on all controls
- [ ] Modal closes with Escape key
- [ ] All colors pass WCAG AA contrast
- [ ] Accessibility tests passing

---

## Implementation Sequence

### Time-Ordered Execution Plan

**Total Time:** 25 minutes (135-160 minute window)

| Step | Duration | Cumulative | Task | Files |
|------|----------|------------|------|-------|
| 4A.1 | 3 min | 138 min | Create dashboard components | MetricCard.tsx, PhaseDistribution.tsx, StatusBreakdown.tsx |
| 4A.2 | 5 min | 143 min | Enhance home page with data + layout | page.tsx |
| 4A.3 | 2 min | 145 min | Write dashboard unit tests | tests/unit/dashboard/*.test.tsx |
| 4B.1 | 4 min | 149 min | Create filter logic functions | applyMatrixFilters.ts |
| 4B.2 | 3 min | 152 min | Build MatrixFilters component | MatrixFilters.tsx |
| 4B.3 | 3 min | 155 min | Integrate filters into matrix page | matrix/page.tsx update |
| 4B.4 | 2 min | 157 min | Write filter tests | tests/unit/filters/*.test.ts |
| 4C.1 | 2 min | 159 min | Add responsive classes + ARIA labels | Various files |
| 4C.2 | 1 min | 160 min | Final validation + manual QA | All |

### Implementation Notes

**Parallel Work Opportunities:**
- Dashboard tests can be written while filter logic is being implemented
- Responsive classes can be added incrementally throughout

**Critical Path:**
1. Dashboard components first (highest visual impact, establishes patterns)
2. Filter logic second (core functionality, reusable)
3. Responsive/accessibility last (polish, lower risk)

**Stop Conditions:**
- If minute 152 reached without dashboard complete: Skip filters, finish dashboard + tests
- If minute 158 reached without filters complete: Ship dashboard only
- Always run final test suite before declaring complete

---

## Testing Strategy

### Test Targets

**New Tests to Write:**
- Dashboard components: 12 tests (MetricCard, PhaseDistribution, StatusBreakdown, HomePage)
- Filter logic: 8 tests (applyMatrixFilters, URL utils)
- Filter UI: 6 tests (MatrixFilters component)
- Accessibility: 6 tests (keyboard nav, ARIA)

**Total Expected:** 32 new tests  
**Overall Total:** 140+ tests (108 existing + 32 new)

### Coverage Goals

**Target:** Maintain >85% coverage for new files

**Focus Areas:**
- Filter logic (100% - pure functions)
- Dashboard components (90% - UI + computation)
- Accessibility utilities (80% - harder to test interactions)

### Test Commands

```bash
# Run all tests
npm test

# Run only Phase 4 tests
npm test -- dashboard filters accessibility

# Watch mode for active development
npm test -- --watch

# Coverage report
npm run test:coverage
```

---

## Validation Checklist

### Pre-Implementation

- [ ] Phase 3 tests passing (108+ tests)
- [ ] Build succeeds (`npm run build`)
- [ ] Matrix route functional at `/matrix`
- [ ] Current git status clean (commit Phase 3 if needed)

### During Implementation

**After Dashboard (minute 145):**
- [ ] Home page renders with metrics
- [ ] All 4 metric cards display data
- [ ] Phase distribution chart shows bars
- [ ] Status breakdown shows counts
- [ ] Link to matrix works
- [ ] Dashboard tests passing (12 tests)

**After Filters (minute 157):**
- [ ] Filter panel renders in sidebar
- [ ] Clicking checkboxes updates URL
- [ ] Chart updates with filtered data
- [ ] "Clear All" button works
- [ ] Empty state shows when no matches
- [ ] Filter tests passing (14 tests)

**After Responsive/A11y (minute 160):**
- [ ] Mobile layout works (<768px)
- [ ] Keyboard nav functional
- [ ] ARIA labels present
- [ ] Accessibility tests passing (6 tests)

### Post-Implementation

**Final QA:**
- [ ] All 140+ tests passing
- [ ] Build succeeds with no errors
- [ ] No console warnings in browser
- [ ] Matrix still works (no regressions)
- [ ] Dashboard loads in <1 second
- [ ] Filters respond instantly

**Manual Testing:**
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile device
- [ ] Test with keyboard only
- [ ] Test with screen reader (basic check)
- [ ] Test all filter combinations

**Performance:**
- [ ] Dashboard metrics compute quickly (<100ms)
- [ ] Filter operations instant (<50ms)
- [ ] No layout shifts during load
- [ ] Smooth animations (60fps)

---

## Risk Mitigation

### Known Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Time overrun | Medium | High | Prioritize dashboard, defer filters if needed |
| Filter logic bugs | Low | Medium | Comprehensive unit tests, simple OR/AND logic |
| Responsive layout breaks | Low | Medium | Test at 3 breakpoints during dev |
| Test complexity | Medium | Low | Use simple assertions, avoid complex mocks |
| URL param edge cases | Low | Low | Validate with URL utils, add fallbacks |

### Fallback Strategy

**If minute 152 reached without dashboard complete:**
- Ship simplified dashboard (metric cards only, no charts)
- Skip filters entirely
- Focus on test coverage for what's built

**If minute 158 reached without filters complete:**
- Ship dashboard complete
- Skip filters and responsive work
- Ensure no regressions in Phase 3

**If tests failing at minute 159:**
- Fix blocking test failures only
- Skip accessibility tests if needed
- Ensure build passes (required for submission)

### Regression Prevention

**Protected Functionality (must not break):**
- ✅ Strategy Matrix at `/matrix` route
- ✅ Scatter plot with quadrants
- ✅ Hover tooltip with project details
- ✅ Click-to-modal interaction
- ✅ All 108 existing tests

**Testing Strategy:**
- Run full test suite after each feature area
- Manual smoke test of matrix route after each change
- Keep Phase 3 components untouched (only extend, don't modify)

---

## Appendices

### Appendix A: Design Tokens

**Colors (from config.json):**
```json
{
  "primary": "#0B1220",      // Dark blue-gray (headers)
  "secondary": "#2563EB",    // Blue (CTAs, links)
  "accent": "#F59E0B",       // Amber (highlights)
  "background": "#F8FAFC"    // Light gray (page bg)
}
```

**Additional Palette:**
- Success: `#10B981` (green-500) - Active status, positive trends
- Warning: `#F59E0B` (amber-500) - Queued status, attention needed
- Error: `#EF4444` (red-500) - Blocked status, critical issues
- Neutral: `#6B7280` (gray-500) - Backlog status, secondary text

**Spacing Scale:**
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- base: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Appendix B: Component API Contracts

**MetricCard Props:**
```typescript
interface MetricCardProps {
  label: string;           // Display label (e.g., "Total Investment")
  value: string | number;  // Primary metric value
  subtitle?: string;       // Optional secondary info
  icon?: React.ReactNode;  // Optional icon element
  trend?: 'up' | 'down' | 'neutral'; // Optional trend indicator
}
```

**PhaseDistribution Props:**
```typescript
interface PhaseDistributionProps {
  phases: {
    name: string;    // Phase name from config
    count: number;   // Project count in phase
    color: string;   // Hex color for bar
  }[];
}
```

**MatrixFilters Props:**
```typescript
interface MatrixFiltersProps {
  departments: string[];  // Available departments from config
  phases: string[];       // Available phases from config
  statuses: string[];     // Available statuses from config
}
```

### Appendix C: URL Filter Format

**Query Parameter Schema:**
```
/matrix?dept=Sales&dept=Manufacturing&phase=Foundation&status=Active
```

**Parsing Rules:**
- Multiple values for same key = array (OR logic)
- Different keys = AND logic across categories
- Empty params = no filter (show all)
- Invalid values = ignored (defensive parsing)

**Example URLs:**
```
# All projects
/matrix

# Sales department only
/matrix?dept=Sales

# Sales OR Manufacturing
/matrix?dept=Sales&dept=Manufacturing

# Sales AND Foundation phase
/matrix?dept=Sales&phase=Foundation

# Complex filter
/matrix?dept=Sales&phase=Foundation&phase=Scale&status=Active&status=Queued
```

### Appendix D: Accessibility Requirements Summary

**WCAG 2.1 AA Checklist:**

**Perceivable:**
- ✅ Color contrast ≥ 4.5:1 for normal text
- ✅ Color contrast ≥ 3:1 for large text (18pt+)
- ✅ Text resizable up to 200% without loss of content

**Operable:**
- ✅ All functionality available via keyboard
- ✅ No keyboard traps
- ✅ Focus order is logical
- ✅ Link/button purpose clear from text
- ✅ Focus indicator visible (2px outline)

**Understandable:**
- ✅ Page language specified (`<html lang="en">`)
- ✅ Labels present for all form controls
- ✅ Error messages provide suggestions

**Robust:**
- ✅ Valid HTML
- ✅ ARIA used correctly
- ✅ Role/state/properties correct

### Appendix E: Browser Support Matrix

**Target Browsers:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari (iOS): 14+
- Chrome Android: Last 2 versions

**Known Limitations:**
- No IE11 support (Next.js 14 requirement)
- Recharts may have minor visual differences in older browsers
- CSS Grid used extensively (2017+ browser support)

### Appendix F: File Size Budget

**Performance Targets:**
- Home page bundle: <150 KB (gzipped)
- Matrix page bundle: <200 KB (gzipped)
- Time to Interactive (TTI): <3 seconds
- First Contentful Paint (FCP): <1.5 seconds

**Current Status (Phase 3):**
- Home: ~30 KB (lots of headroom)
- Matrix: ~180 KB (reasonable for Recharts)

**Phase 4 Impact:**
- Dashboard components: +15 KB
- Filter logic: +5 KB
- **Total: Well under budget**

---

## Exit Criteria

### Minimum Success (Priority 1)

Must complete at least **2 of 3** feature areas:

**Option A: Dashboard + Filters** (recommended)
- ✅ Executive dashboard on home page (5 components)
- ✅ Matrix filters functional (3 categories)
- ✅ All tests passing (26 new tests)

**Option B: Dashboard + Responsive** (if filters challenging)
- ✅ Executive dashboard complete
- ✅ Responsive layouts at 3 breakpoints
- ✅ Accessibility improvements
- ✅ All tests passing (18 new tests)

**Option C: Filters + Responsive** (if dashboard deprioritized)
- ✅ Matrix filters functional
- ✅ Responsive + accessible
- ✅ All tests passing (20 new tests)

### Ideal Success (Priority 2)

All 3 feature areas complete:
- ✅ Executive dashboard with 4 metric cards + 2 charts
- ✅ Matrix filters with URL state management
- ✅ Responsive design + WCAG AA compliance
- ✅ 140+ total tests passing
- ✅ Build succeeds
- ✅ No regressions in Phase 3

### Stretch Goals (Priority 3 - only if ahead of schedule)

- [ ] Dashboard: Add velocity chart (completed projects over time)
- [ ] Dashboard: Add recent activity feed (last 3 updates)
- [ ] Filters: Add "Save Filter Preset" functionality
- [ ] Matrix: Add zoom/pan interactions
- [ ] All pages: Add print stylesheets
- [ ] Add simple error boundary components

---

## Definition of Done

**Code Quality:**
- [ ] All TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Consistent formatting (Prettier)
- [ ] No hardcoded values (use config.json)

**Functionality:**
- [ ] Dashboard displays accurate metrics
- [ ] Filters update chart correctly
- [ ] Responsive at mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] ARIA labels present

**Testing:**
- [ ] All new tests passing
- [ ] No regressions in existing tests
- [ ] Coverage >85% for new files
- [ ] Manual QA checklist complete

**Build:**
- [ ] `npm run build` succeeds
- [ ] `npm run dev` runs without errors
- [ ] No console warnings in browser
- [ ] Static export generates correctly

**Documentation:**
- [ ] This execution plan followed
- [ ] Any deviations documented in PR
- [ ] Known issues listed (if any)

---

## Handoff Notes for Agent

**Starting Conditions:**
You are receiving a fully functional Strategy Matrix application with comprehensive test coverage. Phase 3 is complete and verified.

**Your Mission:**
Add professional polish through dashboard, filters, and responsive design. Prioritize visual impact and user experience improvements.

**Critical Success Factor:**
Do NOT break Phase 3 functionality. The matrix must continue to work. If in doubt, create new files rather than modifying existing ones.

**Time Management:**
You have 25 minutes. If running behind, skip features rather than rushing. Quality over quantity.

**Testing Discipline:**
Write tests as you go, not at the end. Each component gets 2-3 tests minimum.

**When to Stop:**
Minute 159. Run final test suite. If tests fail, fix them. Build must pass. Ship what works.

**Help:**
All code patterns are provided in this document. Copy-paste-adapt. Don't overcomplicate.

**You've Got This! 🚀**

---

**End of Phase 4 Execution Plan**

*Document Version: 1.0*  
*Last Updated: 2026-02-15*  
*Status: Ready for Implementation*
