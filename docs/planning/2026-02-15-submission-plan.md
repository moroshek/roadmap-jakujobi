# Submission Plan

**Date:** 2026-02-15  
**Status:** Approved  
**Purpose:** Ensure complete, compliant PR submission

---

## PR Requirements Checklist

### Mandatory (Fail-Gate)

- [ ] Code compiles without errors
- [ ] `/matrix` route renders successfully
- [ ] Scatter plot displays with correct axes (X=Effort, Y=Impact)
- [ ] All 4 quadrants labeled correctly
- [ ] Tooltip shows: Project Title + Quadrant Label (+ ROI bonus)
- [ ] Quadrant logic matches PRD exactly:
  - Quick Wins: impact >= 50, effort < 50
  - Big Bets: impact >= 50, effort >= 50
  - Fillers: impact < 50, effort < 50
  - Time Sinks: impact < 50, effort >= 50

### Bonus Items (If Completed)

- [ ] Dashboard metric cards on `/` (Total Investment, Active Count)
- [ ] Department + Phase filters working
- [ ] Responsive layout
- [ ] Unit tests passing
- [ ] Clean code organization

### Quality Standards

- [ ] No console errors on page load
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Code follows project conventions

---

## PR Summary Template

```markdown
## Summary

### Completed (Must-Have)
- ✅ Strategy Matrix at `/matrix` route
- ✅ Scatter plot with X=Effort, Y=Impact axes
- ✅ Quadrant assignment logic (Quick Wins, Big Bets, Fillers, Time Sinks)
- ✅ Tooltip with Project Title, Quadrant Label, and ROI
- ✅ Data pipeline: parser → validation → transform → render

### Bonus Features
- [ ] Dashboard metric cards (Total Investment, Active Count)
- [ ] Department + Phase filters
- [ ] Responsive design
- [ ] Unit tests for matrix logic

### Verification
- All 4 seeded projects render in correct quadrants:
  - PRJ-001 (Factory Predictive Maintenance): Quick Wins ✅
  - PRJ-002 (Battery Supply Risk Hedging): Big Bets ✅
  - PRJ-003 (Dealer Portal UX Refresh): Fillers ✅
  - PRJ-004 (Legacy Warranty Mainframe Rewrite): Time Sinks ✅

### PRD Compliance
- README.md Section 2 (Must-Have): ✅
- PRD Section 2.1 (Governance Engine): ✅
- PRD Section 4.3 (Strategy Matrix): ✅

### Time Spent
- Phase 1 (Foundation): XX min
- Phase 2 (Core Logic): XX min
- Phase 3 (Matrix UI): XX min
- Phase 4 (Polish): XX min
- Phase 5 (Testing): XX min
- Phase 6 (Submission): XX min

### Notes
[Any limitations, known issues, or future improvements]
```

---

## Visual Evidence Required

### Screenshot Checklist

Before submission, capture:

1. **`/matrix` page full view**
   - Show all 4 quadrants with labels
   - Show all 4 data points
   - Show tooltip on hover

2. **Tooltip close-up**
   - Capture tooltip showing Title + Quadrant + ROI

3. **Dashboard (if bonus complete)**
   - Show metric cards on `/`

4. **Console (no errors)**
   - Browser console showing no errors

---

## Code Organization

### Files Created

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── matrix/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── MetricCard.tsx
│   └── matrix/
│       ├── StrategyMatrix.tsx
│       ├── ScatterChart.tsx
│       ├── QuadrantBackground.tsx
│       └── MatrixTooltip.tsx
└── lib/
    ├── types.ts
    ├── content/
    │   ├── loadProjects.ts
    │   └── loadConfig.ts
    ├── governance/
    │   ├── matrix.ts
    │   └── status.ts
    └── validation/
        └── projectSchema.ts

tests/
├── unit/
│   ├── governance/
│   │   ├── matrix.normalize.test.ts
│   │   └── matrix.quadrant.test.ts
│   └── validation/
│       └── schema.test.ts
└── fixtures/
    └── projects/
        └── valid-project.md
```

---

## Submission Checklist

### Before Creating PR

- [ ] All code committed to branch
- [ ] Tests run and pass
- [ ] No lint errors
- [ ] No TypeScript errors
- [ ] Dev server tested locally
- [ ] Screenshots captured
- [ ] PR description drafted

### Creating PR

- [ ] Branch name: `feature/strategy-matrix`
- [ ] PR title: `Implement Strategy Matrix (PRD 4.3)`
- [ ] Fill in summary template
- [ ] Attach screenshots
- [ ] Link to README.md requirements

### After PR Created

- [ ] Verify all checks pass
- [ ] Respond to any feedback
- [ ] Do NOT force push
- [ ] Do NOT amend commits (unless necessary)

---

## Evaluation Alignment

| Criterion | What We Did |
|-----------|-------------|
| **Compliance** | Exact quadrant logic from PRD table |
| **User Delight** | Clean UI, tooltips, responsive |
| **Code Quality** | Logic separated from UI (`src/lib/governance/`) |
| **Velocity** | Full matrix in ~2 hours, bonus items if time permits |

---

## Post-Submission

If evaluator requests changes:

1. Create new branch: `fix/evaluator-feedback`
2. Make changes
3. Update PR with new commits
4. Do NOT amend existing commits

---

## Notes

- PR must be created before 3-hour hard stop
- If running late, submit whatever is working
- Missing bonus is okay; missing must-have is not
- Always include visual evidence
- Be honest about what wasn't completed
