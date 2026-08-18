import { apiClient } from '../../shared/api/client'
import type { PublicResponseDetail, PublicResponseList, PublicResponseQuery } from './types'

export function getPublicResponses(query: PublicResponseQuery = {}) {
  const params = new URLSearchParams()
  if (query.keyword) params.set('keyword', query.keyword)
  if (query.categoryCode) params.set('categoryCode', query.categoryCode)
  if (query.completedFrom) params.set('completedFrom', query.completedFrom)
  if (query.completedTo) params.set('completedTo', query.completedTo)
  return apiClient.get<PublicResponseList>(`/public-responses?${params}`)
}
export function getPublicResponse(responseId: number) { return apiClient.get<PublicResponseDetail>(`/public-responses/${responseId}`) }
