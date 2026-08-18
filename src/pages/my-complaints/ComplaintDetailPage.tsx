import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMyComplaint } from '../../features/my-complaints/api'
import type { MyComplaintDetail } from '../../features/my-complaints/types'
import { BackLink, FeedbackBanner, PageHeader, StatusBadge, StatusStepper } from '../../shared/ui/krds'

const stepByStatus = { RECEIVED: 0, ASSIGNED: 1, IN_PROGRESS: 3, COMPLETED: 4 } as const
const statusLabels = { RECEIVED: '접수', ASSIGNED: '부서 배정', IN_PROGRESS: '처리 중', COMPLETED: '완료' } as const
const formatDateTime = (value: string) => new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

export function ComplaintDetailPage() {
  const { complaintId } = useParams()
  const [data, setData] = useState<MyComplaintDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true; const id = Number(complaintId)
    if (!Number.isInteger(id)) { setError('잘못된 민원 번호입니다.'); setLoading(false); return }
    getMyComplaint(id).then((result) => { if (active) setData(result) }).catch(() => { if (active) setError('민원 정보를 불러오지 못했습니다.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [complaintId])

  if (loading) return <><PageHeader title="민원 상세" crumbs={['홈', '내 민원', '민원 상세']} /><FeedbackBanner>민원 정보를 불러오는 중입니다.</FeedbackBanner></>
  if (error || !data) return <><PageHeader title="민원 상세" crumbs={['홈', '내 민원', '민원 상세']} /><BackLink to="/my/complaints" /><FeedbackBanner tone="error">{error || '민원 정보가 없습니다.'}</FeedbackBanner></>
  return <><PageHeader title="민원 상세" description={`${data.complaintNo} · ${statusLabels[data.currentStatus]}`} crumbs={['홈', '내 민원', '민원 상세']} /><BackLink to="/my/complaints" /><StatusStepper current={stepByStatus[data.currentStatus]} mode="process" /><div className="detail-grid"><section className="summary-panel"><h2>신청 정보</h2><dl className="definition-list"><div><dt>처리 상태</dt><dd><StatusBadge status={data.currentStatus} /></dd></div><div><dt>신청일</dt><dd>{formatDateTime(data.submittedAt)}</dd></div><div><dt>민원 분야</dt><dd>{data.categoryName}</dd></div><div><dt>담당 부서</dt><dd>{data.assignedDepartmentName ?? '배정 대기'}</dd></div><div><dt>알림 채널</dt><dd>{data.notifyChannels.map((channel) => channel === 'IN_APP' ? '알림센터' : '이메일').join(', ')}</dd></div></dl></section><section className="summary-panel"><h2>{data.title}</h2><p>{data.content}</p>{data.attachments.length > 0 && <ul>{data.attachments.map((file) => <li key={file.attachmentId}><a href={`/api/v1/complaints/${data.complaintId}/attachments/${file.attachmentId}`}>{file.originalFilename} 다운로드</a></li>)}</ul>}</section></div><section className="history-panel"><h2>처리 이력</h2><ol>{data.statusHistories.map((history) => <li key={`${history.newStatus}-${history.changedAt}`}><time>{formatDateTime(history.changedAt)}</time> {statusLabels[history.newStatus]}</li>)}</ol></section>{data.response && <section className="history-panel"><h2>공식 답변</h2><p>{data.response.content}</p><p>{data.response.officerName} · {formatDateTime(data.response.respondedAt)}</p></section>}<FeedbackBanner>처리 상태가 변경되면 알림센터 및 선택한 이메일 채널로 안내합니다.</FeedbackBanner></>
}
