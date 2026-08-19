import { apiClient } from '../../shared/api/client'
import type { ComplaintCategory, ComplaintCreateResult, ComplaintDraft } from './types'

export function getComplaintCategories(activeOnly = true) {
  return apiClient.get<ComplaintCategory[]>(`/complaint-categories?activeOnly=${activeOnly}`)
}

export function createComplaint(draft: ComplaintDraft) {
  const body = new FormData()
  if (draft.categoryId === null) throw new Error('민원 분야를 선택해 주세요.')
  body.append('categoryId', String(draft.categoryId))
  body.append('categoryCode', draft.categoryCode)
  body.append('title', draft.title)
  body.append('content', draft.content)
  draft.attachmentFiles.forEach((file) => body.append('attachmentFiles', file))
  draft.notifyChannels.forEach((channel) => body.append('notifyChannels', channel))
  return apiClient.postForm<ComplaintCreateResult>('/complaints', body)
}
