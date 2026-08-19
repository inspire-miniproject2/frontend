import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { authSession } from '../features/auth/session'
import { logout as requestLogout } from '../features/auth/api'
import { useAuthSession } from '../features/auth/useAuthSession'
import { BellIcon, JoinIcon, LoginIcon, LogoutIcon } from '../shared/ui/icons/HeaderIcons'
import type { UserRole } from '../features/auth/types'
import { useNotifications } from '../features/notifications/NotificationContext'

type MenuItem = readonly [to: string, label: string]
const publicMenu: MenuItem[] = [['/complaints/new/write', '민원신청'], ['/public-responses', '공개 답변'], ['/guide', '이용안내']]
const roleMenus: Record<UserRole, MenuItem[]> = {
  CITIZEN: [['/complaints/new/write', '민원신청'], ['/my/complaints', '내 민원'], ['/public-responses', '공개 답변'], ['/guide', '이용안내']],
  OFFICER: [['/public-responses', '공개 답변'], ['/officer/complaints', '민원업무함']],
  ADMIN: [['/public-responses', '공개 답변'], ['/complaints/new/write', '민원신청'], ['/my/complaints', '내 민원'], ['/officer/complaints', '민원업무함'], ['/admin/statistics', '민원처리현황']],
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notificationCenterRef = useRef<HTMLDivElement>(null)
  const session = useAuthSession()
  const { notifications, unreadCount, loading: notificationsLoading, error: notificationsError, refresh, markAsRead } = useNotifications()
  const navigate = useNavigate()
  const navigation = session ? roleMenus[session.user.role] : publicMenu
  useEffect(() => {
    if (!notificationsOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!notificationCenterRef.current?.contains(event.target as Node)) setNotificationsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNotificationsOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [notificationsOpen])

  const logout = async () => {
    const refreshToken = session?.refreshToken
    try { if (refreshToken) await requestLogout(refreshToken) } finally { authSession.clear(); navigate('/public-responses') }
  }
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">본문 바로가기</a>
    <div className="official-banner"><div className="container"><span aria-hidden="true">🇰🇷</span> 이 누리집은 공공민원처리 누리집입니다.</div></div>
    <header className="site-header">
      <div className="container header-top">
        <Link className="brand" to="public-responses" aria-label="민원온 홈"><span className="brand-mark" aria-hidden="true">◉</span>민원온</Link>
        <div className="header-actions">
          {session ? <>
            <button className="header-action" type="button" onClick={logout}><LogoutIcon /><span>로그아웃</span></button>
            <div className="notification-center" ref={notificationCenterRef}>
              <button
                className="header-action"
                type="button"
                aria-label={`알림${unreadCount > 0 ? `, 읽지 않은 알림 ${unreadCount}개` : ''}`}
                aria-expanded={notificationsOpen}
                aria-controls="header-notification-panel"
                onClick={() => {
                  setNotificationsOpen((open) => !open)
                  if (!notificationsOpen) void refresh()
                }}
              >
                <span className="header-icon-wrap"><BellIcon />{unreadCount > 0 && <strong className="unread-count">{unreadCount > 99 ? '99+' : unreadCount}</strong>}</span><span>알림</span>
              </button>
              {notificationsOpen && <section id="header-notification-panel" className="notification-popover" aria-label="최근 알림">
                <div className="notification-popover-header"><h2>알림 센터</h2><span>미읽음 {unreadCount}개</span></div>
                {notificationsLoading && notifications.length === 0 && <p className="notification-state" role="status">알림을 불러오는 중입니다.</p>}
                {notificationsError && <p className="notification-state notification-error" role="alert">{notificationsError}</p>}
                {!notificationsLoading && !notificationsError && notifications.length === 0 && <p className="notification-state">새로운 알림이 없습니다.</p>}
                {notifications.length > 0 && <ul className="notification-popover-list">{notifications.slice(0, 5).map((notification) => <li key={notification.notificationId} className={notification.read ? '' : 'unread'}>
                  <div><strong>{notification.title}</strong><p>{notification.message}</p><time dateTime={notification.createdAt}>{formatNotificationDate(notification.createdAt)}</time></div>
                  {!notification.read && <button type="button" onClick={() => void markAsRead(notification.notificationId).catch(() => undefined)}>읽음</button>}
                </li>)}</ul>}
                <Link className="notification-more" to="/notifications" onClick={() => setNotificationsOpen(false)}>알림 더보기</Link>
              </section>}
            </div>
          </> : <>
            <Link className="header-action" to="/login"><LoginIcon /><span>로그인</span></Link>
            <Link className="header-action" to="/signup"><JoinIcon /><span>회원가입</span></Link>
          </>}
        </div>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="global-navigation" onClick={() => setMenuOpen(!menuOpen)}>전체 메뉴</button>
      </div>
      <nav id="global-navigation" className={`global-navigation ${menuOpen ? 'is-open' : ''}`} aria-label="주 메뉴"><ul className="container">{navigation.map(([to, label]) => <li key={to}><NavLink to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : undefined}>{label}</NavLink></li>)}</ul></nav>
    </header>
    <main id="main-content" className="container main-content" tabIndex={-1}><Outlet /></main>
    <footer className="site-footer"><div className="container footer-inner"><div><strong className="footer-brand">민원온</strong><p>© (팀)공부함청년</p></div><nav aria-label="푸터 메뉴"><a href="/guide">이용안내</a></nav></div></footer>
  </div>
}

const formatNotificationDate = (value: string) => new Intl.DateTimeFormat('ko-KR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
