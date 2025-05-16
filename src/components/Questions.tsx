import React, { useEffect, useState } from 'react'
import { useDarkMode } from '../context/DarkModeContext'
import { getQuestions } from '../localStorageUtils.ts'

export default function Questions() {
    const { darkMode } = useDarkMode()
    const [questions, setQuestions] = useState<string[]>([])

    useEffect(() => {
        setQuestions(getQuestions())
    }, [])
    return (
        <>
            {questions.map((q, i) => (
                <div key={i} className="mb-4">
                    <label className="form-label fw-bold text-wrap d-block text-break">{q}</label>
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
