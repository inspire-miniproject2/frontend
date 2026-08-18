import type { UserRole } from '../../features/auth/types'

export type MockUser = { userId: number; loginId: string; password: string; name: string; email: string; phone: string; emailNotifyAgreed: boolean; role: UserRole; departmentId: number | null; createdAt: string }
export const mockUsers: MockUser[] = [
  { userId: 101, loginId: 'citizen01', password: 'Civil!2026#', name: '홍길동', email: 'citizen01@email.com', phone: '010-1234-5678', emailNotifyAgreed: true, role: 'CITIZEN', departmentId: null, createdAt: '2026-08-14T09:30:00+09:00' },
  { userId: 201, loginId: 'officer01', password: 'Officer!2026#', name: '김담당', email: 'officer01@seoul.go.kr', phone: '010-2222-3333', emailNotifyAgreed: true, role: 'OFFICER', departmentId: 10, createdAt: '2026-08-01T09:00:00+09:00' },
  { userId: 301, loginId: 'admin01', password: 'Admin!2026#', name: '이관리', email: 'admin01@seoul.go.kr', phone: '010-3333-4444', emailNotifyAgreed: true, role: 'ADMIN', departmentId: null, createdAt: '2026-08-01T09:00:00+09:00' },
]
