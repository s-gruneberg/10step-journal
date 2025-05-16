import { useEffect, useState } from 'react'
import { useDarkMode } from '../context/DarkModeContext'
import {
    getQuestions,
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
                    <button type="button" className="btn btn-primary btn-success" onClick={handleAddQuestion}>
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
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveQuestion(q)}>
                            X
                        </button>
                    </li>
                ))}
            </ul>

            <button className="btn btn-warning" onClick={handleRestoreDefaults}>
                Restore Defaults
            </button>
        </div>
    )
}