import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Questions from '../components/Questions'
import { getQuestions, saveAnswers, getAnswers, getCheckmarkStates } from '../localStorageUtils.ts'
import { downloadAsPDF, downloadAsWord, downloadAsText } from '../downloadUtils.ts'
import { useDarkMode } from '../context/DarkModeContext.tsx'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../services/api'

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
    const { isAuthenticated } = useAuth()
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const buttonClass = `btn ${darkMode ? 'btn btn-outline-success dropdown-toggle' : 'btn btn-success dropdown-toggle'}`
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

    const handleSave = async () => {
        try {
            setIsSaving(true)
            setSaveError(null)

            // Create an object mapping question index to answer
            const answersObj: Record<string, string> = {}
            answers.forEach((answer, index) => {
                if (answer.trim()) { // Only save non-empty answers
                    answersObj[index.toString()] = answer
                }
            })

            // Get current checkmark states
            const checkmarkStates = getCheckmarkStates()

            // Save to backend
            await apiService.saveJournalEntry({
                date: new Date().toISOString().split('T')[0],
                answers: answersObj,
                checkmarks: checkmarkStates
            })
        } catch (error) {
            console.error('Failed to save journal entry:', error)
            setSaveError('Failed to save your entry. Your work is saved locally.')
        } finally {
            setIsSaving(false)
        }
    }

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

    const handleDownload = (downloadFn: (content: { title: string; qa: { q: string; a: string }[]; checkmarks: Record<string, boolean> }) => void) => {
        const qaPairs = questions.map((q, i) => ({ q, a: answers[i] || '' }));
        const now = new Date()
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        const dateString = now.toLocaleDateString()
        const title = `10th Step Journal - ${dateString} ${timeString}`
        const checkmarkStates = getCheckmarkStates()

        downloadFn({
            title,
            qa: qaPairs,
            checkmarks: checkmarkStates
        });
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="mb-2">Inventory</h1>
                <Link to="/customize" className={customizeButtonClass}>
                    Customize
                </Link>
            </div>
            <hr className="mb-4 mt-0" />

            {saveError && (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    {saveError}
                    <button type="button" className="btn-close" onClick={() => setSaveError(null)} aria-label="Close"></button>
                </div>
            )}

            {isSaving && (
                <div className="alert alert-info" role="alert">
                    Saving your entry...
                </div>
            )}

            <Questions
                questions={questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onClear={handleClear}
            />
            <div className="d-flex justify-content-between align-items-center mt-4">
                {isAuthenticated && (
                    <button
                        className={`btn ${darkMode ? 'btn-outline-success' : 'btn-success'}`}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                )}
                {!isAuthenticated && (
                    <div className="text-muted">
                        <small>Sign in to save your entries</small>
                    </div>
                )}
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
