import Cell from "./Cell";


export default function Grid({ cells, path, onCellClick }) {
    return(
        <div className='zip-grid' style={{ gridTemplateColumns: `repeat(${cells[0].length}, 1fr)`, width: `${cells[0].length * 3}rem` }}>
            {cells.map((row, r) => 
                row.map((cell, c) => {
                    const coord = { row: r, col: c };
                    const selected = path.some(p => p.row === r && p.col === c);
                    return (
                        <Cell 
                            key={`${r}-${c}`}
                            cell={cell} 
                            selected={selected} 
                            onClick={() => onCellClick(coord)} 
                        />
                    );
                })
            )}
        </div>
    );
}