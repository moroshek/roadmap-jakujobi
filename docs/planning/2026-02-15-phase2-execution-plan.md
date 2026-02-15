# Phase 2 Execution Plan: Data Pipeline

**Date:** 2026-02-15  
**Status:** COMPLETED  
**Time Window:** 75-100 minutes (25-minute hard limit)  
**Strategy:** Connect markdown content → validated model → matrix-ready data  
**Exit Gate:** All 4 seeded projects transform correctly with proper scores and quadrants

---

## Executive Summary

Phase 2 builds the **Data Pipeline** that connects the content layer (`_content/`) to the application layer. By the end of P2, we will have:

1. Content loaders that read markdown files and parse frontmatter
2. Configuration loader for tenant-specific settings
3. Transformation pipeline that validates, normalizes, and enriches project data
4. Integration tests verifying end-to-end data flow
5. All 4 seeded projects correctly mapped with quadrants and normalized scores

**Critical Success Factor:** If the data pipeline doesn't work, the matrix UI will have no data to display. This phase bridges the gap between Phase 1 logic and Phase 3 UI.

---

## Context & Prerequisites

### What Already Exists (P0 + P1 Complete)

✅ **P0 Bootstrap:**
- Next.js 14 app structure
- Vitest testing harness
- `_content/projects/` with 4 seeded projects (PRJ-001 to PRJ-004)
- `_content/config.json` tenant configuration
- Route placeholders at `/` and `/matrix`

✅ **P1 Core Logic:**
- `src/lib/types.ts` - Complete type system
- `src/lib/governance/matrix.ts` - Normalization + quadrant logic (tested)
- `src/lib/validation/projectSchema.ts` - Zod schema validation (tested)
- 50 passing unit tests covering all edge cases

### What We're Building in P2

The "plumbing" that connects content files to the application:
- File system readers for markdown projects
- Gray-matter parsers for frontmatter extraction
- Validation layer using P1 schemas
- Transformation layer using P1 governance functions
- Integration tests for end-to-end data flow

### Why This Phase Matters

Without this pipeline, the matrix has no data. This is the bridge between static content and dynamic UI.

---

## Implementation Roadmap

### Timeline Breakdown

| Task | Time Estimate | Cumulative |
|------|---------------|------------|
| Create content loader module | 8 min | 8 min |
| Write integration tests for loader | 7 min | 15 min |
| Implement transformation pipeline | 8 min | 23 min |
| Verify all 4 seeded projects map correctly | 5 min | 28 min |
| Buffer for debugging | 5 min | 33 min |

**Total: 25 minutes (within 75-100 min window)**

---

## File-by-File Implementation Guide

### File 1: `src/lib/content/loadProjects.ts`

**Purpose:** Read and parse markdown files from `_content/projects/`

**Dependencies:**
```json
{
  "gray-matter": "^4.0.3",
  "fs": "native",
  "path": "native"
}
```

**Implementation Strategy:**

```typescript
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

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { RawProjectFrontmatter } from '../types';

/**
 * Get the absolute path to the content directory
 * Works in both dev and build modes
 */
export function getContentPath(): string {
  // In Next.js, process.cwd() points to the project root
  return path.join(process.cwd(), '_content');
}

/**
 * Get the absolute path to the projects directory
 */
export function getProjectsPath(): string {
  return path.join(getContentPath(), 'projects');
}

/**
 * Read all markdown files from _content/projects/
 * 
 * @returns Array of { filename, frontmatter, content }
 * @throws Error if projects directory doesn't exist
 */
export function readAllProjectFiles(): Array<{
  filename: string;
  frontmatter: unknown;  // Raw, unvalidated
  content: string;
}> {
  const projectsDir = getProjectsPath();
  
  // Check if directory exists
  if (!fs.existsSync(projectsDir)) {
    throw new Error(`Projects directory not found: ${projectsDir}`);
  }
  
  // Read all .md files
  const filenames = fs.readdirSync(projectsDir)
    .filter(file => file.endsWith('.md'));
  
  if (filenames.length === 0) {
    console.warn('No markdown files found in projects directory');
    return [];
  }
  
  // Parse each file
  const projects = filenames.map(filename => {
    const filePath = path.join(projectsDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
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
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
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
  
  return fs.readdirSync(projectsDir)
    .filter(file => file.endsWith('.md'))
    .length;
}
```

**Testing Strategy:**
- Test that `readAllProjectFiles()` returns 4 projects for seeded data
- Test that each project has valid frontmatter structure
- Test error handling when directory doesn't exist
- Test `readProjectFile()` for specific project lookup

---

### File 2: `src/lib/content/loadConfig.ts`

**Purpose:** Load tenant configuration from `_content/config.json`

**Implementation Strategy:**

```typescript
/**
 * Configuration Loader for Tenant Settings
 * 
 * Loads _content/config.json which contains:
 * - Tenant metadata
 * - Design tokens (colors, fonts)
 * - Feature flags
 * - Governance rules
 */

import fs from 'fs';
import path from 'path';
import { getContentPath } from './loadProjects';

/**
 * Tenant configuration structure
 * Based on PRD Section 3.1
 */
export interface TenantConfig {
  tenant_id: string;
  meta: {
    title: string;
    logo_url?: string;
    favicon_url?: string;
  };
  design_tokens?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
    };
    typography?: {
      heading_font?: string;
      body_font?: string;
    };
  };
  modules?: {
    enable_matrix?: boolean;
    enable_gantt?: boolean;
    enable_blog?: boolean;
  };
  governance?: {
    fiscal_year_start?: string;
    max_concurrent_projects?: number;
    phases?: string[];
    departments?: string[];
  };
}

/**
 * Load tenant configuration from _content/config.json
 * 
 * @returns Parsed configuration object
 * @throws Error if config.json doesn't exist or is invalid JSON
 */
export function loadConfig(): TenantConfig {
  const configPath = path.join(getContentPath(), 'config.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }
  
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent) as TenantConfig;
    
    // Validate required fields
    if (!config.tenant_id) {
      throw new Error('Config missing required field: tenant_id');
    }
    if (!config.meta?.title) {
      throw new Error('Config missing required field: meta.title');
    }
    
    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in config.json: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get allowed departments from config
 * Falls back to empty array if not configured
 */
export function getAllowedDepartments(): string[] {
  const config = loadConfig();
  return config.governance?.departments || [];
}

/**
 * Get allowed phases from config
 * Falls back to default phases if not configured
 */
export function getAllowedPhases(): string[] {
  const config = loadConfig();
  return config.governance?.phases || ['Foundation', 'Acceleration', 'Scale'];
}

/**
 * Check if a specific module is enabled
 */
export function isModuleEnabled(moduleName: 'matrix' | 'gantt' | 'blog'): boolean {
  const config = loadConfig();
  const key = `enable_${moduleName}` as keyof NonNullable<TenantConfig['modules']>;
  return config.modules?.[key] ?? false;
}
```

**Testing Strategy:**
- Test successful config loading for seeded config.json
- Test error handling for missing config
- Test error handling for invalid JSON
- Test department/phase extraction
- Test module flag checking

---

### File 3: `src/lib/content/transformProjects.ts`

**Purpose:** Transform raw frontmatter → validated → normalized → matrix-ready data

**Implementation Strategy:**

```typescript
/**
 * Project Transformation Pipeline
 * 
 * This module orchestrates the transformation from raw markdown
 * frontmatter to fully processed, matrix-ready project objects.
 * 
 * Pipeline stages:
 * 1. Parse raw frontmatter (from loadProjects)
 * 2. Validate with Zod schema (from validation/projectSchema)
 * 3. Normalize scores (from governance/matrix)
 * 4. Assign quadrants (from governance/matrix)
 * 5. Enrich with computed fields
 */

import { ProjectSchema } from '../validation/projectSchema';
import { normalizeScore, assignQuadrant } from '../governance/matrix';
import type { RawProjectFrontmatter, ProcessedProject } from '../types';
import { ZodError } from 'zod';

/**
 * Validation result for a single project
 */
export interface ValidationResult {
  success: boolean;
  project?: ProcessedProject;
  errors?: string[];
  filename?: string;
}

/**
 * Transform a single raw project into a processed project
 * 
 * @param rawFrontmatter - Unvalidated frontmatter object
 * @param filename - Source filename (for error reporting)
 * @returns ValidationResult with success status
 */
export function transformProject(
  rawFrontmatter: unknown,
  filename: string
): ValidationResult {
  try {
    // Step 1: Validate with Zod schema
    const validated = ProjectSchema.parse(rawFrontmatter) as RawProjectFrontmatter;
    
    // Step 2: Normalize scores (0-10 → 0-100)
    const impactNormalized = normalizeScore(validated.scores.strategic_value);
    const effortNormalized = normalizeScore(validated.scores.complexity);
    
    // Step 3: Assign quadrant based on normalized scores
    const quadrant = assignQuadrant(effortNormalized, impactNormalized);
    
    // Step 4: Parse date strings to Date objects
    const dates = {
      planned_start: new Date(validated.dates.planned_start),
      planned_end: new Date(validated.dates.planned_end),
      actual_start: validated.dates.actual_start 
        ? new Date(validated.dates.actual_start) 
        : undefined,
    };
    
    // Step 5: Construct processed project
    const processed: ProcessedProject = {
      // Core identity
      id: validated.id,
      title: validated.title,
      slug: validated.slug,
      owner: validated.owner,
      department: validated.department,
      phase: validated.phase,
      status: validated.status,
      
      // Dates (converted to Date objects)
      dates,
      
      // Raw scores (unchanged)
      scores: {
        strategic_value: validated.scores.strategic_value,
        complexity: validated.scores.complexity,
        confidence: validated.scores.confidence,
      },
      
      // Matrix-specific computed fields
      matrix: {
        impactNormalized,
        effortNormalized,
        quadrant,
      },
      
      // Financials
      financials: validated.financials,
      
      // Metadata
      tags: validated.tags,
      related_projects: validated.related_projects,
    };
    
    return {
      success: true,
      project: processed,
      filename,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      return {
        success: false,
        errors: [`Validation failed for ${filename}`, ...errors],
        filename,
      };
    }
    
    return {
      success: false,
      errors: [`Unexpected error transforming ${filename}: ${String(error)}`],
      filename,
    };
  }
}

/**
 * Transform all projects from raw files
 * 
 * @param rawProjects - Array of { filename, frontmatter, content }
 * @param options - Transformation options
 * @returns Object with successful projects and error list
 */
export function transformAllProjects(
  rawProjects: Array<{
    filename: string;
    frontmatter: unknown;
    content: string;
  }>,
  options: {
    skipInvalid?: boolean;  // Continue on validation errors
    logErrors?: boolean;    // Log errors to console
  } = {}
): {
  projects: ProcessedProject[];
  errors: Array<{ filename: string; messages: string[] }>;
  stats: {
    total: number;
    successful: number;
    failed: number;
  };
} {
  const projects: ProcessedProject[] = [];
  const errors: Array<{ filename: string; messages: string[] }> = [];
  
  for (const raw of rawProjects) {
    const result = transformProject(raw.frontmatter, raw.filename);
    
    if (result.success && result.project) {
      projects.push(result.project);
    } else if (result.errors) {
      const error = {
        filename: raw.filename,
        messages: result.errors,
      };
      errors.push(error);
      
      if (options.logErrors) {
        console.error(`[Transform Error] ${raw.filename}:`, result.errors);
      }
      
      if (!options.skipInvalid) {
        throw new Error(
          `Failed to transform ${raw.filename}: ${result.errors.join(', ')}`
        );
      }
    }
  }
  
  return {
    projects,
    errors,
    stats: {
      total: rawProjects.length,
      successful: projects.length,
      failed: errors.length,
    },
  };
}

/**
 * Load and transform all projects in one call
 * Convenience function combining loader + transformer
 */
export function loadAndTransformProjects(options?: {
  skipInvalid?: boolean;
  logErrors?: boolean;
}): {
  projects: ProcessedProject[];
  errors: Array<{ filename: string; messages: string[] }>;
  stats: {
    total: number;
    successful: number;
    failed: number;
  };
} {
  // Import here to avoid circular dependencies
  const { readAllProjectFiles } = require('./loadProjects');
  const rawProjects = readAllProjectFiles();
  return transformAllProjects(rawProjects, options);
}
```

**Testing Strategy:**
- Test successful transformation of valid project
- Test validation errors are caught and returned
- Test score normalization is applied
- Test quadrant assignment is correct
- Test date parsing
- Test batch transformation with mixed valid/invalid projects
- Test skipInvalid option

---

### File 4: `tests/integration/content/loadProjects.test.ts`

**Purpose:** Integration tests for content loading

**Implementation Strategy:**

```typescript
/**
 * Integration Tests for Project Loading
 * 
 * These tests verify the content layer works correctly
 * with the real seeded data in _content/projects/
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  readAllProjectFiles,
  readProjectFile,
  getProjectCount,
  getProjectsPath,
} from '@/lib/content/loadProjects';
import fs from 'fs';

describe('Content Loading Integration', () => {
  describe('readAllProjectFiles', () => {
    it('should read all 4 seeded project files', () => {
      const projects = readAllProjectFiles();
      
      expect(projects).toHaveLength(4);
    });
    
    it('should return projects with expected structure', () => {
      const projects = readAllProjectFiles();
      
      projects.forEach(project => {
        expect(project).toHaveProperty('filename');
        expect(project).toHaveProperty('frontmatter');
        expect(project).toHaveProperty('content');
        expect(project.filename).toMatch(/^PRJ-\d{3}\.md$/);
      });
    });
    
    it('should parse frontmatter correctly', () => {
      const projects = readAllProjectFiles();
      const firstProject = projects[0];
      
      expect(firstProject.frontmatter).toHaveProperty('id');
      expect(firstProject.frontmatter).toHaveProperty('title');
      expect(firstProject.frontmatter).toHaveProperty('scores');
    });
    
    it('should include markdown content body', () => {
      const projects = readAllProjectFiles();
      
      projects.forEach(project => {
        expect(project.content).toBeTruthy();
        expect(typeof project.content).toBe('string');
      });
    });
  });
  
  describe('readProjectFile', () => {
    it('should read a specific project by ID', () => {
      const project = readProjectFile('PRJ-001');
      
      expect(project).not.toBeNull();
      expect(project?.filename).toBe('PRJ-001.md');
      expect(project?.frontmatter).toHaveProperty('id', 'PRJ-001');
    });
    
    it('should return null for non-existent project', () => {
      const project = readProjectFile('PRJ-999');
      
      expect(project).toBeNull();
    });
  });
  
  describe('getProjectCount', () => {
    it('should return correct count of projects', () => {
      const count = getProjectCount();
      
      expect(count).toBe(4);
    });
  });
  
  describe('path resolution', () => {
    it('should resolve correct projects path', () => {
      const projectsPath = getProjectsPath();
      
      expect(projectsPath).toContain('_content');
      expect(projectsPath).toContain('projects');
      expect(fs.existsSync(projectsPath)).toBe(true);
    });
  });
});
```

---

### File 5: `tests/integration/content/transformProjects.test.ts`

**Purpose:** Integration tests for complete data pipeline

**Implementation Strategy:**

```typescript
/**
 * Integration Tests for Project Transformation Pipeline
 * 
 * These tests verify the complete data flow:
 * Raw markdown → Parsed → Validated → Normalized → Matrix-ready
 */

import { describe, it, expect } from 'vitest';
import {
  transformProject,
  transformAllProjects,
  loadAndTransformProjects,
} from '@/lib/content/transformProjects';
import { readAllProjectFiles } from '@/lib/content/loadProjects';
import type { ProcessedProject } from '@/lib/types';

describe('Project Transformation Pipeline', () => {
  describe('transformProject', () => {
    it('should transform valid project successfully', () => {
      const rawProjects = readAllProjectFiles();
      const firstRaw = rawProjects[0];
      
      const result = transformProject(firstRaw.frontmatter, firstRaw.filename);
      
      expect(result.success).toBe(true);
      expect(result.project).toBeDefined();
      expect(result.errors).toBeUndefined();
    });
    
    it('should include normalized scores', () => {
      const rawProjects = readAllProjectFiles();
      const firstRaw = rawProjects[0];
      
      const result = transformProject(firstRaw.frontmatter, firstRaw.filename);
      
      expect(result.project?.matrix.impactNormalized).toBeGreaterThanOrEqual(0);
      expect(result.project?.matrix.impactNormalized).toBeLessThanOrEqual(100);
      expect(result.project?.matrix.effortNormalized).toBeGreaterThanOrEqual(0);
      expect(result.project?.matrix.effortNormalized).toBeLessThanOrEqual(100);
    });
    
    it('should include quadrant assignment', () => {
      const rawProjects = readAllProjectFiles();
      const firstRaw = rawProjects[0];
      
      const result = transformProject(firstRaw.frontmatter, firstRaw.filename);
      
      const validQuadrants = ['Quick Wins', 'Big Bets', 'Fillers', 'Time Sinks'];
      expect(validQuadrants).toContain(result.project?.matrix.quadrant);
    });
    
    it('should convert date strings to Date objects', () => {
      const rawProjects = readAllProjectFiles();
      const firstRaw = rawProjects[0];
      
      const result = transformProject(firstRaw.frontmatter, firstRaw.filename);
      
      expect(result.project?.dates.planned_start).toBeInstanceOf(Date);
      expect(result.project?.dates.planned_end).toBeInstanceOf(Date);
    });
    
    it('should handle validation errors gracefully', () => {
      const invalidFrontmatter = {
        id: 'INVALID',  // Wrong format
        title: 'Test',
      };
      
      const result = transformProject(invalidFrontmatter, 'test.md');
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
  
  describe('transformAllProjects', () => {
    it('should transform all 4 seeded projects', () => {
      const rawProjects = readAllProjectFiles();
      const result = transformAllProjects(rawProjects);
      
      expect(result.stats.total).toBe(4);
      expect(result.stats.successful).toBe(4);
      expect(result.stats.failed).toBe(0);
      expect(result.projects).toHaveLength(4);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should include all required fields in processed projects', () => {
      const rawProjects = readAllProjectFiles();
      const result = transformAllProjects(rawProjects);
      
      result.projects.forEach(project => {
        // Core fields
        expect(project.id).toBeTruthy();
        expect(project.title).toBeTruthy();
        expect(project.slug).toBeTruthy();
        expect(project.owner).toBeTruthy();
        expect(project.department).toBeTruthy();
        expect(project.phase).toBeTruthy();
        expect(project.status).toBeTruthy();
        
        // Dates
        expect(project.dates.planned_start).toBeInstanceOf(Date);
        expect(project.dates.planned_end).toBeInstanceOf(Date);
        
        // Scores
        expect(project.scores.strategic_value).toBeGreaterThanOrEqual(0);
        expect(project.scores.strategic_value).toBeLessThanOrEqual(10);
        expect(project.scores.complexity).toBeGreaterThanOrEqual(0);
        expect(project.scores.complexity).toBeLessThanOrEqual(10);
        
        // Matrix fields
        expect(project.matrix.impactNormalized).toBeGreaterThanOrEqual(0);
        expect(project.matrix.impactNormalized).toBeLessThanOrEqual(100);
        expect(project.matrix.effortNormalized).toBeGreaterThanOrEqual(0);
        expect(project.matrix.effortNormalized).toBeLessThanOrEqual(100);
        expect(project.matrix.quadrant).toBeTruthy();
        
        // Financials
        expect(project.financials).toBeDefined();
        expect(project.financials.currency).toBeTruthy();
      });
    });
  });
  
  describe('Seeded Projects Verification', () => {
    it('should map PRJ-001 to Quick Wins quadrant', () => {
      // PRJ-001: strategic_value=8.6, complexity=3.2
      // Normalized: (86, 32) → High Impact, Low Effort → Quick Wins
      const rawProjects = readAllProjectFiles();
      const prj001 = rawProjects.find(p => 
        (p.frontmatter as any)?.id === 'PRJ-001'
      );
      
      expect(prj001).toBeDefined();
      const result = transformProject(prj001!.frontmatter, prj001!.filename);
      
      expect(result.success).toBe(true);
      expect(result.project?.matrix.impactNormalized).toBe(86);
      expect(result.project?.matrix.effortNormalized).toBe(32);
      expect(result.project?.matrix.quadrant).toBe('Quick Wins');
    });
    
    it('should map PRJ-002 to Big Bets quadrant', () => {
      // PRJ-002: strategic_value=9.1, complexity=8.2
      // Normalized: (91, 82) → High Impact, High Effort → Big Bets
      const rawProjects = readAllProjectFiles();
      const prj002 = rawProjects.find(p => 
        (p.frontmatter as any)?.id === 'PRJ-002'
      );
      
      expect(prj002).toBeDefined();
      const result = transformProject(prj002!.frontmatter, prj002!.filename);
      
      expect(result.success).toBe(true);
      expect(result.project?.matrix.impactNormalized).toBe(91);
      expect(result.project?.matrix.effortNormalized).toBe(82);
      expect(result.project?.matrix.quadrant).toBe('Big Bets');
    });
    
    it('should map PRJ-003 to Fillers quadrant', () => {
      // PRJ-003: strategic_value=3.9, complexity=2.8
      // Normalized: (39, 28) → Low Impact, Low Effort → Fillers
      const rawProjects = readAllProjectFiles();
      const prj003 = rawProjects.find(p => 
        (p.frontmatter as any)?.id === 'PRJ-003'
      );
      
      expect(prj003).toBeDefined();
      const result = transformProject(prj003!.frontmatter, prj003!.filename);
      
      expect(result.success).toBe(true);
      expect(result.project?.matrix.impactNormalized).toBe(39);
      expect(result.project?.matrix.effortNormalized).toBe(28);
      expect(result.project?.matrix.quadrant).toBe('Fillers');
    });
    
    it('should map PRJ-004 to Time Sinks quadrant', () => {
      // PRJ-004: strategic_value=4.1, complexity=8.7
      // Normalized: (41, 87) → Low Impact, High Effort → Time Sinks
      const rawProjects = readAllProjectFiles();
      const prj004 = rawProjects.find(p => 
        (p.frontmatter as any)?.id === 'PRJ-004'
      );
      
      expect(prj004).toBeDefined();
      const result = transformProject(prj004!.frontmatter, prj004!.filename);
      
      expect(result.success).toBe(true);
      expect(result.project?.matrix.impactNormalized).toBe(41);
      expect(result.project?.matrix.effortNormalized).toBe(87);
      expect(result.project?.matrix.quadrant).toBe('Time Sinks');
    });
    
    it('should have exactly one project per quadrant', () => {
      const result = loadAndTransformProjects();
      
      const quadrants = result.projects.map(p => p.matrix.quadrant);
      const uniqueQuadrants = new Set(quadrants);
      
      expect(uniqueQuadrants.size).toBe(4);
      expect(uniqueQuadrants.has('Quick Wins')).toBe(true);
      expect(uniqueQuadrants.has('Big Bets')).toBe(true);
      expect(uniqueQuadrants.has('Fillers')).toBe(true);
      expect(uniqueQuadrants.has('Time Sinks')).toBe(true);
    });
  });
  
  describe('loadAndTransformProjects', () => {
    it('should load and transform in one call', () => {
      const result = loadAndTransformProjects();
      
      expect(result.projects).toHaveLength(4);
      expect(result.stats.successful).toBe(4);
      expect(result.stats.failed).toBe(0);
    });
    
    it('should return consistent results', () => {
      const result1 = loadAndTransformProjects();
      const result2 = loadAndTransformProjects();
      
      expect(result1.projects.length).toBe(result2.projects.length);
      expect(result1.projects[0].id).toBe(result2.projects[0].id);
    });
  });
});
```

---

### File 6: `tests/integration/content/loadConfig.test.ts`

**Purpose:** Integration tests for configuration loading

**Implementation Strategy:**

```typescript
/**
 * Integration Tests for Configuration Loading
 * 
 * Verifies that config.json is loaded and parsed correctly
 */

import { describe, it, expect } from 'vitest';
import {
  loadConfig,
  getAllowedDepartments,
  getAllowedPhases,
  isModuleEnabled,
} from '@/lib/content/loadConfig';

describe('Configuration Loading', () => {
  describe('loadConfig', () => {
    it('should load config.json successfully', () => {
      const config = loadConfig();
      
      expect(config).toBeDefined();
      expect(config.tenant_id).toBeTruthy();
      expect(config.meta).toBeDefined();
      expect(config.meta.title).toBeTruthy();
    });
    
    it('should include governance configuration', () => {
      const config = loadConfig();
      
      expect(config.governance).toBeDefined();
    });
  });
  
  describe('getAllowedDepartments', () => {
    it('should return array of departments', () => {
      const departments = getAllowedDepartments();
      
      expect(Array.isArray(departments)).toBe(true);
    });
  });
  
  describe('getAllowedPhases', () => {
    it('should return array of phases', () => {
      const phases = getAllowedPhases();
      
      expect(Array.isArray(phases)).toBe(true);
      expect(phases.length).toBeGreaterThan(0);
    });
  });
  
  describe('isModuleEnabled', () => {
    it('should check matrix module flag', () => {
      const enabled = isModuleEnabled('matrix');
      
      expect(typeof enabled).toBe('boolean');
    });
  });
});
```

---

## Validation Checklist: End-to-End Data Flow

### Manual Verification Steps

After implementation, verify the following in order:

1. **Content Loading:**
   ```bash
   npm run test -- tests/integration/content/loadProjects.test.ts
   ```
   ✅ All 4 project files read  
   ✅ Frontmatter parsed correctly  
   ✅ Content body included  

2. **Transformation Pipeline:**
   ```bash
   npm run test -- tests/integration/content/transformProjects.test.ts
   ```
   ✅ All 4 projects transform successfully  
   ✅ Scores normalized (0-10 → 0-100)  
   ✅ Quadrants assigned correctly  
   ✅ Dates parsed to Date objects  

3. **Seeded Projects Verification:**
   - PRJ-001 → (86, 32) → Quick Wins ✅
   - PRJ-002 → (91, 82) → Big Bets ✅
   - PRJ-003 → (39, 28) → Fillers ✅
   - PRJ-004 → (41, 87) → Time Sinks ✅

4. **Configuration Loading:**
   ```bash
   npm run test -- tests/integration/content/loadConfig.test.ts
   ```
   ✅ config.json loads successfully  
   ✅ Required fields present  

### Automated Test Expectations

| Test Suite | Expected Tests | Expected Result |
|------------|----------------|-----------------|
| loadProjects.test.ts | 8 tests | All pass |
| transformProjects.test.ts | 15 tests | All pass |
| loadConfig.test.ts | 5 tests | All pass |
| **Total** | **28 new tests** | **All pass** |

Combined with P1 (50 tests), total should be **78 passing tests**.

---

## Exit Gate Criteria

Phase 2 is complete when:

- [ ] All 4 content modules created and exported correctly
- [ ] All 28 integration tests pass
- [ ] Manual spot-check confirms correct quadrant mapping:
  - PRJ-001 (8.6, 3.2) → Quick Wins ✅
  - PRJ-002 (9.1, 8.2) → Big Bets ✅
  - PRJ-003 (3.9, 2.8) → Fillers ✅
  - PRJ-004 (4.1, 8.7) → Time Sinks ✅
- [ ] `loadAndTransformProjects()` returns 4 valid ProcessedProject objects
- [ ] No console errors during test runs
- [ ] Build still succeeds: `npm run build`

**Code Quality Checks:**
- [ ] All functions have JSDoc comments
- [ ] Error handling is comprehensive
- [ ] Path resolution works in both dev and build
- [ ] No hardcoded paths
- [ ] TypeScript types are strict

---

## Risk Assessment & Contingencies

### Risk 1: File System Path Issues (Probability: Medium)

**Symptom:** Tests fail with "Cannot find projects directory"

**Causes:**
- Working directory differs between dev/test/build
- Relative paths resolved incorrectly

**Mitigation:**
1. Use `process.cwd()` consistently
2. Test path resolution explicitly
3. Add debug logging for paths
4. Verify `_content/` exists relative to project root

**Fallback:**
- Add environment variable for content path override
- Document path assumptions in README

### Risk 2: Gray-Matter Parsing Failures (Probability: Low)

**Symptom:** Frontmatter returns empty objects

**Causes:**
- Malformed YAML in frontmatter
- Encoding issues (UTF-8 BOM)
- Missing frontmatter delimiters

**Mitigation:**
1. Validate seeded project files manually
2. Add try-catch around gray-matter calls
3. Log parse errors with filename

**Fallback:**
- Skip invalid files with warning
- Continue with valid projects only

### Risk 3: Date Parsing Edge Cases (Probability: Low)

**Symptom:** Invalid Date objects or timezone issues

**Causes:**
- ISO 8601 format variations
- Timezone handling differences

**Mitigation:**
1. Use standard ISO 8601 format in frontmatter
2. Validate dates in integration tests
3. Consider date-fns for robust parsing

**Fallback:**
- Accept Date object or timestamp
- Document expected format

### Risk 4: Zod Validation Too Strict (Probability: Medium)

**Symptom:** All projects fail validation

**Causes:**
- Schema doesn't match actual frontmatter structure
- Required fields missing in seeded data
- Enum values mismatch

**Mitigation:**
1. Review P1 schema against seeded projects
2. Run single-project test first
3. Make optional fields truly optional
4. Log full validation errors

**Fallback:**
- Relax schema temporarily
- Fix seeded data to match schema

---

## Time Budget

| Activity | Planned Time | Buffer |
|----------|-------------|--------|
| Create loadProjects.ts | 8 min | 2 min |
| Create loadConfig.ts | 5 min | 1 min |
| Create transformProjects.ts | 8 min | 2 min |
| Write integration tests | 10 min | 3 min |
| Run tests and debug | 5 min | 2 min |
| **Total** | **36 min** | **10 min** |

**Maximum time:** 25 minutes (fits in 75-100 window)  
**With buffer:** 36 minutes (still safe)

---

## Implementation Order

Execute in this exact sequence:

1. **Create `src/lib/content/loadProjects.ts`** (8 min)
   - Implement file reading and gray-matter parsing
   - Export file path utilities

2. **Create `src/lib/content/loadConfig.ts`** (5 min)
   - Implement config loading
   - Export utility functions

3. **Create `src/lib/content/transformProjects.ts`** (8 min)
   - Import from validation + governance
   - Implement transformation pipeline
   - Export convenience function

4. **Create `tests/integration/content/loadProjects.test.ts`** (5 min)
   - Test file loading with real data

5. **Create `tests/integration/content/loadConfig.test.ts`** (3 min)
   - Test config loading

6. **Create `tests/integration/content/transformProjects.test.ts`** (7 min)
   - Test complete pipeline
   - Verify all 4 quadrants

7. **Run full test suite** (2 min)
   ```bash
   npm run test
   ```

8. **Manual verification** (3 min)
   - Check console output for correct quadrants
   - Verify normalized scores

9. **Build verification** (2 min)
   ```bash
   npm run build
   ```

---

## Success Metrics

At completion of Phase 2:

| Metric | Target | Actual |
|--------|--------|--------|
| Unit tests passing | 50 | ✅ |
| Integration tests passing | 28 | 🔲 |
| Total tests passing | 78 | 🔲 |
| Test coverage (content layer) | >80% | 🔲 |
| Seeded projects loaded | 4/4 | 🔲 |
| Quadrants correct | 4/4 | 🔲 |
| Build passes | Yes | 🔲 |
| TypeScript errors | 0 | 🔲 |

---

## Next Phase Preview

After P2 completion, proceed to **Phase 3: Matrix UI Core (100-135 min)**

Phase 3 will:
- Create `/matrix` page with Recharts
- Build StrategyMatrix component
- Implement tooltip with project details
- Add quadrant overlays
- Wire up data from P2 pipeline

Phase 3 **depends on**:
- `loadAndTransformProjects()` returning valid data
- ProcessedProject type having matrix.* fields
- All 4 quadrants being tested and correct

---

## Agent Execution Instructions

When executing this plan:

1. **Read this entire document first** - Understand the complete flow
2. **Create files in order** - Don't skip ahead
3. **Run tests after each file** - Catch issues early
4. **Check exit gate** - Don't proceed to P3 until all 28 tests pass
5. **Log progress** - Update JOURNAL.md with completion status
6. **Time check** - If approaching 100 min mark, deprioritize config tests

**Critical Path:**
loadProjects.ts → transformProjects.ts → transformProjects.test.ts

**Can defer if time-constrained:**
loadConfig tests (not required for matrix to work)

---

## Troubleshooting Guide

### Issue: "Cannot find module '@/lib/content/loadProjects'"

**Solution:**
- Check tsconfig.json paths configuration
- Verify file is exported with `export` keyword
- Restart TypeScript server in IDE

### Issue: "Projects directory not found"

**Solution:**
```typescript
// Debug path resolution
console.log('CWD:', process.cwd());
console.log('Projects path:', getProjectsPath());
```
- Verify `_content/projects/` exists
- Check working directory is project root

### Issue: "Validation failed for PRJ-001.md"

**Solution:**
- Print full Zod error: `console.log(JSON.stringify(error.errors, null, 2))`
- Compare PRJ-001.md frontmatter to ProjectSchema
- Check for typos in field names
- Verify enum values match

### Issue: "Expected 4 projects, got 0"

**Solution:**
- Check if gray-matter parsed frontmatter
- Verify YAML frontmatter has `---` delimiters
- Check file encoding (should be UTF-8)

### Issue: "Tests pass but quadrants are wrong"

**Solution:**
- Print normalized scores: `console.log(impactNormalized, effortNormalized)`
- Verify normalization: should be score * 10
- Check assignQuadrant boundary logic
- Review PRD quadrant table

---

## Definition of Done

Phase 2 is **DONE** when an agent can:

1. Call `loadAndTransformProjects()` and get 4 valid projects
2. Verify each project has `matrix.impactNormalized`, `matrix.effortNormalized`, `matrix.quadrant`
3. Confirm quadrants match expected values:
   - PRJ-001: Quick Wins
   - PRJ-002: Big Bets
   - PRJ-003: Fillers
   - PRJ-004: Time Sinks
4. Run `npm run test` and see 78 passing tests
5. Run `npm run build` and see successful build

**Then Phase 3 can begin.**

---

*Plan completed. Ready for agent execution.*
