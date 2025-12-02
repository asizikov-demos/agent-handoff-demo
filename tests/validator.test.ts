import { describe, expect, it } from 'vitest';

import { Grid } from '../src/types';
import { validateGrid, isPlacementValid } from '../src/validator';

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

  it('validates a correctly filled grid', () => {
    const validGrid: Grid = [
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

    expect(validateGrid(validGrid)).toEqual({ valid: true });
  });

  it('detects duplicates at far ends of a row', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[0][0] = 3;
    grid[0][8] = 3;

    const result = validateGrid(grid);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/Row 1.*duplicate.*3/);
    }
  });

  it('detects duplicates at far ends of a column', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[0][0] = 8;
    grid[8][0] = 8;

    const result = validateGrid(grid);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/Column 1.*duplicate.*8/);
    }
  });

  it('detects duplicates in corner boxes correctly', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    // Bottom-right box (rows 6-8, cols 6-8)
    grid[6][6] = 1;
    grid[8][8] = 1;

    const result = validateGrid(grid);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/3x3 box.*\(3, 3\)/);
    }
  });
});

describe('isPlacementValid', () => {
  it('returns true for placing 0 (empty cell)', () => {
    expect(isPlacementValid(emptyGrid, 0, 0, 0)).toBe(true);
  });

  it('returns true for valid placement in empty grid', () => {
    expect(isPlacementValid(emptyGrid, 0, 0, 5)).toBe(true);
  });

  it('returns false when same value exists in the row', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[0][5] = 7;

    expect(isPlacementValid(grid, 0, 0, 7)).toBe(false);
  });

  it('returns false when same value exists in the column', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[5][0] = 3;

    expect(isPlacementValid(grid, 0, 0, 3)).toBe(false);
  });

  it('returns false when same value exists in the 3x3 box', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[1][1] = 9;

    expect(isPlacementValid(grid, 0, 0, 9)).toBe(false);
  });

  it('returns true when value is unique in row, column, and box', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[0][5] = 1;
    grid[5][0] = 2;
    grid[1][1] = 3;

    expect(isPlacementValid(grid, 0, 0, 5)).toBe(true);
  });

  it('handles placement in center of grid', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[4][0] = 6; // Same row
    
    expect(isPlacementValid(grid, 4, 4, 6)).toBe(false);
    expect(isPlacementValid(grid, 4, 4, 7)).toBe(true);
  });

  it('handles placement in bottom-right corner', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    grid[8][0] = 4; // Same row
    
    expect(isPlacementValid(grid, 8, 8, 4)).toBe(false);
    expect(isPlacementValid(grid, 8, 8, 5)).toBe(true);
  });

  it('correctly checks box boundaries', () => {
    const grid: Grid = emptyGrid.map((row) => [...row]) as Grid;
    // Place 5 in box (1,1) at position (3,3)
    grid[3][3] = 5;
    
    // Should be invalid for any cell in box (1,1)
    expect(isPlacementValid(grid, 4, 4, 5)).toBe(false);
    expect(isPlacementValid(grid, 5, 5, 5)).toBe(false);
    
    // Should be valid for cell in adjacent box (different row, column, and box)
    expect(isPlacementValid(grid, 6, 6, 5)).toBe(true); // Different box, row, and column
  });
});
