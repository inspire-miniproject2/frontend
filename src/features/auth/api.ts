import { apiClient } from '../../shared/api/client'
import type { LoginRequest, LoginResult, SignupRequest, SignupResult } from './types'

export const login = (request: LoginRequest) => apiClient.post<LoginResult>('/auth/login', request)
export const signup = (request: SignupRequest) => apiClient.post<SignupResult>('/auth/signup', request)
