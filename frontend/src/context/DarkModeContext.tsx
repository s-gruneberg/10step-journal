import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { loadJournalData, saveJournalData } from '../localStorageUtils' // adjust path as needed

interface DarkModeContextType {
    darkMode: boolean
    toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

function DarkModeProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false

        // Check localStorage first for user preference
        const stored = loadJournalData().darkMode
        if (stored === 'dark') return true
        if (stored === 'light') return false

        // If no stored preference, use system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        // Apply theme to html element
        if (darkMode) {
            document.documentElement.classList.remove('light')
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
            document.documentElement.classList.add('light')
        }

        // Save to localStorage
        saveJournalData({ darkMode: darkMode ? 'dark' : 'light' })
    }, [darkMode])

    const toggleDarkMode = () => setDarkMode(prev => !prev)

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}

function useDarkMode() {
    const context = useContext(DarkModeContext)
    if (!context) throw new Error('useDarkMode must be used within a DarkModeProvider')
    return context
}

export { DarkModeProvider, useDarkMode }
