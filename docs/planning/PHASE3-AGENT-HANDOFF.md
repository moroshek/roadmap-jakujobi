# Phase 3 Agent Handoff: Matrix UI Core

**Date:** 2026-02-15  
**Status:** Ready for Execution  
**Agent Task:** Implement the Strategy Matrix UI (critical pass/fail requirement)  
**Detailed Plan:** `docs/planning/2026-02-15-phase3-execution-plan.md`  
**Time Budget:** 35 minutes (100-135 min window)

---

## Quick Context

You are implementing **Phase 3** of the Roadmap Engine assessment. This is the **automatic-fail requirement** mentioned in the README:

> "You must implement the Strategy Matrix Component. IF THIS COMPONENT IS BROKEN OR MISSING, THE ASSESSMENT IS AN AUTOMATIC FAIL."

### What's Already Complete

✅ **P0 - Bootstrap (DONE):**
- Next.js 14 app structure
- Tailwind CSS configured
- Vitest + React Testing Library setup
- Routes `/` and `/matrix` (matrix is placeholder)

✅ **P1 - TDD Core Logic (DONE):**
- `src/lib/types.ts` - Type system
- `src/lib/governance/matrix.ts` - `normalizeScore()`, `assignQuadrant()`
- `src/lib/validation/projectSchema.ts` - Zod schema
- 50 passing unit tests with full edge case coverage

✅ **P2 - Data Pipeline (DONE):**
- `src/lib/content/loadProjects.ts` - Markdown file reader
- `src/lib/content/loadConfig.ts` - Config loader
- `src/lib/content/transformProjects.ts` - Validation + transformation
- 27 passing integration tests
- **Total: 77 tests passing, ~90% coverage**

✅ **Seeded Data (4 projects):**
- `_content/projects/PRJ-001.md` → Quick Wins (86, 32)
- `_content/projects/PRJ-002.md` → Big Bets (91, 82)
- `_content/projects/PRJ-003.md` → Fillers (39, 28)
- `_content/projects/PRJ-004.md` → Time Sinks (41, 87)

---

## Your Mission

Build a fully functional, interactive Strategy Matrix at `/matrix` route that:

### Must-Have Features (Non-negotiable)

1. **Scatter plot** using Recharts with proper axes (X=Effort 0-100, Y=Impact 0-100)
2. **All 4 projects** render as points in correct quadrants
3. **Quadrant zones** visible with labels (Quick Wins, Big Bets, Fillers, Time Sinks)
4. **Tooltip** on hover showing: project title + quadrant + ROI
5. **Interactive:** Click to open modal with full project details
6. **Loading states:** Skeleton/spinner during data load
7. **Error handling:** Error message if data load fails, empty state if no projects
8. **Responsive:** Works on mobile (320px+) and desktop
9. **Accessible:** WCAG 2.1 AA (keyboard nav, ARIA labels, screen reader support)
10. **Tested:** 36+ automated tests (unit + integration)

### Architecture Decisions (From Brainstorming)

| Decision | Choice | Why |
|----------|--------|-----|
| Chart Library | Recharts | Already installed, React-friendly |
| Component Structure | Modular (separate components) | Easier testing, clean separation |
| State Management | React Context | Share state without prop drilling |
| Styling | Tailwind CSS | Already configured |
| Tooltip | Recharts built-in + custom modal | No extra deps |
| Data Flow | `useProjects()` hook → P2 pipeline | Testable, clean |
| Colors | Brand-based with semantic hints | Use config.json colors |
| Testing | Unit (must) + Integration (automated) | Max coverage |

---

## File Structure to Create

```
src/
├── lib/
│   └── hooks/
│       └── useProjects.ts                 # Data fetching hook
├── contexts/
│   └── MatrixContext.tsx                  # State management
├── components/
│   └── matrix/
│       ├── MatrixChart.tsx                # Main scatter chart
│       ├── MatrixChart.test.tsx           # Unit tests
│       ├── QuadrantOverlay.tsx            # Background zones
│       ├── QuadrantOverlay.test.tsx       # Unit tests
│       ├── MatrixTooltip.tsx              # Hover tooltip
│       ├── MatrixTooltip.test.tsx         # Unit tests
│       ├── ProjectModal.tsx               # Click-to-expand modal
│       └── ProjectModal.test.tsx          # Unit tests
└── app/
    └── matrix/
        └── page.tsx                       # Main page (replace placeholder)

tests/
└── integration/
    └── matrix/
        └── matrix-page.integration.test.tsx  # E2E test
```

**Total:** 12 new files

---

## Implementation Sequence

Follow this order for smooth progress:

### 1. Foundation (5 min)
- Create `useProjects.ts` hook (connects to P2 `loadAndTransformProjects`)
- Create `MatrixContext.tsx` (manages selected/hovered state)

### 2. Core Components (18 min)
- Build `MatrixChart.tsx` (Recharts scatter with click handlers)
- Build `QuadrantOverlay.tsx` (CSS/SVG background zones)
- Build `MatrixTooltip.tsx` (formatted hover display)
- Build `ProjectModal.tsx` (full detail overlay)

### 3. Page Integration (5 min)
- Update `src/app/matrix/page.tsx` (orchestrate all components)
- Add loading skeleton, error display, empty state

### 4. Testing (12 min)
- Write unit tests for each component (6 test files)
- Write integration test for full page flow
- Run `npm run test` and `npm run test:coverage`

---

## Quick Reference: Key Code Patterns

### Data Hook Pattern

```typescript
// src/lib/hooks/useProjects.ts
export function useProjects() {
  const [projects, setProjects] = useState<ProcessedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const result = loadAndTransformProjects({ skipInvalid: true });
    setProjects(result.valid);
    setLoading(false);
  }, []);

  return { projects, loading, error };
}
```

### Chart Component Pattern

```typescript
// src/components/matrix/MatrixChart.tsx
<ScatterChart>
  <XAxis 
    dataKey="x" 
    domain={[0, 100]} 
    label="Effort / Complexity →" 
  />
  <YAxis 
    dataKey="y" 
    domain={[0, 100]} 
    label="↑ Impact / Strategic Value" 
  />
  <Scatter 
    data={chartData} 
    onClick={handleClick}
  />
</ScatterChart>
```

### Context Pattern

```typescript
// src/contexts/MatrixContext.tsx
const MatrixContext = createContext<{
  selectedProject: ProcessedProject | null;
  setSelectedProject: (p: ProcessedProject | null) => void;
}>();

export function useMatrix() {
  return useContext(MatrixContext);
}
```

---

## Validation Checklist

Before marking P3 complete, verify:

- [ ] `npm run test` passes (target: 113+ tests)
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run dev` → navigate to `/matrix` → chart renders
- [ ] All 4 points visible in correct quadrants:
  - PRJ-001 in top-left (Quick Wins)
  - PRJ-002 in top-right (Big Bets)
  - PRJ-003 in bottom-left (Fillers)
  - PRJ-004 in bottom-right (Time Sinks)
- [ ] Hover any point → tooltip shows title + quadrant + formatted ROI
- [ ] Click any point → modal opens with full project details
- [ ] Press Escape → modal closes
- [ ] Mobile check: Resize browser to 320px width → layout works
- [ ] Keyboard check: Tab to focus elements, Enter/Space to activate
- [ ] No console errors in browser devtools

---

## Common Gotchas

### 1. Recharts in Tests
Recharts doesn't render properly in jsdom (Vitest environment). **Solution:** Mock Recharts components in unit tests, use real chart in integration tests.

```typescript
// In test files
vi.mock('recharts', () => ({
  ScatterChart: ({ children }: any) => <div data-testid="scatter-chart">{children}</div>,
  // ... mock other components
}));
```

### 2. Client Components
All interactive components must have `'use client'` directive at the top. **Without it, you'll get hydration errors.**

```typescript
'use client';

import React from 'react';
// ... rest of component
```

### 3. Quadrant Boundaries
PRD specifies boundaries **at 50, not greater than 50**. Use `>=` and `<` operators:

```typescript
// CORRECT (already implemented in P1)
if (impact >= 50 && effort < 50) return 'Quick Wins';
if (impact >= 50 && effort >= 50) return 'Big Bets';
if (impact < 50 && effort < 50) return 'Fillers';
if (impact < 50 && effort >= 50) return 'Time Sinks';
```

### 4. Modal Accessibility
Remember to:
- Trap focus inside modal (or at minimum handle Escape key)
- Prevent body scroll when modal open
- Restore focus when modal closes
- Add `aria-modal="true"` and `role="dialog"`

### 5. Empty State Logic
If `_content/projects/` is empty or malformed files exist, show friendly empty state. The `transformProjects` function already handles this—use `result.valid` for display.

---

## Time Management

| Time Spent | Checkpoint |
|------------|------------|
| 10 min | Foundation + Chart component done |
| 20 min | All components built |
| 25 min | Page integration complete |
| 32 min | Tests written and passing |
| 35 min | Manual QA complete, P3 done |

**If you hit minute 30 and tests aren't passing:** Pause testing, ensure manual validation works, then debug tests.

**If you hit minute 33 and still have issues:** Consider fallback (see below).

---

## Fallback Plan (If Time-Constrained)

If reaching minute 130 without full completion, **prioritize in this order:**

1. ✅ **Keep:** Basic chart rendering (no click, just tooltip)
2. ✅ **Keep:** Correct axes and quadrant zones
3. ✅ **Keep:** Tooltip with required fields
4. ✅ **Keep:** Unit tests for chart + tooltip
5. ⚠️ **Drop:** Click-to-modal interaction
6. ⚠️ **Drop:** Integration test
7. ⚠️ **Drop:** Animations

**Absolute minimum for pass:** Chart renders, points in correct quadrants, tooltip shows title + quadrant + ROI.

---

## Resources

### Documentation to Reference

- **Phase 3 Detailed Plan:** `docs/planning/2026-02-15-phase3-execution-plan.md` (full implementation guide with code samples)
- **Execution Roadmap:** `docs/planning/2026-02-15-execution-roadmap.md` (overall timeline)
- **PRD Section 4.3:** `/Roadmap Engine PRD.md` (matrix requirements)
- **PRD Section 2.1:** `/Roadmap Engine PRD.md` (quadrant logic table)
- **Phase 1 Review:** `docs/planning/2026-02-15-phase1-review.md` (P1 validation)
- **Phase 2 Review:** `docs/planning/2026-02-15-phase2-review.md` (P2 validation)

### Key Dependencies (Already Installed)

```json
{
  "recharts": "^2.x",          // Chart library
  "react": "^18.x",            // Framework
  "tailwindcss": "^3.x",       // Styling
  "gray-matter": "^4.x",       // Markdown parsing (P2)
  "zod": "^3.x"                // Validation (P1)
}
```

### Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Testing
npm run test             # Run all tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report

# Build
npm run build            # Production build (must pass)
npm run start            # Serve production build
```

---

## Success Criteria

### Definition of Done

- [ ] Matrix page loads without error
- [ ] Chart displays with correct structure (axes, grid, points)
- [ ] All 4 seeded projects visible in correct quadrants
- [ ] Tooltip appears on hover with required data
- [ ] Click interaction works (modal or tooltip)
- [ ] Loading state displays during data fetch
- [ ] Error state handles failed loads gracefully
- [ ] Empty state shows helpful message
- [ ] Responsive on mobile (320px+)
- [ ] Keyboard accessible (Tab, Enter, Escape work)
- [ ] 36+ new tests passing
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser

### How to Know You're Done

Run this validation sequence:

```bash
# 1. Tests pass
npm run test
# Expected: 113+ tests passing (77 existing + 36+ new)

# 2. Build succeeds
npm run build
# Expected: Build complete, no errors

# 3. Manual check
npm run dev
# Navigate to http://localhost:3000/matrix
# Verify all checklist items above
```

**If all checks pass, Phase 3 is complete.** 🎉

---

## Next Steps After P3

Once Phase 3 is validated and complete:

1. ✅ Mark P3 as done in JOURNAL.md
2. ✅ Commit changes with message: "feat: Phase 3 - Matrix UI Core complete"
3. ✅ Update Phase 3 review document (or create one similar to Phase 1/2 reviews)
4. 🚀 Proceed to **Phase 4 - Bonus Features** (filters, dashboard cards, polish)

---

## Questions During Implementation?

If you encounter ambiguity or edge cases not covered:

1. **First:** Check `docs/planning/2026-02-15-phase3-execution-plan.md` (extensive detail with code examples)
2. **Second:** Check PRD Section 4.3 for UI specifications
3. **Third:** Look at Phase 1 (`src/lib/governance/matrix.ts`) for quadrant logic
4. **Fourth:** Check Phase 2 (`src/lib/content/transformProjects.ts`) for data structure
5. **Last resort:** Make reasonable assumption based on existing patterns and document decision

---

## Key Insight

**This phase connects everything:** P1 logic + P2 data → P3 UI.

You're not building from scratch—you're **assembling pieces that already work** and adding the visual layer. The hard logic is done. Focus on:
- Clean component architecture
- Proper data flow (hook → context → components)
- Comprehensive testing
- Excellent UX (loading, errors, interactions)

**You've got this!** 💪

---

**End of Handoff Document**

**Status:** ✅ Ready  
**Detailed Plan:** `docs/planning/2026-02-15-phase3-execution-plan.md`  
**Contact:** See project JOURNAL.md for decisions log
