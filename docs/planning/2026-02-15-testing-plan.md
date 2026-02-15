# Testing Plan

**Date:** 2026-02-15  
**Status:** Approved  
**Approach:** Test-Driven Development (TDD) with Vitest + Testing Library

---

## 1. Test Strategy

### Philosophy
- Write failing test first, then implement to make it pass
- Test behavior, not implementation details
- Keep tests fast (<100ms each)
- Prioritize tests for fail-gate components

### Test金字塔

```
         ┌─────────────┐
         │   E2E/UI   │  ← Minimal (1 smoke test)
         ├─────────────┤
         │ Integration │  ← Matrix render test
         ├─────────────┤
         │    Unit     │  ← Heavy: matrix logic, validation
         └─────────────┘
```

---

## 2. Test Structure

```
tests/
├── unit/
│   ├── governance/
│   │   ├── matrix.normalize.test.ts
│   │   ├── matrix.quadrant.test.ts
│   │   └── status.update.test.ts
│   ├── validation/
│   │   ├── schema.valid.test.ts
│   │   └── schema.invalid.test.ts
│   └── content/
│       └── filter.test.ts
├── integration/
│   └── matrix/
│       └── StrategyMatrix.render.test.tsx
└── fixtures/
    └── projects/
        ├── valid-project.md
        └── invalid-project.md
```

---

## 3. Unit Tests

### 3.1 Matrix Normalization (`matrix.normalize.test.ts`)

```typescript
describe('normalizeScore', () => {
  test('should return 0 for input 0', () => {
    expect(normalizeScore(0)).toBe(0);
  });

  test('should return 100 for input 10', () => {
    expect(normalizeScore(10)).toBe(100);
  });

  test('should return 50 for input 5', () => {
    expect(normalizeScore(5)).toBe(50);
  });

  test('should clamp negative values to 0', () => {
    expect(normalizeScore(-5)).toBe(0);
    expect(normalizeScore(-1)).toBe(0);
  });

  test('should clamp values over 10 to 100', () => {
    expect(normalizeScore(15)).toBe(100);
    expect(normalizeScore(10.1)).toBe(100);
  });

  test('should handle decimal values', () => {
    expect(normalizeScore(8.6)).toBe(86);
    expect(normalizeScore(3.2)).toBe(32);
  });

  test('should round to nearest integer', () => {
    expect(normalizeScore(5.5)).toBe(55);
    expect(normalizeScore(5.4)).toBe(54);
  });
});
```

### 3.2 Quadrant Assignment (`matrix.quadrant.test.ts`)

```typescript
describe('assignQuadrant', () => {
  describe('Quick Wins (high impact, low effort)', () => {
    test('impact >= 50, effort < 50', () => {
      expect(assignQuadrant(50, 0)).toBe('Quick Wins');
      expect(assignQuadrant(50, 49)).toBe('Quick Wins');
      expect(assignQuadrant(100, 0)).toBe('Quick Wins');
      expect(assignQuadrant(86, 32)).toBe('Quick Wins');
    });
  });

  describe('Big Bets (high impact, high effort)', () => {
    test('impact >= 50, effort >= 50', () => {
      expect(assignQuadrant(50, 50)).toBe('Big Bets');
      expect(assignQuadrant(50, 100)).toBe('Big Bets');
      expect(assignQuadrant(100, 50)).toBe('Big Bets');
      expect(assignQuadrant(91, 82)).toBe('Big Bets');
    });
  });

  describe('Fillers (low impact, low effort)', () => {
    test('impact < 50, effort < 50', () => {
      expect(assignQuadrant(0, 0)).toBe('Fillers');
      expect(assignQuadrant(49, 0)).toBe('Fillers');
      expect(assignQuadrant(0, 49)).toBe('Fillers');
      expect(assignQuadrant(39, 28)).toBe('Fillers');
    });
  });

  describe('Time Sinks (low impact, high effort)', () => {
    test('impact < 50, effort >= 50', () => {
      expect(assignQuadrant(0, 50)).toBe('Time Sinks');
      expect(assignQuadrant(49, 50)).toBe('Time Sinks');
      expect(assignQuadrant(0, 100)).toBe('Time Sinks');
      expect(assignQuadrant(41, 87)).toBe('Time Sinks');
    });
  });

  describe('Boundary conditions', () => {
    test('exactly 50 on impact, below 50 on effort', () => {
      expect(assignQuadrant(50, 49)).toBe('Quick Wins');
    });

    test('exactly 50 on both axes', () => {
      expect(assignQuadrant(50, 50)).toBe('Big Bets');
    });

    test('just below 50 on impact, exactly 50 on effort', () => {
      expect(assignQuadrant(49, 50)).toBe('Time Sinks');
    });
  });
});
```

### 3.3 Schema Validation (`schema.valid.test.ts`, `schema.invalid.test.ts`)

```typescript
describe('ProjectSchema', () => {
  describe('valid projects', () => {
    test('should parse valid project frontmatter', () => {
      const validProject = {
        id: 'PRJ-001',
        title: 'Test Project',
        slug: 'test-project',
        owner: 'John Doe',
        department: 'Manufacturing',
        phase: 'Foundation',
        status: 'Active',
        dates: {
          planned_start: '2026-02-01',
          planned_end: '2026-07-15',
        },
        scores: {
          strategic_value: 8.6,
          complexity: 3.2,
          confidence: 0.87,
        },
        financials: {
          estimated_cost: 620000,
          projected_roi: 2100000,
          currency: 'USD',
        },
        tags: ['IoT'],
        related_projects: [],
      };

      const result = ProjectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid projects', () => {
    test('should reject invalid ID format', () => {
      const invalid = { ...validProject, id: 'INVALID' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject out-of-range strategic_value', () => {
      const invalid = {
        ...validProject,
        scores: { ...validProject.scores, strategic_value: 15 }
      };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject invalid department', () => {
      const invalid = { ...validProject, department: 'InvalidDept' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
```

---

## 4. Integration Tests

### 4.1 Matrix Render (`StrategyMatrix.render.test.tsx`)

```typescript
import { render, screen } from '@testing-library/react';
import { StrategyMatrix } from '@/components/matrix/StrategyMatrix';

const mockData: MatrixDataPoint[] = [
  {
    id: 'PRJ-001',
    x: 32,
    y: 86,
    quadrant: 'Quick Wins',
    title: 'Factory Predictive Maintenance',
    department: 'Manufacturing',
    phase: 'Foundation',
    status: 'Active',
    financials: { estimated_cost: 620000, projected_roi: 2100000, currency: 'USD' },
  },
];

describe('StrategyMatrix', () => {
  test('should render scatter chart with data points', () => {
    render(<StrategyMatrix data={mockData} filters={defaultFilters} onFilterChange={() => {}} />);
    
    // Verify chart renders (Recharts creates SVG)
    const chart = document.querySelector('.recharts-scatter-chart');
    expect(chart).toBeInTheDocument();
  });

  test('should render correct number of points', () => {
    render(<StrategyMatrix data={mockData} filters={defaultFilters} onFilterChange={() => {}} />);
    
    const points = document.querySelectorAll('.recharts-scatter-circle');
    expect(points).toHaveLength(1);
  });
});
```

---

## 5. Test Fixtures

### Valid Project Fixture (`fixtures/projects/valid-project.md`)

```yaml
---
id: "PRJ-TEST"
title: "Test Project"
slug: "test-project"
owner: "Test Owner"
department: "Manufacturing"
phase: "Foundation"
status: "Active"
dates:
  planned_start: "2026-02-01"
  planned_end: "2026-07-15"
scores:
  strategic_value: 8.0
  complexity: 4.0
  confidence: 0.9
financials:
  estimated_cost: 100000
  projected_roi: 200000
  currency: "USD"
tags: ["Test"]
related_projects: []
---
# Test Content
```

### Invalid Project Fixture (`fixtures/projects/invalid-project.md`)

```yaml
---
id: "INVALID-ID"
title: ""
department: "InvalidDepartment"
scores:
  strategic_value: 15
  complexity: -1
---
```

---

## 6. Test Execution

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm test:unit

# Integration tests only
npm test:integration

# Watch mode
npm test:watch

# Coverage
npm test:coverage
```

### Test Scripts (package.json)

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 7. Test Priority (Execution Order)

| Priority | Test File                        | Reason               |
| -------- | -------------------------------- | -------------------- |
| P0       | `matrix.normalize.test.ts`       | Core fail-gate logic |
| P0       | `matrix.quadrant.test.ts`        | Core fail-gate logic |
| P0       | `schema.valid.test.ts`           | Data integrity       |
| P1       | `schema.invalid.test.ts`         | Error handling       |
| P1       | `status.update.test.ts`          | Governance logic     |
| P2       | `StrategyMatrix.render.test.tsx` | UI smoke test        |
| P3       | `filter.test.ts`                 | Filter logic         |

---

## 8. Coverage Targets

| Category         | Target |
| ---------------- | ------ |
| Governance logic | 100%   |
| Validation       | 100%   |
| Matrix component | 80%    |
| Overall          | 70%    |

---

## 9. CI Behavior

- All tests must pass for PR to be merged
- Coverage drop > 5% fails CI
- Test runtime < 30 seconds

---

## Notes

- Use `@testing-library/react` for component tests
- Mock Recharts to avoid rendering issues in tests
- Test data uses actual seeded projects (PRJ-001 to PRJ-004)
- All unit tests run in Node (no browser)
- Integration tests run in jsdom environment
