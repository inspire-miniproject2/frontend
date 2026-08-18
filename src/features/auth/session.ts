import type { LoginResult } from './types'

let session: LoginResult | null = null
export const authSession = { get: () => session, set: (next: LoginResult) => { session = next }, clear: () => { session = null } }
