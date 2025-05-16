import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface DarkModeContextType {
    darkMode: boolean
    toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    // 1. Initialize from localStorage or fallback to system preference
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false // SSR safe

        const stored = localStorage.getItem('darkMode')
        if (stored === 'dark') return true
        if (stored === 'light') return false

        // fallback to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    // 2. Sync darkMode state with localStorage and body class
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode ? 'dark' : 'light')
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
