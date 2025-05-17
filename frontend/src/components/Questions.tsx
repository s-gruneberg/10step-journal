import { useDarkMode } from '../context/DarkModeContext'

interface QuestionsProps {
    questions: string[];
    answers: string[];
    onAnswerChange: (index: number, value: string) => void;
}


const Questions = ({ questions, answers, onAnswerChange }: QuestionsProps) => {
    const { darkMode } = useDarkMode()

    return (
        <>
            {questions.map((q, i) => (
                <div key={i} className="mb-4">
                    <label className="form-label fw-bold text-wrap d-block text-break">{q}</label>
                    <textarea
                        className={`form-control themed-textarea ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light'
                            }`}
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


