// Parses project markdown and computes matrix coordinates/quadrants.
// ABOUTME: Shared Strategy Matrix transformation logic for build and tests.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const RAW_MIN = 0;
const RAW_MAX = 10;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const normalizeScore = (rawScore) => {
  const numeric = Number(rawScore);
  if (Number.isNaN(numeric)) return 0;
  const clamped = clamp(numeric, RAW_MIN, RAW_MAX);
  return Math.round((clamped / RAW_MAX) * 1000) / 10;
};

export const getQuadrantLabel = ({ impact, effort }) => {
  if (impact >= 50 && effort < 50) return 'Quick Wins';
  if (impact >= 50 && effort >= 50) return 'Big Bets';
  if (impact < 50 && effort < 50) return 'Fillers';
  return 'Time Sinks';
};

export const parseProjectMarkdown = (markdown) => {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';

  const id = frontmatter.match(/^id:\s*"([^"]+)"/m)?.[1] ?? '';
  const title = frontmatter.match(/^title:\s*"([^"]+)"/m)?.[1] ?? id;
  const impactRaw = Number(frontmatter.match(/^\s*strategic_value:\s*([0-9.]+)/m)?.[1]);
  const effortRaw = Number(frontmatter.match(/^\s*complexity:\s*([0-9.]+)/m)?.[1]);

  const impact = normalizeScore(impactRaw);
  const effort = normalizeScore(effortRaw);

  return {
    id,
    title,
    impact,
    effort,
    quadrantLabel: getQuadrantLabel({ impact, effort })
  };
};

export const loadProjectsFromDirectory = async (projectsDirectory) => {
  const files = await readdir(projectsDirectory);
  const markdownFiles = files.filter((file) => file.endsWith('.md'));

  const projects = await Promise.all(
    markdownFiles.map(async (file) => {
      const markdown = await readFile(path.join(projectsDirectory, file), 'utf8');
      return parseProjectMarkdown(markdown);
    })
  );

  return projects.filter((project) => project.id && project.title);
};
