export type Coordinate = { row: number; col: number };
export interface Cell {
    coord: Coordinate;
    number?: number;
    visited: boolean;
}
export interface Level {
    id: string;
    rows: number;
    cols: number;
    numberedCells: Coordinate[];
}
export interface GameState {
    level: Level;
    cells: Cell[][];
    path: Coordinate[];
    currentNumberIndex: number;
    status: 'ongoing' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
}