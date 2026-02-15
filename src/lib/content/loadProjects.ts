/**
 * Content Loader for Project Markdown Files
 *
 * This module is responsible for:
 * 1. Reading markdown files from _content/projects/
 * 2. Parsing frontmatter using gray-matter
 * 3. Returning raw frontmatter objects (no validation here)
 *
 * Validation happens in the transformation layer.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Get the absolute path to the content directory
 * Works in both dev and build modes
 */
export function getContentPath(): string {
  return path.join(process.cwd(), "_content");
}

/**
 * Get the absolute path to the projects directory
 */
export function getProjectsPath(): string {
  return path.join(getContentPath(), "projects");
}

/**
 * Read all markdown files from _content/projects/
 *
 * @returns Array of { filename, frontmatter, content }
 * @throws Error if projects directory doesn't exist
 */
export function readAllProjectFiles(): Array<{
  filename: string;
  frontmatter: unknown;
  content: string;
}> {
  const projectsDir = getProjectsPath();

  if (!fs.existsSync(projectsDir)) {
    throw new Error(`Projects directory not found: ${projectsDir}`);
  }

  const filenames = fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".md"));

  if (filenames.length === 0) {
    console.warn("No markdown files found in projects directory");
    return [];
  }

  const projects = filenames.map((filename) => {
    const filePath = path.join(projectsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      filename,
      frontmatter: data,
      content,
    };
  });

  return projects;
}

/**
 * Read a single project file by ID
 *
 * @param projectId - The project ID (e.g., "PRJ-001")
 * @returns Parsed file or null if not found
 */
export function readProjectFile(projectId: string): {
  filename: string;
  frontmatter: unknown;
  content: string;
} | null {
  const projectsDir = getProjectsPath();
  const expectedFilename = `${projectId}.md`;
  const filePath = path.join(projectsDir, expectedFilename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    filename: expectedFilename,
    frontmatter: data,
    content,
  };
}

/**
 * Get count of project files (useful for metrics)
 */
export function getProjectCount(): number {
  const projectsDir = getProjectsPath();

  if (!fs.existsSync(projectsDir)) {
    return 0;
  }

  return fs.readdirSync(projectsDir).filter((file) => file.endsWith(".md"))
    .length;
}
