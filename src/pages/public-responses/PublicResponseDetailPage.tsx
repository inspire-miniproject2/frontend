import { BackLink, FeedbackBanner, PageHeader } from '../../shared/ui/krds'

export function PublicResponseDetailPage() {
  return (
      <>
        <PageHeader title="공개 민원 답변 상세" crumbs={['홈', '공개 민원 답변', '답변 상세']} />
        <BackLink to="/public-responses" />
        <FeedbackBanner>민원인의 개인정보 보호를 위해 민원 본문은 공개하지 않습니다.</FeedbackBanner>
        <article className="response-detail">
          <section>
            <h2>민원 사례</h2>
            <dl className="inline-meta">
              <div><dt>민원 제목</dt><dd>어린이보호구역 신호시간 조정 요청</dd></div>
              <div><dt>민원 분야</dt><dd>도로·교통</dd></div>
              <div><dt>신청일</dt><dd>2026.08.01</dd></div></dl>
          </section>
          <section>
            <h2>공식 답변</h2>
            <p className="response-meta"><strong>답변 부서</strong> 교통정책과 · <strong>완료일</strong> 2026.08.13</p>
            <p>현장 교통량과 보행량 조사를 실시한 결과, 등교 시간대 보행 신호를 8초 연장하기로 결정했습니다.</p>
            <p>2026년 8월 20일부터 변경된 신호체계를 적용하며, 적용 후 2주간 교통 흐름과 안전성을 점검합니다.</p>
            <p><a href="#attachment">공식 첨부파일 교통량조사결과.pdf</a></p>
          </section>
        </article>
      </>)
}
