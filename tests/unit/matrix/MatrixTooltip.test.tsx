/**
 * Unit Tests for MatrixTooltip Component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatrixTooltip } from "@/components/matrix/MatrixTooltip";

const mockPayload = [
  {
    payload: {
      id: "PRJ-001",
      title: "Test Project",
      quadrant: "Quick Wins",
      x: 32,
      y: 86,
      roi: 120000,
      cost: 45000,
    },
  },
];

describe("MatrixTooltip", () => {
  it("renders null when not active", () => {
    const { container } = render(
      <MatrixTooltip active={false} payload={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders null when no payload", () => {
    const { container } = render(<MatrixTooltip active={true} payload={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("displays project title when active", () => {
    render(<MatrixTooltip active={true} payload={mockPayload as never} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("displays quadrant label", () => {
    render(<MatrixTooltip active={true} payload={mockPayload as never} />);
    expect(screen.getByText("Quick Wins")).toBeInTheDocument();
  });

  it("displays impact and effort scores", () => {
    render(<MatrixTooltip active={true} payload={mockPayload as never} />);
    expect(screen.getByText("86/100")).toBeInTheDocument();
    expect(screen.getByText("32/100")).toBeInTheDocument();
  });

  it("displays formatted ROI", () => {
    render(<MatrixTooltip active={true} payload={mockPayload as never} />);
    expect(screen.getByText("$120,000")).toBeInTheDocument();
  });

  it("shows click hint", () => {
    render(<MatrixTooltip active={true} payload={mockPayload as never} />);
    expect(screen.getByText(/click for details/i)).toBeInTheDocument();
  });

  it("has tooltip role for accessibility", () => {
    render(<MatrixTooltip active={true} payload={mockPayload as never} />);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});
