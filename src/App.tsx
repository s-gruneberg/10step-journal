// main.tsx or App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Settings from './pages/Settings.tsx'
import Customize from './pages/Customize.tsx'

function App() {
  return (
    <Router>
      <Header />
      <div className="container my-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/customize" element={<Customize />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

/* TODO
- Make header text fit 
- Add pages: nightly inventory, home(?), meditation and prayer / upon awakening (?), customize questions
- Consider moving light/dark button or changing color (not sure how to change color)
- Save to pdf functionality
- Custom question functionality
- Making sure it can extend out to a backend that stores user's custom questions, morning meditation/prayer streaks with data, 
- Home page explaining step 10 and what's going on with a link to nightly inventory, maybe a selective navigation: if user has visited before, go to nightly inventory page
- making sure local storage data is structured correctly, ie key: 10stepjournal: dark:true, questions: ["question 1", "question2"...]
- if you open mobile menu, then click something else, mobile menu closes
- persist the answers to local storage but only during the session 

*/
