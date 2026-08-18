import { delay, http, HttpResponse } from 'msw'
import type { LoginRequest, SignupRequest } from '../../features/auth/types'
import { mockUsers } from '../data/auth'

const apiUrl = '*/api/v1/auth'
const failure = (status: number, code: string, message: string, details: unknown = null) => HttpResponse.json({ success: false, error: { code, message, details }, requestId: `mock-${crypto.randomUUID()}` }, { status })

export const authHandlers = [
  http.post(`${apiUrl}/signup`, async ({ request }) => {
    await delay(400)
    const body = await request.json() as Partial<SignupRequest>
    const details: Record<string, string> = {}
    if (!/^[A-Za-z0-9]{6,20}$/.test(body.loginId ?? '')) details.loginId = '아이디를 영문·숫자 6~20자로 입력해 주세요.'
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/.test(body.password ?? '')) details.password = '비밀번호는 영문·숫자·특수문자를 포함해 10자 이상이어야 합니다.'
    if ((body.name?.trim().length ?? 0) < 2 || (body.name?.trim().length ?? 0) > 50) details.name = '이름을 2~50자로 입력해 주세요.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email ?? '')) details.email = '올바른 이메일 형식으로 입력해 주세요.'
    if (!/^010-\d{4}-\d{4}$/.test(body.phone ?? '')) details.phone = '휴대전화번호를 010-0000-0000 형식으로 입력해 주세요.'
    if (Object.keys(details).length) return failure(400, 'VALIDATION_ERROR', '입력값을 확인해 주세요.', details)
    if (mockUsers.some((user) => user.loginId === body.loginId)) return failure(409, 'DUPLICATE_RESOURCE', '이미 사용 중인 아이디입니다.')
    const user = { userId: Math.max(...mockUsers.map((item) => item.userId)) + 1, loginId: body.loginId!, password: body.password!, name: body.name!, email: body.email!, phone: body.phone!, emailNotifyAgreed: body.emailNotifyAgreed ?? false, role: 'CITIZEN' as const, departmentId: null, createdAt: new Date().toISOString() }
    mockUsers.push(user)
    return HttpResponse.json({ success: true, data: { userId: user.userId, loginId: user.loginId, role: user.role, createdAt: user.createdAt }, message: '회원가입이 완료되었습니다.' }, { status: 201 })
  }),
  http.post(`${apiUrl}/login`, async ({ request }) => {
    await delay(350)
    const body = await request.json() as Partial<LoginRequest>
    if (!body.loginId?.trim() || !body.password?.trim()) return failure(400, 'VALIDATION_ERROR', '아이디와 비밀번호를 입력해 주세요.')
    const user = mockUsers.find((item) => item.loginId === body.loginId && item.password === body.password)
    if (!user) return failure(401, 'INVALID_CREDENTIALS', '아이디 또는 비밀번호가 일치하지 않습니다.')
    return HttpResponse.json({ success: true, data: { accessToken: `mock-access-${user.userId}`, refreshToken: `mock-refresh-${user.userId}`, user: { userId: user.userId, loginId: user.loginId, role: user.role, departmentId: user.departmentId } }, message: '로그인에 성공했습니다.' })
  }),
]
