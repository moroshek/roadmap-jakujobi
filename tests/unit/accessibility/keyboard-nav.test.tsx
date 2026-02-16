/**
 * Unit Tests for Keyboard Navigation
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatrixFilters } from "@/components/matrix/MatrixFilters";
import HomePage from "@/app/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Keyboard Navigation", () => {
  it("filter checkboxes are focusable", () => {
    render(
      <MatrixFilters
        departments={["Sales"]}
        phases={[]}
        statuses={[]}
      />
    );
    const checkbox = screen.getByLabelText("Sales");
    checkbox.focus();
    expect(document.activeElement).toBe(checkbox);
  });

  it("matrix CTA link is focusable on home page", () => {
    render(<HomePage />);
    const link = screen.getByText("Matrix View");
    expect(link).toHaveAttribute("href", "/matrix");
    link.focus();
    expect(document.activeElement).toBe(link);
  });
});