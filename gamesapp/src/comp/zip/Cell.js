export default function Cell({ cell, onClick, selected }) {
    const {number, visited} = cell;
    return(
        <div className={`zip-cell${visited ? ' visited' : ''}${selected ? ' selected' : ''}`} onMouseDown={onClick}>
            {number !== undefined ? <span>{number}</span> : null}
        </div>
    );
}