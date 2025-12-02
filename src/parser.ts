import { CellValue, Grid, ParseResult } from './types';

const GRID_SIZE = 9;

export function parsePuzzle(content: string): ParseResult {
  const normalized = content.replace(/\r\n/g, '\n').split('\n');
  const lines = normalized.map((line) => line.trim()).filter((line) => line.length > 0);

  if (lines.length !== GRID_SIZE) {
    return {
      success: false,
      error: `Puzzle must contain exactly ${GRID_SIZE} rows; received ${lines.length}.`,
    };
  }

  const grid: Grid = [];

  for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex += 1) {
    const line = lines[rowIndex];

    if (line.length !== GRID_SIZE) {
      return {
        success: false,
        error: `Row ${rowIndex + 1} must contain exactly ${GRID_SIZE} characters.`,
      };
    }

    const row: CellValue[] = [];

    for (let columnIndex = 0; columnIndex < GRID_SIZE; columnIndex += 1) {
      const symbol = line[columnIndex];

      if (symbol === '*') {
        row.push(0);
        continue;
      }

      if (!/^[1-9]$/.test(symbol)) {
        return {
          success: false,
          error: `Invalid character '${symbol}' found at row ${rowIndex + 1}, column ${columnIndex + 1}. Only digits 1-9 and * are allowed.`,
        };
      }

      row.push(Number(symbol) as CellValue);
    }

    grid.push(row);
  }

  return { success: true, grid };
}
