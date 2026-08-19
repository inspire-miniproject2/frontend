import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getComplaintCategories } from '../../features/complaint-application/api'
import { downloadComplaintAttachment, getMyComplaint } from '../../features/my-complaints/api'
import type { MyComplaintDetail } from '../../features/my-complaints/types'
import { ApiError } from '../../shared/api/contracts'
import { BackLink, FeedbackBanner, PageHeader, StatusBadge, StatusStepper } from '../../shared/ui/krds'

const stepByStatus = { RECEIVED: 0, ASSIGNED: 1, IN_PROGRESS: 3, COMPLETED: 4 } as const
const statusLabels = { RECEIVED: '접수', ASSIGNED: '부서 배정', IN_PROGRESS: '처리 중', COMPLETED: '완료' } as const
const formatDateTime = (value: string) => new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

export function ComplaintDetailPage() {
  const { complaintId } = useParams()
  const [data, setData] = useState<MyComplaintDetail | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadError, setDownloadError] = useState('')

  useEffect(() => {
    let active = true; const id = Number(complaintId)
    if (!Number.isInteger(id)) { setError('잘못된 민원 번호입니다.'); setLoading(false); return }
    Promise.all([getMyComplaint(id), getComplaintCategories(true)]).then(([detail, categories]) => { if (active) { setData(detail); setCategoryName(categories.find((item) => item.categoryCode === detail.categoryCode)?.categoryName ?? detail.categoryCode) } }).catch((reason) => { if (active) setError(reason instanceof ApiError ? reason.message : '민원 정보를 불러오지 못했습니다.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [complaintId])

  const download = async (attachmentId: number, originalFilename: string) => {
    if (!data) return
    setDownloadError('')
    try { const result = await downloadComplaintAttachment(data.complaintId, attachmentId); const url = URL.createObjectURL(result.blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.filename ?? originalFilename; anchor.click(); URL.revokeObjectURL(url) }
    catch (reason) { setDownloadError(reason instanceof ApiError ? reason.message : '첨부파일을 다운로드하지 못했습니다.') }
  }

  if (loading) return <><PageHeader title="민원 상세" crumbs={['홈', '내 민원', '민원 상세']} /><div className="complaint-loading"><div className="krds-spinner" role="status"><span className="sr-only">로딩 중</span>민원 정보를 불러오는 중입니다.</div></div></>
  if (error || !data) return <><PageHeader title="민원 상세" crumbs={['홈', '내 민원', '민원 상세']} /><BackLink to="/my/complaints" /><FeedbackBanner tone="error">{error || '민원 정보가 없습니다.'}</FeedbackBanner></>
  return <><PageHeader title="민원 상세" description={`${data.complaintNo} · ${statusLabels[data.currentStatus]}`} crumbs={['홈', '내 민원', '민원 상세']} /><BackLink to="/my/complaints" /><StatusStepper current={stepByStatus[data.currentStatus]} mode="process" />{downloadError && <FeedbackBanner tone="error">{downloadError}</FeedbackBanner>}<div className="detail-grid"><section className="summary-panel"><h2>신청 정보</h2><dl className="definition-list"><div><dt>처리 상태</dt><dd><StatusBadge status={data.currentStatus} /></dd></div><div><dt>신청일</dt><dd>{formatDateTime(data.submittedAt)}</dd></div><div><dt>민원 분야</dt><dd>{categoryName}</dd></div><div><dt>담당 부서</dt><dd>{data.assignedDepartmentName ?? '배정 대기'}</dd></div></dl></section><section className="summary-panel"><h2>{data.title}</h2><p>{data.content}</p>{data.attachments.length > 0 && <ul>{data.attachments.map((file) => <li key={file.attachmentId}><button type="button" className="download-link" onClick={() => void download(file.attachmentId, file.originalFilename)}>{file.originalFilename} 다운로드</button></li>)}</ul>}</section></div><section className="history-panel"><h2>처리 이력</h2><ol>{data.statusHistories.map((history) => <li key={`${history.newStatus}-${history.changedAt}`}><time>{formatDateTime(history.changedAt)}</time> {statusLabels[history.newStatus]}{history.changeMemo && ` · ${history.changeMemo}`}</li>)}</ol></section>{data.response && <section className="history-panel"><h2>공식 답변</h2><p>{data.response.responseContent}</p><p>답변 담당자 #{data.response.responderUserId} · {formatDateTime(data.response.respondedAt)}</p></section>}<FeedbackBanner>처리 상태가 변경되면 알림센터와 설정된 추가 알림 채널로 안내합니다.</FeedbackBanner></>
}
