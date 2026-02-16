/**
 * Unit Tests for ARIA labels and landmarks
 */

import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import HomePage from "@/app/page";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MatrixFilters } from "@/components/matrix/MatrixFilters";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("ARIA Labels", () => {
  it("dashboard has main landmark with aria-label", () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector('main[aria-label="Executive Dashboard"]');
    expect(main).toBeInTheDocument();
  });

  it("MetricCard has article role", () => {
    const { container } = render(
      <MetricCard label="Test" value={1} />
    );
    const article = container.querySelector("[role='article']");
    expect(article).toBeInTheDocument();
  });

  it("MatrixFilters has navigation role with aria-label", () => {
    const { container } = render(
      <MatrixFilters
        departments={["Sales"]}
        phases={["Foundation"]}
        statuses={["Active"]}
      />
    );
    const nav = container.querySelector('nav[aria-label="Project filters"]');
    expect(nav).toBeInTheDocument();
  });
});
