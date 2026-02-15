# Scope Freeze Plan

**Date:** 2026-02-15  
**Status:** Approved  
**Philosophy:** Assessment-pass-first with bonus optimization

---

## In-Scope (Locked)

### Must-Have (Fail-Gate)
- [ ] Strategy Matrix at `/matrix` route
- [ ] Scatter plot with X=effort, Y=impact axes
- [ ] Normalized scores (0-10 -> 0-100)
- [ ] Quadrant assignment logic (Quick Wins, Big Bets, Fillers, Time Sinks)
- [ ] Tooltip with Title + Quadrant Label (+ ROI bonus)
- [ ] Data parser for project markdown files
- [ ] Zod schema validation

### Core Foundation
- [ ] Next.js app structure with routing
- [ ] Tailwind CSS styling setup
- [ ] TypeScript with moderate strictness
- [ ] Gray-matter parser integration

### Bonus (If Time Permits - Priority Order)
1. **Dashboard Metric Cards** - Total Investment, Active Count on `/`
2. **Department + Phase Filters** - Sidebar filter controls
3. **Responsive Polish** - Mobile-friendly matrix layout
4. **WCAG AA Accessibility** - Matrix page only

---

## Out-of-Scope (Explicitly Not Doing)

- [ ] Zoom/brush functionality (deferred to future)
- [ ] Full Executive Dashboard widgets (beyond 2 metric cards)
- [ ] Gantt Chart timeline
- [ ] Project Library page
- [ ] Project Detail page
- [ ] Fuzzy Search
- [ ] AI Ingestion Pipeline
- [ ] Cron jobs for auto-status updates
- [ ] Authentication/middleware
- [ ] Print styles
- [ ] Full app accessibility sweep

---

## Scope Decision Rules

| If Time Remaining | Action                                |
| ----------------- | ------------------------------------- |
| > 45 min          | Execute bonus items in priority order |
| 20-45 min         | Dashboard cards + one filter          |
| < 20 min          | Freeze: only core + tests             |
| < 10 min          | Core matrix only, skip tests          |

---

## Rationale

- **Primary goal:** Pass the automatic-fail gate (Strategy Matrix)
- **Secondary goal:** Demonstrate polish and quality (bonus points)
- **Tertiary goal:** Ship as many PRD-aligned features as time allows
- **Failure mode:** Must have working matrix; everything else is negotiable

---

## Change Control

Any scope expansion requires:
1. Current pass-gate feature is green (tests passing, page renders)
2. Time impact estimated < 15 min
3. No blocking dependencies

**No scope changes allowed during first 60 minutes.**
