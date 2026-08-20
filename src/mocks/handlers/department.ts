import { delay, http, HttpResponse } from 'msw'

const apiUrl = '*/api/v1'

const departments = [
  { departmentId: 10, departmentName: '교통정책과' },
  { departmentId: 20, departmentName: '시설관리과' },
  { departmentId: 30, departmentName: '환경관리과' },
  { departmentId: 40, departmentName: '복지지원과' },
  { departmentId: 50, departmentName: '민원총괄과' },
]

export const departmentHandlers = [
  http.get(`${apiUrl}/departments`, async () => {
    await delay(200)
    return HttpResponse.json({ success: true, data: departments, message: '부서 목록을 조회했습니다.' })
  }),
]
