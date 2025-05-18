const APP_NAMESPACE = '10StepJournal';

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

const getNamespacedKey = (key: string) => `${APP_NAMESPACE}.${key}`;

export function loadJournalData(): JournalData {
    if (typeof window === 'undefined') return {}

    try {
        const raw = localStorage.getItem(getNamespacedKey('JournalData'));
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

export function saveJournalData(update: Partial<JournalData>) {
    const current = loadJournalData()
    const next = { ...current, ...update }
    localStorage.setItem(getNamespacedKey('JournalData'), JSON.stringify(next))
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
    const stored = localStorage.getItem(getNamespacedKey('Questions'));
    if (!stored) return defaultQuestions;
    try {
        return JSON.parse(stored);
    } catch {
        return defaultQuestions;
    }
}

export function setQuestions(newQuestions: string[]) {
    localStorage.setItem(getNamespacedKey('Questions'), JSON.stringify(newQuestions));
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
    const stored = localStorage.getItem(getNamespacedKey('Checkmarks'));
    if (!stored) return defaultCheckmarks;
    try {
        return JSON.parse(stored);
    } catch {
        return defaultCheckmarks;
    }
}

export function setCheckmarks(newCheckmarks: string[]) {
    localStorage.setItem(getNamespacedKey('Checkmarks'), JSON.stringify(newCheckmarks));
}

export function addCheckmark(checkmark: string) {
    const current = getCheckmarks()
    if (!current.includes(checkmark)) {
        setCheckmarks([...current, checkmark])
    }
}

export function removeCheckmark(checkmark: string) {
    const current = getCheckmarks()
    const filtered = current.filter(c => c !== checkmark)
    setCheckmarks(filtered)
}

export function restoreDefaultCheckmarks() {
    setCheckmarks(defaultCheckmarks)
}

export function getCheckmarkStates(): Record<string, boolean> {
    const stored = localStorage.getItem(getNamespacedKey('CheckmarkStates'));
    if (!stored) return {};
    try {
        return JSON.parse(stored);
    } catch {
        return {};
    }
}

export function saveCheckmarkStates(states: Record<string, boolean>) {
    localStorage.setItem(getNamespacedKey('CheckmarkStates'), JSON.stringify(states));
}

/* utils for answer manipulation with expiry */
export function getAnswers(): Record<number, string> {
    const stored = localStorage.getItem(getNamespacedKey('Answers'));
    if (!stored) return {};
    try {
        return JSON.parse(stored);
    } catch {
        return {};
    }
}

export function saveAnswers(answers: Record<number, string>) {
    localStorage.setItem(getNamespacedKey('Answers'), JSON.stringify(answers));
}

export function clearAnswers() {
    localStorage.removeItem(getNamespacedKey('Answers'));
    localStorage.removeItem(getNamespacedKey('CheckmarkStates'));
}

