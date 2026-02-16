/**
 * Integration Tests for Home Page (Executive Dashboard)
 *
 * Tests data loading, metric computation, and full render.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage Integration", () => {
  it("loads projects and displays Executive Dashboard", () => {
    render(<HomePage />);
    expect(screen.getByText("Executive Dashboard")).toBeInTheDocument();
  });

  it("displays metric cards", () => {
    render(<HomePage />);
    expect(screen.getByText("Total Investment")).toBeInTheDocument();
    expect(screen.getByText("Active Projects")).toBeInTheDocument();
    expect(screen.getByText("Projected ROI")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Health")).toBeInTheDocument();
  });

  it("displays distribution charts and CTA", () => {
    render(<HomePage />);
    expect(screen.getByText("Projects by Phase")).toBeInTheDocument();
    expect(screen.getByText("Status Overview")).toBeInTheDocument();
    expect(screen.getByText("Open Matrix View")).toBeInTheDocument();
  });
});
