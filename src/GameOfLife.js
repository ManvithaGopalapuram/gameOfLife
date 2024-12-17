import React, { useState, useEffect, useCallback } from 'react';
import './GameOfLife.css';

const calculateGridSize = () => {
  const cellSize = 40;
  const margin = 60;
  const numCols = Math.floor((window.innerWidth - margin) / cellSize);
  const numRows = Math.floor((window.innerHeight - margin) / cellSize);
  return { numRows, numCols };
};

const generateEmptyGrid = (numRows, numCols) => {
  return Array.from({ length: numRows }, () => Array(numCols).fill(0));
};

const GameOfLife = () => {
  const { numRows, numCols } = calculateGridSize();

  const [grid, setGrid] = useState(() => generateEmptyGrid(numRows, numCols));
  const [running, setRunning] = useState(false);

  const runSimulation = useCallback(() => {
    if (!running) return;

    setGrid(g => {
      const newGrid = g.map(arr => [...arr]);

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          let neighbors = 0;
          const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
          ];

          directions.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += g[newI][newJ];
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            newGrid[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
            newGrid[i][j] = 1;
          }
        }
      }

      return newGrid;
    });

    setTimeout(runSimulation, 100);
  }, [running, numRows, numCols]);

  useEffect(() => {
    if (running) {
      runSimulation();
    }
  }, [running, runSimulation]);

  useEffect(() => {
    const handleResize = () => {
      const { numRows, numCols } = calculateGridSize();
      setGrid(generateEmptyGrid(numRows, numCols));
      setRunning(false);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="game-container">
    <h1 style={{ color: '#5c4033', fontSize: '80px', }}> GAME OF LIFE</h1>
      <div className="button-container">
        <button className="button" onClick={() => setRunning(!running)}>
          {running ? 'Stop' : 'Start Simulation'}
        </button>
        <button
          className="button clear"
          onClick={() => {
            const { numRows, numCols } = calculateGridSize();
            setGrid(generateEmptyGrid(numRows, numCols));
            setRunning(false);
          }}
        >
          Clear
        </button>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${numCols}, 40px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              className="square-cell"
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = grid.map(arr => [...arr]);
                newGrid[i][j] = grid[i][j] ? 0 : 1;
                setGrid(newGrid);
              }}
              style={{
                backgroundColor: grid[i][j] ? '#5c4033' : undefined,
                border: 'solid 1px gray',
                height: '40px',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameOfLife;
