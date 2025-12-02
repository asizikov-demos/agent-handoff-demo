#!/usr/bin/env node

import { readPuzzleFile } from './fileReader';
import { formatGrid } from './formatter';
import { parsePuzzle } from './parser';
import { solve } from './solver';
import { validateGrid } from './validator';

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: sudoku-solver <path-to-puzzle.txt>');
    process.exitCode = 1;
    return;
  }

  try {
    const content = await readPuzzleFile(filePath);
    const parseResult = parsePuzzle(content);

    if (!parseResult.success) {
      console.error(`Invalid puzzle: ${parseResult.error}`);
      process.exitCode = 1;
      return;
    }

    const validationResult = validateGrid(parseResult.grid);

    if (!validationResult.valid) {
      console.error(`Rule violation: ${validationResult.error}`);
      process.exitCode = 1;
      return;
    }

    const solveResult = solve(parseResult.grid);

    if (!solveResult.solved) {
      console.error(solveResult.error);
      process.exitCode = 1;
      return;
    }

    console.log(formatGrid(solveResult.grid));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exitCode = 1;
  }
}

main();
