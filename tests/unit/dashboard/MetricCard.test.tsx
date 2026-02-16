/**
 * Unit Tests for MetricCard Component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/components/dashboard/MetricCard";

describe("MetricCard", () => {
  it("renders label and value", () => {
    render(<MetricCard label="Active Projects" value={5} />);
    expect(screen.getByText("Active Projects")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders optional subtitle when provided", () => {
    render(
      <MetricCard
        label="ROI"
        value="3.2x"
        subtitle="Target: 4.0x"
      />
    );
    expect(screen.getByText("Target: 4.0x")).toBeInTheDocument();
  });

  it("handles string value", () => {
    render(
      <MetricCard label="Total Investment" value="$250K" />
    );
    expect(screen.getByText("$250K")).toBeInTheDocument();
  });
});
