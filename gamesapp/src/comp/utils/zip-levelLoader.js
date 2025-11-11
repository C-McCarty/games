function generateZigZagPath(rows, cols) {
    const path = [];
    for (let r = 0; r < rows; r++) {
        if (r % 2 === 0) {
            for (let c = 0; c < cols; c++) {
                path.push({ row: r, col: c });
            }
        } else {
            for (let c = cols - 1; c >= 0; c--) {
                path.push({ row: r, col: c });
            }
        }
    }
    return path;
}

function randomizePath(path, rows, cols) {
    let newPath = [...path];
    if (Math.random() < 0.5) {
        newPath = newPath.map(coord => ({  row: coord.row, col: cols - 1 - coord.col }));
    }
    if (Math.random() < 0.5) {
        newPath = newPath.map(coord => ({  row: rows - 1 - coord.row, col: coord.col }));
    }
    return newPath;
}

function pickNumberedCells(path, count) {
    const total = path.length;
    if (count >= total) {
        return [...path];
    }
    const interval = Math.floor(total / count);
    const numbered = [];

    for (let i = 0; i < count; i++) {
        const idx = Math.min(total - 1, i * interval);
        numbered.push(path[idx]);
    }
    numbered[count - 1] = path[total - 1];
    return numbered;
}

export function generateLevel(rows, cols, numberedCount, levelId=null) {
    let path = generateZigZagPath(rows, cols);
    path = randomizePath(path, rows, cols);
    const numberedCells = pickNumberedCells(path, numberedCount);
    const level = {
        id: levelId ?? `r${rows}c${cols}_n${numberedCount}_${Date.now()}`,
        rows,
        cols,
        numberedCells
    };
    return level;
}

export function loadLevel() {
    const gridSize = Math.floor(Math.random() * 3) + 5;
    const numberNodes = Math.floor(gridSize * gridSize / 3);
    return generateLevel(gridSize, gridSize, numberNodes, 'level1');
}