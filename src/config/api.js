const rawApiBaseUrl = import.meta.env.VITE_API_URL
const isProduction = import.meta.env.PROD

if (isProduction && !rawApiBaseUrl) {
  throw new Error('Missing VITE_API_URL in production build')
}

const fallbackApiBaseUrl = 'http://localhost:3002'
const selectedApiBaseUrl = rawApiBaseUrl || fallbackApiBaseUrl
const normalizedApiBaseUrl = selectedApiBaseUrl.startsWith('http')
  ? selectedApiBaseUrl
  : `https://${selectedApiBaseUrl}`

export const API_BASE_URL = normalizedApiBaseUrl.replace(/\/+$/, '')
