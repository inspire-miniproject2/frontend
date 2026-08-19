import type { LoginResult } from './types'

const STORAGE_KEY = 'minwonon.auth.session'
const restoreSession = (): LoginResult | null => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as LoginResult
    if (!parsed.accessToken || !parsed.refreshToken || !parsed.user?.role) return null
    return parsed
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

let session: LoginResult | null = restoreSession()
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const authSession = {
  get: () => session,
  set: (next: LoginResult) => { session = next; sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); notify() },
  clear: () => { session = null; sessionStorage.removeItem(STORAGE_KEY); notify() },
  subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } },
}
