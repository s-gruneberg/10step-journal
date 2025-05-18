import { useDarkMode } from '../context/DarkModeContext'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/10steplogo.png'
import { useState } from 'react'
import './Header.css'

const Header = () => {
    const { darkMode } = useDarkMode()
    const [expanded, setExpanded] = useState(false)
    const { isAuthenticated, user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
        setExpanded(false)
    }

    return (
        <nav
            className={`navbar navbar-expand-md ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} border-bottom safe-area-padding`}
        >
            <div className="container-fluid py-2">
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
                            <NavLink to="/inventory" className="nav-link" onClick={() => setExpanded(false)}>
                                Inventory
                            </NavLink>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <NavLink to="/insights" className="nav-link" onClick={() => setExpanded(false)}>
                                    Insights
                                </NavLink>
                            </li>
                        )}
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
                        {isAuthenticated ? (
                            <li className="nav-item">
                                <button
                                    className="btn btn-link nav-link"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <NavLink to="/login" className="nav-link" onClick={() => setExpanded(false)}>
                                    Login
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header
