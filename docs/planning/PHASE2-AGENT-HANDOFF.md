# Phase 2 Agent Handoff Instructions

**Date:** 2026-02-15  
**Target:** Autonomous Agent Execution  
**Phase:** P2 - Data Pipeline (75-100 min window)  
**Status:** COMPLETED

---

## Quick Start for Agent

### Current State

✅ **Phase 0 (Bootstrap):** Complete
- Next.js 14 app running
- Routes `/` and `/matrix` render
- All dependencies installed

✅ **Phase 1 (Core Logic):** Complete
- 50 unit tests passing
- Types, validation, and governance logic implemented
- Files: `types.ts`, `matrix.ts`, `projectSchema.ts`

✅ **Phase 2 (Data Pipeline):** Complete - 77 tests passing, build succeeds
- **Full plan:** `docs/planning/2026-02-15-phase2-execution-plan.md`
- **Time budget:** 25 minutes
- **Expected output:** 28 new integration tests, all passing

---

## Agent Instructions

### Step 1: Read the Detailed Plan

Open and read completely:
```
docs/planning/2026-02-15-phase2-execution-plan.md
```

This document contains:
- Complete implementation code for all files
- Test specifications
- Exit gate criteria
- Troubleshooting guide

### Step 2: Execute Implementation

Create these files in order:

1. **`src/lib/content/loadProjects.ts`** (8 min)
   - File reading and gray-matter parsing
   - Path utilities

2. **`src/lib/content/loadConfig.ts`** (5 min)
   - Configuration loading
   - Utility functions

3. **`src/lib/content/transformProjects.ts`** (8 min)
   - Transformation pipeline
   - Connects P1 logic to data loading

4. **`tests/integration/content/loadProjects.test.ts`** (5 min)
   - 8 tests for file loading

5. **`tests/integration/content/loadConfig.test.ts`** (3 min)
   - 5 tests for config loading

6. **`tests/integration/content/transformProjects.test.ts`** (7 min)
   - 15 tests for complete pipeline
   - Verifies all 4 quadrants

### Step 3: Validation

Run tests:
```bash
npm run test
```

Expected result:
- **78 passing tests** (50 from P1 + 28 from P2)
- Zero failures

Verify quadrants:
- PRJ-001 → Quick Wins ✅
- PRJ-002 → Big Bets ✅
- PRJ-003 → Fillers ✅
- PRJ-004 → Time Sinks ✅

### Step 4: Build Check

```bash
npm run build
```

Expected result: Successful build with no errors

---

## Exit Gate Checklist

Phase 2 is complete when:

- [ ] All 6 files created and exported correctly
- [ ] 78 total tests passing (50 + 28)
- [ ] All 4 seeded projects map to correct quadrants
- [ ] `loadAndTransformProjects()` function works
- [ ] Build passes without errors

---

## Critical Success Factors

1. **Read the full Phase 2 plan** - Don't guess implementation details
2. **Create files in sequence** - Each builds on the previous
3. **Run tests incrementally** - Catch issues early
4. **Verify quadrants manually** - Core requirement validation

---

## Troubleshooting

If tests fail, check:

1. **Path issues:** Verify `process.cwd()` points to project root
2. **Import errors:** Check tsconfig.json path alias `@/*`
3. **Validation errors:** Compare PRJ-001.md frontmatter to schema
4. **Gray-matter issues:** Verify `---` delimiters in markdown files

Full troubleshooting guide in Phase 2 plan document.

---

## Time Management

| Checkpoint | Time | Action |
|------------|------|--------|
| 5 min | If import errors | Fix tsconfig paths first |
| 15 min | If no tests passing | Review implementation vs plan |
| 20 min | If <50% tests pass | Focus on critical path (loadProjects + transform) |
| 25 min | Should be done | All tests passing |

---

## After Phase 2

Once Phase 2 is complete:

1. Update `JOURNAL.md` with completion status
2. Update `docs/changelog.md` with implemented files
3. Proceed to Phase 3: Matrix UI Core
   - Reference: `docs/planning/2026-02-15-execution-roadmap.md`
   - Time window: 100-135 min

---

## Context for AI Agent

**What you're building:**
A data pipeline that reads markdown project files, validates them, normalizes scores (0-10 → 0-100), assigns quadrants, and prepares data for the matrix UI.

**Why it matters:**
Without this pipeline, the matrix chart has no data to display. This is the bridge between static content files and the React UI.

**What success looks like:**
An agent in Phase 3 can call `loadAndTransformProjects()` and immediately get 4 fully-processed projects with correct quadrant assignments, ready to render in a chart.

**Dependencies:**
- Phase 1 logic functions (normalizeScore, assignQuadrant)
- Phase 1 type definitions (ProcessedProject, RawProjectFrontmatter)
- Seeded data files (PRJ-001 through PRJ-004)

**Constraints:**
- Must use gray-matter for frontmatter parsing
- Must validate with Zod schema from Phase 1
- Must handle file system paths correctly in both dev and build
- Must maintain type safety throughout pipeline

---

*Phase 2 plan ready for agent execution. Good luck!*
