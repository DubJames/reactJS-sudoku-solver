import React, { useState } from 'react';
import './App.css';

const emptyGrid = Array(9).fill(0).map(() => Array(9).fill(''));

function App() {
  const [grid, setGrid] = useState(emptyGrid);
  const [invalidCells, setInvalidCells] = useState(new Set());

  const handleChange = (row, col, value) => {
    if (/^[1-9]?$/.test(value)) {
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = value;
      setGrid(newGrid);
      validateGrid(newGrid);
    }
  };

  const validateGrid = (grid) => {
    const errors = new Set();

    const addError = (r, c) => errors.add(`${r}-${c}`);

    // Check rows and columns
    for (let i = 0; i < 9; i++) {
      const rowMap = {};
      const colMap = {};
      for (let j = 0; j < 9; j++) {
        const rowVal = grid[i][j];
        const colVal = grid[j][i];

        if (rowVal) {
          if (rowMap[rowVal]) {
            addError(i, j);
            addError(i, rowMap[rowVal] - 1);
          }
          rowMap[rowVal] = j + 1;
        }

        if (colVal) {
          if (colMap[colVal]) {
            addError(j, i);
            addError(colMap[colVal] - 1, i);
          }
          colMap[colVal] = j + 1;
        }
      }
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = {};
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const row = boxRow * 3 + r;
            const col = boxCol * 3 + c;
            const val = grid[row][col];
            if (val) {
              const key = `${val}`;
              if (seen[key]) {
                addError(row, col);
                addError(...seen[key]);
              }
              seen[key] = [row, col];
            }
          }
        }
      }
    }

    setInvalidCells(errors);
  };

  const isSafe = (grid, row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[startRow + r][startCol + c] === num) return false;
      }
    }

    return true;
  };

  const solveSudoku = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => (cell === '' ? 0 : parseInt(cell)))
    );

    const solve = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (newGrid[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isSafe(newGrid, row, col, num)) {
                newGrid[row][col] = num;
                if (solve()) return true;
                newGrid[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    if (solve()) {
      const solved = newGrid.map((row) => row.map((cell) => cell.toString()));
      setGrid(solved);
      validateGrid(solved);
    } else {
      alert('No solution exists!');
    }
  };

  const clearGrid = () => {
    setGrid(emptyGrid);
    setInvalidCells(new Set());
  };

  return (
    <div className="App">
      <h1>Sudoku Solver</h1>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const isInvalid = invalidCells.has(key);
            return (
              <input
                key={key}
                type="text"
                maxLength="1"
                value={cell}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                className={`sudoku-cell ${isInvalid ? 'invalid' : ''}`}
              />
            );
          })
        )}
      </div>
      <div className="buttons">
        <button onClick={solveSudoku}>Solve</button>
        <button onClick={clearGrid}>Clear</button>
      </div>
    </div>
  );
}

export default App;
