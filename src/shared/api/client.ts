import { authSession } from '../../features/auth/session'
import { ApiError, type ApiFailure, type ApiSuccess } from './contracts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
const authorizedHeaders = (source?: HeadersInit) => {
  const headers = new Headers(source)
  const accessToken = authSession.get()?.accessToken
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  return headers
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: authorizedHeaders(init?.headers) })
  const body = await response.json() as ApiSuccess<T> | ApiFailure
  if (!response.ok || !body.success) {
    if (response.status === 401 && path !== '/auth/login') authSession.clear()
    throw new ApiError(response.status, body as ApiFailure)
  }
  return body.data
}

async function download(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: authorizedHeaders() })
  if (!response.ok) {
    const body = await response.json() as ApiFailure
    if (response.status === 401) authSession.clear()
    throw new ApiError(response.status, body)
  }
  const disposition = response.headers.get('Content-Disposition') ?? ''
  const encodedName = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1]
  const plainName = disposition.match(/filename="?([^";]+)"?/i)?.[1]
  return { blob: await response.blob(), filename: encodedName ? decodeURIComponent(encodedName) : plainName }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  postForm: <T>(path: string, body: FormData) => request<T>(path, { method: 'POST', body }),
  download,
}
