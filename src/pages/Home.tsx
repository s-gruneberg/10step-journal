import { useState } from 'react'
import Questions from '../components/Questions'
import { getQuestions } from '../localStorageUtils.ts'
import { downloadAsPDF } from '../downloadUtils.ts'

export default function Home() {
  const questions = getQuestions()
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''))

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleDownload = () => {
    const qaPairs = questions.map((q, i) => ({ q, a: answers[i] || '' }))
    const title = `10th Step Journal - ${new Date().toLocaleDateString()}`
    downloadAsPDF(title, qaPairs)
  }

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
        <button
          className="btn btn-primary btn-success"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </>

  )
}
