import { delay, http, HttpResponse } from 'msw'
import { complaintCategories } from '../data/complaint'

const apiUrl = '*/api/v1'
let sequence = 185

const failure = (status: number, code: string, message: string, details: unknown = null) => HttpResponse.json({ success: false, error: { code, message, details }, requestId: `mock-${crypto.randomUUID()}` }, { status })

export const complaintHandlers = [
  http.get(`${apiUrl}/complaint-categories`, async ({ request }) => {
    await delay(250)
    const activeOnly = new URL(request.url).searchParams.get('activeOnly') !== 'false'
    return HttpResponse.json({ success: true, data: activeOnly ? complaintCategories : complaintCategories, message: '카테고리 목록을 조회했습니다.' })
  }),
  http.post(`${apiUrl}/complaints`, async ({ request }) => {
    await delay(500)
    const body = await request.formData()
    const categoryId = Number(body.get('categoryId'))
    const title = String(body.get('title') ?? '').trim()
    const content = String(body.get('content') ?? '').trim()
    const notifyChannels = body.getAll('notifyChannels[]').map(String)
    const category = complaintCategories.find((item) => item.categoryId === categoryId)

    const details: Record<string, string> = {}
    if (!category) details.categoryId = '활성 상태인 민원 분야를 선택해 주세요.'
    if (title.length < 5 || title.length > 100) details.title = '민원 제목을 5~100자로 입력해 주세요.'
    if (content.length < 20 || content.length > 3000) details.content = '민원 내용을 20~3000자로 입력해 주세요.'
    if (notifyChannels.some((channel) => channel !== 'EMAIL')) details.notifyChannels = 'EMAIL 채널만 선택할 수 있습니다.'
    if (Object.keys(details).length > 0) return failure(400, 'VALIDATION_ERROR', '입력값을 확인해 주세요.', details)

    const complaintNo = `CIV-2026-${String(sequence++).padStart(6, '0')}`
    const assignmentPending = title.includes('[배정대기]')
    return HttpResponse.json({ success: true, data: { complaintId: 5000 + sequence, complaintNo, categoryCode: category!.categoryCode, currentStatus: assignmentPending ? 'RECEIVED' : 'ASSIGNED', assignedDepartmentId: assignmentPending ? null : categoryId * 10, assignedOfficerUserId: assignmentPending ? null : 201, submittedAt: new Date().toISOString() }, message: assignmentPending ? '민원이 접수되었으며 담당 부서 배정을 기다리고 있습니다.' : '민원이 접수되고 담당 부서 및 공무원에게 배정되었습니다.' }, { status: 201 })
  }),
]
