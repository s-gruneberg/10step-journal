const STORAGE_KEY = '10StepJournal'

interface JournalData {
    darkMode?: 'dark' | 'light'
    questions?: string[]
    // Add other fields as needed
}

export function loadJournalData(): JournalData {
    if (typeof window === 'undefined') return {}

    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

export function saveJournalData(update: Partial<JournalData>) {
    const current = loadJournalData()
    const next = { ...current, ...update }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}
