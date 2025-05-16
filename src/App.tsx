// main.tsx or App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'

function App() {
  return (
    <Router>
      <Header />
      <div className="container my-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

/* TODO
- Persist dark / light preferences using localstorage or cookie
- Figure out why the light/dark button jumps around when clicked (14 pro max does this)
- 
*/
