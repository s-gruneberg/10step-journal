import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { loadJournalData, saveJournalData } from '../localStorageUtils' // adjust path as needed

interface DarkModeContextType {
    darkMode: boolean
    toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false
        const stored = loadJournalData().darkMode
        if (stored === 'dark') return true
        if (stored === 'light') return false
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        saveJournalData({ darkMode: darkMode ? 'dark' : 'light' })
        document.body.classList.toggle('dark', darkMode)
    }, [darkMode])

    const toggleDarkMode = () => setDarkMode(prev => !prev)

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}

export const useDarkMode = () => {
    const context = useContext(DarkModeContext)
    if (!context) throw new Error('useDarkMode must be used within a DarkModeProvider')
    return context
}
