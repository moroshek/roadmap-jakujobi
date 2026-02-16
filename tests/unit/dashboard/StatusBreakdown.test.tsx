/**
 * Unit Tests for StatusBreakdown Component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";

describe("StatusBreakdown", () => {
  it("renders status counts", () => {
    const statuses = {
      active: 2,
      queued: 1,
      backlog: 3,
      paused: 0,
      complete: 1,
    };
    render(<StatusBreakdown statuses={statuses} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders all five status categories", () => {
    const statuses = {
      active: 0,
      queued: 0,
      backlog: 0,
      paused: 0,
      complete: 0,
    };
    render(<StatusBreakdown statuses={statuses} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Queued")).toBeInTheDocument();
    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByText("Paused")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("renders Status Overview heading", () => {
    const statuses = {
      active: 1,
      queued: 0,
      backlog: 0,
      paused: 0,
      complete: 0,
    };
    render(<StatusBreakdown statuses={statuses} />);
    expect(screen.getByText("Status Overview")).toBeInTheDocument();
  });
});
