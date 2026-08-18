import { apiClient } from '../../shared/api/client'
import type { MyComplaintDetail } from '../my-complaints/types'
import type { ChangeComplaintStatusRequest, ChangeComplaintStatusResult, OfficerComplaintList, OfficerComplaintQuery, RegisterResponseRequest, RegisterResponseResult } from './types'

export function getOfficerComplaints(query: OfficerComplaintQuery = {}) {
  const params = new URLSearchParams({ page: String(query.page ?? 0), size: String(query.size ?? 20) })
  if (query.status) params.set('status', query.status)
  if (query.keyword) params.set('keyword', query.keyword)
  return apiClient.get<OfficerComplaintList>(`/officer/complaints?${params}`)
}
export function getOfficerComplaint(complaintId: number) { return apiClient.get<MyComplaintDetail>(`/complaints/${complaintId}`) }
export function changeComplaintStatus(complaintId: number, body: ChangeComplaintStatusRequest) { return apiClient.patch<ChangeComplaintStatusResult>(`/officer/complaints/${complaintId}/status`, body) }
export function registerComplaintResponse(complaintId: number, body: RegisterResponseRequest) { return apiClient.post<RegisterResponseResult>(`/officer/complaints/${complaintId}/response`, body) }
