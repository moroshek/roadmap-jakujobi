# Risk/Contingency Plan

**Date:** 2026-02-15  
**Status:** Approved  
**Purpose:** Identify risks, mitigations, and contingency actions

---

## Risk Register

### Critical Risks (Must Avoid)

| ID | Risk | Likelihood | Impact | Mitigation | Contingency |
|----|------|------------|--------|------------|-------------|
| R1 | Matrix fails to render | Medium | **Critical** | Test rendering early in Phase 3 | Use simpler chart lib |
| R2 | Quadrant logic wrong | Low | **Critical** | Unit tests with boundary cases | Re-verify PRD table |
| R3 | Time overrun | High | **Critical** | Strict timeboxing, fallback rules | Abort non-essential features |
| R4 | Tooltip missing required fields | Medium | **Critical** | Verify against README before Phase 3 end | Hardcode if needed |

### High Risks

| ID | Risk | Likelihood | Impact | Mitigation | Contingency |
|----|------|------------|--------|------------|-------------|
| R5 | Dependencies fail to install | Low | High | Use existing node_modules | Check npm version |
| R6 | TypeScript errors block build | Medium | High | Moderate strictness, fix early | Use `any` temporarily |
| R7 | Recharts rendering issues | Medium | High | Test in isolation | Use SVG directly |
| R8 | Data parsing errors | Low | High | Validate seeded data | Check file paths |

### Medium Risks

| ID | Risk | Likelihood | Impact | Mitigation | Contingency |
|----|------|------------|--------|------------|-------------|
| R9 | Filter logic breaks chart | Low | Medium | Test filter toggle | Disable filters |
| R10 | Responsive issues | Medium | Medium | Test on mobile early | Hide advanced features |
| R11 | Accessibility gaps | Medium | Medium | Use semantic HTML | Skip a11y, submit anyway |
| R12 | Test setup issues | Low | Medium | Vitest pre-configured | Use manual verification |

### Low Risks

| ID | Risk | Likelihood | Impact | Mitigation | Contingency |
|----|------|------------|--------|------------|-------------|
| R13 | Dashboard metrics wrong | Low | Low | Calculate from processed data | Hardcode for demo |
| R14 | Styling inconsistency | Medium | Low | Use Tailwind consistently | Accept minor issues |
| R15 | Git conflicts | Low | Low | Work on branch | Rebase carefully |

---

## Scenario-Based Contingencies

### Scenario A: "Matrix won't render at all"

**Symptoms:** Blank page, console errors
**Time to Detect:** Phase 3 (60-70 min)
**Immediate Action:**
1. Check browser console for errors
2. Verify data is being passed to component
3. Simplify chart to basic SVG circles
4. If still broken, use HTML/CSS grid as fallback

**Recovery Time:** 10-15 min

---

### Scenario B: "Quadrants are in wrong positions"

**Symptoms:** PRJ-001 shows in wrong quadrant
**Time to Detect:** Phase 3 (70-80 min)
**Immediate Action:**
1. Check normalization output (0-100)
2. Verify quadrant boundary logic (>=50 vs <50)
3. Run unit tests - should catch this
4. Swap X/Y axes in chart config

**Recovery Time:** 5-10 min (tests should catch)

---

### Scenario C: "Tooltip not showing"

**Symptoms:** Hover does nothing or shows default
**Time to Detect:** Phase 3 (80-90 min)
**Immediate Action:**
1. Check Recharts Tooltip props
2. Verify custom component renders
3. Add console.log for debugging
4. Use native `title` attribute as last resort

**Recovery Time:** 5-10 min

---

### Scenario D: "Running out of time"

**Symptoms:** Clock showing < 30 min remaining
**Time to Detect:** Any phase
**Immediate Action:**
1. STOP all new feature work
2. Run existing tests
3. Create PR with current state
4. Document what's missing

**Priority Order:**
1. Matrix renders (fail-gate)
2. Tooltip works
3. Tests pass
4. Filters work
5. Dashboard works
6. Polish

---

### Scenario E: "Tests won't run"

**Symptoms:** `npm test` fails or errors
**Time to Detect:** Phase 2 or 5
**Immediate Action:**
1. Check Vitest configuration
2. Try running specific test file
3. Skip tests, use manual verification
4. Document test gaps in PR

**Recovery Time:** 5 min max, then skip

---

### Scenario F: "Build fails"

**Symptoms:** `npm run build` or dev server error
**Time to Detect:** Any phase
**Immediate Action:**
1. Read error message carefully
2. Fix TypeScript errors
3. Check imports
4. Remove broken import, continue

**Recovery Time:** 5-10 min

---

## Emergency Quick Reference

### One-Minute Diagnostics

| Check | Command |
|-------|---------|
| Server running? | `curl localhost:3000` |
| Data loading? | Check console.log in loadProjects |
| Chart has data? | `console.log(data.length)` in component |
| Tests passing? | `npm test -- --run` |

### Five-Minute Fixes

| Issue | Fix |
|-------|-----|
| TypeScript error | Add `// @ts-ignore` or `as any` |
| Import error | Check file path, add `.js` extension |
| Chart broken | Replace with simple `<svg>` circles |
| Filter broken | Remove filter, show all |
| Style broken | Use inline styles temporarily |

---

## Decision Authority

| Decision | Who Decides |
|----------|-------------|
| Skip a feature | Agent (based on time) |
| Change implementation approach | Agent |
| Abort and submit current state | Agent |
| Add new feature | **Not allowed** without approval |
| Extend time | **Not allowed** - hard stop |

---

## Post-Mortem Template

If issues occur, document:

```markdown
## Issue: [Title]

### What Happened
[Description]

### Root Cause
[Analysis]

### Resolution
[How fixed or worked around]

### Prevention
[How to avoid in future]
```

---

## Contact Information

- **If completely stuck:** Take 2-minute break, re-read PRD section 4.3
- **If unclear on requirements:** Re-read README.md section 2
- **If need clarification:** Make best guess, document in PR

---

## Notes

- No risk is acceptable if it blocks the fail-gate (Matrix)
- Time risks are more acceptable than quality risks
- Always have a "Plan B" for each critical component
- Document everything for post-assessment review
