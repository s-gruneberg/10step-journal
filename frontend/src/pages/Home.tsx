// pages/Home.tsx
import { useDarkMode } from '../context/DarkModeContext'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Home = () => {
  const { darkMode } = useDarkMode()
  const { isAuthenticated } = useAuth()
  const primaryButtonClass = `btn ${darkMode ? 'btn-outline-primary' : 'btn-primary'} btn-lg`
  const secondaryButtonClass = `btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'} ms-3`

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

      <div className="mt-4">
        <Link to="/inventory" className={primaryButtonClass}>
          Go to Inventory
        </Link>
      </div>

      {!isAuthenticated && (
        <div className="mt-5 pt-4 border-top">
          <h2 className="h4 mb-3">Account creation coming soon!</h2>
          <div className="d-flex align-items-center">
            <Link to="/register" className={primaryButtonClass}>
              Register
            </Link>
            <span className="mx-3">or</span>
            <Link to="/login" className={secondaryButtonClass}>
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
