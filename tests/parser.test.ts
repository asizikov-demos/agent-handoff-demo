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

  it('handles Windows line endings (CRLF)', () => {
    const windowsPuzzle = validPuzzle.replace(/\n/g, '\r\n');
    const result = parsePuzzle(windowsPuzzle);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.grid).toHaveLength(9);
      expect(result.grid[0]).toEqual([5, 3, 0, 0, 7, 0, 0, 0, 0]);
    }
  });

  it('fails when a row has wrong number of columns', () => {
    const invalidPuzzle = validPuzzle.replace('53**7****', '53**7***'); // 8 chars instead of 9
    const result = parsePuzzle(invalidPuzzle);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toMatch(/Row 1 must contain exactly 9 characters/);
    }
  });

  it('handles extra blank lines and whitespace', () => {
    const puzzleWithBlanks = '\n  ' + validPuzzle.split('\n').join('\n  ') + '\n\n';
    const result = parsePuzzle(puzzleWithBlanks);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.grid).toHaveLength(9);
    }
  });

  it('fails when digit 0 is used instead of asterisk', () => {
    const invalidPuzzle = validPuzzle.replace('*', '0');
    const result = parsePuzzle(invalidPuzzle);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toMatch(/Invalid character '0'/);
    }
  });

  it('fails when too many rows are provided', () => {
    const tooManyRows = validPuzzle + '\n123456789';
    const result = parsePuzzle(tooManyRows);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toMatch(/received 10/);
    }
  });

  it('correctly parses a fully empty puzzle', () => {
    const emptyPuzzle = Array(9).fill('*********').join('\n');
    const result = parsePuzzle(emptyPuzzle);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.grid.every((row) => row.every((cell) => cell === 0))).toBe(true);
    }
  });

  it('correctly parses a fully filled puzzle', () => {
    const fullPuzzle = `534678912
672195348
198342567
859761423
426853791
713924856
961537284
287419635
345286179`;
    const result = parsePuzzle(fullPuzzle);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.grid[0]).toEqual([5, 3, 4, 6, 7, 8, 9, 1, 2]);
      expect(result.grid.every((row) => row.every((cell) => cell !== 0))).toBe(true);
    }
  });
});
