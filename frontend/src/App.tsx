// main.tsx or App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Inventory from './pages/Inventory.tsx'
import About from './pages/About.tsx'
import Settings from './pages/Settings.tsx'
import Customize from './pages/Customize.tsx'
import Home from './pages/Home.tsx'
import Login from './pages/Login'
import Register from './pages/Register'
import Insights from './pages/Insights'
import { AuthProvider } from './context/AuthContext'

function AppContent() {
  return (
    <Router>
      <Header />
      <div className="container my-5">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/customize" element={<Customize />} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App


