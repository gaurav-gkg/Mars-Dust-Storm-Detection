// This file is deprecated - use ../contexts/ThemeContext instead
// Keeping for backward compatibility, but re-exporting from context

export { useTheme } from '../contexts/ThemeContext'

// Utility function for theme-aware classes
export const themeClass = (isDark, darkClass, lightClass) => {
  return isDark ? darkClass : lightClass
}

