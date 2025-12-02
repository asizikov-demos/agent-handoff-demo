import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';

import { readPuzzleFile } from '../src/fileReader';

const TEST_DIR = path.join(__dirname, 'test-files');

describe('readPuzzleFile', () => {
  beforeAll(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  it('reads a valid puzzle file', async () => {
    const filePath = path.join(TEST_DIR, 'valid.txt');
    const content = '53**7****\n6**195***\n*98****6*\n8***6***3\n4**8*3**1\n7***2***6\n*6****28*\n***419**5\n****8**79';
    await fs.writeFile(filePath, content, 'utf-8');

    const result = await readPuzzleFile(filePath);

    expect(result).toBe(content);
  });

  it('throws an error when file does not exist', async () => {
    await expect(readPuzzleFile('/nonexistent/path/puzzle.txt')).rejects.toThrow(
      'File not found'
    );
  });

  it('throws an error when path is empty', async () => {
    await expect(readPuzzleFile('')).rejects.toThrow(
      'Please provide a path to the puzzle file'
    );
  });

  it('throws an error when file is empty', async () => {
    const filePath = path.join(TEST_DIR, 'empty.txt');
    await fs.writeFile(filePath, '', 'utf-8');

    await expect(readPuzzleFile(filePath)).rejects.toThrow('Puzzle file is empty');
  });

  it('throws an error when file contains only whitespace', async () => {
    const filePath = path.join(TEST_DIR, 'whitespace.txt');
    await fs.writeFile(filePath, '   \n\n   ', 'utf-8');

    await expect(readPuzzleFile(filePath)).rejects.toThrow('Puzzle file is empty');
  });

  it('throws an error when path is a directory', async () => {
    await expect(readPuzzleFile(TEST_DIR)).rejects.toThrow('Path is not a file');
  });

  it('resolves relative paths correctly', async () => {
    const filePath = path.join(TEST_DIR, 'relative-test.txt');
    const content = 'test content here';
    await fs.writeFile(filePath, content, 'utf-8');

    const relativePath = path.relative(process.cwd(), filePath);
    const result = await readPuzzleFile(relativePath);

    expect(result).toBe(content);
  });
});
