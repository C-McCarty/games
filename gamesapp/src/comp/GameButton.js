import { NavLink } from 'react';


export default function GameButton({ to, icon, children }) {
    return(
        <div className='game-button'>
            <NavLink to={to} className="game-button-link">
                <div className="game-button-icon"></div>
                <div className="game-button-text">{children}</div>
            </NavLink>
        </div>
    );
}