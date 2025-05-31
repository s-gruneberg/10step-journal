// pages/Home.tsx
import { useDarkMode } from '../context/DarkModeContext'
import { Link } from 'react-router-dom'

const Home = () => {
  const { darkMode } = useDarkMode()
  const primaryButtonClass = `btn ${darkMode ? 'btn-outline-primary' : 'btn-primary'} btn-lg`

  return (
    <div className="container mt-4">
      <h1 className="h1 mb-2">Welcome to 10th Step Journal!</h1>
      <hr className="mb-5 mt-0" />

      <p className="h3 mb-3">
        This site helps you complete your daily 10th Step inventory.
      </p>
      <ul className="lead">
        <li>You can customize the inventory questions.</li>
        <li>Accounts are not required, there is no data collection, and there are no ads.</li>
      </ul>

      <div className="mt-4">
        <Link to="/inventory" className={primaryButtonClass}>
          Go to Inventory
        </Link>
      </div>
    </div>
  )
}

export default Home
