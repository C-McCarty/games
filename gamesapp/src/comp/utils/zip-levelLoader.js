
// Maze generation using DFS backtracking

// Hamiltonian path generator for grid (snake-like)
// Randomized DFS Hamiltonian path generator
function generateHamiltonianPath(rows, cols) {
    // Backtracking Hamiltonian path generator
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const path = [];
    const directions = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 }
    ];

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function isZigZag(path) {
        // Detect if path is a trivial zig-zag (row alternates, col increments)
        let zigzag = true;
        for (let i = 1; i < path.length; i++) {
            if (Math.abs(path[i].row - path[i-1].row) > 1 || Math.abs(path[i].col - path[i-1].col) > 1) {
                zigzag = false;
                break;
            }
        }
        return zigzag;
    }

    function backtrack(row, col, depth) {
        if (depth === rows * cols) return true;
        const dirs = shuffle([...directions]);
        for (const { dr, dc } of dirs) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
                visited[nr][nc] = true;
                path.push({ row: nr, col: nc });
                if (backtrack(nr, nc, depth + 1)) return true;
                path.pop();
                visited[nr][nc] = false;
            }
        }
        return false;
    }

    // Try up to 20 times to avoid trivial zig-zag
    for (let attempt = 0; attempt < 20; attempt++) {
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) visited[r][c] = false;
        path.length = 0;
        const startRow = Math.floor(Math.random() * rows);
        const startCol = Math.floor(Math.random() * cols);
        visited[startRow][startCol] = true;
        path.push({ row: startRow, col: startCol });
        if (backtrack(startRow, startCol, 1) && !isZigZag(path)) {
            return [...path];
        }
    }
    // Fallback: return any valid path
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) visited[r][c] = false;
    path.length = 0;
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);
    visited[startRow][startCol] = true;
    path.push({ row: startRow, col: startCol });
    if (backtrack(startRow, startCol, 1)) {
        return [...path];
    }
    // If all else fails, return zig-zag
    const fallback = [];
    for (let r = 0; r < rows; r++) {
        if (r % 2 === 0) {
            for (let c = 0; c < cols; c++) fallback.push({ row: r, col: c });
        } else {
            for (let c = cols - 1; c >= 0; c--) fallback.push({ row: r, col: c });
        }
    }
    return fallback;
}

function wallKey(a, b) {
    const [first, second] = [a, b].sort((x, y) => x.row - y.row || x.col - y.col);
    return `${first.row},${first.col}|${second.row},${second.col}`;
}

function generateMaze(rows, cols) {
    // Use Hamiltonian path for full coverage
    const path = generateHamiltonianPath(rows, cols);
    const walls = new Set();
    // Add random walls that do not block the main path
    const directions = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 }
    ];
    const allowedEdges = new Set();
    for (let i = 1; i < path.length; i++) {
        const a = path[i - 1];
        const b = path[i];
        allowedEdges.add(wallKey(a, b));
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (const { dr, dc } of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    const key = wallKey({ row: r, col: c }, { row: nr, col: nc });
                    if (!allowedEdges.has(key) && Math.random() < 0.15) {
                        walls.add(key);
                    }
                }
            }
        }
    }
    return { path, walls: Array.from(walls) };
}

// No longer needed: path is randomized by maze

function pickNumberedCells(path, count) {
    const total = path.length;
    if (count >= total) {
        return [...path];
    }
    // Always include the starting cell as node 1
    const indices = [0];
    // Pick remaining indices randomly (excluding start)
    const available = Array.from({length: total - 1}, (_, i) => i + 1);
    for (let i = 1; i < count; i++) {
        const idx = available.splice(Math.floor(Math.random() * available.length), 1)[0];
        indices.push(idx);
    }
    indices.sort((a, b) => a - b); // Ensure order along path
    return indices.map(i => path[i]);
}

export function generateLevel(rows, cols, numberedCount, levelId=null) {
    const { path, walls } = generateMaze(rows, cols);
    const numberedCells = pickNumberedCells(path, numberedCount);
    const level = {
        id: levelId ?? `r${rows}c${cols}_n${numberedCount}_${Date.now()}`,
        rows,
        cols,
        numberedCells,
        walls
    };
    return level;
}

export function loadLevel() {
    const gridSize = Math.floor(Math.random() * 3) + 5;
    const numberNodes = Math.floor(gridSize * gridSize / 3);
    return generateLevel(gridSize, gridSize, numberNodes, 'level1');
}