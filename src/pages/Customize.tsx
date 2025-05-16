import { useEffect, useState } from 'react'
import { useDarkMode } from '../context/DarkModeContext'
import {
    getQuestions,
    setQuestions,
    restoreDefaultQuestions,
    addQuestion,
    removeQuestion
} from '../localStorageUtils.ts'

export default function CustomizeQuestions() {
    const { darkMode } = useDarkMode()
    const [questions, setLocalQuestions] = useState<string[]>([])
    const [newQuestion, setNewQuestion] = useState<string>('')

    useEffect(() => {
        setLocalQuestions(getQuestions())
    }, [])

    const handleAddQuestion = () => {
        const trimmed = newQuestion.trim()
        if (!trimmed || questions.includes(trimmed)) return

        addQuestion(trimmed)
        setLocalQuestions(getQuestions())
        setNewQuestion('')
    }

    const handleRemoveQuestion = (q: string) => {
        removeQuestion(q)
        setLocalQuestions(getQuestions())
    }

    const handleRestoreDefaults = () => {
        restoreDefaultQuestions()
        setLocalQuestions(getQuestions())
    }

    return (
        <div>
            <h1 className="mb-2">Customize Questions</h1>
            <hr className="mb-4 mt-1" />

            <div className="mb-4">
                <label htmlFor="newQuestion" className="form-label">Add New Question</label>
                <div className="d-flex">
                    <input
                        id="newQuestion"
                        type="text"
                        className={`form-control me-2 ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Enter a new question"
                    />
                    <button className="btn btn-primary" onClick={handleAddQuestion}>
                        Add
                    </button>
                </div>
            </div>

            <ul className="list-group mb-4">
                {questions.map((q, i) => (
                    <li
                        key={i}
                        className={`list-group-item d-flex justify-content-between align-items-center ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    >
                        {q}
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveQuestion(q)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <button className="btn btn-warning" onClick={handleRestoreDefaults}>
                Restore Default Questions
            </button>
        </div>
    )
}