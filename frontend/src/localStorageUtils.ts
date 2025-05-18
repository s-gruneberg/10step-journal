const STORAGE_KEY = '10StepJournal'
const SESSION_STORAGE_KEY = '10StepJournal_Answers'
const CHECKMARKS_KEY = '10StepJournal_Checkmarks'
const ANSWERS_EXPIRY_KEY = '10StepJournal_AnswersExpiry'

interface JournalData {
    darkMode?: 'dark' | 'light'
    questions?: string[]
    checkmarks?: string[]
}

export const defaultQuestions = [
    "Was I resentful, angry, or dishonest?",
    "Was I kind and loving towards all?",
    "Did I promptly admit when I was wrong?",
    "How did I help others today?",
]

export const defaultCheckmarks = [
    "Pray",
    "Meditate"
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
    const update: JournalData = {}

    if (!Array.isArray(data.questions)) {
        update.questions = defaultQuestions
    }
    if (!Array.isArray(data.checkmarks)) {
        update.checkmarks = defaultCheckmarks
    }

    if (Object.keys(update).length > 0) {
        saveJournalData(update)
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

/* utils for checkmark manipulation */
export function getCheckmarks(): string[] {
    const data = loadJournalData()
    return Array.isArray(data.checkmarks) ? data.checkmarks : defaultCheckmarks
}

export function setCheckmarks(newCheckmarks: string[]) {
    saveJournalData({ checkmarks: newCheckmarks })
}

export function addCheckmark(checkmark: string) {
    const current = getCheckmarks()
    if (!current.includes(checkmark)) {
        setCheckmarks([...current, checkmark])
    }
}

export function removeCheckmark(checkmark: string) {
    const current = getCheckmarks()
    setCheckmarks(current.filter(c => c !== checkmark))
}

export function restoreDefaultCheckmarks() {
    setCheckmarks(defaultCheckmarks)
}

export function getCheckmarkStates(): Record<string, boolean> {
    try {
        const raw = sessionStorage.getItem(CHECKMARKS_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

export function saveCheckmarkStates(states: Record<string, boolean>) {
    sessionStorage.setItem(CHECKMARKS_KEY, JSON.stringify(states))
}

/* utils for answer manipulation with expiry */
export function saveAnswers(answers: string[]) {
    if (typeof window === 'undefined') return
    const expiry = new Date().getTime() + (60 * 60 * 1000) // 1 hour from now
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(answers))
    sessionStorage.setItem(ANSWERS_EXPIRY_KEY, expiry.toString())
}

export function loadAnswers(): string[] {
    if (typeof window === 'undefined') return []
    try {
        const expiry = sessionStorage.getItem(ANSWERS_EXPIRY_KEY)
        if (expiry && new Date().getTime() > parseInt(expiry)) {
            sessionStorage.removeItem(SESSION_STORAGE_KEY)
            sessionStorage.removeItem(ANSWERS_EXPIRY_KEY)
            return []
        }
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function clearAnswers() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    sessionStorage.removeItem(ANSWERS_EXPIRY_KEY)
    sessionStorage.removeItem(CHECKMARKS_KEY)
}

