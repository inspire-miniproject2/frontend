import type { LoginResult } from './types'

let session: LoginResult | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const authSession = {
  get: () => session,
  set: (next: LoginResult) => { session = next; notify() },
  clear: () => { session = null; notify() },
  subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } },
}
