// src/hooks/useGameState.js
import { useState, useEffect, useCallback } from 'react';
import { initCells, isAdjacent } from '../utils/zip-gridUtils';
import { loadLevel } from '../utils/zip-levelLoader';

export function useGameState(levelId) {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const level = loadLevel(levelId);
    const cells = initCells(level.rows, level.cols, level.numberedCells);
    // Mark node 1 (start) as visited and in path
    const startCoord = level.numberedCells[0];
    const newCells = cells.map(r => r.map(c => ({ ...c })));
    newCells[startCoord.row][startCoord.col].visited = true;
    setGame({
      level,
      cells: newCells,
      path: [startCoord],
      currentNumberIndex: 1,
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
        if (!isAdjacent(last, coord, level.walls)) {
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

  const unvisitCell = useCallback(coord => {
    setGame(g => {
      if (!g) return g;
      if (g.status !== 'ongoing') return g;

      const { cells, path, level } = g;
      // Find index of coord in path
      const idx = path.findIndex(p => p.row === coord.row && p.col === coord.col);
      if (idx === -1) return g; // not in path
      // Only allow backtracking if not last cell
      if (idx === path.length - 1) return g;

      // Unvisit all cells after idx
      const newCells = cells.map(r => r.map(c => ({ ...c })));
      for (let i = idx + 1; i < path.length; i++) {
        const p = path[i];
        newCells[p.row][p.col].visited = false;
      }
      // Recompute currentNumberIndex
      let newCurrentNumberIndex = 0;
      for (let i = 0; i <= idx; i++) {
        const p = path[i];
        if (level.numberedCells.some(nc => nc.row === p.row && nc.col === p.col)) {
          newCurrentNumberIndex++;
        }
      }
      return {
        ...g,
        cells: newCells,
        path: path.slice(0, idx + 1),
        currentNumberIndex: newCurrentNumberIndex,
        status: 'ongoing',
        endTime: undefined
      };
    });
  }, []);

  return {
    game,
    visitCell,
    unvisitCell,
    resetGame,
    startTimer
  };
}