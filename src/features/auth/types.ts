export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN'
export type SignupRequest = { loginId: string; password: string; name: string; email: string; phone: string; emailNotifyAgreed: boolean }
export type SignupResult = { userId: number; loginId: string; role: 'CITIZEN'; createdAt: string }
export type LoginRequest = { loginId: string; password: string }
export type LoginResult = { accessToken: string; refreshToken: string; user: { userId: number; loginId: string; role: UserRole; departmentId: number | null } }
