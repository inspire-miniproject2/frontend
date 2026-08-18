import { delay, http, HttpResponse } from 'msw'
import type { ComplaintStatus } from '../../shared/ui/krds'
import { myComplaints } from '../data/myComplaints'

const apiUrl = '*/api/v1'
const assignees: Record<number, string> = { 5001: '김담당', 5002: '이담당', 5003: '박담당' }
const failure = (status: number, code: string, message: string, details: unknown = null) => HttpResponse.json({ success: false, error: { code, message, details }, requestId: `mock-${crypto.randomUUID()}` }, { status })

export const officerComplaintHandlers = [
  http.get(`${apiUrl}/officer/complaints`, async ({ request }) => {
    await delay(300); const params = new URL(request.url).searchParams; const keyword = params.get('keyword')?.trim().toLowerCase() ?? ''; const status = params.get('status'); const page = Math.max(0, Number(params.get('page') ?? 0)); const size = Math.max(1, Number(params.get('size') ?? 20))
    const filtered = myComplaints.filter((item) => (!keyword || item.complaintNo.toLowerCase().includes(keyword) || item.title.toLowerCase().includes(keyword)) && (!status || item.currentStatus === status))
    const count = (value: ComplaintStatus) => myComplaints.filter((item) => item.currentStatus === value).length
    const content = filtered.slice(page * size, (page + 1) * size).map((item) => ({ complaintId: item.complaintId, complaintNo: item.complaintNo, title: item.title, categoryName: item.categoryName, assigneeName: assignees[item.complaintId] ?? '미지정', submittedAt: item.submittedAt, status: item.currentStatus }))
    return HttpResponse.json({ success: true, data: { summary: { newAssigned: count('ASSIGNED'), inProgress: count('IN_PROGRESS'), completed: count('COMPLETED') }, content, page, size, totalElements: filtered.length, totalPages: Math.ceil(filtered.length / size) }, message: '담당 민원 목록을 조회했습니다.' })
  }),
  http.patch(`${apiUrl}/officer/complaints/:complaintId/status`, async ({ params, request }) => {
    await delay(350); const complaint = myComplaints.find((item) => item.complaintId === Number(params.complaintId)); if (!complaint) return failure(404, 'RESOURCE_NOT_FOUND', '존재하지 않는 민원입니다.')
    const body = await request.json() as { newStatus?: ComplaintStatus; changeMemo?: string }; const next: Partial<Record<ComplaintStatus, ComplaintStatus>> = { RECEIVED: 'ASSIGNED', ASSIGNED: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' }; const newStatus = body.newStatus
    if (!newStatus || newStatus !== next[complaint.currentStatus] || (body.changeMemo?.length ?? 0) > 500) return failure(409, 'INVALID_STATUS_TRANSITION', '허용되지 않은 상태 전이입니다.')
    if (newStatus === 'COMPLETED' && !complaint.response) return failure(409, 'INVALID_STATUS_TRANSITION', '공식 답변을 먼저 등록해 주세요.')
    const previousStatus = complaint.currentStatus; const changedAt = new Date().toISOString(); complaint.currentStatus = newStatus; complaint.statusHistories.push({ previousStatus, newStatus, changedAt })
    return HttpResponse.json({ success: true, data: { previousStatus, newStatus, changedAt }, message: '민원 상태가 변경되었습니다.' })
  }),
  http.post(`${apiUrl}/officer/complaints/:complaintId/response`, async ({ params, request }) => {
    await delay(350); const complaint = myComplaints.find((item) => item.complaintId === Number(params.complaintId)); if (!complaint) return failure(404, 'RESOURCE_NOT_FOUND', '존재하지 않는 민원입니다.')
    const body = await request.json() as { responseContent?: string; isPublic?: boolean }; const responseContent = body.responseContent?.trim() ?? ''
    if (responseContent.length < 20 || responseContent.length > 3000) return failure(400, 'VALIDATION_ERROR', '답변 본문을 20~3000자로 입력해 주세요.')
    const respondedAt = new Date().toISOString(); complaint.response = { officerName: assignees[complaint.complaintId] ?? '담당자', content: responseContent, respondedAt }
    return HttpResponse.json({ success: true, data: { responseId: 7100 + complaint.complaintId, isPublic: body.isPublic ?? false, respondedAt }, message: '민원 답변이 등록되었습니다.' }, { status: 201 })
  }),
]
