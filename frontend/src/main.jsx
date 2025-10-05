import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { BackgroundProvider } from './contexts/BackgroundContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BackgroundProvider>
        <App />
      </BackgroundProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

