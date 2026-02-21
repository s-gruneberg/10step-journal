// main.tsx or App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './components/Header'
import Inventory from './pages/Inventory.tsx'
import About from './pages/About.tsx'
import Settings from './pages/Settings.tsx'
import Customize from './pages/Customize.tsx'
import Home from './pages/Home.tsx'
import { AuthProvider } from './context/AuthContext'
import SEO from './components/SEO'

function AppContent() {
  return (
    <Router>
      <SEO />
      <Header />
      <div className="container my-5">
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/home" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App


