import { useDarkMode } from '../context/DarkModeContext'
import { useState, useEffect } from 'react'
import { getCheckmarks, getCheckmarkStates, saveCheckmarkStates, clearAnswers } from '../localStorageUtils'

interface QuestionsProps {
    questions: string[];
    answers: string[];
    onAnswerChange: (index: number, value: string) => void;
    onClear: () => void;
}

const Questions = ({ questions, answers, onAnswerChange, onClear }: QuestionsProps) => {
    const { darkMode } = useDarkMode()
    const [checkmarks, setCheckmarks] = useState<string[]>([])
    const [checkmarkStates, setCheckmarkStates] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const loadedCheckmarks = getCheckmarks()
        const loadedStates = getCheckmarkStates()
        setCheckmarks(loadedCheckmarks)
        setCheckmarkStates(loadedStates)
    }, [])

    const handleCheckmarkChange = (checkmark: string, checked: boolean) => {
        const newStates = { ...checkmarkStates, [checkmark]: checked }
        setCheckmarkStates(newStates)
        saveCheckmarkStates(newStates)
    }

    const handleClearAll = () => {
        // Clear all storage and state
        clearAnswers()
        setCheckmarkStates({})
        onClear()
    }

    return (
        <>
            <h2 className="h4 mb-3">Daily Activities</h2>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="d-flex flex-wrap gap-4" style={{ flex: '1 1 auto' }}>
                    {checkmarks.map((checkmark) => (
                        <div key={checkmark} className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`checkmark-${checkmark}`}
                                checked={checkmarkStates[checkmark] || false}
                                onChange={(e) => handleCheckmarkChange(checkmark, e.target.checked)}
                            />
                            <label className="form-check-label text-capitalize" htmlFor={`checkmark-${checkmark}`}>
                                {checkmark}
                            </label>
                        </div>
                    ))}
                </div>
                <button
                    className={`btn ${darkMode ? 'btn-outline-danger' : 'btn-danger'} ms-3`}
                    onClick={handleClearAll}
                >
                    Clear All
                </button>
            </div>

            <h2 className="h4 mb-3">Inventory Questions</h2>
            {questions.map((q, i) => (
                <div key={i} className="mb-4">
                    <label className="form-label fw-bold text-wrap d-block text-break">{q}</label>
                    <textarea
                        className={`form-control themed-textarea ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}
                        rows={3}
                        placeholder="Write your answer here..."
                        value={answers[i] || ''}
                        onChange={(e) => onAnswerChange(i, e.target.value)}
                    />
                </div>
            ))}
        </>
    )
}

export default Questions


