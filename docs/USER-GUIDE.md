# User Guide

How to use each view, filter and search, and how to read the Strategy Matrix.

---

## Routes Overview

| Route | Purpose |
|-------|---------|
| `/` | Executive Dashboard - metrics, phase and status charts, recent activity |
| `/matrix` | Strategy Matrix - scatter plot of Impact vs Effort with quadrant labels |
| `/roadmap` | Gantt timeline - projects on a horizontal timeline with grouping |
| `/projects` | Project Library - searchable catalog with filters and sort |
| `/projects/[id]` | Project Detail - full information for a single project (e.g. PRJ-001) |

---

## Executive Dashboard (/)

**Purpose:** Quick overview of the portfolio.

### Sections

1. **Metric Cards**
   - **Total Investment** - Sum of estimated costs across all projects
   - **Active Projects** - Count of projects with status "Active"
   - **Projected ROI** - Sum of projected ROI and ROI multiplier
   - **Portfolio Health** - Summary based on percent of active projects

2. **Phase Distribution**
   - Bar chart showing how many projects are in each phase (Foundation, Acceleration, Scale)

3. **Status Breakdown**
   - Counts for Active, Queued, Backlog, Paused, Complete

4. **Recent Activity**
   - List of recent projects (e.g. last 5 by date)

5. **Explore Portfolio**
   - Links to Matrix View, Roadmap, and Projects

---

## Strategy Matrix (/matrix)

**Purpose:** Compare projects by Impact (strategic value) and Effort (complexity).

### Layout

- **X-Axis:** Effort (0–100, low to high)
- **Y-Axis:** Impact (0–100, low to high)
- Each dot is a project. Position shows its Impact and Effort.

### Interpreting the Quadrants

The chart is split into four quadrants at (50, 50):

| Quadrant | Impact | Effort | Meaning |
|----------|--------|--------|---------|
| **Quick Wins** | High (>= 50) | Low (< 50) | High value, low effort. Best candidates to start first. |
| **Big Bets** | High (>= 50) | High (>= 50) | High value, high effort. Important but resource-heavy. |
| **Fillers** | Low (< 50) | Low (< 50) | Low value, low effort. Optional or filler work. |
| **Time Sinks** | Low (< 50) | High (>= 50) | Low value, high effort. Avoid unless there is a strong reason. |

### Interactions

- **Hover** - Tooltip shows project title, quadrant, and projected ROI
- **Click** - Opens a modal with full project details
- **Filters** - Use the filter panel to narrow by Department, Phase, or Status

### Using Filters

- Select one or more values in each category
- **Within a category:** OR (e.g. Sales OR Manufacturing)
- **Across categories:** AND (e.g. Sales AND Foundation)
- Filters are stored in the URL, so you can share filtered views
- Use "Clear All" to reset filters

---

## Roadmap (/roadmap)

**Purpose:** See projects on a timeline.

### Layout

- Horizontal timeline with project bars
- Each bar shows planned start and end
- Bars are colored by status (e.g. Active, Queued, Backlog)
- A vertical "Today" line marks the current date

### Grouping

Use the grouping dropdown to organize rows by:

- **Department** - Manufacturing, Supply Chain, Sales, After-Sales
- **Status** - Active, Queued, Backlog, Paused, Complete
- **Phase** - Foundation, Acceleration, Scale

### Interaction

- Scroll horizontally to see more of the timeline
- Bars show the project’s date range

---

## Project Library (/projects)

**Purpose:** Browse and search all projects.

### Search

- Type in the search bar for fuzzy search
- Matches across: title, ID, tags, owner, department
- Use at least 2 characters to trigger search
- Results update as you type

### Filters

- Multi-select for Status, Department, Phase
- Combine filters to narrow results

### View Toggle

- **Cards** - Grid of project cards
- **Table** - Compact table view

### Sort

- Use the sort dropdown to order by date, status, or other fields

---

## Project Detail (/projects/[id])

**Purpose:** Full view of a single project.

### Sections

- **Hero** - Title, ID, status badge
- **Tabs** - Overview (markdown content), Plan, Updates
- **Sidebar** - Metrics (cost, ROI, dates), team, dependencies

### Navigation

- Use breadcrumbs or the Projects link to return to the library

---

## Filter and Search Tips

### Matrix Filters

- Filter by `dept`, `phase`, `status` in the URL
- Example: `/matrix?dept=Manufacturing&phase=Foundation`
- Multiple values: `/matrix?dept=Sales&dept=Manufacturing`

### Project Library Search

- Searches are fuzzy (e.g. "maint" can match "Maintenance")
- Title has the highest weight, then ID, tags, owner, department

### Empty Results

- Relax or clear filters
- Check that your search term is at least 2 characters
- Verify that projects exist for the selected filters

---

## Interpretation Guide: What Do Quadrants Mean?

### Quick Wins (top-left)

- **Impact >= 50, Effort < 50**
- Strong strategic value, relatively low complexity
- **Action:** Prioritize these when you want fast, high-value outcomes

### Big Bets (top-right)

- **Impact >= 50, Effort >= 50**
- High strategic value but high complexity
- **Action:** Plan resources and timeline carefully; these define major initiatives

### Fillers (bottom-left)

- **Impact < 50, Effort < 50**
- Low value and low complexity
- **Action:** Fit in when capacity allows; avoid letting them displace Quick Wins

### Time Sinks (bottom-right)

- **Impact < 50, Effort >= 50**
- Low value with high complexity
- **Action:** Question whether to do these; consider deprioritizing or stopping

### Portfolio Balance

- **Too many Quick Wins:** Likely good ROI if you can execute
- **Too many Time Sinks:** Review scope and value
- **Heavy Big Bets:** Ensure you have capacity and governance
- **Many Fillers:** Check if effort is better spent on higher-impact work
