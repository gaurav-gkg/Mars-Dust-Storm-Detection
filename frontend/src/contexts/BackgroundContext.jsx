import { createContext, useContext, useState } from 'react'

const BackgroundContext = createContext()

export const BackgroundProvider = ({ children }) => {
  const [enableDitherBg, setEnableDitherBg] = useState(true) // Enabled by default

  return (
    <BackgroundContext.Provider value={{ enableDitherBg, setEnableDitherBg }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export const useBackground = () => {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider')
  }
  return context
}

