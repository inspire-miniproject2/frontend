import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicResponse } from '../../features/public-responses/api'
import type { PublicResponseDetail } from '../../features/public-responses/types'
import { BackLink, FeedbackBanner, PageHeader } from '../../shared/ui/krds'

export function PublicResponseDetailPage() {
  const { responseId } = useParams()
  const [data, setData] = useState<PublicResponseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { let active = true; const id = Number(responseId); if (!Number.isInteger(id)) { setError('잘못된 답변 번호입니다.'); setLoading(false); return }; getPublicResponse(id).then((result) => { if (active) setData(result) }).catch(() => { if (active) setError('공개 답변을 불러오지 못했습니다.') }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [responseId])
  if (loading) return <><PageHeader title="공개 민원 답변 상세" crumbs={['홈', '공개 민원 답변', '답변 상세']} /><div className="complaint-loading"><div className="krds-spinner" role="status"><span className="sr-only">로딩 중</span>공개 답변을 불러오는 중입니다.</div></div></>
  if (error || !data) return <><PageHeader title="공개 민원 답변 상세" crumbs={['홈', '공개 민원 답변', '답변 상세']} /><BackLink to="/public-responses" /><FeedbackBanner tone="error">{error || '공개된 답변이 없습니다.'}</FeedbackBanner></>
  return <><PageHeader title="공개 민원 답변 상세" crumbs={['홈', '공개 민원 답변', '답변 상세']} /><BackLink to="/public-responses" /><FeedbackBanner>민원인의 개인정보 보호를 위해 민원 본문은 공개하지 않습니다.</FeedbackBanner><article className="response-detail"><section><h2>민원 사례</h2><dl className="inline-meta"><div><dt>민원 제목</dt><dd>{data.caseTitle}</dd></div><div><dt>민원 분야</dt><dd>{data.categoryName}</dd></div><div><dt>신청일</dt><dd>{data.appliedDate.replaceAll('-', '.')}</dd></div></dl></section><section><h2>공식 답변</h2><p className="response-meta"><strong>답변 부서</strong> {data.departmentName} · <strong>완료일</strong> {data.completedAt.replaceAll('-', '.')}</p><p>{data.responseContent}</p>{data.attachments.length > 0 && <ul>{data.attachments.map((file) => <li key={file.attachmentId}>{file.originalFilename}</li>)}</ul>}</section></article></>
}
