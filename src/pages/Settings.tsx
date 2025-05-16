import { useDarkMode } from '../context/DarkModeContext'

const Settings = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()
    const toggleBtnClass = `btn ${darkMode ? 'btn-light' : 'btn-dark'}`

    return (
        <div className="container mt-4">
            <h1 className="text-3xl font-bold mb-1">Settings</h1>
            <hr className="w-full h-0.5 bg-gray-300 rounded-sm mb-6" />

            <div className="mt-6">
                <button onClick={toggleDarkMode} className={toggleBtnClass}>
                    {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </div>
        </div>
    )
}

export default Settings
