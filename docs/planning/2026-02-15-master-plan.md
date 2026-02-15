# Master Implementation Plan

**Date:** 2026-02-15  
**Version:** 1.0  
**Status:** Approved  

---

## Overview

This document serves as the master index for all implementation plans.
Primary execution source of truth: `docs/planning/2026-02-15-execution-roadmap.md`.

---

## Plan Index

| Plan | File | Purpose | Status |
|------|------|---------|--------|
| Execution Roadmap | `2026-02-15-execution-roadmap.md` | End-to-end phased execution with validation gates and file map | Approved |
| Phase 1 Execution | `2026-02-15-phase1-execution-plan.md` | Detailed P1 TDD Core Logic plan (agent-ready, 50 unit tests) | ✅ Complete |
| Phase 1 Review | `2026-02-15-phase1-review.md` | Phase 1 completion review and validation | ✅ Complete |
| Phase 2 Execution | `2026-02-15-phase2-execution-plan.md` | Detailed P2 Data Pipeline plan (agent-ready, 27 integration tests) | ✅ Complete |
| Phase 2 Review | `2026-02-15-phase2-review.md` | Phase 2 completion review and validation | ✅ Complete |
| PRD Compliance | `2026-02-15-prd-compliance-plan.md` | Map requirements to implementation | ✅ Approved |
| Scope Freeze | `2026-02-15-scope-freeze-plan.md` | Define in/out of scope | ✅ Approved |
| Architecture | `2026-02-15-architecture-plan.md` | Data flow & structure | ✅ Approved |
| Data Contract | `2026-02-15-data-contract-plan.md` | Schemas & transformation | ✅ Approved |
| UI Delivery | `2026-02-15-ui-delivery-plan.md` | Component specs | ✅ Approved |
| Testing | `2026-02-15-testing-plan.md` | TDD approach & test cases | ✅ Approved |
| Timebox | `2026-02-15-timebox-plan.md` | Minute-by-minute execution | ✅ Approved |
| Risk/Contingency | `2026-02-15-risk-contingency-plan.md` | Risks & mitigations | ✅ Approved |
| Submission | `2026-02-15-submission-plan.md` | PR requirements | ✅ Approved |

---

## Quick Reference

### Must-Have (Fail-Gate)
1. Strategy Matrix at `/matrix` route
2. Scatter plot: X=Effort, Y=Impact
3. Normalize scores (0-10 → 0-100)
4. Quadrant assignment logic
5. Tooltip: Title + Quadrant + ROI

### Bonus Items (Priority Order)
1. Dashboard metric cards
2. Department + Phase filters
3. Responsive layout
4. Unit tests

### Key Files
- Logic: `src/lib/governance/matrix.ts`
- Validation: `src/lib/validation/projectSchema.ts`
- UI: `src/app/matrix/page.tsx`, `src/components/matrix/StrategyMatrix.tsx`

### Test Commands
```bash
npm test              # All tests
npm run test:unit     # Unit tests only
npm run test:watch   # Watch mode
```

### Time Budget
- Phase 1 (Foundation): 30 min
- Phase 2 (Core Logic): 30 min
- Phase 3 (Matrix UI): 50 min
- Phase 4 (Polish): 30 min
- Phase 5 (Testing): 25 min
- Phase 6 (Submission): 15 min
- **Total: 180 min**

---

## Critical Success Criteria

- [ ] At 60 min: Logic complete, tests green
- [ ] At 110 min: Matrix renders with tooltips
- [ ] At 140 min: All planned features done
- [ ] At 165 min: All tests pass
- [ ] At 180 min: PR submitted

---

## Decision Rules

| Situation | Decision |
|-----------|----------|
| Time < 30 min, matrix working | Submit current state |
| Time < 30 min, matrix broken | Fix matrix only, skip everything else |
| Tests failing | Fix tests before new features |
| Unclear requirement | Make best guess, document in PR |

---

## Contact Points

- **PRD Reference:** Section 4.3 (Strategy Matrix)
- **README Reference:** Section 2 (The Challenge)
- **Quadrant Logic:** PRD Section 2.1, Table: "Quadrant Logic Definitions"

---

## Notes

- All plans follow TDD approach
- Hybrid data flow (runtime + prebuild-ready)
- Moderate TypeScript strictness
- Vitest for testing
- Tailwind CSS for styling
