import type { ComplaintStatus } from '../../shared/ui/krds'

export type OfficerComplaintQuery = { page?: number; size?: number; status?: ComplaintStatus; keyword?: string }
export type OfficerComplaintSummary = { newAssigned: number; inProgress: number; completed: number }
export type OfficerComplaintListItem = { complaintId: number; complaintNo: string; title: string; categoryName: string; assigneeName: string; submittedAt: string; status: ComplaintStatus }
export type OfficerComplaintList = { summary: OfficerComplaintSummary; content: OfficerComplaintListItem[]; page: number; size: number; totalElements: number; totalPages: number }
export type ChangeComplaintStatusRequest = { newStatus: Exclude<ComplaintStatus, 'RECEIVED'>; changeMemo?: string }
export type ChangeComplaintStatusResult = { previousStatus: ComplaintStatus; newStatus: ComplaintStatus; changedAt: string }
export type RegisterResponseRequest = { responseContent: string; isPublic?: boolean }
export type RegisterResponseResult = { responseId: number; isPublic: boolean; respondedAt: string }
