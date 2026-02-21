import { useDarkMode } from '../context/DarkModeContext'
import { useState, useEffect } from 'react'

const Settings = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()
    const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || '16')

    useEffect(() => {
        // Apply stored font size
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [fontSize]);

    const handleFontSizeChange = (size: string) => {
        setFontSize(size);
        localStorage.setItem('fontSize', size);
        document.documentElement.style.fontSize = `${size}px`;
    };

    const toggleBtnClass = `btn ${darkMode ? 'btn-light' : 'btn-dark'}`
    const dangerBtnClass = `btn ${darkMode ? 'btn-outline-danger' : 'btn-danger'}`
    const primaryBtnClass = `btn ${darkMode ? 'btn-outline-primary' : 'btn-primary'}`

    return (
        <div className="container mt-4">
            <h1 className="mb-2">Settings</h1>
            <hr className="mb-4" />

            {/* Appearance Settings */}
            <div className="card mb-4">
                <div className={`card-body ${darkMode ? 'bg-dark text-light' : ''}`}>
                    <h5 className="card-title">Appearance & Accessibility</h5>

                    {/* Theme Toggle */}
                    <div className="mb-4">
                        <label className="form-label">Theme</label>
                        <div>
                            <button onClick={toggleDarkMode} className={toggleBtnClass}>
                                {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            </button>
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="mb-4">
                        <label className="form-label">Font Size</label>
                        <div className="d-flex align-items-center gap-3">
                            <input
                                type="range"
                                className="form-range"
                                min="12"
                                max="24"
                                step="2"
                                value={fontSize}
                                onChange={(e) => handleFontSizeChange(e.target.value)}
                            />
                            <span className="badge bg-secondary">{fontSize}px</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
