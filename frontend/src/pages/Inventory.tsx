import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Questions from '../components/Questions'
import { getQuestions, saveAnswers, loadAnswers, getCheckmarkStates } from '../localStorageUtils.ts'
import { downloadAsPDF, downloadAsWord, downloadAsText } from '../downloadUtils.ts'
import { useDarkMode } from '../context/DarkModeContext.tsx'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../services/api'

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
    const { isAuthenticated } = useAuth()
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const buttonClass = `btn ${darkMode ? 'btn btn-outline-success dropdown-toggle' : 'btn btn-success dropdown-toggle'}`
    const customizeButtonClass = `btn ${darkMode ? 'btn-outline-primary' : 'btn-primary'} mb-4`

    const handleAnswerChange = async (index: number, value: string) => {
        const newAnswers = [...answers]
        newAnswers[index] = value
        setAnswers(newAnswers)
        saveAnswers(newAnswers)

        if (isAuthenticated) {
            await saveToBackend(newAnswers);
        }
    }

    const saveToBackend = async (currentAnswers: string[]) => {
        try {
            setIsSaving(true)
            setSaveError(null)

            // Create an object mapping question index to answer
            const answersObj: Record<string, string> = {};
            currentAnswers.forEach((answer, index) => {
                if (answer.trim()) { // Only save non-empty answers
                    answersObj[index.toString()] = answer;
                }
            });

            // Get current checkmark states
            const checkmarkStates = getCheckmarkStates();

            // Save to backend
            await apiService.saveJournalEntry({
                date: new Date().toISOString().split('T')[0],
                answers: answersObj,
                checkmarks: checkmarkStates
            });
        } catch (error) {
            console.error('Failed to save journal entry:', error);
            setSaveError('Failed to save your entry. Your work is saved locally.');
        } finally {
            setIsSaving(false)
        }
    };

    const handleClear = () => {
        const emptyAnswers = Array(questions.length).fill('')
        setAnswers(emptyAnswers)
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
                <button
                    className={`btn ${darkMode ? 'btn-outline-success' : 'btn-success'}`}
                    onClick={() => saveToBackend(answers)}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
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
