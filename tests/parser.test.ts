import { describe, expect, it } from 'vitest';

import { parsePuzzle } from '../src/parser';

const validPuzzle = `53**7****
6**195***
*98****6*
8***6***3
4**8*3**1
7***2***6
*6****28*
***419**5
****8**79`;

describe('parsePuzzle', () => {
  it('parses a valid puzzle into a grid', () => {
    const result = parsePuzzle(validPuzzle);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.grid).toHaveLength(9);
      expect(result.grid[0]).toEqual([5, 3, 0, 0, 7, 0, 0, 0, 0]);
      expect(result.grid[8][8]).toBe(9);
    }
  });

  it('fails when the puzzle has invalid characters', () => {
    const result = parsePuzzle(validPuzzle.replace('*', 'x'));

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toMatch(/Invalid character/);
    }
  });

  it('fails when the puzzle has the wrong number of rows', () => {
    const result = parsePuzzle(validPuzzle.split('\n').slice(0, 8).join('\n'));

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toMatch(/rows/);
    }
  });
});
