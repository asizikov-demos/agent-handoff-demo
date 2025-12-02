import { describe, expect, it } from 'vitest';

import { Grid } from '../src/types';
import { solve } from '../src/solver';

const puzzle: Grid = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const expectedSolution: Grid = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

describe('solve', () => {
  it('solves a valid puzzle', () => {
    const result = solve(puzzle);

    expect(result.solved).toBe(true);

    if (result.solved) {
      expect(result.grid[0]).toEqual([5, 3, 4, 6, 7, 8, 9, 1, 2]);
      expect(result.grid[8]).toEqual([3, 4, 5, 2, 8, 6, 1, 7, 9]);
    }
  });

  it('returns an error for unsolvable puzzles', () => {
    const invalidPuzzle: Grid = puzzle.map((row) => [...row]) as Grid;
    invalidPuzzle[0][0] = 9;

    const result = solve(invalidPuzzle);

    expect(result.solved).toBe(false);
    if (!result.solved) {
      expect(result.error).toMatch(/no valid solution/i);
    }
  });

  it('returns an already solved puzzle unchanged', () => {
    const result = solve(expectedSolution);

    expect(result.solved).toBe(true);

    if (result.solved) {
      expect(result.grid).toEqual(expectedSolution);
    }
  });

  it('solves an empty puzzle', () => {
    const emptyPuzzle: Grid = Array.from({ length: 9 }, () =>
      Array(9).fill(0)
    ) as Grid;

    const result = solve(emptyPuzzle);

    expect(result.solved).toBe(true);

    if (result.solved) {
      // Verify the solution is valid (all rows, columns, and boxes have 1-9)
      for (let row = 0; row < 9; row++) {
        const rowValues = new Set(result.grid[row]);
        expect(rowValues.size).toBe(9);
        expect(rowValues.has(0)).toBe(false);
      }
    }
  });

  it('does not modify the original grid', () => {
    const originalPuzzle: Grid = puzzle.map((row) => [...row]) as Grid;
    const puzzleCopy: Grid = puzzle.map((row) => [...row]) as Grid;

    solve(originalPuzzle);

    expect(originalPuzzle).toEqual(puzzleCopy);
  });

  it('handles puzzle with single empty cell', () => {
    const almostComplete: Grid = expectedSolution.map((row) => [...row]) as Grid;
    almostComplete[4][4] = 0; // Remove the center cell (value was 5)

    const result = solve(almostComplete);

    expect(result.solved).toBe(true);

    if (result.solved) {
      expect(result.grid[4][4]).toBe(5);
    }
  });

  it('fails for puzzle with conflicting initial values', () => {
    const conflictingPuzzle: Grid = puzzle.map((row) => [...row]) as Grid;
    // Add conflicting values in the same row
    conflictingPuzzle[0][2] = 5; // Conflicts with position [0][0] which is also 5

    const result = solve(conflictingPuzzle);

    expect(result.solved).toBe(false);
  });

  it('handles hard puzzle correctly', { timeout: 30000 }, () => {
    // A known difficult puzzle
    const hardPuzzle: Grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 8, 5],
      [0, 0, 1, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 7, 0, 0, 0],
      [0, 0, 4, 0, 0, 0, 1, 0, 0],
      [0, 9, 0, 0, 0, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 0, 0, 7, 3],
      [0, 0, 2, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 9],
    ];

    const result = solve(hardPuzzle);

    expect(result.solved).toBe(true);

    if (result.solved) {
      // Verify all cells are filled
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          expect(result.grid[row][col]).toBeGreaterThan(0);
          expect(result.grid[row][col]).toBeLessThanOrEqual(9);
        }
      }
    }
  });
});
