import { describe, expect, it, beforeAll, afterAll, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';

const TEST_DIR = path.join(__dirname, 'integration-test-files');
const CLI_PATH = path.join(__dirname, '..', 'dist', 'index.js');

const validPuzzleContent = `53**7****
6**195***
*98****6*
8***6***3
4**8*3**1
7***2***6
*6****28*
***419**5
****8**79`;

const invalidCharPuzzleContent = `53**7****
6**195***
*98****6*
8***6***3
4**8x3**1
7***2***6
*6****28*
***419**5
****8**79`;

const duplicatePuzzleContent = `55**7****
6**195***
*98****6*
8***6***3
4**8*3**1
7***2***6
*6****28*
***419**5
****8**79`;

const wrongRowsPuzzleContent = `53**7****
6**195***
*98****6*`;

function runCli(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const process = spawn('node', [CLI_PATH, ...args], {
      cwd: path.join(__dirname, '..'),
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: code ?? 1,
      });
    });
  });
}

describe('CLI Integration Tests', () => {
  beforeAll(async () => {
    // Build the project first
    execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'ignore' });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  describe('argument parsing', () => {
    it('shows usage message when no arguments provided', async () => {
      const result = await runCli([]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Usage: sudoku-solver');
    });
  });

  describe('file handling', () => {
    it('reports error for non-existent file', async () => {
      const result = await runCli(['/nonexistent/path/puzzle.txt']);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('File not found');
    });

    it('reports error for empty file', async () => {
      const emptyFile = path.join(TEST_DIR, 'empty.txt');
      await fs.writeFile(emptyFile, '', 'utf-8');

      const result = await runCli([emptyFile]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('empty');
    });

    it('reports error for directory path', async () => {
      const result = await runCli([TEST_DIR]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('not a file');
    });
  });

  describe('puzzle parsing errors', () => {
    it('reports error for invalid characters', async () => {
      const invalidFile = path.join(TEST_DIR, 'invalid-char.txt');
      await fs.writeFile(invalidFile, invalidCharPuzzleContent, 'utf-8');

      const result = await runCli([invalidFile]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Invalid');
    });

    it('reports error for wrong number of rows', async () => {
      const wrongRowsFile = path.join(TEST_DIR, 'wrong-rows.txt');
      await fs.writeFile(wrongRowsFile, wrongRowsPuzzleContent, 'utf-8');

      const result = await runCli([wrongRowsFile]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('rows');
    });
  });

  describe('validation errors', () => {
    it('reports error for puzzle with duplicate values', async () => {
      const duplicateFile = path.join(TEST_DIR, 'duplicate.txt');
      await fs.writeFile(duplicateFile, duplicatePuzzleContent, 'utf-8');

      const result = await runCli([duplicateFile]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Rule violation');
    });
  });

  describe('successful solving', () => {
    it('solves a valid puzzle and outputs formatted result', async () => {
      const validFile = path.join(TEST_DIR, 'valid.txt');
      await fs.writeFile(validFile, validPuzzleContent, 'utf-8');

      const result = await runCli([validFile]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('5 3 4 | 6 7 8 | 9 1 2');
      expect(result.stdout).toContain('------+-------+------');
      expect(result.stdout).toContain('3 4 5 | 2 8 6 | 1 7 9');
    });

    it('solves puzzle from examples directory', async () => {
      const result = await runCli(['examples/valid-puzzle.txt']);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('5 3 4 | 6 7 8 | 9 1 2');
    });
  });

  describe('relative path handling', () => {
    it('handles relative paths correctly', async () => {
      const result = await runCli(['./examples/valid-puzzle.txt']);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('5 3 4 | 6 7 8 | 9 1 2');
    });
  });
});
