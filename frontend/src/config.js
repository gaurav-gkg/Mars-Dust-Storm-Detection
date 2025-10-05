// API Configuration
// In production, this will use the VITE_API_URL environment variable
// In development, it falls back to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
