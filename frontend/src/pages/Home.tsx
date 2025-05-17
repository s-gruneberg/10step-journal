// pages/Home.tsx
import { useDarkMode } from '../context/DarkModeContext'
import { Link } from 'react-router-dom'

const Home = () => {
  const { darkMode } = useDarkMode()
  const buttonClass = `btn ${darkMode ? 'btn-outline-primary' : 'btn-primary'} btn-lg`

  return (
    <div className="container mt-4">
      <h1 className="mb-2">Welcome to 10th Step Journal</h1>
      <hr className="mb-5 mt-0" />

      <p className="lead">
        This site helps you complete your daily 10th Step inventory.
      </p>

      <p className="lead">
        No account required, no data collection, and no ads.
      </p>
      <br />



      <div className="mt-4">
        <Link to="/inventory" className={buttonClass}>
          Go to Inventory
        </Link>
      </div>
    </div>
  )
}

export default Home
