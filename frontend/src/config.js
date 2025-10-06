// API Configuration
// In production, this will use the VITE_API_URL environment variable
// In development, it falls back to localhost
const isProduction = import.meta.env.PROD
const defaultUrl = isProduction 
  ? 'https://your-app-name.onrender.com'  // Production Render backend
  : 'http://localhost:8000'                // Local development backend

export const API_BASE_URL = import.meta.env.VITE_API_URL || defaultUrl
