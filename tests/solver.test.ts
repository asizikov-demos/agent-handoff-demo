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
});
