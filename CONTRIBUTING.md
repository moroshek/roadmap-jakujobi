# Contributing to Roadmap Engine

This document explains how to contribute to or extend the Roadmap Engine project.

---

## Development Setup

### Prerequisites

- Node.js 18.x or later
- npm (comes with Node.js)

### Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run dev:clean` | Clear `.next` cache and start dev server (use when hard-reload causes cache errors) |
| `npm run build` | Production build (static export) |
| `npm run start` | Serve production build locally |
| `npm run lint` | Run Next.js ESLint |
| `npm run test` | Run all tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

### Project Layout

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components (matrix, dashboard, projects, roadmap, layout)
- `src/lib/` - Logic layer: content loaders, governance, validation, filters
- `src/contexts/` - React context providers
- `_content/` - Content repository (projects, config) - the only folder that changes per tenant
- `tests/` - Unit and integration tests

---

## Code Style Guide

### General Principles

- Prefer functional, declarative code over object-oriented patterns
- Use modularization and iteration instead of duplication
- Keep files under 300 lines; split into submodules when needed
- Use TypeScript type hints for all function parameters and returns

### File Organization

- Colocate tests near the code they test when possible
- Unit tests in `tests/unit/`
- Integration tests in `tests/integration/`
- Use descriptive test names: `testFunctionNameWithCondition_ExpectedBehavior`

### Naming

- Components: PascalCase
- Functions and variables: camelCase
- Constants: UPPER_SNAKE_CASE or camelCase for config objects
- Use auxiliary verbs for booleans: `isLoading`, `hasError`

### Comments

- Add JSDoc for all public functions with `@param` and `@return`
- Inline comments for non-obvious logic only
- Avoid comments for obvious code

### Separation of Concerns

- **Logic** (src/lib): Pure functions, no React dependencies. Easy to unit test.
- **Presentation** (src/components): React components, minimal business logic.
- **Data**: Content lives in `_content/`; transformation in `src/lib/content/`.

---

## Testing Requirements

### Coverage Goals

- Aim for >80% coverage on new code
- Unit tests for all new functions in `src/lib/`
- Integration tests for data pipeline and key user flows

### What to Test

- Happy path and error cases
- Edge cases (empty lists, boundary values)
- Mock external dependencies (file system, APIs)

### Test Structure

```typescript
// Example: tests/unit/governance/matrix.normalize.test.ts
import { describe, it, expect } from "vitest";
import { normalizeScore } from "@/lib/governance/matrix";

describe("normalizeScore", () => {
  it("normalizes 0 to 0", () => {
    expect(normalizeScore(0)).toBe(0);
  });
  it("normalizes 10 to 100", () => {
    expect(normalizeScore(10)).toBe(100);
  });
  it("clamps out-of-range input", () => {
    expect(normalizeScore(-1)).toBe(0);
    expect(normalizeScore(15)).toBe(100);
  });
});
```

### Running Tests

```bash
npm run test          # All tests
npm run test:unit     # Unit only
npm run test:coverage # Coverage report
```

---

## Pull Request Process

### Before Submitting

1. Run `npm run lint` and fix any issues
2. Run `npm run test` and ensure all tests pass
3. Run `npm run build` and confirm it succeeds
4. Update `docs/changelog.md` with your changes

### PR Guidelines

- Use a clear, descriptive title
- Add a summary comment explaining what you changed and why
- Reference any related issues or specs
- Keep PRs focused; prefer multiple small PRs over one large one

### Review Expectations

- Code follows the style guide
- New logic has tests
- No regressions in existing behavior
- Documentation is updated where relevant

---

## Extending the Project

### Adding a New Page

1. Add a route in `src/app/` (e.g., `src/app/new-page/page.tsx`)
2. Add a link in `AppHeader.tsx` or the appropriate navigation
3. Add a loading state (`loading.tsx`) for async data

### Adding New Content Types

1. Define the schema in `src/lib/validation/`
2. Add loader in `src/lib/content/`
3. Add transformer that uses governance logic if needed

### Adding a New Filter or Search Field

- Extend `MatrixFilters` or the search keys in `searchProjects.ts`
- Update URL serialization in `applyMatrixFilters.ts` if filters are URL-driven

---

## Security

- Never hardcode secrets, API keys, or tokens
- Use environment variables for sensitive config
- Validate all user input; never trust external data
- Sanitize data before logging (never log passwords or tokens)
