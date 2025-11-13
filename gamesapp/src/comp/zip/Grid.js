import Cell from "./Cell";
import { useRef, useState } from 'react';

// Helper to check for wall between two cells
function hasWall(walls, a, b) {
    if (!walls) return false;
    const [first, second] = [a, b].sort((m, n) => m.row - n.row || m.col - n.col);
    const key = `${first.row},${first.col}|${second.row},${second.col}`;
    return walls.includes(key);
}

export default function Grid({ cells, path, onCellClick, onCellBacktrack, walls = [] }) {
    const [isDragging, setIsDragging] = useState(false);
    const lastCoordRef = useRef(null);

    function handleDragStart(coord) {
        setIsDragging(true);
        lastCoordRef.current = coord;
        onCellClick(coord);
    }

    function handleDragOver(coord) {
        if (isDragging) {
            if (!lastCoordRef.current || lastCoordRef.current.row !== coord.row || lastCoordRef.current.col !== coord.col) {
                lastCoordRef.current = coord;
                // Check if cell is visited
                const isVisited = cells[coord.row][coord.col].visited;
                // If visited and not last in path, backtrack
                const pathIdx = path.findIndex(p => p.row === coord.row && p.col === coord.col);
                if (isVisited && pathIdx !== -1 && pathIdx < path.length - 1) {
                    if (onCellBacktrack) onCellBacktrack(coord);
                } else {
                    onCellClick(coord);
                }
            }
        }
    }

    function handleDragEnd() {
        setIsDragging(false);
        lastCoordRef.current = null;
    }

    return (
        <div
            className='zip-grid'
            style={{ gridTemplateColumns: `repeat(${cells[0].length}, 1fr)`, width: `${cells[0].length * 3}rem` }}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
        >
            {cells.map((row, r) =>
                row.map((cell, c) => {
                    const coord = { row: r, col: c };
                    const selected = path.some(p => p.row === r && p.col === c);
                    // Determine wall sides for this cell
                    const wallTop = r > 0 && hasWall(walls, coord, { row: r - 1, col: c });
                    const wallBottom = r < cells.length - 1 && hasWall(walls, coord, { row: r + 1, col: c });
                    const wallLeft = c > 0 && hasWall(walls, coord, { row: r, col: c - 1 });
                    const wallRight = c < row.length - 1 && hasWall(walls, coord, { row: r, col: c + 1 });

                    // Path direction logic
                    let lineUp = false, lineDown = false, lineLeft = false, lineRight = false;
                    const idx = path.findIndex(p => p.row === r && p.col === c);
                    if (idx !== -1) {
                        // Previous cell
                        if (idx > 0) {
                            const prev = path[idx - 1];
                            if (prev.row === r - 1 && prev.col === c) lineUp = true;
                            if (prev.row === r + 1 && prev.col === c) lineDown = true;
                            if (prev.row === r && prev.col === c - 1) lineLeft = true;
                            if (prev.row === r && prev.col === c + 1) lineRight = true;
                        }
                        // Next cell
                        if (idx < path.length - 1) {
                            const next = path[idx + 1];
                            if (next.row === r - 1 && next.col === c) lineUp = true;
                            if (next.row === r + 1 && next.col === c) lineDown = true;
                            if (next.row === r && next.col === c - 1) lineLeft = true;
                            if (next.row === r && next.col === c + 1) lineRight = true;
                        }
                    }

                    return (
                        <Cell
                            key={`${r}-${c}`}
                            cell={cell}
                            selected={selected}
                            onDragStart={() => handleDragStart(coord)}
                            onDragOver={() => handleDragOver(coord)}
                            onDragEnd={handleDragEnd}
                            wallTop={wallTop}
                            wallBottom={wallBottom}
                            wallLeft={wallLeft}
                            wallRight={wallRight}
                            lineUp={lineUp}
                            lineDown={lineDown}
                            lineLeft={lineLeft}
                            lineRight={lineRight}
                        />
                    );
                })
            )}
        </div>
    );
}