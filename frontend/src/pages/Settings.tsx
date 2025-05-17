import { useDarkMode } from '../context/DarkModeContext'

const Settings = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()
    const toggleBtnClass = `btn ${darkMode ? 'btn-light' : 'btn-dark'}`

    return (
        <div className="container mt-4">
            <h1 className="mb-2">Settings</h1>
            <hr className="mb-5 mt-0" />
            <div className="mt-4">
                <button onClick={toggleDarkMode} className={toggleBtnClass}>
                    {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </div>
        </div>
    )
}

export default Settings
