/**
 * Unit Tests for MatrixFilters Component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MatrixFilters } from "@/components/matrix/MatrixFilters";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("MatrixFilters", () => {
  const defaultProps = {
    departments: ["Sales", "Manufacturing"],
    phases: ["Foundation", "Scale"],
    statuses: ["Active", "Queued"],
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders all filter categories", () => {
    render(<MatrixFilters {...defaultProps} />);
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Phase")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders all filter options", () => {
    render(<MatrixFilters {...defaultProps} />);
    expect(screen.getByLabelText("Sales")).toBeInTheDocument();
    expect(screen.getByLabelText("Manufacturing")).toBeInTheDocument();
    expect(screen.getByLabelText("Foundation")).toBeInTheDocument();
    expect(screen.getByLabelText("Scale")).toBeInTheDocument();
    expect(screen.getByLabelText("Active")).toBeInTheDocument();
    expect(screen.getByLabelText("Queued")).toBeInTheDocument();
  });

  it("toggles department filter and calls router.push on click", () => {
    render(<MatrixFilters {...defaultProps} />);
    const salesCheckbox = screen.getByLabelText("Sales");
    fireEvent.click(salesCheckbox);
    expect(mockPush).toHaveBeenCalledWith("/matrix?dept=Sales");
  });

  it("does not show Clear All when no filters active", () => {
    render(<MatrixFilters {...defaultProps} />);
    expect(screen.queryByText(/Clear All/)).not.toBeInTheDocument();
  });
});
