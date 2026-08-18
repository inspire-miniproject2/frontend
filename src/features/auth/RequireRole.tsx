import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { UserRole } from './types'
import { useAuthSession } from './useAuthSession'

const roleHome: Record<UserRole, string> = {
  CITIZEN: '/my/complaints',
  OFFICER: '/officer/complaints',
  ADMIN: '/admin/statistics',
}

export function RequireRole({ allowedRoles, children }: { allowedRoles: UserRole[]; children: ReactNode }) {
  const session = useAuthSession()
  const location = useLocation()
  const navigate = useNavigate()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    if (!session) {
      handled.current = true
      window.alert('민원 신청은 로그인 후 이용할 수 있습니다.')
      navigate('/login', { replace: true, state: { returnTo: `${location.pathname}${location.search}` } })
      return
    }
    if (!allowedRoles.includes(session.user.role)) {
      handled.current = true
      window.alert('민원 신청은 민원인 또는 관리자 계정만 이용할 수 있습니다.')
      navigate(roleHome[session.user.role], { replace: true })
    }
  }, [allowedRoles, location.pathname, location.search, navigate, session])

  if (!session || !allowedRoles.includes(session.user.role)) return null
  return children
}
