import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'


interface DarkModeContextType {
    darkMode: boolean
    toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    )

    useEffect(() => {
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
