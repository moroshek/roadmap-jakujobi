# Web Interface Guidelines Compliance Plan

**Date:** 2026-02-15  
**Status:** Ready for Implementation  
**Estimated Time:** 45-60 minutes  
**Prerequisites:** Phase 3 complete (Strategy Matrix functional)  
**Type:** Quality & Polish Enhancement

---

## Executive Summary

This plan addresses compliance gaps with Vercel's Web Interface Guidelines, improving:

1. **Accessibility** - WCAG 2.1 AA compliance for modals, progress bars, and keyboard navigation
2. **Typography** - Proper glyphs, numeric formatting, and text wrapping
3. **Motion & Performance** - Reduced motion support for animations
4. **Content & UX** - Better button labels, improved messaging

**Impact:** Higher code quality, better user experience, improved accessibility for all users

**Priority:** High - These are best practices that prevent usability issues

---

## Table of Contents

1. [Audit Summary](#audit-summary)
2. [Priority Areas](#priority-areas)
3. [Implementation Plan](#implementation-plan)
4. [Testing Strategy](#testing-strategy)
5. [Validation Checklist](#validation-checklist)
6. [Appendices](#appendices)

---

## Audit Summary

### Files Audited

- ✅ `src/components/matrix/QuadrantOverlay.tsx` - Pass (proper aria-hidden)
- ⚠️ `src/components/matrix/MatrixChart.tsx` - 3 issues
- ⚠️ `src/components/matrix/MatrixPageClient.tsx` - 3 issues
- ⚠️ `src/components/matrix/MatrixTooltip.tsx` - 2 issues
- ⚠️ `src/components/matrix/ProjectModal.tsx` - 9 issues

**Total Issues:** 17 guideline violations  
**Categories:** Accessibility (9), Typography (5), Motion (2), Content (1)

### Issues by Severity

| Severity | Count | Category | Impact |
|----------|-------|----------|--------|
| **High** | 4 | Accessibility - Modal focus management | Screen readers, keyboard users blocked |
| **High** | 3 | Accessibility - Progress bar ARIA | Screen readers can't announce values |
| **Medium** | 2 | Accessibility - Focus states | Keyboard users lose visual feedback |
| **Medium** | 2 | Motion - Reduced motion | Vestibular disorder users experience discomfort |
| **Low** | 5 | Typography - Numeric formatting | Inconsistent visual alignment |
| **Low** | 1 | Content - Button labels | Generic labels reduce clarity |

---

## Priority Areas

### Priority 1: Accessibility (Modal & Focus Management)

**Issues:**
1. Modal missing focus trap (Tab key escapes modal)
2. Modal doesn't restore focus on close
3. Modal doesn't focus first element on open
4. Close button uses `outline-none` without replacement

**User Impact:**
- Keyboard users lose context when Tab escapes modal
- Screen reader users don't receive focus feedback
- Violates WCAG 2.1 AA Success Criterion 2.4.3 (Focus Order)

**Affected File:** `src/components/matrix/ProjectModal.tsx`

---

### Priority 2: Accessibility (Progress Bars)

**Issues:**
1. Progress bars missing `role="progressbar"`
2. Missing `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
3. Score displays lack numeric formatting

**User Impact:**
- Screen readers announce generic "div" instead of progress value
- Visually impaired users can't track score changes
- Violates WCAG 2.1 AA Success Criterion 4.1.2 (Name, Role, Value)

**Affected File:** `src/components/matrix/ProjectModal.tsx`

---

### Priority 3: Motion & Animation

**Issues:**
1. Progress bar transitions ignore `prefers-reduced-motion`
2. Other transitions might trigger vestibular issues

**User Impact:**
- Users with vestibular disorders experience discomfort
- Violates WCAG 2.1 AA Success Criterion 2.3.3 (Animation from Interactions)

**Affected Files:**
- `src/components/matrix/ProjectModal.tsx`
- `src/components/matrix/MatrixChart.tsx`

---

### Priority 4: Typography & Content

**Issues:**
1. Arrow symbol "->" should be "→"
2. Ellipsis "..." should be "…"
3. Number displays lack tabular-nums
4. Headings lack text-wrap: balance
5. Generic button label "Close"

**User Impact:**
- Unprofessional appearance
- Numbers misalign in columns
- Improved readability with proper wrapping

**Affected Files:** All matrix components

---

## Implementation Plan

### Phase 1: Modal Accessibility (15 minutes)

#### Step 1.1: Add Focus Trap Hook

**File:** `src/lib/hooks/useFocusTrap.ts` (NEW)

```typescript
/**
 * Focus Trap Hook
 * 
 * Traps focus within a container (modal, dialog, drawer)
 * Implements WCAG 2.1 AA Success Criterion 2.4.3
 */

import { useEffect, useRef } from "react";

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    // Trap focus within container
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift+Tab: If on first element, go to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: If on last element, go to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleTab);
      
      // Restore focus on cleanup
      previousFocusRef.current?.focus();
    };
  }, [isActive]);

  return containerRef;
}
```

**Testing:**
```typescript
// tests/unit/hooks/useFocusTrap.test.ts

describe("useFocusTrap", () => {
  it("focuses first element on mount", () => {
    // Test implementation
  });

  it("prevents Tab from escaping container", () => {
    // Test implementation
  });

  it("cycles focus from last to first on Tab", () => {
    // Test implementation
  });

  it("cycles focus from first to last on Shift+Tab", () => {
    // Test implementation
  });

  it("restores focus on unmount", () => {
    // Test implementation
  });
});
```

---

#### Step 1.2: Update ProjectModal with Focus Trap

**File:** `src/components/matrix/ProjectModal.tsx`

**Changes:**

1. Import the focus trap hook:
```typescript
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
```

2. Use the hook in component:
```typescript
export function ProjectModal() {
  const { selectedProject, setSelectedProject } = useMatrix();
  const modalRef = useFocusTrap(!!selectedProject);

  // ... existing escape key handler ...
```

3. Apply ref to modal container:
```typescript
<div
  ref={modalRef}
  className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
```

4. Fix close button focus state (replace `focus:outline-none` with `focus-visible:ring-2`):
```typescript
<button
  onClick={() => setSelectedProject(null)}
  className="text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
  aria-label="Close Project Details"
>
```

5. Add overscroll behavior to prevent scroll-through:
```typescript
<div
  className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overscroll-contain"
  onClick={(e) => e.stopPropagation()}
>
```

---

### Phase 2: Progress Bar Accessibility (10 minutes)

#### Step 2.1: Create Accessible ProgressBar Component

**File:** `src/components/matrix/ProgressBar.tsx` (NEW)

```typescript
/**
 * Accessible Progress Bar Component
 * 
 * Implements WCAG 2.1 AA Success Criterion 4.1.2
 * Supports prefers-reduced-motion
 */

"use client";

import React from "react";

export interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  maxValue?: number;
  color?: string; // Tailwind color class
  showLabel?: boolean;
}

export function ProgressBar({
  label,
  value,
  maxValue = 100,
  color = "bg-blue-600",
  showLabel = true,
}: ProgressBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium tabular-nums">
            {value}/{maxValue}
          </span>
        </div>
      )}
      <div
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-label={label}
      >
        <div
          className={`${color} h-2 rounded-full motion-safe:transition-all motion-safe:duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

**Key Features:**
- Proper ARIA attributes for screen readers
- `motion-safe:` prefix respects `prefers-reduced-motion`
- Uses `tabular-nums` for consistent number alignment
- Semantic HTML with proper role

**Testing:**
```typescript
// tests/unit/matrix/ProgressBar.test.tsx

describe("ProgressBar", () => {
  it("renders with correct ARIA attributes", () => {
    render(<ProgressBar label="Impact" value={75} maxValue={100} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "75");
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "100");
  });

  it("calculates percentage correctly", () => {
    render(<ProgressBar label="Score" value={7} maxValue={10} />);
    // Inner bar should be 70% width
  });

  it("respects prefers-reduced-motion", () => {
    // Test that motion-safe: classes are present
  });
});
```

---

#### Step 2.2: Replace Progress Bars in ProjectModal

**File:** `src/components/matrix/ProjectModal.tsx`

**Replace all three progress bar instances** with the new component:

**Before:**
```typescript
<div>
  <div className="flex justify-between text-sm mb-1">
    <span className="text-gray-600">Impact / Strategic Value</span>
    <span className="font-medium">
      {project.scores.strategic_value}/10
    </span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full transition-all"
      style={{ width: `${project.matrix.impactNormalized}%` }}
    />
  </div>
</div>
```

**After:**
```typescript
<ProgressBar
  label="Impact / Strategic Value"
  value={project.scores.strategic_value}
  maxValue={10}
  color="bg-blue-600"
/>
```

**Apply to:**
1. Impact / Strategic Value (blue)
2. Effort / Complexity (amber)
3. Confidence (green)

---

### Phase 3: Typography Fixes (10 minutes)

#### Step 3.1: Global CSS for Numeric Formatting

**File:** `src/app/globals.css`

Add utility class:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
  
  .text-balance {
    text-wrap: balance;
  }
  
  .text-pretty {
    text-wrap: pretty;
  }
}
```

---

#### Step 3.2: Fix Glyphs and Symbols

**Files to update:**

1. **MatrixChart.tsx** - Line 88:
```typescript
// Before:
label={{ value: "Effort / Complexity ->", ... }}

// After:
label={{ value: "Effort / Complexity →", ... }}
```

2. **MatrixPageClient.tsx** - Line 119:
```typescript
// Before:
<strong>Tip:</strong> Hover over points to see details, or click to view full project information.

// After:
<strong>Tip:</strong> Hover over points to see details, or click to view full project information…
```

3. **MatrixTooltip.tsx** - Line 90:
```typescript
// Before:
<div className="mt-3 pt-2 border-t text-xs text-gray-400 italic">
  Click for details
</div>

// After:
<div className="mt-3 pt-2 border-t text-xs text-gray-400 italic">
  Click to view full project details
</div>
```

---

#### Step 3.3: Add Tabular Nums to Number Displays

**Files to update:**

1. **MatrixPageClient.tsx** - Quadrant counts (lines 73-106):
```typescript
<div className="text-2xl font-bold text-green-600 tabular-nums">
  {projects.filter((p) => p.matrix.quadrant === "Quick Wins").length}
</div>
```

Apply `tabular-nums` to all 4 quadrant count displays.

2. **MatrixTooltip.tsx** - Score values (lines 74-84):
```typescript
<span className="font-medium text-gray-900 tabular-nums">{data.y}/100</span>
```

Apply to both Impact and Effort displays.

3. **ProjectModal.tsx** - All numeric displays:
- Timeline dates (already using Intl, no change needed)
- Score displays (use ProgressBar with tabular-nums)
- Financial values (already using Intl.NumberFormat)
- ROI Multiplier:
```typescript
<div className="mt-2 text-sm text-gray-600 text-center tabular-nums">
  ROI Multiplier:{" "}
  {(project.financials.projected_roi / project.financials.estimated_cost).toFixed(2)}x
</div>
```

---

#### Step 3.4: Add Text Wrapping to Headings

**Files to update:**

1. **MatrixPageClient.tsx** - Main heading (line 64):
```typescript
<h1 className="text-3xl font-bold text-gray-900 text-balance">
  Strategy Matrix
</h1>
```

2. **ProjectModal.tsx** - Modal title (line 95):
```typescript
<h2
  id="modal-title"
  className="text-xl font-bold text-gray-900 mb-2 text-balance"
>
  {project.title}
</h2>
```

3. **ProjectModal.tsx** - Section headings (multiple locations):
```typescript
<h3 className="text-sm font-semibold text-gray-900 mb-3 text-balance">
  Timeline
</h3>
```

Apply to: "Timeline", "Strategic Scores", "Financial Impact", "Tags", "Related Projects"

---

### Phase 4: Motion & Animation (5 minutes)

#### Step 4.1: Add Reduced Motion Support

**File:** `tailwind.config.ts`

Verify motion-safe variants are enabled (should be by default):
```typescript
export default {
  theme: {
    extend: {
      // ... existing config
    },
  },
  // Motion variants enabled by default in Tailwind 3.x
  plugins: [],
} satisfies Config;
```

---

#### Step 4.2: Update Transition Classes

**Already handled in ProgressBar component** (motion-safe: prefix added)

**MatrixChart.tsx** - Cell transitions:
No changes needed - hover/size changes are rapid and don't trigger vestibular issues per WCAG guidelines.

---

### Phase 5: Content & UX (5 minutes)

#### Step 5.1: Improve Button Labels

**File:** `src/components/matrix/ProjectModal.tsx`

1. Close button (line 111):
```typescript
aria-label="Close Project Details"
```
Already updated in Phase 1.

2. Footer button (line 316):
```typescript
<button
  onClick={() => setSelectedProject(null)}
  className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-medium"
>
  Close Project Details
</button>
```

---

## Testing Strategy

### Unit Tests (8 new tests)

**File:** `tests/unit/hooks/useFocusTrap.test.ts`
- Focus trap activates on mount
- Tab cycles within container
- Shift+Tab cycles backwards
- Focus restored on unmount

**File:** `tests/unit/matrix/ProgressBar.test.tsx`
- Renders with correct ARIA attributes
- Calculates percentage correctly
- Handles edge cases (0%, 100%)
- Respects reduced motion preference

---

### Accessibility Tests (3 new tests)

**File:** `tests/integration/matrix/ProjectModal.a11y.test.tsx`
```typescript
describe("ProjectModal Accessibility", () => {
  it("traps focus within modal when open", () => {
    // Test Tab key doesn't escape
  });

  it("restores focus to trigger element on close", () => {
    // Test focus returns to clicked chart point
  });

  it("announces progress bar values to screen readers", () => {
    // Test aria-valuenow updates
  });
});
```

---

### Manual Testing Checklist

**Keyboard Navigation:**
- [ ] Tab through matrix chart to project points
- [ ] Enter/Space opens modal
- [ ] Tab stays within modal (doesn't escape)
- [ ] Shift+Tab cycles backwards through modal
- [ ] Escape closes modal
- [ ] Focus returns to chart point after close

**Screen Reader Testing:**
- [ ] Progress bars announce "Impact, 75 of 100"
- [ ] Modal announces "Project Details dialog"
- [ ] Close button announces "Close Project Details"

**Motion Testing:**
- [ ] Enable "Reduce Motion" in OS settings
- [ ] Progress bars animate (should not with reduce motion)
- [ ] Transitions smooth with default settings
- [ ] No jarring animations

**Visual Testing:**
- [ ] Numbers align in columns (tabular-nums working)
- [ ] Arrow symbol displays correctly (→)
- [ ] Ellipsis displays correctly (…)
- [ ] Headings wrap nicely (no orphans)
- [ ] Focus rings visible on keyboard focus

---

## Validation Checklist

### Pre-Implementation
- [ ] Phase 3 tests passing (108+ tests)
- [ ] No existing errors in console
- [ ] Matrix functionality working correctly

### During Implementation
- [ ] Write tests alongside code changes
- [ ] No regressions in existing functionality
- [ ] Run `npm run test:unit` after each phase
- [ ] Check console for accessibility warnings

### Post-Implementation
- [ ] All 116+ tests passing (108 existing + 8 new)
- [ ] Coverage >85% for new files
- [ ] Build succeeds (`npm run build`)
- [ ] Manual QA checklist complete
- [ ] Lighthouse accessibility score >90

---

## Risk Mitigation

### Risk 1: Focus Trap Breaking Existing Behavior

**Mitigation:**
- Test thoroughly with keyboard before committing
- Keep escape key handler as fallback
- Ensure containerRef properly applied

**Rollback:**
- If focus trap causes issues, remove hook but keep ARIA improvements

---

### Risk 2: Motion-Safe Classes Not Working

**Mitigation:**
- Test with OS settings: Windows (Settings > Accessibility > Visual effects)
- Verify Tailwind config includes motion variants
- Use browser DevTools to toggle prefers-reduced-motion

**Rollback:**
- Remove motion-safe: prefixes, keep basic transitions

---

### Risk 3: TabularNums Font Not Available

**Mitigation:**
- Verify system fonts support tabular-nums variant
- Fallback to default if variant not supported
- Test on Windows, Mac, Linux

**Rollback:**
- Remove tabular-nums class, accept slight misalignment

---

## Time Allocation

| Phase | Task | Duration | Cumulative |
|-------|------|----------|------------|
| 1 | Modal accessibility (focus trap) | 15 min | 15 min |
| 2 | Progress bar accessibility | 10 min | 25 min |
| 3 | Typography fixes | 10 min | 35 min |
| 4 | Motion & animation | 5 min | 40 min |
| 5 | Content & UX | 5 min | 45 min |
| 6 | Testing & validation | 10 min | 55 min |
| 7 | Buffer | 5 min | 60 min |

---

## Appendices

### Appendix A: WCAG 2.1 AA Success Criteria Addressed

| Criterion | Level | Description | Implementation |
|-----------|-------|-------------|----------------|
| **2.4.3** | A | Focus Order | Focus trap in modal |
| **2.3.3** | AAA* | Animation from Interactions | Reduced motion support |
| **4.1.2** | A | Name, Role, Value | ARIA attributes on progress bars |
| **2.4.7** | AA | Focus Visible | Replace outline-none with focus-visible |

*Note: 2.3.3 is AAA but considered best practice

---

### Appendix B: Files Modified

**New Files (2):**
- `src/lib/hooks/useFocusTrap.ts`
- `src/components/matrix/ProgressBar.tsx`

**Modified Files (5):**
- `src/app/globals.css`
- `src/components/matrix/MatrixChart.tsx`
- `src/components/matrix/MatrixPageClient.tsx`
- `src/components/matrix/MatrixTooltip.tsx`
- `src/components/matrix/ProjectModal.tsx`

**New Test Files (2):**
- `tests/unit/hooks/useFocusTrap.test.ts`
- `tests/unit/matrix/ProgressBar.test.tsx`

**Modified Test Files (1):**
- `tests/integration/matrix/ProjectModal.a11y.test.tsx` (if exists, otherwise new)

**Total Changes:** 2 new files, 5 modifications, 3 test files

---

### Appendix C: Code Patterns Reference

#### Pattern 1: Focus Trap Hook Usage
```typescript
const modalRef = useFocusTrap(!!selectedProject);

<div ref={modalRef} role="dialog" aria-modal="true">
  {/* Modal content */}
</div>
```

#### Pattern 2: Accessible Progress Bar
```typescript
<ProgressBar
  label="Score Name"
  value={currentValue}
  maxValue={maxValue}
  color="bg-blue-600"
/>
```

#### Pattern 3: Focus Visible Styling
```typescript
// ❌ Bad:
className="focus:outline-none"

// ✅ Good:
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
```

#### Pattern 4: Reduced Motion
```typescript
// ❌ Bad:
className="transition-all duration-300"

// ✅ Good:
className="motion-safe:transition-all motion-safe:duration-300"
```

#### Pattern 5: Tabular Numbers
```typescript
// ❌ Bad:
<span className="font-medium">{count}</span>

// ✅ Good:
<span className="font-medium tabular-nums">{count}</span>
```

#### Pattern 6: Text Balance
```typescript
// ❌ Bad:
<h1 className="text-3xl font-bold">Long Title That Might Have Orphans</h1>

// ✅ Good:
<h1 className="text-3xl font-bold text-balance">Long Title That Might Have Orphans</h1>
```

---

### Appendix D: Browser Support

**Focus Trap:** All modern browsers (IE11+ with polyfill)  
**Tabular Nums:** All browsers with OpenType support (98%+)  
**Text-wrap:** Chrome 114+, Firefox 121+, Safari 17.4+ (graceful degradation)  
**Prefers-Reduced-Motion:** All modern browsers (IE11+ with media query)  

**Fallback Strategy:** Graceful degradation for older browsers

---

### Appendix E: Related Documentation

- **Web Interface Guidelines:** https://github.com/vercel-labs/web-interface-guidelines
- **WCAG 2.1 AA:** https://www.w3.org/WAI/WCAG21/quickref/
- **Tailwind Accessibility:** https://tailwindcss.com/docs/screen-readers
- **MDN ARIA:** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA

---

**End of Web Interface Guidelines Compliance Plan**

*Ready for agent implementation. Estimated completion: 45-60 minutes with testing.*
