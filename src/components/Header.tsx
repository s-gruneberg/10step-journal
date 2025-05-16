import { useDarkMode } from '../context/DarkModeContext'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/10steplogo.png'
import { useState } from 'react'

const Header = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()
    const [expanded, setExpanded] = useState(false)

    return (
        <nav
            className={`navbar navbar-expand-md ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} border-bottom px-2 py-2`}
        >
            <div className="container-fluid">
                {/* Logo and title */}
                <Link to="/" className="navbar-brand d-flex align-items-center" onClick={() => setExpanded(false)}>
                    <img src={logo} alt="Logo" height={50} className="me-2" />
                    <span style={{ fontSize: '1.8rem' }}>10th Step Journal</span>
                </Link>

                {/* Dark mode toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="btn btn-outline-secondary btn-sm me-5 d-md-none"
                >
                    {darkMode ? 'Light' : 'Dark'}
                </button>

                {/* Hamburger button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible nav menu */}
                <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link" onClick={() => setExpanded(false)}>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about" className="nav-link" onClick={() => setExpanded(false)}>
                                About
                            </NavLink>
                        </li>
                        {/* Optional: show dark mode toggle on desktop */}
                        <li className="nav-item d-none d-md-block">
                            <button
                                onClick={toggleDarkMode}
                                className="btn btn-outline-secondary btn-sm ms-2"
                            >
                                {darkMode ? 'Light' : 'Dark'}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header
