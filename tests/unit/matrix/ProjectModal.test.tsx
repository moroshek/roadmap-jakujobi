/**
 * Unit Tests for ProjectModal Component
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ProjectModal } from "@/components/matrix/ProjectModal";
import { MatrixProvider } from "@/contexts/MatrixContext";
import { mockProject } from "./mockProjects";

describe("ProjectModal", () => {
  it("renders null when no project selected", () => {
    const { container } = render(
      <MatrixProvider>
        <ProjectModal />
      </MatrixProvider>
    );
    expect(container.firstChild).toBeNull();
  });
});
