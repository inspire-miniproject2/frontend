import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navigation = [
  ['/public-responses', '공개 답변'], ['/complaints/new/write', '민원신청'],
  ['/my/complaints', '내 민원'], ['/officer/complaints', '민원업무함'],
  ['/admin/statistics', '민원처리현황'],
] as const

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">본문 바로가기</a>
    <div className="official-banner"><div className="container"><span aria-hidden="true">🇰🇷</span> 이 누리집은 대한민국 공식 전자정부 누리집입니다.</div></div>
    <header className="site-header">
      <div className="container header-top">
        <Link className="brand" to="/my/complaints" aria-label="민원온 홈"><span className="brand-mark" aria-hidden="true">◉</span>민원온</Link>
        <div className="header-actions"><Link to="/notifications" aria-label="알림, 읽지 않은 알림 2개">알림 <strong className="unread-count">2</strong></Link><Link to="/login">로그인</Link><Link to="/signup">회원가입</Link></div>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="global-navigation" onClick={() => setMenuOpen(!menuOpen)}>전체 메뉴</button>
      </div>
      <nav id="global-navigation" className={`global-navigation ${menuOpen ? 'is-open' : ''}`} aria-label="주 메뉴"><ul className="container">{navigation.map(([to, label]) => <li key={to}><NavLink to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : undefined}>{label}</NavLink></li>)}</ul></nav>
    </header>
    <main id="main-content" className="container main-content" tabIndex={-1}><Outlet /></main>
    <footer className="site-footer"><div className="container footer-inner"><div><strong className="footer-brand">민원온</strong><p>서울특별시 · 대표전화 120</p></div><nav aria-label="푸터 메뉴"><a href="#privacy">개인정보처리방침</a><a href="#guide">이용안내</a></nav></div></footer>
  </div>
}
