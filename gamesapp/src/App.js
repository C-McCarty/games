import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './comp/Home';
import About from './comp/About';
import Error404 from './comp/Error404';

function App() {
    const location = useLocation();
    const aboutLink = location.pathname === '/about' ? '/' : '/about';
  return (
    <div className="App">
        <header>
            <NavLink to="https://code78.net">Code78.net</NavLink>
            <NavLink to={"/"}><h1>Games.Code78.net</h1></NavLink>
            <NavLink to={aboutLink}>{location.pathname === '/about' ? 'Home' : 'About'}</NavLink>
        </header>

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    </div>
  );
}

export default App;
