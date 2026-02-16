/**
 * Integration Tests for Matrix Page
 *
 * Tests the complete flow: load projects from disk, transform via P2 pipeline,
 * render in chart. Uses real loadAndTransformProjects (no mocks at integration level).
 * Mocks next/navigation for MatrixFilters (no App Router in test env).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MatrixPage from "@/app/matrix/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Matrix Page Integration", () => {
  it("renders strategy matrix heading", () => {
    render(<MatrixPage />);
    expect(screen.getByText(/strategy matrix/i)).toBeInTheDocument();
  });

  it("loads and displays projects from _content", () => {
    render(<MatrixPage />);

    expect(screen.getByText(/visualizing \d+ projects?/i)).toBeInTheDocument();
  });

  it("displays quadrant count stats or labels", () => {
    render(<MatrixPage />);

    expect(screen.getAllByText("Quick Wins").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Big Bets").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Fillers").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Time Sinks").length).toBeGreaterThan(0);
  });

  it("shows tip for hover and click interaction", () => {
    render(<MatrixPage />);
    expect(
      screen.getByText(/hover over points to see details/i)
    ).toBeInTheDocument();
  });
});
