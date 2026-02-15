# Execution Roadmap (Phases + Validation + Files)

Date: 2026-02-15
Status: Approved
Strategy: Assessment-pass-first, TDD-first

## 1) Current Baseline (what is true right now)

- `src/app/` has layout, page.tsx, matrix/page.tsx, globals.css (Next.js App Router).
- `src/lib/` is ready for content loaders, governance, validation modules.
- `_content/projects/` already has 4 seeded projects (`PRJ-001` to `PRJ-004`) covering all matrix quadrants.
- `_content/config.json` contains tenant tokens and taxonomies.
- Project bootstrap complete: package.json, tsconfig, next.config.js, postcss.config.mjs, Tailwind, Vitest. `npm run build` passes. P0 exit gate met: `/` and `/matrix` render.

This roadmap assumes we build the app foundation and the matrix feature in one implementation pass.

## 2) Must-Have Requirements (non-negotiable)

From `README.md` and PRD section 2.1/4.3:

1. Route `/matrix` exists and renders a scatter plot.
2. X axis = effort (complexity), Y axis = impact (strategic value).
3. Scores are normalized from 0-10 to 0-100.
4. Quadrant label is assigned programmatically by PRD boundaries.
5. Tooltip includes project title + quadrant label (plus ROI as approved bonus).

## 3) Phase Timeline (180-minute hard stop)

| Phase                   | Window      | Goal                                                 | Exit Gate                                 |
| ----------------------- | ----------- | ---------------------------------------------------- | ----------------------------------------- |
| P0 - Bootstrap          | 0-25 min    | Project runs locally                                 | `/` and `/matrix` placeholders render |
| P1 - TDD Core Logic     | 25-75 min   | Normalization + quadrant + validation logic complete | Unit tests green                          |
| P2 - Data Pipeline      | 75-100 min  | Markdown -> validated model -> matrix points         | Seeded projects map correctly             |
| P3 - Matrix UI Core     | 100-135 min | Functional chart with tooltip and quadrant zones     | Must-have UI complete                     |
| P4 - Bonus Scope        | 135-160 min | Filters + dashboard cards (if green)                 | No regressions in must-have               |
| P5 - Hardening + Submit | 160-180 min | Build/test pass and PR package                       | Submission-ready evidence                 |

## 4) Phase-by-Phase Plan (with files and validation)

### P0 - Bootstrap (0-25 min) [DONE]

Purpose:

- Create runnable Next.js + TypeScript + Tailwind baseline and testing harness.

Files to create/update:

- `package.json`
- `tsconfig.json`
- `next.config.js` (Next.js 14 does not support .ts)
- `postcss.config.mjs`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/matrix/page.tsx` (placeholder)
- `src/app/globals.css`
- `next-env.d.ts`
- `vitest.config.ts`
- `tests/setup.ts`

Commands/validation:

- `npm install`
- `npm run dev`
- Manual: `/` loads, `/matrix` loads placeholder, no crash

Exit gate:

- App starts successfully and both routes render.

Fallback if blocked:

- Remove non-critical style setup and keep minimal CSS until matrix works.

---

### P1 - TDD Core Logic (25-75 min)

**Detailed Plan:** See `docs/planning/2026-02-15-phase1-execution-plan.md` for the full agent-ready implementation guide.

Purpose:

- Build deterministic governance logic first (test-first), before UI wiring.

Files to create/update:

- `src/lib/types.ts`
- `src/lib/governance/matrix.ts`
- `src/lib/validation/projectSchema.ts`
- `tests/unit/governance/matrix.normalize.test.ts`
- `tests/unit/governance/matrix.quadrant.test.ts`
- `tests/unit/validation/projectSchema.test.ts`

TDD cycle:

1. Write failing tests for `normalizeScore`.
2. Implement `normalizeScore` with clamp strategy (0-10) and normalize to 0-100.
3. Write failing tests for `assignQuadrant` boundary cases at 50.
4. Implement `assignQuadrant` with PRD rules.
5. Write failing schema validation tests.
6. Implement Zod schema for frontmatter.

Commands/validation:

- `npm run test:unit`
- Required assertions:
  - `normalizeScore(0) -> 0`, `normalizeScore(10) -> 100`
  - clamp behavior for out-of-range input
  - `(50,49)=Quick Wins`, `(50,50)=Big Bets`, `(49,49)=Fillers`, `(49,50)=Time Sinks`

Exit gate:

- Core logic tests pass and logic matches PRD table exactly.

Fallback if blocked:

- Freeze schema strictness to required fields first, postpone taxonomy refinements.

---

### P2 - Data Pipeline (75-100 min) [DONE]

**Detailed Plan:** See `docs/planning/2026-02-15-phase2-execution-plan.md` for the full agent-ready implementation guide.

Purpose:

- Connect markdown source to matrix-ready data model.

Files to create/update:

- `src/lib/content/loadProjects.ts` (file reading + gray-matter parsing)
- `src/lib/content/loadConfig.ts` (tenant configuration loader)
- `src/lib/content/transformProjects.ts` (validation + normalization pipeline)
- `tests/integration/content/loadProjects.test.ts` (8 tests)
- `tests/integration/content/loadConfig.test.ts` (5 tests)
- `tests/integration/content/transformProjects.test.ts` (15 tests)

Implementation notes:

- Parse frontmatter with `gray-matter`.
- Validate each project with Zod schema from P1.
- Apply normalization and quadrant assignment using P1 functions.
- Produce ProcessedProject[] with matrix-ready fields.
- 28 new integration tests covering complete data pipeline.

Commands/validation:

- `npm run test` (should show 78 passing tests: 50 from P1 + 28 from P2)
- Manual data spot-check from seeded data:
  - PRJ-001 (8.6, 3.2) → Quick Wins (86, 32) ✅
  - PRJ-002 (9.1, 8.2) → Big Bets (91, 82) ✅
  - PRJ-003 (3.9, 2.8) → Fillers (39, 28) ✅
  - PRJ-004 (4.1, 8.7) → Time Sinks (41, 87) ✅

Exit gate:

- End-to-end data transform is stable for all seeded projects.

Fallback if blocked:

- Log and skip invalid file in dev mode, continue with valid dataset.

---

### P3 - Matrix UI Core (100-135 min)

Purpose:

- Deliver the pass/fail feature at `/matrix`.

Files to create/update:

- `src/app/matrix/page.tsx`
- `src/components/matrix/StrategyMatrix.tsx`
- `src/components/matrix/MatrixTooltip.tsx`
- `src/components/matrix/QuadrantOverlay.tsx`
- `tests/integration/matrix/matrix-page.integration.test.tsx`

Implementation notes:

- Use Recharts ScatterChart.
- Axis mapping: `x = effortNormalized`, `y = impactNormalized`.
- Add quadrant visuals/labels and central split at 50.
- Tooltip must include: title + quadrant label (and ROI).

Commands/validation:

- `npm run dev` and manual interaction test on `/matrix`
- Checklist:
  - chart renders
  - 4 points visible
  - tooltip content correct
  - quadrant position correctness matches PRD rules

Exit gate:

- All must-have UI behavior is complete and verified.

Fallback if blocked:

- Keep chart simple (no animation), prioritize correctness and tooltip fields.

---

### P4 - Bonus Scope (135-160 min)

Purpose:

- Add high-value polish only after must-have is green.

Priority order:

1. Department + phase filters.
2. Dashboard metric cards (`Total Investment`, `Active Count`) on `/`.
3. Responsive and accessibility pass for matrix page.

Files to create/update:

- `src/components/matrix/MatrixFilters.tsx`
- `src/lib/filters/applyMatrixFilters.ts`
- `src/app/page.tsx`
- `tests/unit/filters/applyMatrixFilters.test.ts`

Commands/validation:

- Filter toggles update visible data points correctly.
- Dashboard metrics match transformed dataset totals.
- Mobile viewport spot-check for layout breakage.

Exit gate:

- At least one bonus feature completed with no must-have regressions.

Fallback if blocked:

- Drop dashboard first, keep filters if stable.

---

### P5 - Hardening + Submission (160-180 min)

Purpose:

- Final correctness pass and submission packaging.

Files to create/update:

- `docs/planning/2026-02-15-submission-plan.md` (checklist tick-off)
- `README.md` (optional short run instructions if needed)

Commands/validation:

- `npm run test`
- `npm run build`
- Manual QA final checklist:
  - `/matrix` loads
  - axes are correct
  - normalization and quadrants are correct
  - tooltip has required fields
  - no blocking console/runtime errors

Exit gate:

- Ready-to-submit branch with clear PR summary.

Fallback if blocked:

- Remove non-essential polish and submit must-have complete implementation.

## 5) Validation Matrix by Requirement

| Requirement             | Automated Validation               | Manual Validation                      | Gate  |
| ----------------------- | ---------------------------------- | -------------------------------------- | ----- |
| Normalize 0-10 -> 0-100 | Unit tests (`normalizeScore`)    | Spot-check tooltips/points             | P1    |
| Quadrant rules          | Unit tests (`assignQuadrant`)    | Confirm seeded project placement       | P1/P2 |
| Matrix route and chart  | Integration/UI test + dev run      | Open `/matrix` and inspect chart     | P3    |
| Correct axes mapping    | Integration assertion on data keys | Visual axis labels and point positions | P3    |
| Tooltip required fields | Integration/UI test text assertion | Hover each point                       | P3    |
| Bonus filters           | Unit + interaction tests           | Toggle and observe result              | P4    |

## 6) Go/No-Go Rules

- If P3 is not complete by minute 135, stop all bonus work.
- If tests are unstable by minute 170, keep only deterministic core tests and document manual checks.
- Last 10-15 minutes are submission-only; no new features.

## 7) Definition of Done

- Must-have section in README is fully satisfied.
- PRD quadrant logic is implemented exactly.
- Transformation logic is separate from UI.
- TDD used for core logic (`normalizeScore`, `assignQuadrant`, schema/loader path).
- Submission checklist completed with honest notes on any deferred items.
