// src/hooks/useGameState.js
import { useState, useEffect, useCallback } from 'react';
import { initCells, isAdjacent } from '../utils/zip-gridUtils';
import { loadLevel } from '../utils/zip-levelLoader';

export function useGameState(levelId) {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const level = loadLevel(levelId);
    const cells = initCells(level.rows, level.cols, level.numberedCells);
    setGame({
      level,
      cells,
      path: [],
      currentNumberIndex: 0,
      status: 'ongoing',
      startTime: undefined,
      endTime: undefined
    });
  }, [levelId]);

  const startTimer = useCallback(() => {
    setGame(g => {
      if (!g) return g;
      return { ...g, startTime: Date.now() };
    });
  }, []);

  const visitCell = useCallback(coord => {
    setGame(g => {
      if (!g) return g;
      if (g.status !== 'ongoing') return g;

      const { cells, path, currentNumberIndex, level } = g;
      const { row, col } = coord;

      const targetCell = cells[row][col];
      if (targetCell.visited) {
        return g;
      }

      if (path.length > 0) {
        const last = path[path.length - 1];
        if (!isAdjacent(last, coord)) {
          return g;
        }
      }

      const nextNumberCoord = level.numberedCells[currentNumberIndex];
      const isNumbered = row === nextNumberCoord.row && col === nextNumberCoord.col;

      // clone cells deeply
      const newCells = cells.map(r => r.map(c => ({ ...c })));
      newCells[row][col].visited = true;

      const newPath = [...path, coord];
      const newCurrentNumberIndex = isNumbered ? currentNumberIndex + 1 : currentNumberIndex;

      const allVisited = newCells.flat().every(c => c.visited);
      let newStatus = g.status;
      let newEndTime = g.endTime;

      if (allVisited && newCurrentNumberIndex === level.numberedCells.length) {
        newStatus = 'completed';
        newEndTime = Date.now();
      }

      return {
        ...g,
        cells: newCells,
        path: newPath,
        currentNumberIndex: newCurrentNumberIndex,
        status: newStatus,
        endTime: newEndTime
      };
    });
  }, []);

  const resetGame = useCallback(() => {
  setGame(g => {
    if (!g) return g;
    const newLevel = loadLevel(levelId);
    const newCells = initCells(newLevel.rows, newLevel.cols, newLevel.numberedCells);
    return {
      level: newLevel,
      cells: newCells,
      path: [],
      currentNumberIndex: 0,
      status: 'ongoing',
      startTime: undefined,
      endTime: undefined
    };
  });
}, [levelId]);

  return {
    game,
    visitCell,
    resetGame,
    startTimer
  };
}