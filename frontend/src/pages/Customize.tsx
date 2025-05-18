import { useEffect, useState } from 'react'
import { useDarkMode } from '../context/DarkModeContext'
import {
    getQuestions,
    restoreDefaultQuestions,
    addQuestion,
    removeQuestion,
    getCheckmarks,
    addCheckmark,
    removeCheckmark,
    restoreDefaultCheckmarks
} from '../localStorageUtils.ts'

export default function CustomizeQuestions() {
    const { darkMode } = useDarkMode()
    const [questions, setLocalQuestions] = useState<string[]>([])
    const [checkmarks, setLocalCheckmarks] = useState<string[]>([])
    const [newQuestion, setNewQuestion] = useState<string>('')
    const [newCheckmark, setNewCheckmark] = useState<string>('')

    useEffect(() => {
        setLocalQuestions(getQuestions())
        setLocalCheckmarks(getCheckmarks())
    }, [])

    const handleAddQuestion = () => {
        const trimmed = newQuestion.trim()
        if (!trimmed || questions.includes(trimmed)) return

        addQuestion(trimmed)
        setLocalQuestions(getQuestions())
        setNewQuestion('')
    }

    const handleAddCheckmark = () => {
        const trimmed = newCheckmark.trim()
        if (!trimmed || checkmarks.includes(trimmed)) return

        addCheckmark(trimmed)
        setLocalCheckmarks(getCheckmarks())
        setNewCheckmark('')
    }

    const handleRemoveQuestion = (q: string) => {
        removeQuestion(q)
        setLocalQuestions(getQuestions())
    }

    const handleRemoveCheckmark = (c: string) => {
        removeCheckmark(c)
        setLocalCheckmarks(getCheckmarks())
    }

    const handleRestoreDefaults = () => {
        restoreDefaultQuestions()
        restoreDefaultCheckmarks()
        setLocalQuestions(getQuestions())
        setLocalCheckmarks(getCheckmarks())
    }

    const addButtonClass = `btn ${darkMode ? 'btn-outline-success' : 'btn-success'}`
    const restoreButtonClass = `btn ${darkMode ? 'btn-outline-warning' : 'btn-warning'}`
    const deleteButtonClass = `btn ${darkMode ? 'btn-outline-danger' : 'btn-danger'}`

    return (
        <div>
            <h1 className="mb-2">Customize Questions</h1>
            <hr className="mb-4 mt-1" />

            <div className="mb-4">
                <label htmlFor="newQuestion" className="form-label"><strong>Add New Question</strong></label>
                <div className="d-flex">
                    <input
                        id="newQuestion"
                        type="text"
                        className={`form-control me-2 ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Enter a new question"
                    />
                    <button type="button" className={addButtonClass} onClick={handleAddQuestion}>
                        Add
                    </button>
                </div>
            </div>

            <ul className="list-group mb-4">
                {questions.map((q, i) => (
                    <li
                        key={i}
                        className={`list-group-item d-flex justify-content-between align-items-start ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    >
                        <div className="flex-grow-1 me-2 text-break">
                            {q}
                        </div>
                        <button className={deleteButtonClass} onClick={() => handleRemoveQuestion(q)}>
                            X
                        </button>
                    </li>
                ))}
            </ul>

            <h2 className="h4 mb-3">Daily Activities</h2>
            <div className="mb-4">
                <label htmlFor="newCheckmark" className="form-label"><strong>Add New Activity</strong></label>
                <div className="d-flex">
                    <input
                        id="newCheckmark"
                        type="text"
                        className={`form-control me-2 ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}
                        value={newCheckmark}
                        onChange={(e) => setNewCheckmark(e.target.value)}
                        placeholder="Enter a new daily activity"
                    />
                    <button type="button" className={addButtonClass} onClick={handleAddCheckmark}>
                        Add
                    </button>
                </div>
            </div>

            <ul className="list-group mb-4">
                {checkmarks.map((c, i) => (
                    <li
                        key={i}
                        className={`list-group-item d-flex justify-content-between align-items-start ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    >
                        <div className="flex-grow-1 me-2 text-break text-capitalize">
                            {c}
                        </div>
                        <button className={deleteButtonClass} onClick={() => handleRemoveCheckmark(c)}>
                            X
                        </button>
                    </li>
                ))}
            </ul>

            <button className={restoreButtonClass} onClick={handleRestoreDefaults}>
                Restore Defaults
            </button>
        </div>
    )
}