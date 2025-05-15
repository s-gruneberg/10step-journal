import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container my-5">
      <h1 className="mb-4">10th Step Journal</h1>

      <p className="lead">
        Track your daily progress with the Alcoholics Anonymous 10th Step journaling.
      </p>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setCount(count + 1)}
      >
        Count is {count}
      </button>

      <div>
        <textarea
          className="form-control"
          rows={5}
          placeholder="Write your morning or evening inventory here..."
        />
      </div>
    </div>
  )
}

export default App
