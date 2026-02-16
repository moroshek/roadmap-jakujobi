/**
 * Unit Tests for useProjects Hook
 *
 * Tests loading state, error handling, and empty state.
 * Mocks fetch to simulate API response.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProjects } from "@/lib/hooks/useProjects";
import { mockProjects } from "../matrix/mockProjects";

describe("useProjects", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns loading state initially", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    );

    const { result } = renderHook(() => useProjects());

    expect(result.current.loading).toBe(true);
    expect(result.current.projects).toEqual([]);
  });

  it("returns projects when fetch succeeds", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ projects: mockProjects }),
      })
    ));

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.projects).toEqual(mockProjects);
    expect(result.current.error).toBeNull();
    expect(result.current.isEmpty).toBe(false);
  });

  it("returns error when fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error")))
    );

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.projects).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain("Network error");
  });

  it("returns isEmpty when fetch returns empty array", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ projects: [] }),
      })
    ));

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.projects).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });
});
