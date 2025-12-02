# Sudoku Solver CLI

A simple Node.js console tool that solves standard 9x9 sudoku puzzles supplied as text files. Empty cells are represented with `*` and filled cells with digits `1-9`.

## Requirements

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
npm run build
```

This will generate the executable script at `dist/index.js` and register it as `sudoku-solver` via the `bin` entry in `package.json`.

## Usage

Provide the path to a puzzle file as the first CLI argument:

```bash
npm run build
node dist/index.js examples/valid-puzzle.txt
```

Or, after installing globally/local linking:

```bash
npm run build
npm link
sudoku-solver examples/valid-puzzle.txt
```

### Puzzle Format

- Exactly 9 lines, each with 9 characters
- Digits `1-9` denote known values
- `*` denotes an empty cell

Example:

```
53**7****
6**195***
*98****6*
8***6***3
4**8*3**1
7***2***6
*6****28*
***419**5
****8**79
```

### Output

Solved puzzles print as a formatted grid with 3x3 separators:

```
5 3 4 | 6 7 8 | 9 1 2
6 7 2 | 1 9 5 | 3 4 8
1 9 8 | 3 4 2 | 5 6 7
------+-------+------
8 5 9 | 7 6 1 | 4 2 3
4 2 6 | 8 5 3 | 7 9 1
7 1 3 | 9 2 4 | 8 5 6
------+-------+------
9 6 1 | 5 3 7 | 2 8 4
2 8 7 | 4 1 9 | 6 3 5
3 4 5 | 2 8 6 | 1 7 9
```

### Error Handling

The CLI reports descriptive errors for:

- Missing or unreadable files
- Invalid characters or wrong grid dimensions
- Sudoku rule violations (duplicate numbers in rows, columns, or boxes)
- Unsolvable puzzles

## Development

Run the tool without building using ts-node:

```bash
npm start -- examples/valid-puzzle.txt
```

## Testing

Execute the unit test suite with:

```bash
npm test
```
