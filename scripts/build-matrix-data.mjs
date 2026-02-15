// Builds Strategy Matrix JSON payload from markdown project files.
// ABOUTME: Tiny build pipeline step that materializes /matrix/data.json.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProjectsFromDirectory } from '../src/lib/matrix.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const projectsDirectory = path.join(repoRoot, '_content', 'projects');
const outputDirectory = path.join(repoRoot, 'matrix');
const outputPath = path.join(outputDirectory, 'data.json');

const projects = await loadProjectsFromDirectory(projectsDirectory);

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, JSON.stringify({ projects }, null, 2) + '\n', 'utf8');

console.log(`Wrote ${projects.length} projects to ${outputPath}`);
