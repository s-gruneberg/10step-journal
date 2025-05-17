import { useState, useEffect } from 'react'
import Questions from '../components/Questions'
import { getQuestions, saveAnswers, loadAnswers } from '../localStorageUtils.ts'
import { downloadAsPDF, downloadAsWord, downloadAsText } from '../downloadUtils.ts'
import { useDarkMode } from '../context/DarkModeContext.tsx'

export default function Inventory() {
    const questions = getQuestions()
    const [answers, setAnswers] = useState<string[]>(() => {
        const savedAnswers = loadAnswers()
        // Ensure we have an answer slot for each question
        return savedAnswers.length === questions.length
            ? savedAnswers
            : Array(questions.length).fill('')
    })
    const { darkMode } = useDarkMode()
    const buttonClass = `btn ${darkMode ? 'btn btn-outline-success dropdown-toggle' : 'btn btn-success dropdown-toggle'}`

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers]
        newAnswers[index] = value
        setAnswers(newAnswers)
        saveAnswers(newAnswers)
    }

    // Update answers array if questions length changes
    useEffect(() => {
        if (answers.length !== questions.length) {
            const newAnswers = Array(questions.length).fill('')
            // Copy over any existing answers
            answers.forEach((answer, index) => {
                if (index < questions.length) {
                    newAnswers[index] = answer
                }
            })
            setAnswers(newAnswers)
            saveAnswers(newAnswers)
        }
    }, [questions.length])

    const handleDownload = (downloadFn: (title: string, qaPairs: { q: string; a: string }[]) => void) => {
        const qaPairs = questions.map((q, i) => ({ q, a: answers[i] || '' }));
        const now = new Date()
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        const dateString = now.toLocaleDateString()
        const title = `10th Step Journal - ${dateString} ${timeString}`

        downloadFn(title, qaPairs);
    };

    return (
        <>
            <h1 className="mb-2">Inventory</h1>
            <hr className="mb-4 mt-0" />



            <Questions
                questions={questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
            />
            <div className="d-flex justify-content-end">


                <div className="dropdown">
                    <button className={buttonClass} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Download
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <button
                                className="dropdown-item"
                                onClick={() => handleDownload(downloadAsPDF)}
                            >
                                Download PDF
                            </button>
                        </li>
                        <li>
                            <button
                                className="dropdown-item"
                                onClick={() => handleDownload(downloadAsWord)}
                            >
                                Download Word
                            </button>
                        </li>
                        <li>
                            <button
                                className="dropdown-item"
                                onClick={() => handleDownload(downloadAsText)}
                            >
                                Download Text
                            </button>
                        </li>
                    </ul>

                </div>


            </div>
        </>

    )
}
