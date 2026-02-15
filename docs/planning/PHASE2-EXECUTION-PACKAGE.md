# Complete Phase 2 Execution Package

**Date:** 2026-02-15  
**Purpose:** Complete implementation plan for Phase 2 Data Pipeline  
**Status:** Ready for Agent Execution  

---

## Executive Summary

This package contains everything needed to execute Phase 2 of the Roadmap Engine project. Phase 2 builds the data pipeline that connects markdown content files to the application layer.

**Current Status:**
- ✅ Phase 0 (Bootstrap): Complete
- ✅ Phase 1 (Core Logic): Complete - 50 tests passing
- ✅ Phase 2 (Data Pipeline): **Complete** - 77 tests passing
- ⏳ Phase 3 (Matrix UI): Pending Phase 2
- ⏳ Phase 4 (Bonus): Pending Phase 3
- ⏳ Phase 5 (Submission): Pending Phase 4

---

## What Phase 2 Delivers

### Functional Deliverables

1. **Content Loaders**
   - Read markdown files from `_content/projects/`
   - Parse frontmatter with gray-matter
   - Load tenant configuration from `config.json`

2. **Transformation Pipeline**
   - Validate projects with Zod schema
   - Normalize scores (0-10 → 0-100)
   - Assign quadrants (Quick Wins, Big Bets, Fillers, Time Sinks)
   - Convert to ProcessedProject type

3. **Integration Tests**
   - 28 new tests covering complete data flow
   - Verification of all 4 seeded projects
   - End-to-end pipeline validation

### Technical Deliverables

**New Files Created:**
```
src/lib/content/
  ├── loadProjects.ts      (file system + parsing)
  ├── loadConfig.ts        (configuration loading)
  └── transformProjects.ts (validation + transformation)

tests/integration/content/
  ├── loadProjects.test.ts         (8 tests)
  ├── loadConfig.test.ts           (5 tests)
  └── transformProjects.test.ts    (15 tests)
```

**Test Coverage:**
- Phase 1: 50 unit tests ✅
- Phase 2: 28 integration tests 🎯
- **Total: 78 tests**

---

## Document Index

### Primary Documents (Read in Order)

1. **Phase 2 Agent Handoff** ⭐ START HERE
   - File: `docs/planning/PHASE2-AGENT-HANDOFF.md`
   - Purpose: Quick start guide for agents
   - Read time: 3 minutes

2. **Phase 2 Detailed Execution Plan** ⭐ MAIN REFERENCE
   - File: `docs/planning/2026-02-15-phase2-execution-plan.md`
   - Purpose: Complete implementation specifications
   - Read time: 15 minutes
   - Contains: Full code, tests, troubleshooting

3. **Execution Roadmap** (Context)
   - File: `docs/planning/2026-02-15-execution-roadmap.md`
   - Purpose: Overall phase structure
   - Section: P2 (lines 150-200)

### Supporting Documents

4. **Data Contract Plan**
   - File: `docs/planning/2026-02-15-data-contract-plan.md`
   - Purpose: Schema definitions and transformation rules
   - Reference: When implementing validation

5. **Architecture Plan**
   - File: `docs/planning/2026-02-15-architecture-plan.md`
   - Purpose: System structure and data flow
   - Reference: When understanding component relationships

6. **PRD (Product Requirements)**
   - File: `Roadmap Engine PRD.md`
   - Purpose: Source of truth for business logic
   - Reference: Section 3.2 (Project Entity schema)

---

## Pre-Execution Checklist

Before starting Phase 2, verify:

### Environment Status

```bash
# 1. Check you're in the right directory
pwd
# Expected: P:\repos\hiring\roadmap-jakujobi

# 2. Verify Phase 1 is complete
npm run test
# Expected: 50 tests passing

# 3. Check dependencies installed
npm list gray-matter zod
# Expected: Both packages present

# 4. Verify content files exist
ls _content/projects/
# Expected: PRJ-001.md, PRJ-002.md, PRJ-003.md, PRJ-004.md

# 5. Check TypeScript compiles
npx tsc --noEmit
# Expected: No errors
```

### File System Verification

Required files from Phase 1:
- ✅ `src/lib/types.ts`
- ✅ `src/lib/governance/matrix.ts`
- ✅ `src/lib/validation/projectSchema.ts`

Required content files:
- ✅ `_content/config.json`
- ✅ `_content/projects/PRJ-001.md`
- ✅ `_content/projects/PRJ-002.md`
- ✅ `_content/projects/PRJ-003.md`
- ✅ `_content/projects/PRJ-004.md`

---

## Execution Workflow

### Phase 2 Steps (25 minutes)

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Create Content Loaders (13 min)                    │
├─────────────────────────────────────────────────────────────┤
│ • loadProjects.ts    (8 min)                                │
│ • loadConfig.ts      (5 min)                                │
│                                                             │
│ Checkpoint: Files export correctly, no TypeScript errors    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Create Transformation Pipeline (8 min)             │
├─────────────────────────────────────────────────────────────┤
│ • transformProjects.ts (8 min)                              │
│                                                             │
│ Checkpoint: Imports P1 functions, types compile            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Create Integration Tests (15 min)                  │
├─────────────────────────────────────────────────────────────┤
│ • loadProjects.test.ts      (5 min, 8 tests)                │
│ • loadConfig.test.ts        (3 min, 5 tests)                │
│ • transformProjects.test.ts (7 min, 15 tests)               │
│                                                             │
│ Checkpoint: 28 tests created                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Run Tests & Verify (4 min)                         │
├─────────────────────────────────────────────────────────────┤
│ • npm run test                                              │
│ • Verify 78 total tests pass                               │
│ • Check quadrant assignments                               │
│                                                             │
│ Checkpoint: All tests green                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ ✅ Phase 2 Complete                                         │
│ Ready for Phase 3 (Matrix UI)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Expected Test Results

### After Phase 2 Completion

```bash
npm run test
```

**Expected Output:**
```
✓ tests/unit/governance/matrix.normalize.test.ts (11 tests)
✓ tests/unit/governance/matrix.quadrant.test.ts (17 tests)
✓ tests/unit/validation/projectSchema.test.ts (22 tests)
✓ tests/integration/content/loadProjects.test.ts (8 tests)      ← NEW
✓ tests/integration/content/loadConfig.test.ts (5 tests)        ← NEW
✓ tests/integration/content/transformProjects.test.ts (15 tests) ← NEW

Test Files  6 passed (6)
     Tests  78 passed (78)
  Duration  <3s
```

### Manual Verification

Test the pipeline manually:

```typescript
// In Node REPL or test file
import { loadAndTransformProjects } from '@/lib/content/transformProjects';

const result = loadAndTransformProjects();

console.log(result.stats);
// Expected: { total: 4, successful: 4, failed: 0 }

console.log(result.projects.map(p => ({
  id: p.id,
  quadrant: p.matrix.quadrant,
  scores: [p.matrix.effortNormalized, p.matrix.impactNormalized]
})));
// Expected:
// [
//   { id: 'PRJ-001', quadrant: 'Quick Wins', scores: [32, 86] },
//   { id: 'PRJ-002', quadrant: 'Big Bets', scores: [82, 91] },
//   { id: 'PRJ-003', quadrant: 'Fillers', scores: [28, 39] },
//   { id: 'PRJ-004', quadrant: 'Time Sinks', scores: [87, 41] }
// ]
```

---

## Success Criteria

Phase 2 is **DONE** when all criteria are met:

### Functional Criteria
- [ ] Can read all 4 markdown files from `_content/projects/`
- [ ] Gray-matter correctly parses frontmatter
- [ ] Zod validation passes for all 4 projects
- [ ] Scores normalized correctly (0-10 → 0-100)
- [ ] Quadrants assigned correctly:
  - [ ] PRJ-001: Quick Wins ✅
  - [ ] PRJ-002: Big Bets ✅
  - [ ] PRJ-003: Fillers ✅
  - [ ] PRJ-004: Time Sinks ✅
- [ ] `loadAndTransformProjects()` returns valid ProcessedProject[]

### Technical Criteria
- [ ] All 28 integration tests pass
- [ ] Combined with P1: 78 total tests passing
- [ ] Zero TypeScript compilation errors
- [ ] `npm run build` succeeds
- [ ] No runtime errors in test output

### Code Quality Criteria
- [ ] All functions have JSDoc comments
- [ ] Error handling is comprehensive
- [ ] Path resolution works correctly
- [ ] No hardcoded paths
- [ ] Exports are properly typed

---

## Common Pitfalls & Solutions

### Pitfall 1: "Module not found" errors

**Symptom:**
```
Error: Cannot find module '@/lib/content/loadProjects'
```

**Solution:**
- Verify tsconfig.json has `"@/*": ["./src/*"]` in paths
- Restart TypeScript server: Cmd+Shift+P → "Restart TS Server"
- Check file has `export` keyword

### Pitfall 2: Wrong quadrant assignments

**Symptom:** Tests fail, quadrants don't match expected

**Root causes:**
1. Normalization formula wrong (should be `value * 10`)
2. Boundary logic wrong (should be `>= 50` for high)
3. Axis mapping confused (X=effort, Y=impact)

**Solution:**
```typescript
// Verify normalization
const score = 8.6;
const normalized = normalizeScore(score);
console.log(normalized); // Should be 86

// Verify quadrant
const quadrant = assignQuadrant(32, 86); // effort=32, impact=86
console.log(quadrant); // Should be "Quick Wins"
```

### Pitfall 3: Path resolution fails

**Symptom:**
```
Error: Projects directory not found
```

**Solution:**
```typescript
// Debug paths
console.log('CWD:', process.cwd());
console.log('Expected:', 'P:\\repos\\hiring\\roadmap-jakujobi');

// Verify content directory exists
import fs from 'fs';
console.log(fs.existsSync('_content/projects')); // Should be true
```

### Pitfall 4: Date parsing errors

**Symptom:** Invalid Date objects

**Solution:**
- Ensure dates in frontmatter are ISO 8601 format: `"2026-02-01"`
- Use `new Date(dateString)` consistently
- Validate with `date instanceof Date && !isNaN(date.getTime())`

---

## After Phase 2: Next Steps

Once Phase 2 is complete and all tests pass:

### 1. Update Documentation

```bash
# Update changelog
# Add entry documenting P2 completion

# Update JOURNAL.md
# Note Phase 2 complete, ready for Phase 3
```

### 2. Commit Work

```bash
git add src/lib/content/ tests/integration/content/
git commit -m "feat(phase2): implement data pipeline

- Add content loaders for markdown projects and config
- Add transformation pipeline with validation
- Add 28 integration tests
- All 4 seeded projects map to correct quadrants
- 78 total tests passing"
```

### 3. Prepare for Phase 3

Phase 3 will build the Matrix UI (100-135 min):

**What Phase 3 needs from Phase 2:**
- `loadAndTransformProjects()` function working
- ProcessedProject type with matrix.* fields
- All 4 projects returning with correct quadrants

**Phase 3 will create:**
- `/matrix` page implementation
- StrategyMatrix React component
- Recharts scatter plot
- Tooltip with project details
- Quadrant overlays

**Reference for Phase 3:**
- `docs/planning/2026-02-15-execution-roadmap.md` (P3 section)
- `docs/planning/2026-02-15-ui-delivery-plan.md`

---

## Validation Checklist

Use this checklist to verify Phase 2 completion:

### Code Implementation
- [ ] `src/lib/content/loadProjects.ts` exists and exports functions
- [ ] `src/lib/content/loadConfig.ts` exists and exports functions
- [ ] `src/lib/content/transformProjects.ts` exists and exports functions
- [ ] All functions have TypeScript types
- [ ] All functions have JSDoc comments

### Test Implementation
- [ ] `tests/integration/content/loadProjects.test.ts` has 8 tests
- [ ] `tests/integration/content/loadConfig.test.ts` has 5 tests
- [ ] `tests/integration/content/transformProjects.test.ts` has 15 tests
- [ ] All 28 tests pass individually
- [ ] All 78 tests pass together (50 from P1 + 28 from P2)

### Functional Verification
- [ ] Can load PRJ-001 and get correct data
- [ ] Can load PRJ-002 and get correct data
- [ ] Can load PRJ-003 and get correct data
- [ ] Can load PRJ-004 and get correct data
- [ ] PRJ-001 maps to Quick Wins (86, 32)
- [ ] PRJ-002 maps to Big Bets (91, 82)
- [ ] PRJ-003 maps to Fillers (39, 28)
- [ ] PRJ-004 maps to Time Sinks (41, 87)

### Build & Quality
- [ ] `npm run test` shows 78 passing tests
- [ ] `npm run build` completes successfully
- [ ] `npx tsc --noEmit` shows no errors
- [ ] No console errors during test runs
- [ ] Git status is clean (all files committed)

---

## Time Tracking

| Activity | Planned | Actual | Notes |
|----------|---------|--------|-------|
| Read Phase 2 plan | 15 min | | Full understanding |
| Create loadProjects.ts | 8 min | | File loading |
| Create loadConfig.ts | 5 min | | Config loading |
| Create transformProjects.ts | 8 min | | Pipeline |
| Write integration tests | 15 min | | All 28 tests |
| Run and debug tests | 5 min | | Validation |
| **Total** | **56 min** | | Within 75-100 window |

*Actual time may vary. Plan has buffer built in.*

---

## Contact & Support

If blocked during execution:

1. **Check the troubleshooting guide** in Phase 2 execution plan
2. **Review the data contract plan** for schema details
3. **Compare against seeded projects** in `_content/projects/`
4. **Verify Phase 1 exports** are available and typed correctly

**Critical files for reference:**
- PRD: `Roadmap Engine PRD.md` (Section 3.2)
- Types: `src/lib/types.ts` (RawProjectFrontmatter, ProcessedProject)
- Governance: `src/lib/governance/matrix.ts` (normalizeScore, assignQuadrant)
- Schema: `src/lib/validation/projectSchema.ts` (ProjectSchema)

---

## Summary

**Phase 2 Goal:** Connect markdown files → validated data → matrix-ready projects

**Time Budget:** 25-40 minutes (within 75-100 min window)

**Deliverables:**
- 3 new implementation files
- 3 new test files
- 28 passing integration tests
- 4 verified project transformations

**Exit Condition:** Call `loadAndTransformProjects()` and get 4 correct quadrants

**Next Phase:** Phase 3 - Matrix UI (requires Phase 2 complete)

---

*Phase 2 execution package complete. Ready for agent execution.*
