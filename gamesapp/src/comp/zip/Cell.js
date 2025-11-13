export default function Cell({ cell, selected, onDragStart, onDragOver, onDragEnd, wallTop, wallBottom, wallLeft, wallRight, lineUp, lineDown, lineLeft, lineRight }) {
    const { number, visited } = cell;
    const borderStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderTop: wallTop ? '2px solid #000' : undefined,
        borderBottom: wallBottom ? '2px solid #000' : undefined,
        borderLeft: wallLeft ? '2px solid #000' : undefined,
        borderRight: wallRight ? '2px solid #000' : undefined,
    };
    return (
        <div
            className={`zip-cell${visited ? ' visited' : ''}${selected ? ' selected' : ''}`}
            onMouseDown={e => {
                if (onDragStart) onDragStart(e);
            }}
            onMouseEnter={e => {
                if (onDragOver) onDragOver(e);
            }}
            onMouseUp={e => {
                if (onDragEnd) onDragEnd(e);
            }}
            style={{ position: 'relative' }}
        >
            <div style={borderStyles}></div>
            {visited && <>
                <div className="visitedFilling"></div>
                {lineUp && <div className="line-up"></div>}
                {lineDown && <div className="line-down"></div>}
                {lineLeft && <div className="line-left"></div>}
                {lineRight && <div className="line-right"></div>}
            </>}
            {number !== undefined ? <span>{number}</span> : null}
        </div>
    );
}