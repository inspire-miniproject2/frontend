export type NotifyChannel = 'EMAIL'
export type ComplaintCreateStatus = 'RECEIVED' | 'ASSIGNED'

export type ComplaintCategory = {
  categoryId: number
  categoryName: string
  categoryCode: string
}

export type ComplaintDraft = {
  categoryId: number | null
  categoryName: string
  categoryCode: string
  title: string
  content: string
  attachmentFiles: File[]
  notifyChannels: NotifyChannel[]
}

export type ComplaintCreateResult = {
  complaintId: number
  complaintNo: string
  categoryCode: string
  currentStatus: ComplaintCreateStatus
  assignedDepartmentId: number | null
  assignedOfficerUserId: number | null
  submittedAt: string
}
