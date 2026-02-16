/**
 * Unit Tests for MatrixChart Component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatrixChart } from "@/components/matrix/MatrixChart";
import { MatrixProvider } from "@/contexts/MatrixContext";
import { mockProjects } from "./mockProjects";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  ScatterChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scatter-chart">{children}</div>
  ),
  Scatter: () => <div data-testid="scatter" />,
  XAxis: ({ label }: { label?: { value?: string } }) => (
    <div data-testid="x-axis">{label?.value}</div>
  ),
  YAxis: ({ label }: { label?: { value?: string } }) => (
    <div data-testid="y-axis">{label?.value}</div>
  ),
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Cell: () => <div data-testid="cell" />,
}));

function renderWithProvider(ui: React.ReactElement) {
  return render(<MatrixProvider>{ui}</MatrixProvider>);
}

describe("MatrixChart", () => {
  it("renders chart container", () => {
    renderWithProvider(<MatrixChart projects={mockProjects} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("scatter-chart")).toBeInTheDocument();
  });

  it("renders axes with correct labels", () => {
    renderWithProvider(<MatrixChart projects={mockProjects} />);
    expect(screen.getByText(/Effort.*Complexity/i)).toBeInTheDocument();
    expect(screen.getByText(/Impact.*Strategic Value/i)).toBeInTheDocument();
  });

  it("renders scatter points for all projects", () => {
    renderWithProvider(<MatrixChart projects={mockProjects} />);
    expect(screen.getByTestId("scatter")).toBeInTheDocument();
  });

  it("handles empty projects array", () => {
    renderWithProvider(<MatrixChart projects={[]} />);
    expect(screen.getByTestId("scatter-chart")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithProvider(
      <MatrixChart projects={mockProjects} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
