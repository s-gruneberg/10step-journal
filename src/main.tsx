import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DarkModeProvider } from './context/DarkModeContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { ensureQuestionsInitialized } from './localStorageUtils'


ensureQuestionsInitialized();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
)
