import { promises as fs } from 'fs';
import path from 'path';

export async function readPuzzleFile(filePath: string): Promise<string> {
  if (!filePath) {
    throw new Error('Please provide a path to the puzzle file.');
  }

  const resolvedPath = path.resolve(filePath);

  let stats;
  try {
    stats = await fs.stat(resolvedPath);
  } catch (error) {
    throw new Error(`File not found: ${filePath}`);
  }

  if (!stats.isFile()) {
    throw new Error(`Path is not a file: ${filePath}`);
  }

  const content = await fs.readFile(resolvedPath, 'utf-8');

  if (!content.trim()) {
    throw new Error('Puzzle file is empty.');
  }

  return content;
}
