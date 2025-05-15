import { useDarkMode } from '../context/DarkModeContext'
import { useState } from 'react'
import logo from '../assets/10steplogo.png'

const Header = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="border-bottom p-4">
            {/* Top row: logo + title */}
            <div className="d-flex align-items-center mb-3">
                <img src={logo} alt="10th Step Logo" height={60} className="me-3" />
                <h1 className="h3 m-0">10th Step Journal</h1>
            </div>

            {/* Bottom row: toggle left, hamburger right */}
            <div className="d-flex justify-content-between align-items-center">
                {/* Dark mode toggle button (left) */}
                <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={toggleDarkMode}
                    aria-label="Toggle dark mode"
                    style={{ fontSize: '1rem', width: 'fit-content' }}
                >
                    {darkMode ? '🌞' : '🌙'}
                </button>

                {/* Hamburger menu button (right) */}
                <button
                    className="btn btn-outline-secondary btn-sm d-md-none"
                    aria-label="Toggle menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile menu links */}
            {menuOpen && (
                <nav className="mt-3 d-md-none">
                    <a href="/about" className="btn btn-link p-0">
                        About
                    </a>
                </nav>
            )}
        </header>
    )
}

export default Header
