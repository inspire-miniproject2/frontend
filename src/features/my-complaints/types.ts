import type { ComplaintStatus } from '../../shared/ui/krds'

export type MyComplaintQuery = { page?: number; size?: number; keyword?: string; categoryCode?: string; status?: ComplaintStatus }
export type MyComplaintSummary = { total: number; received: number; assigned: number; inProgress: number; completed: number }
export type MyComplaintListItem = { complaintId: number; complaintNo: string; categoryCode: string; categoryName: string; title: string; currentStatus: ComplaintStatus; assignedDepartmentName: string | null; submittedAt: string }
export type MyComplaintListResponse = { summary: MyComplaintSummary; content: MyComplaintListItem[]; page: number; size: number; totalElements: number; totalPages: number }
export type ComplaintAttachment = { attachmentId: number; originalFilename: string }
export type ComplaintStatusHistory = { previousStatus: ComplaintStatus | null; newStatus: ComplaintStatus; changedAt: string }
export type MyComplaintDetail = MyComplaintListItem & { content: string; notifyChannels: Array<'IN_APP' | 'EMAIL'>; attachments: ComplaintAttachment[]; statusHistories: ComplaintStatusHistory[]; response: { officerName: string; content: string; respondedAt: string } | null }
