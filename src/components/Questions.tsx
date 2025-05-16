import React from 'react'
import { useDarkMode } from '../context/DarkModeContext'

const questions = [
    "Was I resentful, angry, or dishonest?",
    "Was I kind and loving towards all?",
    "Did I promptly admit when I was wrong today?",
    "How did I help others today?",
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
