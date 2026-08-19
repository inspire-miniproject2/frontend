import { delay, http, HttpResponse } from 'msw'
import { publicResponseDetails, publicResponses } from '../data/publicResponses'

const apiUrl = '*/api/v1'
const failure = () => HttpResponse.json({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: '공개된 답변이 없습니다.', details: null }, requestId: `mock-${crypto.randomUUID()}` }, { status: 404 })

export const publicResponseHandlers = [
  http.get(`${apiUrl}/public-responses`, async ({ request }) => {
    await delay(300)
    const params = new URL(request.url).searchParams; const keyword = params.get('keyword')?.trim().toLowerCase() ?? ''; const categoryCode = params.get('categoryCode'); const from = params.get('completedFrom'); const to = params.get('completedTo')
    const content = publicResponses.filter((item) => (!keyword || item.title.toLowerCase().includes(keyword) || publicResponseDetails.find((detail) => detail.responseId === item.responseId)?.responseContent.toLowerCase().includes(keyword)) && (!categoryCode || item.categoryCode === categoryCode) && (!from || item.completedAt >= from) && (!to || item.completedAt <= to))
    return HttpResponse.json({ success: true, data: { content: content.map(({ categoryCode: _categoryCode, ...item }) => item) }, message: '공개 답변 목록을 조회했습니다.' })
  }),
  http.get(`${apiUrl}/public-responses/:responseId`, async ({ params }) => {
    await delay(300); const detail = publicResponseDetails.find((item) => item.responseId === Number(params.responseId))
    return detail ? HttpResponse.json({ success: true, data: detail, message: '공개 답변 상세를 조회했습니다.' }) : failure()
  }),
]
