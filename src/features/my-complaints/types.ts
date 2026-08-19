import type { ComplaintStatus } from '../../shared/ui/krds'

export type MyComplaintQuery = { page?: number; size?: number; keyword?: string; categoryCode?: string; status?: ComplaintStatus }
export type MyComplaintSummary = { total: number; received: number; assigned: number; inProgress: number; completed: number }
export type MyComplaintListItem = { complaintId: number; complaintNo: string; title: string; categoryCode: string; currentStatus: ComplaintStatus; assignedDepartmentName: string | null; assignedDepartmentId: number | null; assignedOfficerUserId: number | null }
export type MyComplaintListResponse = { summary: MyComplaintSummary; content: MyComplaintListItem[]; page: number; size: number; totalElements: number; totalPages: number; hasNext: boolean }
export type ComplaintAttachment = { attachmentId: number; originalFilename: string; contentType: string; fileSize: number; uploadedAt: string }
export type ComplaintStatusHistory = { previousStatus: ComplaintStatus | null; newStatus: ComplaintStatus; changedByUserId: number | null; changeMemo: string | null; changedAt: string }
export type ComplaintResponse = { responseId: number; responderUserId: number; isPublic: boolean; responseContent: string; respondedAt: string }
export type MyComplaintDetail = {
  complaintId: number; complaintNo: string; applicantUserId: number; categoryCode: string; title: string; content: string; currentStatus: ComplaintStatus
  assignedDepartmentName: string | null; assignedDepartmentId: number | null; assignedOfficerUserId: number | null
  submittedAt: string; assignedAt: string | null; completedAt: string | null; response: ComplaintResponse | null
  attachments: ComplaintAttachment[]; statusHistories: ComplaintStatusHistory[]
}
