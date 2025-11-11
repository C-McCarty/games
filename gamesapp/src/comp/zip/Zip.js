import { useEffect, useState } from 'react';
import { useGameState } from '../hooks/zip-useGameState';
import Grid from './Grid';

export default function Zip() {
    const { game, visitCell, resetGame, startTimer } = useGameState('level1');
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        startTimer();
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
    },[]);
    if (!game) {
        return <div>Loading...</div>;
    }
    const { cells, path, status, startTime, endTime } = game;
    return(
        <div className='page-game'>
            <h2 className='game-title'>Zip</h2>
            <div className="game-app">
                {status === 'completed' && 
                    <div>
                        <h3>🎉 Level Complete! 🎉</h3>
                        <h4>Time: {((endTime - startTime)/1000).toFixed(1)}s</h4>
                    </div>}
                    <button onClick={resetGame}>New Game</button>
                    <div>{seconds}</div>
                    <Grid cells={cells} path={path} onCellClick={coord => {
                        if (!startTime) startTimer();
                        visitCell(coord);
                    }} />
            </div>
        </div>
    );
}