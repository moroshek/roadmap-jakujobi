# Phase 4 Agent Handoff: Bonus Features & Polish

**Date:** 2026-02-15  
**Status:** Ready for Execution  
**Phase Window:** 135-160 minutes (25-minute timebox)  
**Your Mission:** Transform functional app into impressive portfolio piece

---

## Quick Context

### ✅ What's Done (Phase 3 Complete)

**Data Pipeline:**
- Loading: `src/lib/content/loadProjects.ts`, `loadConfig.ts`
- Transform: `src/lib/content/transformProjects.ts`
- Governance: `src/lib/governance/matrix.ts`
- Validation: `src/lib/validation/projectSchema.ts`
- **Tests: 77 passing (P1 + P2)**

**Strategy Matrix:**
- Page: `src/app/matrix/page.tsx`
- Chart: `src/components/matrix/MatrixChart.tsx`
- Overlay: `src/components/matrix/QuadrantOverlay.tsx`
- Tooltip: `src/components/matrix/MatrixTooltip.tsx`
- Modal: `src/components/matrix/ProjectModal.tsx`
- **Tests: 31 passing (P3)**

**Infrastructure:**
- Next.js 14 with App Router + Static Export
- Tailwind CSS configured
- Vitest + React Testing Library
- TypeScript (moderate strictness)
- **Build: Passing ✓**

### 🎯 What's Next (Phase 4 Scope)

**3 Feature Areas:**
1. **Executive Dashboard** - Professional home page with metrics (PRIORITY 1)
2. **Matrix Filters** - Department, phase, status filtering (PRIORITY 2)
3. **Responsive & Accessible** - Mobile + WCAG AA (PRIORITY 3)

**Exit Goal:** Complete at least 2 of 3 areas, no regressions in Phase 3

---

## Mission Summary

### Must-Have (Minimum Success)

**Dashboard OR Filters (pick at least one):**
- [ ] Executive dashboard with 4 metric cards
- [ ] Phase distribution chart
- [ ] Matrix filters (department, phase, status)
- [ ] URL-driven filter state

**Quality Gates:**
- [ ] At least 20 new tests passing
- [ ] Build succeeds
- [ ] Matrix still works (no regressions)

### Nice-to-Have (Stretch Goals)

- [ ] All 3 feature areas complete
- [ ] 32+ new tests passing
- [ ] Responsive layouts at 3 breakpoints
- [ ] Keyboard navigation + ARIA labels

---

## Architecture Decisions

| Area | Decision | Why |
|------|----------|-----|
| **State** | React state + URL params | Simple, shareable filter links |
| **Data** | Reuse `loadAndTransformProjects()` | No new data layer |
| **Components** | New files, don't modify P3 | Protect matrix functionality |
| **Filters** | Pure functions in `lib/filters/` | Testable, reusable logic |
| **Dashboard** | Server component with computed metrics | Fast, no client state |
| **Responsive** | Tailwind breakpoints (sm/md/lg) | Already configured |
| **A11y** | Incremental WCAG 2.1 AA | Focus on keyboard + screen readers |

---

## File Structure to Create

### Feature A: Dashboard (8 files)

```
src/components/dashboard/
├── MetricCard.tsx               (reusable metric display)
├── PhaseDistribution.tsx        (bar chart by phase)
└── StatusBreakdown.tsx          (status count grid)

src/app/page.tsx                 (enhance with dashboard)

tests/unit/dashboard/
├── MetricCard.test.tsx          (3 tests)
├── PhaseDistribution.test.tsx   (3 tests)
└── StatusBreakdown.test.tsx     (3 tests)

tests/integration/dashboard/
└── home-page.integration.test.tsx (3 tests)
```

**Expected: 12 tests**

### Feature B: Filters (8 files)

```
src/lib/filters/
├── applyMatrixFilters.ts        (filter logic + URL utils)
└── filterUtils.ts               (helper functions)

src/components/matrix/
└── MatrixFilters.tsx            (filter UI component)

src/app/matrix/page.tsx          (enhance with filters)

tests/unit/filters/
└── applyMatrixFilters.test.ts   (8 tests)

tests/unit/matrix/
└── MatrixFilters.test.tsx       (6 tests)
```

**Expected: 14 tests**

### Feature C: Responsive/A11y (2 files)

```
(Updates to existing files only - add classes + ARIA)

tests/unit/accessibility/
├── keyboard-nav.test.tsx        (3 tests)
└── aria-labels.test.tsx         (3 tests)
```

**Expected: 6 tests**

---

## Implementation Sequence

### Time-Ordered Steps

| Step | Time | Task | Priority |
|------|------|------|----------|
| **4A: Dashboard** |||  **PRIORITY 1** |
| 4A.1 | 3 min | Create 3 dashboard components | P1 |
| 4A.2 | 5 min | Enhance home page | P1 |
| 4A.3 | 2 min | Write 12 dashboard tests | P1 |
| **4B: Filters** ||| **PRIORITY 2** |
| 4B.1 | 4 min | Create filter logic + utils | P2 |
| 4B.2 | 3 min | Build MatrixFilters UI | P2 |
| 4B.3 | 3 min | Update matrix page | P2 |
| 4B.4 | 2 min | Write 14 filter tests | P2 |
| **4C: Polish** ||| **PRIORITY 3** |
| 4C.1 | 2 min | Add responsive + ARIA | P3 |
| 4C.2 | 1 min | Write 6 a11y tests | P3 |

**Total: 25 minutes (135→160)**

### Critical Path

**Minutes 135-145 (Dashboard):**
- Focus: High visual impact, establishes patterns
- Goal: Working dashboard with metrics
- Stop: If not complete by 145, skip filters

**Minutes 145-157 (Filters):**
- Focus: Core UX improvement, reusable logic
- Goal: Working filters with URL state
- Stop: If not complete by 157, skip responsive

**Minutes 157-160 (Polish):**
- Focus: Responsive classes, ARIA labels
- Goal: Mobile-friendly, accessible
- Stop: Minute 159 hard stop for testing

---

## Quick Reference: Code Patterns

### Pattern 1: Dashboard Metric Card

```typescript
// src/components/dashboard/MetricCard.tsx
interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export function MetricCard({ label, value, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}
```

### Pattern 2: Enhanced Home Page

```typescript
// src/app/page.tsx
import { loadAndTransformProjects } from '@/lib/content/transformProjects';
import { MetricCard } from '@/components/dashboard/MetricCard';

export default async function HomePage() {
  const projects = await loadAndTransformProjects();

  // Compute metrics
  const totalInvestment = projects.reduce((sum, p) => 
    sum + (p.financials.estimated_cost || 0), 0
  );
  const activeCount = projects.filter(p => p.status === 'Active').length;
  const totalROI = projects.reduce((sum, p) => 
    sum + (p.financials.projected_roi || 0), 0
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Executive Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Investment" value={`$${(totalInvestment/1000)}K`} />
        <MetricCard label="Active Projects" value={activeCount} />
        <MetricCard label="Projected ROI" value={`$${(totalROI/1000)}K`} />
        <MetricCard label="Portfolio Health" value="Strong" />
      </div>
    </main>
  );
}
```

### Pattern 3: Filter Logic

```typescript
// src/lib/filters/applyMatrixFilters.ts
import { ProcessedProject } from '@/lib/types';

export interface MatrixFilters {
  departments: string[];
  phases: string[];
  statuses: string[];
}

export function applyMatrixFilters(
  projects: ProcessedProject[],
  filters: MatrixFilters
): ProcessedProject[] {
  return projects.filter((project) => {
    const deptMatch = filters.departments.length === 0 || 
      filters.departments.includes(project.department);
    const phaseMatch = filters.phases.length === 0 || 
      filters.phases.includes(project.phase);
    const statusMatch = filters.statuses.length === 0 || 
      filters.statuses.includes(project.status);
    
    return deptMatch && phaseMatch && statusMatch;
  });
}

export function parseFiltersFromURL(params: URLSearchParams): MatrixFilters {
  return {
    departments: params.getAll('dept'),
    phases: params.getAll('phase'),
    statuses: params.getAll('status'),
  };
}
```

### Pattern 4: Filter Component

```typescript
// src/components/matrix/MatrixFilters.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export function MatrixFilters({ departments, phases, statuses }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const toggleFilter = (category: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    const current = params.getAll(category);
    
    if (current.includes(value)) {
      // Remove
      params.delete(category);
      current.filter(v => v !== value).forEach(v => params.append(category, v));
    } else {
      // Add
      params.append(category, value);
    }
    
    router.push(`/matrix?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold mb-4">Filters</h3>
      
      {departments.map(dept => (
        <label key={dept} className="flex items-center mb-2">
          <input type="checkbox" onChange={() => toggleFilter('dept', dept)} />
          <span className="ml-2">{dept}</span>
        </label>
      ))}
    </div>
  );
}
```

### Pattern 5: Matrix Page with Filters

```typescript
// src/app/matrix/page.tsx (updated)
import { loadAndTransformProjects } from '@/lib/content/transformProjects';
import { loadConfig } from '@/lib/content/loadConfig';
import { applyMatrixFilters, parseFiltersFromURL } from '@/lib/filters/applyMatrixFilters';
import { MatrixFilters } from '@/components/matrix/MatrixFilters';

interface MatrixPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function MatrixPage({ searchParams }: MatrixPageProps) {
  const [projects, config] = await Promise.all([
    loadAndTransformProjects(),
    loadConfig(),
  ]);

  // Parse and apply filters
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach(x => params.append(k, x));
    else if (v) params.append(k, v);
  });
  const filters = parseFiltersFromURL(params);
  const filteredProjects = applyMatrixFilters(projects, filters);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <MatrixFilters 
            departments={config.taxonomies.departments}
            phases={config.governance.phases}
            statuses={config.taxonomies.statuses}
          />
        </aside>
        <div className="lg:col-span-3">
          <MatrixPageClient projects={filteredProjects} />
        </div>
      </div>
    </div>
  );
}
```

### Pattern 6: Component Test Template

```typescript
// tests/unit/dashboard/MetricCard.test.tsx
import { render, screen } from '@testing-library/react';
import { MetricCard } from '@/components/dashboard/MetricCard';

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Active" value={5} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders optional subtitle', () => {
    render(<MetricCard label="ROI" value="3.2x" subtitle="Target: 4x" />);
    expect(screen.getByText('Target: 4x')).toBeInTheDocument();
  });
});
```

---

## Validation Checklist

### After Dashboard (Minute 145)

- [ ] Home page renders without errors
- [ ] All 4 metric cards display
- [ ] Data computed correctly (check totals)
- [ ] Link to matrix works
- [ ] Dashboard tests passing (12 tests)
- [ ] Build succeeds

### After Filters (Minute 157)

- [ ] Filter panel renders in sidebar
- [ ] Clicking checkbox updates URL
- [ ] Chart updates with filtered data
- [ ] Multiple filters work (OR within category)
- [ ] "Clear All" button works
- [ ] Empty state shows when no matches
- [ ] Filter tests passing (14 tests)
- [ ] Build succeeds

### After Polish (Minute 160)

- [ ] Mobile layout stacks correctly (<768px)
- [ ] Keyboard tab order logical
- [ ] ARIA labels present
- [ ] All tests passing (140+ total)
- [ ] Build succeeds
- [ ] No console errors

---

## Common Gotchas & Solutions

### Gotcha 1: URL Params in Next.js 14

**Problem:** `searchParams` is a Promise in Next.js 14

**Solution:** Your server component already receives it as an object, not a Promise. Just use it directly:

```typescript
export default async function Page({ searchParams }: Props) {
  // searchParams is already resolved - use it immediately
  const filters = parseFiltersFromURL(new URLSearchParams(...));
}
```

### Gotcha 2: Client vs Server Components

**Problem:** "use client" directive needed for hooks

**Solution:**
- Dashboard: Server component (no hooks, async/await ok)
- Filters: Client component (uses `useRouter`, `useSearchParams`)

### Gotcha 3: Filter State Management

**Problem:** How to sync filters with URL

**Solution:** Use Next.js navigation:

```typescript
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push(`/matrix?${newParams.toString()}`);
// Page will re-render with new searchParams
```

### Gotcha 4: Testing Async Components

**Problem:** Server components are async

**Solution:** Await the component in tests:

```typescript
const page = await HomePage(); // Await async component
render(page);
```

### Gotcha 5: Empty Filter Array Logic

**Problem:** Should empty array show all or none?

**Solution:** Empty = show all (no filter applied):

```typescript
const match = filters.departments.length === 0 || 
  filters.departments.includes(project.department);
```

---

## Time Management Tips

### If Ahead of Schedule (rare but possible)

**Minute 150, dashboard + filters done:**
- Add responsive classes (5 min)
- Add ARIA labels (3 min)
- Write accessibility tests (2 min)

### If On Schedule

**Minute 145:** Dashboard complete  
**Minute 157:** Filters complete  
**Minute 160:** Polish complete

### If Behind Schedule

**Minute 152, dashboard not done:**
- Skip filters entirely
- Finish dashboard tests
- Ship what works

**Minute 158, filters broken:**
- Drop filters
- Ensure dashboard works
- Run test suite

**Minute 159:**
- STOP new features
- Fix any test failures
- Ensure build passes

---

## Testing Strategy

### Write Tests As You Go

**After each component:**
1. Create test file (same name + .test.tsx)
2. Write 3 tests: renders, props work, edge case
3. Run `npm test -- <filename>`
4. Fix if red, move on if green

### Test Priorities

**Must Test:**
- Dashboard metric calculations
- Filter logic (pure functions)
- Component rendering

**Nice to Test:**
- Responsive layouts
- Keyboard interactions
- ARIA attributes

### Quick Test Commands

```bash
# Run all tests
npm test

# Run specific file
npm test MetricCard

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage
```

---

## Fallback Plan

### If Time Runs Out

**Priority 1: Dashboard Only**
- Ship 4 metric cards on home page
- Skip filters
- Skip responsive
- Tests: 12 passing
- **Outcome: Acceptable**

**Priority 2: Dashboard + Basic Filters**
- Ship dashboard
- Ship filter UI (even if buggy)
- Skip tests for filters if needed
- **Outcome: Good**

**Priority 3: All Features**
- Ship everything
- Full test coverage
- Responsive + accessible
- **Outcome: Excellent**

### What NOT to Do

❌ Don't modify Phase 3 matrix components  
❌ Don't skip all tests to add features  
❌ Don't break the build  
❌ Don't work past minute 160  
❌ Don't add features without tests

### Decision Rules

**If minute 152:** Drop filters if dashboard not complete  
**If minute 158:** Drop polish if filters not working  
**If minute 159:** Stop features, fix tests  
**If build fails:** Fix it before submitting

---

## Data Reference

### Available from config.json

```json
{
  "taxonomies": {
    "departments": ["Manufacturing", "Supply Chain", "Sales", "After-Sales"],
    "statuses": ["Backlog", "Queued", "Active", "Paused", "Complete"]
  },
  "governance": {
    "phases": ["Foundation", "Acceleration", "Scale"]
  }
}
```

### Seeded Projects

- **PRJ-001:** Manufacturing, Foundation, Active
- **PRJ-002:** Supply Chain, Scale, Queued
- **PRJ-003:** Sales, Acceleration, Backlog
- **PRJ-004:** After-Sales, Foundation, Queued

### Computed Metrics (from seeded data)

- Total Investment: ~$250K
- Active Projects: 1
- Total ROI: ~$600K
- ROI Multiplier: ~2.4x

---

## Success Criteria

### Minimum (Must Achieve)

- [ ] At least 1 feature area complete
- [ ] At least 12 new tests passing
- [ ] Build succeeds
- [ ] Matrix still works

### Target (Should Achieve)

- [ ] Dashboard + Filters complete
- [ ] 26+ new tests passing
- [ ] Build succeeds
- [ ] No regressions

### Stretch (Nice to Achieve)

- [ ] All 3 feature areas
- [ ] 32+ new tests passing
- [ ] Responsive + accessible
- [ ] Manual QA complete

---

## Final Reminders

✅ **Protect Phase 3** - Matrix must keep working  
✅ **Test as you go** - Don't leave testing for the end  
✅ **Keep it simple** - Copy patterns from this doc  
✅ **Watch the clock** - Stop at minute 159  
✅ **Build must pass** - Non-negotiable for submission

🚀 **You've got this!**

All patterns, decisions, and gotchas are documented above. Execute confidently. Ship quality. Make it impressive.

---

**Need Help?**
- Full details: `docs/planning/2026-02-15-phase4-execution-plan.md`
- Component code: See "Quick Reference" section above
- Test examples: See "Pattern 6" above

**Good luck! 🎯**

---

**End of Phase 4 Agent Handoff**

*Document Version: 1.0*  
*Last Updated: 2026-02-15*  
*Ready for Execution*
