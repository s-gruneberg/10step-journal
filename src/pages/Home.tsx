import { useState } from 'react'
import Questions from '../components/Questions'
import { getQuestions } from '../localStorageUtils.ts'
import { downloadAsPDF, downloadAsWord, downloadAsText } from '../downloadUtils.ts'


export default function Home() {
  const questions = getQuestions()
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''))

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

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
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown button
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
