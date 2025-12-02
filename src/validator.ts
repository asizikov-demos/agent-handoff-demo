import { CellValue, Grid, ValidationResult } from './types';

const GRID_SIZE = 9;
const BOX_SIZE = 3;

export function validateGrid(grid: Grid): ValidationResult {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    const result = validateRow(grid, row);
    if (!result.valid) {
      return result;
    }
  }

  for (let column = 0; column < GRID_SIZE; column += 1) {
    const result = validateColumn(grid, column);
    if (!result.valid) {
      return result;
    }
  }

  for (let boxRow = 0; boxRow < GRID_SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < GRID_SIZE; boxCol += BOX_SIZE) {
      const result = validateBox(grid, boxRow, boxCol);
      if (!result.valid) {
        return result;
      }
    }
  }

  return { valid: true };
}

export function isPlacementValid(grid: Grid, row: number, column: number, value: CellValue): boolean {
  if (value === 0) {
    return true;
  }

  for (let index = 0; index < GRID_SIZE; index += 1) {
    if (grid[row][index] === value || grid[index][column] === value) {
      return false;
    }
  }

  const boxRowStart = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxColumnStart = Math.floor(column / BOX_SIZE) * BOX_SIZE;

  for (let r = boxRowStart; r < boxRowStart + BOX_SIZE; r += 1) {
    for (let c = boxColumnStart; c < boxColumnStart + BOX_SIZE; c += 1) {
      if (grid[r][c] === value) {
        return false;
      }
    }
  }

  return true;
}

function validateRow(grid: Grid, row: number): ValidationResult {
  const seen = new Set<CellValue>();

  for (const value of grid[row]) {
    if (value === 0) {
      continue;
    }

    if (seen.has(value)) {
      return { valid: false, error: `Row ${row + 1} contains duplicate value ${value}.` };
    }

    seen.add(value);
  }

  return { valid: true };
}

function validateColumn(grid: Grid, column: number): ValidationResult {
  const seen = new Set<CellValue>();

  for (let row = 0; row < GRID_SIZE; row += 1) {
    const value = grid[row][column];

    if (value === 0) {
      continue;
    }

    if (seen.has(value)) {
      return { valid: false, error: `Column ${column + 1} contains duplicate value ${value}.` };
    }

    seen.add(value);
  }

  return { valid: true };
}

function validateBox(grid: Grid, startRow: number, startColumn: number): ValidationResult {
  const seen = new Set<CellValue>();

  for (let row = startRow; row < startRow + BOX_SIZE; row += 1) {
    for (let column = startColumn; column < startColumn + BOX_SIZE; column += 1) {
      const value = grid[row][column];

      if (value === 0) {
        continue;
      }

      if (seen.has(value)) {
        const humanRow = Math.floor(startRow / BOX_SIZE) + 1;
        const humanColumn = Math.floor(startColumn / BOX_SIZE) + 1;
        return {
          valid: false,
          error: `3x3 box (${humanRow}, ${humanColumn}) contains duplicate value ${value}.`,
        };
      }

      seen.add(value);
    }
  }

  return { valid: true };
}
