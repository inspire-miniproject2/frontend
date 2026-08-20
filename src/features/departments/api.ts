import { apiClient } from '../../shared/api/client'
import type { Department } from './types'

export function getDepartments() {
  return apiClient.get<Department[]>('/departments')
}
