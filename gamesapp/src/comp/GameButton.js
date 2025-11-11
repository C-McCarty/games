import { NavLink } from 'react-router-dom';


export default function GameButton({ to, icon, children }) {
    const iconStyle = {
        backgroundImage: `url(/icons/${icon}.svg)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    };
    return(
        <div className='game-button'>
            <NavLink to={to} className={icon}>
                <div className="game-button-icon" style={iconStyle}></div>
                <h6 className="game-button-text">{children}</h6>
            </NavLink>
        </div>
    );
}