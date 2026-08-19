import { apiClient } from '../../shared/api/client'
import type { DailyStatistics, DailyStatisticsQuery } from './types'

export function getDailyStatistics(query: DailyStatisticsQuery) {
  const params = new URLSearchParams({ fromDate: query.fromDate, toDate: query.toDate })
  if (query.departmentId !== undefined) params.set('departmentId', String(query.departmentId))
  return apiClient.get<DailyStatistics>(`/admin/statistics/daily?${params}`)
}
