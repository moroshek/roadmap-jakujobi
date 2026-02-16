/**
 * Unit Tests for QuadrantOverlay Component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuadrantOverlay } from "@/components/matrix/QuadrantOverlay";

describe("QuadrantOverlay", () => {
  it("renders all four quadrant labels", () => {
    render(<QuadrantOverlay />);

    expect(screen.getByText("Quick Wins")).toBeInTheDocument();
    expect(screen.getByText("Big Bets")).toBeInTheDocument();
    expect(screen.getByText("Fillers")).toBeInTheDocument();
    expect(screen.getByText("Time Sinks")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <QuadrantOverlay className="custom-overlay" />
    );
    expect(container.firstChild).toHaveClass("custom-overlay");
  });

  it("has aria-hidden for accessibility", () => {
    const { container } = render(<QuadrantOverlay />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("has pointer-events-none for click-through", () => {
    const { container } = render(<QuadrantOverlay />);
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
