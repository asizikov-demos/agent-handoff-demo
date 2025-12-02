import { describe, expect, it } from 'vitest';

import { formatGrid } from '../src/formatter';
import { Grid } from '../src/types';

const solvedGrid: Grid = [
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

describe('formatGrid', () => {
  it('renders the grid with separators', () => {
    const output = formatGrid(solvedGrid);
    const lines = output.split('\n');

    expect(lines[0]).toBe('5 3 4 | 6 7 8 | 9 1 2');
    expect(lines[3]).toBe('------+-------+------');
    expect(lines[8]).toBe('9 6 1 | 5 3 7 | 2 8 4');
  });

  it('renders empty cells as asterisks', () => {
    const gridWithEmpty: Grid = solvedGrid.map((row) => [...row]) as Grid;
    gridWithEmpty[0][0] = 0;
    gridWithEmpty[4][4] = 0;

    const output = formatGrid(gridWithEmpty);
    const lines = output.split('\n');

    expect(lines[0]).toBe('* 3 4 | 6 7 8 | 9 1 2');
    expect(lines[5]).toBe('4 2 6 | 8 * 3 | 7 9 1');
  });

  it('has exactly 11 lines of output', () => {
    const output = formatGrid(solvedGrid);
    const lines = output.split('\n');

    expect(lines).toHaveLength(11);
  });

  it('has horizontal separators at correct positions', () => {
    const output = formatGrid(solvedGrid);
    const lines = output.split('\n');

    // Separators should be at indices 3 and 7 (after rows 3 and 6)
    expect(lines[3]).toBe('------+-------+------');
    expect(lines[7]).toBe('------+-------+------');

    // Other lines should not be separators
    expect(lines[0]).not.toContain('---');
    expect(lines[1]).not.toContain('---');
    expect(lines[2]).not.toContain('---');
    expect(lines[4]).not.toContain('---');
    expect(lines[5]).not.toContain('---');
    expect(lines[6]).not.toContain('---');
    expect(lines[8]).not.toContain('---');
    expect(lines[9]).not.toContain('---');
    expect(lines[10]).not.toContain('---');
  });

  it('formats a completely empty grid', () => {
    const emptyGrid: Grid = Array.from({ length: 9 }, () =>
      Array(9).fill(0)
    ) as Grid;

    const output = formatGrid(emptyGrid);
    const lines = output.split('\n');

    expect(lines[0]).toBe('* * * | * * * | * * *');
    expect(lines[4]).toBe('* * * | * * * | * * *');
  });

  it('correctly renders all 9 rows', () => {
    const output = formatGrid(solvedGrid);
    const lines = output.split('\n').filter((line) => !line.includes('---'));

    expect(lines).toHaveLength(9);
    expect(lines[0]).toBe('5 3 4 | 6 7 8 | 9 1 2');
    expect(lines[1]).toBe('6 7 2 | 1 9 5 | 3 4 8');
    expect(lines[2]).toBe('1 9 8 | 3 4 2 | 5 6 7');
    expect(lines[3]).toBe('8 5 9 | 7 6 1 | 4 2 3');
    expect(lines[4]).toBe('4 2 6 | 8 5 3 | 7 9 1');
    expect(lines[5]).toBe('7 1 3 | 9 2 4 | 8 5 6');
    expect(lines[6]).toBe('9 6 1 | 5 3 7 | 2 8 4');
    expect(lines[7]).toBe('2 8 7 | 4 1 9 | 6 3 5');
    expect(lines[8]).toBe('3 4 5 | 2 8 6 | 1 7 9');
  });

  it('handles grid with mixed filled and empty cells', () => {
    const mixedGrid: Grid = [
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

    const output = formatGrid(mixedGrid);
    const lines = output.split('\n');

    expect(lines[0]).toBe('5 3 * | * 7 * | * * *');
    expect(lines[1]).toBe('6 * * | 1 9 5 | * * *');
  });
});
