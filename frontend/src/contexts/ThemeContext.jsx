import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Always dark theme
  const [isDark] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light')
    root.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }, [])

  return (
    <ThemeContext.Provider value={{ isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}



