import React from 'react'
import { useDarkMode } from '../context/DarkModeContext'

const questions = [
    "What did I do wrong today?",
    "What did I do right today?",
    "What could I have done better?",
    "How did I help others today?",
    "What am I grateful for today?",
]

export default function Questions() {
    const { darkMode } = useDarkMode()

    return (
        <>
            {questions.map((q, i) => (
                <div key={i} className="mb-4">
                    <label className="form-label fw-bold">{q}</label>
                    <textarea
                        className={`form-control themed-textarea ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}
                        rows={3}
                        placeholder="Write your answer here..."
                    />
                </div>
            ))}
        </>
    )
}
