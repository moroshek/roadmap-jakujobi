/**
 * Home Page - Executive Dashboard
 *
 * Displays key portfolio metrics, phase distribution, and status breakdown.
 * Data is loaded at build time via loadAndTransformProjects.
 */

import Link from "next/link";
import { loadAndTransformProjects } from "@/lib/content/transformProjects";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PhaseDistribution } from "@/components/dashboard/PhaseDistribution";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";

function getPhaseColor(phase: string): string {
  const colors: Record<string, string> = {
    Foundation: "#10B981",
    Acceleration: "#3B82F6",
    Scale: "#8B5CF6",
  };
  return colors[phase] ?? "#6B7280";
}

export default function HomePage() {
  const result = loadAndTransformProjects({
    skipInvalid: true,
    logErrors: false,
  });
  const projects = result.projects;

  const totalInvestment = projects.reduce(
    (sum, p) => sum + (p.financials.estimated_cost ?? 0),
    0
  );
  const totalROI = projects.reduce(
    (sum, p) => sum + (p.financials.projected_roi ?? 0),
    0
  );
  const roiMultiplier =
    totalInvestment > 0
      ? (totalROI / totalInvestment).toFixed(1)
      : "0.0";
  const activeCount = projects.filter((p) => p.status === "Active").length;

  const phaseCounts = projects.reduce(
    (acc, project) => {
      acc[project.phase] = (acc[project.phase] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const phaseData = Object.entries(phaseCounts).map(([name, count]) => ({
    name,
    count,
    color: getPhaseColor(name),
  }));

  const statusCounts = {
    active: projects.filter((p) => p.status === "Active").length,
    queued: projects.filter((p) => p.status === "Queued").length,
    backlog: projects.filter((p) => p.status === "Backlog").length,
    paused: projects.filter((p) => p.status === "Paused").length,
    complete: projects.filter((p) => p.status === "Complete").length,
  };

  const activePercent =
    projects.length > 0
      ? ((activeCount / projects.length) * 100).toFixed(0)
      : "0";

  return (
    <main
      className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
      role="main"
      aria-label="Executive Dashboard"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Executive Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Strategic portfolio overview and key metrics
          </p>
        </div>

        <section
          aria-labelledby="metrics-heading"
          className="mb-8"
        >
          <h2 id="metrics-heading" className="sr-only">
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <MetricCard
              label="Total Investment"
              value={`$${(totalInvestment / 1000).toFixed(0)}K`}
              subtitle={`Across ${projects.length} projects`}
            />
            <MetricCard
              label="Active Projects"
              value={activeCount}
              subtitle="Currently in progress"
            />
            <MetricCard
              label="Projected ROI"
              value={`$${(totalROI / 1000).toFixed(0)}K`}
              subtitle={`${roiMultiplier}x multiplier`}
            />
            <MetricCard
              label="Portfolio Health"
              value="Strong"
              subtitle={`${activePercent}% active`}
            />
          </div>
        </section>

        <section
          aria-labelledby="distributions-heading"
          className="mb-8"
        >
          <h2 id="distributions-heading" className="sr-only">
            Phase and Status Distributions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <PhaseDistribution phases={phaseData} />
            <StatusBreakdown statuses={statusCounts} />
          </div>
        </section>

        <section
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          aria-labelledby="cta-heading"
        >
          <h2
            id="cta-heading"
            className="text-xl font-semibold text-blue-900 mb-2"
          >
            Explore Strategy Matrix
          </h2>
          <p className="text-blue-700 mb-4">
            Visualize your portfolio on the Impact vs. Effort matrix to identify
            Quick Wins and Big Bets.
          </p>
          <Link
            href="/matrix"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          >
            Open Matrix View
          </Link>
        </section>
      </div>
    </main>
  );
}
