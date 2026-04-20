const rawApiBaseUrl = import.meta.env.VITE_API_URL || 'https://kanban-to-do-list-backend.vercel.app/'

export const API_BASE_URL = rawApiBaseUrl.startsWith('http')
  ? rawApiBaseUrl
  : `https://${rawApiBaseUrl}`
