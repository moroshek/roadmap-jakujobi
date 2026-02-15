# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- 2026-02-15: Phase 2 Data Pipeline (COMPLETED)
  - `src/lib/content/loadProjects.ts` - File system readers for markdown projects, gray-matter parsing, path utilities (getContentPath, getProjectsPath, readAllProjectFiles, readProjectFile, getProjectCount)
  - `src/lib/content/loadConfig.ts` - Tenant configuration loader for config.json, getAllowedDepartments, getAllowedPhases, isModuleEnabled
  - `src/lib/content/transformProjects.ts` - Transformation pipeline: validate with Zod, normalize scores (0-10 to 0-100), assign quadrants, loadAndTransformProjects convenience function
  - `tests/integration/content/loadProjects.test.ts` - 8 integration tests for content loading
  - `tests/integration/content/loadConfig.test.ts` - 5 integration tests for config loading
  - `tests/integration/content/transformProjects.test.ts` - 14 integration tests for complete data pipeline
  - All 4 seeded projects map correctly: PRJ-001 Quick Wins (86,32), PRJ-002 Big Bets (91,82), PRJ-003 Fillers (39,28), PRJ-004 Time Sinks (41,87)
  - 77 total tests passing (50 unit + 27 integration); build succeeds
- 2026-02-15: Phase 1 TDD Core Logic (COMPLETED)
  - `src/lib/types.ts` - Type definitions for RawProjectFrontmatter, ProcessedProject, MatrixDataPoint, QuadrantLabel, TenantConfig
  - `src/lib/governance/matrix.ts` - normalizeScore (0-10 to 0-100), assignQuadrant (PRD quadrant rules), transformToMatrixPoint, transformToMatrixData
  - `src/lib/validation/projectSchema.ts` - Zod schema for project frontmatter, validateProject, safeValidateProject
  - `tests/unit/governance/matrix.normalize.test.ts` - 11 tests for score normalization (clamping, decimals, edge cases)
  - `tests/unit/governance/matrix.quadrant.test.ts` - 17 tests for quadrant assignment (Quick Wins, Big Bets, Fillers, Time Sinks, boundaries)
  - `tests/unit/validation/projectSchema.test.ts` - 22 tests for validation schema (valid/invalid projects, helpers)
  - All 50 unit tests pass; TypeScript compiles without errors
- 2026-02-15: Project bootstrap (Phase 1 Foundation)
  - `package.json` with Next.js 14, React 18, TypeScript, Tailwind CSS, gray-matter, Recharts, Zod, Vitest
  - `tsconfig.json` with strict mode and path alias `@/*` -> `./src/*`
  - `next.config.js` with static export (Next.js 14 does not support next.config.ts)
  - `tailwind.config.ts` and `postcss.config.mjs`
  - `vitest.config.ts` with jsdom, React plugin, path alias
  - Root layout (`src/app/layout.tsx`), home page (`src/app/page.tsx`), matrix placeholder (`src/app/matrix/page.tsx`)
  - `src/app/globals.css` with Tailwind directives
  - `tests/setup.ts` for Testing Library jest-dom
  - `next-env.d.ts` for Next.js types

### Changed
- 2026-02-15: Date validation strengthened in projectSchema - now validates calendrical validity (rejects 2025-02-30, 2025-13-01, etc.) in addition to YYYY-MM-DD format; transformProjects adds parseValidDate defensive check to prevent Invalid Date (NaN) propagation
- 2026-02-15: Phase 2 execution plan status updated to Completed
- 2026-02-15: Phase 1 execution plan status updated to Completed
- 2026-02-15: `tsconfig.json` excludes `vitest.config.ts` and `tests/` to prevent Next.js build type conflicts with Vitest/Vite
- 2026-02-15: PostCSS config restored to `postcss.config.mjs` (ESM)
- 2026-02-15: `tailwind.config.ts` content paths: removed `src/pages` (App Router only)

### Documentation
- 2026-02-15: Phase 2 completion review
  - Document: `docs/planning/2026-02-15-phase2-review.md`
  - Comprehensive review of Phase 2 implementation against execution plan
  - Verified all 77 tests passing (50 unit + 27 integration)
  - Confirmed all 4 seeded projects map to correct quadrants
  - Code coverage: 90.63% (exceeds 80% target)
  - Quality assessment: JSDoc, error handling, type safety all verified
  - Phase 2 APPROVED - ready for Phase 3
- 2026-02-15: Phase 2 Data Pipeline detailed execution plan created
  - Document: `docs/planning/2026-02-15-phase2-execution-plan.md`
  - Comprehensive agent-ready implementation guide for data pipeline
  - File-by-file implementation specs for content loaders and transformation pipeline
  - 28 integration tests specified covering complete data flow
  - Seeded projects verification (all 4 quadrants)
  - Exit gates, risk assessment, and troubleshooting guide included
  - Time budget: 25 minutes (fits in 75-100 min window)
  - Ready for autonomous agent execution
- 2026-02-15: Phase 1 (P0 Bootstrap) review completed; see `docs/planning/2026-02-15-phase1-review.md`
- 2026-02-15: Phase 1 TDD Core Logic detailed execution plan created
  - Document: `docs/planning/2026-02-15-phase1-execution-plan.md`
  - Comprehensive file-by-file implementation guide
  - Test-first development approach with 72 unit tests specified
  - Complete code examples for types, governance logic, and validation schema
  - Exit gates, validation criteria, and troubleshooting guide included
  - Ready for autonomous agent execution
- 2026-02-15: Documentation cross-references updated
  - Execution roadmap P1 section links to Phase 1 detailed plan
  - Execution roadmap P2 section links to Phase 2 detailed plan
  - Master plan index includes Phase 1 and Phase 2 execution plans
  - Journal Planning Summary references Phase 1 execution plan
