import { useDarkMode } from '../context/DarkModeContext'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/10steplogo.png'
import { useState } from 'react'

const Header = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()
    const [expanded, setExpanded] = useState(false)
    const toggleBtnClass = `btn btn-sm toggle-theme-btn ${darkMode ? 'btn-light' : 'btn-dark'}`


    return (
        <nav
            className={`navbar navbar-expand-md ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} border-bottom px-2 py-2`}
        >
            <div className="container-fluid">
                {/* Top Row: Logo/Title and Hamburger */}
                <div className="d-flex justify-content-between align-items-center w-100 flex-wrap">
                    <div className="d-flex align-items-center">
                        <Link
                            to="/"
                            className="navbar-brand d-flex align-items-center mb-2 mb-md-0"
                            onClick={() => setExpanded(false)}
                        >
                            <img src={logo} alt="Logo" height={50} className="me-2" />
                            <span style={{ fontSize: 'clamp(1.17rem, 4vw, 2rem)' }}>
                                10th Step Journal
                            </span>
                        </Link>
                    </div>

                    <div className="ms-auto mb-2 mb-md-0">
                        <button
                            className="navbar-toggler"
                            type="button"
                            onClick={() => setExpanded(!expanded)}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </div>

                {/* Collapsible nav links */}
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
                        <li className="nav-item">
                            <NavLink to="/settings" className="nav-link" onClick={() => setExpanded(false)}>
                                Settings
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>

        </nav>
    )
}

export default Header
