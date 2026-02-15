// Verifies matrix normalization and quadrant assignment behavior.
// ABOUTME: Focused tests for Strategy Matrix transformation rules.
import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuadrantLabel, normalizeScore, parseProjectMarkdown } from './matrix.js';

test('normalizeScore maps 0-10 range to 0-100 and clamps outliers', () => {
  assert.equal(normalizeScore(0), 0);
  assert.equal(normalizeScore(5), 50);
  assert.equal(normalizeScore(10), 100);
  assert.equal(normalizeScore(11), 100);
  assert.equal(normalizeScore(-2), 0);
});

test('getQuadrantLabel follows PRD quadrant rules', () => {
  assert.equal(getQuadrantLabel({ impact: 80, effort: 20 }), 'Quick Wins');
  assert.equal(getQuadrantLabel({ impact: 80, effort: 70 }), 'Big Bets');
  assert.equal(getQuadrantLabel({ impact: 20, effort: 20 }), 'Fillers');
  assert.equal(getQuadrantLabel({ impact: 20, effort: 70 }), 'Time Sinks');
});

test('parseProjectMarkdown extracts title and computes normalized matrix fields', () => {
  const markdown = `---
id: "PRJ-999"
title: "Example Project"
scores:
  strategic_value: 8.5
  complexity: 4
---\n`;

  const parsed = parseProjectMarkdown(markdown);

  assert.equal(parsed.id, 'PRJ-999');
  assert.equal(parsed.title, 'Example Project');
  assert.equal(parsed.impact, 85);
  assert.equal(parsed.effort, 40);
  assert.equal(parsed.quadrantLabel, 'Quick Wins');
});
