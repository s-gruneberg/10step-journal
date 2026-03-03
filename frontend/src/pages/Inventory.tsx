import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Questions from '../components/Questions'
import { getQuestions, saveAnswers, getAnswers, getCheckmarkStates } from '../localStorageUtils.ts'
import { downloadAsPDF, downloadAsWord, downloadAsText, getTextContent } from '../downloadUtils.ts'
import { useDarkMode } from '../context/DarkModeContext.tsx'

export default function Inventory() {
    const questions = getQuestions()
    const [answers, setAnswers] = useState<string[]>(() => {
        const savedAnswers = getAnswers()
        // Convert the answers object to an array matching questions length
        const answersArray = Array(questions.length).fill('')
        Object.entries(savedAnswers).forEach(([index, value]) => {
            const i = parseInt(index)
            if (!isNaN(i) && i < questions.length) {
                answersArray[i] = value
            }
        })
        return answersArray
    })
    const { darkMode } = useDarkMode()
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null)
    const buttonClass = `btn ${darkMode ? 'btn btn-outline-success dropdown-toggle' : 'btn btn-success dropdown-toggle'}`
    const copyButtonClass = `btn ${darkMode ? 'btn-outline-primary' : 'btn-primary'}`
    const customizeButtonClass = `btn ${darkMode ? 'btn-outline-primary' : 'btn-primary'} mb-4`

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers]
        newAnswers[index] = value
        setAnswers(newAnswers)

        // Convert array to object for storage, only storing non-empty answers
        const answersObj: Record<number, string> = {}
        newAnswers.forEach((answer, idx) => {
            if (answer.trim()) {
                answersObj[idx] = answer
            }
        })
        saveAnswers(answersObj)
    }

    // Save functionality removed - data is saved to localStorage automatically via handleAnswerChange

    const handleClear = () => {
        const emptyAnswers = Array(questions.length).fill('')
        setAnswers(emptyAnswers)
        saveAnswers({}) // Clear stored answers
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

            // Convert array to object for storage
            const answersObj: Record<number, string> = {}
            newAnswers.forEach((answer, idx) => {
                if (answer.trim()) {
                    answersObj[idx] = answer
                }
            })
            saveAnswers(answersObj)
        }
    }, [questions.length])

    const getJournalContent = () => {
        // Only include questions that have a non-empty answer
        const qaPairs = questions
            .map((q, i) => ({ q, a: answers[i] || '' }))
            .filter(({ a }) => a.trim().length > 0)

        const now = new Date()
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const dateString = now.toLocaleDateString()
        const title = `10th Step - ${dateString} ${timeString}`
        return { title, qa: qaPairs, checkmarks: getCheckmarkStates() }
    }

    const handleDownload = (downloadFn: (content: { title: string; qa: { q: string; a: string }[]; checkmarks: Record<string, boolean> }) => void) => {
        downloadFn(getJournalContent())
    }

    const handleCopy = async () => {
        const content = getJournalContent()
        const text = getTextContent(content)
        try {
            await navigator.clipboard.writeText(text)
            setCopyFeedback('Copied!')
            setTimeout(() => setCopyFeedback(null), 2000)
        } catch {
            setCopyFeedback('Copy failed')
            setTimeout(() => setCopyFeedback(null), 2000)
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="mb-2">Inventory</h1>
                <Link to="/customize" className={customizeButtonClass}>
                    Customize
                </Link>
            </div>
            <hr className="mb-4 mt-0" />


            <Questions
                questions={questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onClear={handleClear}
            />
            <div className="d-flex justify-content-between align-items-center mt-4 gap-2 flex-wrap">
                <div className="d-flex align-items-center gap-2">
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
                    <button
                        type="button"
                        className={copyButtonClass}
                        onClick={handleCopy}
                        title="Copy to clipboard"
                        aria-label="Copy questions and answers to clipboard"
                    >
                        <i className="bi bi-clipboard me-1" aria-hidden="true" />
                        {copyFeedback ?? 'Copy'}
                    </button>
                </div>
            </div>
        </>
    )
}
