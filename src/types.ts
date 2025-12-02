export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Grid = CellValue[][];

export type ParseResult =
  | { success: true; grid: Grid }
  | { success: false; error: string };

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export type SolveResult =
  | { solved: true; grid: Grid }
  | { solved: false; error: string };
