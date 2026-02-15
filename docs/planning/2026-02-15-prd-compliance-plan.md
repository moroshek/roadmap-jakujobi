# PRD Compliance Plan

**Date:** 2026-02-15  
**Status:** Approved  
**Approach:** Hybrid data flow (runtime + prebuild-ready)

## Objective
Ensure every must-have requirement from README.md and Roadmap Engine PRD.md is mapped to implementation + verification, avoiding hidden fail conditions.

---

## Must-Have Requirements Matrix

### README.md Requirements (Section 2)

| Req ID    | Requirement                                              | Implementation Location                                                | Verification                                   |
| --------- | -------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| R-MH-1    | Populate 3-5 dummy markdown files in `_content/projects` | Already exists: PRJ-001 to PRJ-004                                     | Check files exist with valid frontmatter       |
| R-MH-2a   | Read raw impact (0-10) and effort (0-10) scores          | `src/lib/governance/matrix.ts` - `normalizeScore()`                    | Unit test with sample values                   |
| R-MH-2b   | Normalize to 0-100 for chart axes                        | `src/lib/governance/matrix.ts` - `normalizeScore()` returns value * 10 | Unit test boundary: 0->0, 10->100, 5->50       |
| R-MH-2c   | Programmatically assign Quadrant Label                   | `src/lib/governance/matrix.ts` - `assignQuadrant()`                    | Unit test all 4 quadrants with boundary values |
| R-MH-3a   | Create Scatter Plot at `/matrix` route                   | `src/app/matrix/page.tsx` + `src/app/matrix/StrategyMatrix.tsx`        | Page loads, chart renders                      |
| R-MH-3b   | X-Axis: Effort / Y-Axis: Impact                          | Recharts `<ScatterChart>` config                                       | Visual verification                            |
| R-MH-3c   | Tooltip: Project Title & Quadrant Label                  | Custom tooltip component                                               | Hover shows both fields                        |
| R-MH-FAIL | **AUTOMATIC FAIL IF MISSING**                            | N/A                                                                    | N/A                                            |

---

### PRD Requirements (Section 2.1 - Governance Engine)

| Req ID | Requirement                                    | Implementation Location                             | Verification                     |
| ------ | ---------------------------------------------- | --------------------------------------------------- | -------------------------------- |
| P-GE-1 | Zod schema validation on frontmatter           | `src/lib/validation/projectSchema.ts`               | Test with valid + invalid inputs |
| P-GE-2 | Temporal logic (status updates based on dates) | `src/lib/governance/status.ts` - `updateStatus()`   | Unit test date comparisons       |
| P-GE-3 | Matrix calculation: normalize + quadrant       | `src/lib/governance/matrix.ts`                      | Full integration test            |
| P-GE-4 | Quadrant Logic (PRD Table)                     | `src/lib/governance/matrix.ts` - `assignQuadrant()` | Boundary test at exactly 50      |

---

### PRD Requirements (Section 4.3 - Strategy Matrix)

| Req ID | Requirement                                | Implementation Location             | Verification                  |
| ------ | ------------------------------------------ | ----------------------------------- | ----------------------------- |
| P-SM-1 | Interactive Scatter Plot                   | `src/app/matrix/StrategyMatrix.tsx` | User interaction test         |
| P-SM-2 | Quadrant background zones labeled          | QuadrantBackground component        | Visual verification           |
| P-SM-3 | Sidebar controls: Department/Phase filters | FilterSidebar component             | Toggle filters, chart updates |
| P-SM-4 | Tooltips: Title + ROI (bonus: Quadrant)    | CustomTooltip component             | Hover test                    |

---

## Compliance Checklist (Pre-Submission)

- [ ] All R-MH-* requirements verified
- [ ] All P-GE-* requirements verified
- [ ] All P-SM-* requirements verified
- [ ] No console errors on `/matrix`
- [ ] All 4 seeded projects render in correct quadrants:
  - PRJ-001: Quick Wins (impact=86, effort=32)
  - PRJ-002: Big Bets (impact=91, effort=82)
  - PRJ-003: Fillers (impact=39, effort=28)
  - PRJ-004: Time Sinks (impact=41, effort=87)

---

## Notes

- Any deviation from this matrix requires explicit approval
- This plan is locked after Phase 1 completion
- Only PRD-aligned features are in scope; extras require time surplus
