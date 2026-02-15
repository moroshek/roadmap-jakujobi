# UI Delivery Plan

**Date:** 2026-02-15  
**Status:** Approved  
**Approach:** Clean professional with subtle polish (Option B)

---

## 1. Page Structure

### `/matrix` Route (Primary Deliverable)

```
┌────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px)          │        MAIN CONTENT                   │
│  ┌────────────────────┐  │  ┌──────────────────────────────────┐ │
│  │ Logo               │  │  │  Breadcrumb: Home > Matrix        │ │
│  ├────────────────────┤  │  ├──────────────────────────────────┤ │
│  │ Navigation         │  │  │                                  │ │
│  │ • Dashboard        │  │  │  STRATEGY MATRIX                 │ │
│  │ • Strategy Matrix  │  │  │  ┌─────────────────────────────┐ │ │
│  │ • Roadmap          │  │  │  │      ↑ Impact (Y)            │ │ │
│  │ • Projects         │  │  │  │ 100┌────────────────┬───────┐│ │ │
│  │ • Updates          │  │  │  │    │ Quick Wins │ Big Bets ││ │ │
│  └────────────────────┘  │  │  │ 50 ├────────────────┼────────┤│ │ │
│  ┌────────────────────┐  │  │  │    │  Fillers   │Time Sinks││ │ │
│  │ FILTERS            │  │  │  │  0└────────────┴─────────┘│ │ │
│  │ Department: [x]    │  │  │  │      0    50   100→ Effort │ │ │
│  │ Phase: [x]         │  │  │  └─────────────────────────────┘ │ │
│  └────────────────────┘  │  │                                  │ │
│  ┌────────────────────┐  │  │  ┌─────────────────────────────┐ │ │
│  │ User Profile       │  │  │  │ Project count: 4            │ │ │
│  └────────────────────┘  │  │  └─────────────────────────────┘ │ │
└──────────────────────────┴──┴────────────────────────────────────┘
```

---

## 2. Component Specifications

### StrategyMatrix Component

**Location:** `src/components/matrix/StrategyMatrix.tsx`

**Dependencies:** Recharts `<ScatterChart>`, `<Scatter>`, `<XAxis>`, `<YAxis>`, `<CartesianGrid>`, `<Tooltip>`, `<ResponsiveContainer>`

**Props:**
```typescript
interface StrategyMatrixProps {
  data: MatrixDataPoint[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}
```

**Visual Specs:**
- Chart size: 100% width, 500px height (responsive)
- Background: 4 quadrant zones with subtle colored backgrounds
  - Quick Wins: `#DCFCE7` (green-100)
  - Big Bets: `#DBEAFE` (blue-100)
  - Fillers: `#FEF3C7` (amber-100)
  - Time Sinks: `#FEE2E2` (red-100)
- Grid: Light gray (`#E5E7EB`), dashed
- Points: 12px circles, filled by quadrant color (darker shade)
- Point hover: Scale 1.2x, show tooltip

**Axes:**
- X-Axis: "Effort (Complexity)" - 0 to 100, ticks at 0, 25, 50, 75, 100
- Y-Axis: "Impact (Strategic Value)" - 0 to 100, ticks at 0, 25, 50, 75, 100
- Axis labels: Centered, medium gray (`#6B7280`)

**Quadrant Labels:**
- Position: Center of each quadrant zone
- Font: 14px, semibold, same color as zone background (darker)
- Text: "Quick Wins", "Big Bets", "Fillers", "Time Sinks"

---

### Custom Tooltip

**Trigger:** Hover on scatter point

**Content:**
```
┌─────────────────────────┐
│ [Project Title]         │
│ ─────────────────────── │
│ Quadrant: [Label]       │
│ Impact: [0-100]         │
│ Effort: [0-100]         │
│ ROI: $X,XXX,XXX         │
│ Department: [Name]      │
└─────────────────────────┘
```

**Styling:**
- Background: White with shadow
- Border: 1px solid `#E5E7EB`
- Padding: 12px
- Font: 14px
- Max-width: 250px

---

### FilterSidebar Component

**Location:** `src/components/ui/FilterSidebar.tsx`

**Props:**
```typescript
interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  departments: string[];
  phases: string[];
}
```

**UI:**
- Collapsible sections (Department, Phase)
- Checkbox list for each filter
- "Clear All" button
- Active filter count badge

---

### Dashboard (Bonus)

**Location:** `src/app/page.tsx`

**Metric Cards:**
```
┌─────────────────────┐  ┌─────────────────────┐
│ Total Investment    │  │ Active Projects     │
│ $9,220,000          │  │ 1                   │
│                     │  │                     │
│ +12% from last month│  │                     │
└─────────────────────┘  └─────────────────────┘
```

**Styling:**
- Card: White background, subtle shadow, rounded corners (8px)
- Metric: 32px bold
- Subtitle: 14px gray
- Grid: 2 columns on desktop, 1 on mobile

---

## 3. Responsive Behavior

| Breakpoint          | Layout       | Matrix Width | Sidebar                |
| ------------------- | ------------ | ------------ | ---------------------- |
| Mobile (<768px)     | Stacked      | Full width   | Hidden, hamburger menu |
| Tablet (768-1024px) | Stacked      | 100%         | Collapsible            |
| Desktop (>1024px)   | Side-by-side | 70%          | Fixed 240px            |

**Matrix Responsiveness:**
- Use `<ResponsiveContainer>` from Recharts
- Min-height: 400px on mobile
- Point size: 10px on mobile, 12px on desktop

---

## 4. Accessibility (WCAG AA Target)

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (2px outline)
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Quadrant labels have `aria-label`
- [ ] Tooltip has `role="tooltip"` and `aria-describedby`
- [ ] Filter checkboxes have proper labels

---

## 5. Animation & Polish

**Subtle animations (no overkill):**
- Point hover: `transform: scale(1.2)` with 150ms ease
- Filter toggle: 200ms fade
- Page load: Staggered fade-in for cards (50ms delay each)
- No parallax, no complex motion

**Typography:**
- Headings: Inter (from config), 600 weight
- Body: Roboto (from config), 400 weight
- Base size: 16px
- Line height: 1.5

---

## 6. Empty States

**No projects match filters:**
```
┌─────────────────────────────────────┐
│                                     │
│   No projects match your filters    │
│                                     │
│   [Clear Filters]                   │
│                                     │
└─────────────────────────────────────┘
```

**No projects loaded:**
```
┌─────────────────────────────────────┐
│                                     │
│   No projects available             │
│   Contact your administrator        │
│                                     │
└─────────────────────────────────────┘
```

---

## 7. Color Palette (from config.json)

```css
:root {
  --color-primary: #0B1220;
  --color-secondary: #2563EB;
  --color-accent: #F59E0B;
  --color-background: #F8FAFC;
  
  /* Quadrant colors */
  --quadrant-quick-wins: #DCFCE7;
  --quadrant-quick-wins-dark: #16A34A;
  --quadrant-big-bets: #DBEAFE;
  --quadrant-big-bets-dark: #2563EB;
  --quadrant-fillers: #FEF3C7;
  --quadrant-fillers-dark: #D97706;
  --quadrant-time-sinks: #FEE2E2;
  --quadrant-time-sinks-dark: #DC2626;
}
```

---

## 8. Implementation Priority

| Priority | Component                             | Time Budget |
| -------- | ------------------------------------- | ----------- |
| P0       | Basic scatter chart with correct axes | 20 min      |
| P0       | Quadrant background zones             | 10 min      |
| P0       | Tooltip with title + quadrant         | 10 min      |
| P1       | Filter sidebar (department + phase)   | 15 min      |
| P1       | Dashboard metric cards                | 10 min      |
| P2       | Responsive layout                     | 10 min      |
| P2       | Accessibility improvements            | 10 min      |
| P3       | Animations/polish                     | 5 min       |

---

## Notes

- Use Tailwind CSS for all styling
- Keep custom CSS to minimum (only quadrant backgrounds)
- Chart must work without filters (show all by default)
- Tooltip shows ROI in addition to required fields (bonus compliance)
