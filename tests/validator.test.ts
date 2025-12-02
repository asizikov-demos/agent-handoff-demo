import { describe, expect, it } from 'vitest';

import { Grid } from '../src/types';
import { validateGrid } from '../src/validator';

const emptyGrid: Grid = Array.from({ length: 9 }, () => Array(9).fill(0)) as Grid;

describe('validateGrid', () => {
  it('considers an empty grid valid', () => {
    expect(validateGrid(emptyGrid)).toEqual({ valid: true });
  });

  it('detects duplicate values in a row', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[0][0] = 5;
    grid[0][1] = 5;

    const result = validateGrid(grid);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/Row 1/);
    }
  });

  it('detects duplicate values in a column', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[0][0] = 7;
    grid[1][0] = 7;

    const result = validateGrid(grid);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/Column 1/);
    }
  });

  it('detects duplicate values in a 3x3 box', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[0][0] = 4;
    grid[1][1] = 4;

    const result = validateGrid(grid);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/3x3 box/);
    }
  });
});
