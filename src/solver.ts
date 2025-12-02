import { CellValue, Grid, SolveResult } from './types';
import { isPlacementValid } from './validator';

const GRID_SIZE = 9;

export function solve(grid: Grid): SolveResult {
  const workingGrid = cloneGrid(grid);

  if (solveRecursive(workingGrid)) {
    return { solved: true, grid: workingGrid };
  }

  return { solved: false, error: 'Puzzle has no valid solution.' };
}

function solveRecursive(grid: Grid): boolean {
  const emptyCell = findEmptyCell(grid);

  if (!emptyCell) {
    return true;
  }

  const { row, column } = emptyCell;

  for (let candidate = 1; candidate <= GRID_SIZE; candidate += 1) {
    const value = candidate as CellValue;

    if (isPlacementValid(grid, row, column, value)) {
      grid[row][column] = value;

      if (solveRecursive(grid)) {
        return true;
      }

      grid[row][column] = 0;
    }
  }

  return false;
}

function findEmptyCell(grid: Grid): { row: number; column: number } | null {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      if (grid[row][column] === 0) {
        return { row, column };
      }
    }
  }

  return null;
}

function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]) as Grid;
}
