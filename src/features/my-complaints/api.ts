import { apiClient } from '../../shared/api/client'
import type { MyComplaintDetail, MyComplaintListResponse, MyComplaintQuery } from './types'

export function getMyComplaints(query: MyComplaintQuery = {}) {
  const params = new URLSearchParams({ page: String(query.page ?? 0), size: String(query.size ?? 20) })
  if (query.keyword) params.set('keyword', query.keyword)
  if (query.categoryCode) params.set('categoryCode', query.categoryCode)
  if (query.status) params.set('status', query.status)
  return apiClient.get<MyComplaintListResponse>(`/complaints/my?${params}`)
}
export function getMyComplaint(complaintId: number) { return apiClient.get<MyComplaintDetail>(`/complaints/${complaintId}`) }
