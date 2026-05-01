const rawApiBaseUrl = import.meta.env.VITE_API_URL
const isProduction = import.meta.env.PROD
const fallbackApiBaseUrl = 'https://kanbantodolist-backend.onrender.com'

if (isProduction && !rawApiBaseUrl) {
  throw new Error('Missing VITE_API_URL in production build')
}

const selectedApiBaseUrl = rawApiBaseUrl || fallbackApiBaseUrl
const normalizedApiBaseUrl = selectedApiBaseUrl.startsWith('http')
  ? selectedApiBaseUrl
  : `https://${selectedApiBaseUrl}`

export const API_BASE_URL = normalizedApiBaseUrl.replace(/\/+$/, '')
