const rawApiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002'

export const API_BASE_URL = rawApiBaseUrl.startsWith('http')
  ? rawApiBaseUrl
  : `https://${rawApiBaseUrl}`
