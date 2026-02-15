# Timebox Plan

**Date:** 2026-02-15  
**Status:** Approved  
**Total Budget:** 180 minutes (3 hours)  
**Philosophy:** Assessment-pass-first with hard cutoffs

---

## Phase Overview

| Phase               | Time        | Cumulative  | Focus                          |
| ------------------- | ----------- | ----------- | ------------------------------ |
| Phase 1: Foundation | 0-30 min    | 0-30 min    | Setup & infrastructure         |
| Phase 2: Core Logic | 30-60 min   | 30-60 min   | Transform & validation         |
| Phase 3: Matrix UI  | 60-110 min  | 60-110 min  | Scatter plot + tooltips        |
| Phase 4: Polish     | 110-140 min | 110-140 min | Filters, dashboard, responsive |
| Phase 5: Testing    | 140-165 min | 140-165 min | Unit tests + QA                |
| Phase 6: Submission | 165-180 min | 165-180 min | PR + cleanup                   |

---

## Detailed Breakdown

### Phase 1: Foundation (0-30 min)

| Time      | Task                                         | Expected Outcome               | Blocker Check                     |
| --------- | -------------------------------------------- | ------------------------------ | --------------------------------- |
| 0-5 min   | Run `npm install` to verify dependencies     | All deps installed             | If fail, escalate immediately     |
| 5-10 min  | Configure TypeScript, Next.js, Tailwind      | Project builds                 | If fail, revert to minimal config |
| 10-15 min | Create basic app structure (layout, routing) | `/` and `/matrix` routes exist | -                                 |
| 15-20 min | Set up gray-matter parser                    | Can read project markdown      | -                                 |
| 20-25 min | Create base types in `src/lib/types.ts`      | Types compiled                 | -                                 |
| 25-30 min | Verify empty matrix page renders             | Page loads without crash       | If fail, fix before proceeding    |

**Checkpoint:** At 30 min, must have basic app running

---

### Phase 2: Core Logic (30-60 min)

| Time      | Task                                      | Expected Outcome                 | Blocker Check            |
| --------- | ----------------------------------------- | -------------------------------- | ------------------------ |
| 30-35 min | Write `normalizeScore()` unit tests first | Tests fail (no implementation)   | -                        |
| 35-40 min | Implement `normalizeScore()` in matrix.ts | Tests pass                       | -                        |
| 40-45 min | Write `assignQuadrant()` unit tests first | Tests fail                       | -                        |
| 45-50 min | Implement `assignQuadrant()` in matrix.ts | Tests pass                       | -                        |
| 50-55 min | Create Zod schema validation              | Schema validates seeded projects | -                        |
| 55-60 min | Integrate parser + validation + transform | Data pipeline working            | Must have processed data |

**Checkpoint:** At 60 min, logic pipeline complete, tests green

---

### Phase 3: Matrix UI (60-110 min)

| Time        | Task                              | Expected Outcome                     | Blocker Check          |
| ----------- | --------------------------------- | ------------------------------------ | ---------------------- |
| 60-70 min   | Build basic Recharts scatter plot | Chart renders with data              | Must have correct axes |
| 70-80 min   | Add quadrant background zones     | Visual quadrants visible             | -                      |
| 80-90 min   | Implement custom tooltip          | Tooltip shows Title + Quadrant + ROI | Required by README     |
| 90-100 min  | Add department + phase filters    | Filters work, chart updates          | -                      |
| 100-110 min | Polish: labels, colors, spacing   | Professional look                    | If behind, skip polish |

**Checkpoint:** At 110 min, fully functional matrix page

---

### Phase 4: Polish (110-140 min)

| Time        | Task                       | Expected Outcome                          | Blocker Check       |
| ----------- | -------------------------- | ----------------------------------------- | ------------------- |
| 110-120 min | Add dashboard metric cards | `/` shows Total Investment + Active Count | Bonus item          |
| 120-130 min | Responsive layout          | Works on mobile/tablet                    | -                   |
| 130-140 min | Accessibility improvements | Keyboard nav, contrast                    | If time tight, skip |

**Checkpoint:** At 140 min, all planned features complete

---

### Phase 5: Testing (140-165 min)

| Time        | Task                      | Expected Outcome      | Blocker Check                   |
| ----------- | ------------------------- | --------------------- | ------------------------------- |
| 140-150 min | Run all unit tests        | All pass              | Fix failures immediately        |
| 150-155 min | Run integration test      | Matrix renders        | -                               |
| 155-160 min | Manual QA checklist       | Verify against PRD    | Document any issues             |
| 160-165 min | Fix critical issues found | All P0 items resolved | If no time, note for submission |

**Checkpoint:** At 165 min, all tests green

---

### Phase 6: Submission (165-180 min)

| Time        | Task                   | Expected Outcome    |
| ----------- | ---------------------- | ------------------- |
| 165-170 min | Create PR with summary | PR created          |
| 170-175 min | Add screenshots/demo   | Visual evidence     |
| 175-180 min | Final cleanup          | Clean working state |

---

## Hard Cutoff Rules

| If...                       | Then...                                    |
| --------------------------- | ------------------------------------------ |
| Phase 1 not done at 35 min  | Skip Tailwind polish, use basic styles     |
| Phase 2 not done at 65 min  | Skip validation tests, assume schema works |
| Phase 3 not done at 115 min | Skip filters, show all data                |
| Phase 4 not done at 145 min | Skip dashboard, matrix only                |
| Any time < 15 min left      | Freeze: only PR submission                 |

---

## Fallback Decision Tree

```
Is matrix rendering with correct quadrants?
├── YES → Continue to polish
└── NO → Stop. Fix matrix first. Do not pass go.

Are quadrant positions correct?
├── YES → Continue
└── NO → Debug matrix.ts logic, check normalization

Does tooltip show Title + Quadrant?
├── YES → Continue
└── NO → Fix tooltip component

Is time < 30 min remaining?
├── YES → Skip all bonus items, focus on tests + submission
└── NO → Continue with polish

Are tests failing?
├── YES → Fix tests before any new feature
└── NO → Continue
```

---

## Time Tracking Template

| Phase   | Planned | Actual | Delta | Notes |
| ------- | ------- | ------ | ----- | ----- |
| Phase 1 | 30 min  |        |       |       |
| Phase 2 | 30 min  |        |       |       |
| Phase 3 | 50 min  |        |       |       |
| Phase 4 | 30 min  |        |       |       |
| Phase 5 | 25 min  |        |       |       |
| Phase 6 | 15 min  |        |       |       |

---

## Emergency Contacts

- If stuck > 5 min: Take 30-second break, reassess
- If blocked > 10 min: Skip feature, document, move on
- If lost > 15 min: Return to last green checkpoint

---

## Success Criteria

- [ ] At 60 min: Logic complete, tests green
- [ ] At 110 min: Matrix renders with tooltips
- [ ] At 140 min: All planned features done
- [ ] At 165 min: All tests pass
- [ ] At 180 min: PR submitted

---

## Notes

- Use phone/clock timer for accountability
- Log actual times in time tracking template
- If ahead of schedule, can add zoom/brush (from scope)
- Never extend past 180 min - hard stop
