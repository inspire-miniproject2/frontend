import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { UserRole } from './types'
import { useAuthSession } from './useAuthSession'

const roleHome: Record<UserRole, string> = {
  CITIZEN: '/my/complaints',
  OFFICER: '/officer/complaints',
  ADMIN: '/admin/statistics',
}

export function PublicOnly({ children }: { children: ReactNode }) {
  const session = useAuthSession()
  return session ? <Navigate to={roleHome[session.user.role]} replace /> : children
}
