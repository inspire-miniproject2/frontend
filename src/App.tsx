import { Button } from 'krds-react'

export function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        본문 바로가기
      </a>
      <div className="official-banner">
        <div className="container">이 누리집은 대한민국 공식 전자정부 누리집입니다.</div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="/" aria-label="민원온 홈">
            민원온
          </a>
          <nav aria-label="주 메뉴">
            <ul className="global-nav">
              <li><a href="#apply">민원신청</a></li>
              <li><a href="#mine">내 민원</a></li>
              <li><a href="#public">공개 답변</a></li>
              <li><a href="#guide">이용안내</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main-content" className="container main-content">
        <p className="breadcrumb" aria-label="현재 위치">홈</p>
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">공공 민원 통합 플랫폼</p>
          <h1 id="page-title">민원온 프론트엔드</h1>
          <p>
            KRDS React를 적용한 반응형 웹앱 프로젝트가 준비되었습니다.
          </p>
          <div className="actions">
            <Button>민원 신청 시작</Button>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <strong>민원온</strong>
          <p>개인정보처리방침 · 이용안내 · 대표전화 120</p>
        </div>
      </footer>
    </>
  )
}
