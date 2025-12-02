import { Grid } from './types';

const GRID_SIZE = 9;
const BOX_SIZE = 3;

export function formatGrid(grid: Grid): string {
  const lines: string[] = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    const segments: string[] = [];

    for (let columnStart = 0; columnStart < GRID_SIZE; columnStart += BOX_SIZE) {
      const segment = grid[row]
        .slice(columnStart, columnStart + BOX_SIZE)
        .map((value) => (value === 0 ? '*' : value.toString()))
        .join(' ');
      segments.push(segment);
    }

    lines.push(segments.join(' | '));

    if ((row + 1) % BOX_SIZE === 0 && row < GRID_SIZE - 1) {
      lines.push('------+-------+------');
    }
  }

  return lines.join('\n');
}
