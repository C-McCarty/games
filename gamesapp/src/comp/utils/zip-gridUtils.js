export function initCells(rows, cols, numberedCells) {
    const cells = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const numIndex = numberedCells.findIndex(coord => coord.row === r && coord.col === c);
            row.push({
                coord: { row: r, col: c },
                number: numIndex >= 0 ? numIndex + 1 : undefined,
                visited: false
            });
        }
        cells.push(row);
    }
    return cells;
}

export function isAdjacent(a, b, walls = []) {
    const dr = Math.abs(a.row - b.row);
    const dc = Math.abs(a.col - b.col);
    if (!((dr === 1 && dc === 0) || (dr === 0 && dc === 1))) return false;
    // Check for wall between a and b
    const wallKey = (x, y) => {
        const [first, second] = [x, y].sort((m, n) => m.row - n.row || m.col - n.col);
        return `${first.row},${first.col}|${second.row},${second.col}`;
    };
    return !walls.includes(wallKey(a, b));
}