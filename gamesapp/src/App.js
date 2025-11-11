import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Home from './comp/Home';
import About from './comp/About';

import Zip from './comp/Zip';

import Error404 from './comp/Error404';

function App() {
    const [navOpen, setNavOpen] = useState(false);
    const location = useLocation();
    const aboutLink = location.pathname === '/about' ? '/' : '/about';
    return (
        <div className="App">
            <nav className={navOpen ? "open" : "closed"}>
                <div onClick={() => {setNavOpen(false)}}>
                    <NavLink to={"/"}>Home</NavLink>
                </div>
                <div onClick={() => {setNavOpen(false)}}>
                    <NavLink to={aboutLink}>{location.pathname === '/about' ? 'Home' : 'About'}</NavLink>
                </div>
                <div onClick={() => {setNavOpen(false)}}>
                    <NavLink to="https://code78.net">Code78.net</NavLink>
                </div>
            </nav>
            <header>
                <div className="menu" onClick={() => {setNavOpen(!navOpen)}}></div>
                <h1>Games.Code78.net</h1>
            </header>

            <Routes>
                {/* System */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                {/* Games */}
                <Route path='zip' element={ <Zip /> } />
                {/* 404 */}
                <Route path="*" element={<Error404 />} />
            </Routes>
        </div>
    );
}

export default App;
