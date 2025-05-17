const STORAGE_KEY = '10StepJournal'
const SESSION_STORAGE_KEY = '10StepJournal_Answers'

interface JournalData {
    darkMode?: 'dark' | 'light'
    questions?: string[]
}

export const defaultQuestions = [
    "Was I resentful, angry, or dishonest?",
    "Was I kind and loving towards all?",
    "Did I promptly admit when I was wrong?",
    "How did I help others today?",
]

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

/* utils for question manipulation */
export function ensureQuestionsInitialized() {
    const data = loadJournalData()
    if (!Array.isArray(data.questions)) {
        saveJournalData({ questions: defaultQuestions })
    }
}

export function getQuestions(): string[] {
    const data = loadJournalData()
    return Array.isArray(data.questions) ? data.questions : defaultQuestions
}

export function setQuestions(newQuestions: string[]) {
    saveJournalData({ questions: newQuestions })
}

export function addQuestion(question: string) {
    const current = getQuestions()
    if (!current.includes(question)) {
        setQuestions([...current, question])
    }
}

export function removeQuestion(question: string) {
    const current = getQuestions()
    setQuestions(current.filter(q => q !== question))
}

export function restoreDefaultQuestions() {
    setQuestions(defaultQuestions)
}

/* utils for answer manipulation */
export function saveAnswers(answers: string[]) {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(answers))
}

export function loadAnswers(): string[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

