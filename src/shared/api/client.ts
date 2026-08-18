import { ApiError, type ApiFailure, type ApiSuccess } from './contracts'
import { authSession } from '../../features/auth/session'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  const accessToken = authSession.get()?.accessToken
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })
  const body = await response.json() as ApiSuccess<T> | ApiFailure
  if (!response.ok || !body.success) {
    if (response.status === 401 && path !== '/auth/login') authSession.clear()
    throw new ApiError(response.status, body as ApiFailure)
  }
  return body.data
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  postForm: <T>(path: string, body: FormData) => request<T>(path, { method: 'POST', body }),
}
