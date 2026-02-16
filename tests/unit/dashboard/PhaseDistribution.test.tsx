/**
 * Unit Tests for PhaseDistribution Component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhaseDistribution } from "@/components/dashboard/PhaseDistribution";

describe("PhaseDistribution", () => {
  it("renders all phases", () => {
    const phases = [
      { name: "Foundation", count: 2, color: "#10B981" },
      { name: "Scale", count: 1, color: "#8B5CF6" },
    ];
    render(<PhaseDistribution phases={phases} />);
    expect(screen.getByText("Foundation")).toBeInTheDocument();
    expect(screen.getByText("Scale")).toBeInTheDocument();
  });

  it("displays counts correctly", () => {
    const phases = [
      { name: "Foundation", count: 3, color: "#10B981" },
    ];
    render(<PhaseDistribution phases={phases} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("handles empty phases gracefully", () => {
    render(<PhaseDistribution phases={[]} />);
    expect(screen.getByText("No phase data available")).toBeInTheDocument();
  });
});
