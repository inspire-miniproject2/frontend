import { Button } from 'krds-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { changeComplaintStatus, getOfficerComplaint, registerComplaintResponse } from '../../features/officer-complaints/api'
import type { MyComplaintDetail } from '../../features/my-complaints/types'
import { ApiError } from '../../shared/api/contracts'
import { BackLink, FeedbackBanner, FormField, PageHeader, StatusBadge } from '../../shared/ui/krds'

const nextStatus = { RECEIVED: 'ASSIGNED', ASSIGNED: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' } as const
const actionLabel = { RECEIVED: '담당 부서 배정', ASSIGNED: '처리 시작', IN_PROGRESS: '답변 등록 및 처리 완료' } as const
const formatDateTime = (value: string) => new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

export function OfficerComplaintDetailPage() {
  const { complaintId } = useParams(); const id = Number(complaintId)
  const [data, setData] = useState<MyComplaintDetail | null>(null)
  const [loading, setLoading] = useState(true); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState(''); const [success, setSuccess] = useState('')
  const load = () => { setLoading(true); setError(''); return getOfficerComplaint(id).then(setData).catch(() => setError('민원 정보를 불러오지 못했습니다.')).finally(() => setLoading(false)) }
  useEffect(() => { if (Number.isInteger(id)) void load(); else { setError('잘못된 민원 번호입니다.'); setLoading(false) } }, [id])
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!data || data.currentStatus === 'COMPLETED') return
    const form = new FormData(event.currentTarget); setSubmitting(true); setError(''); setSuccess('')
    try {
      if (data.currentStatus === 'IN_PROGRESS') await registerComplaintResponse(id, { responseContent: String(form.get('responseContent') ?? ''), isPublic: form.get('isPublic') === 'on' })
      await changeComplaintStatus(id, { newStatus: nextStatus[data.currentStatus], changeMemo: String(form.get('changeMemo') ?? '') || undefined })
      setSuccess(data.currentStatus === 'IN_PROGRESS' ? '공식 답변을 등록하고 처리를 완료했습니다.' : '민원 상태를 변경했습니다.')
      await load()
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : '처리 작업을 완료하지 못했습니다.') } finally { setSubmitting(false) }
  }
  if (loading) return <><PageHeader title="민원 처리" crumbs={['홈', '민원업무함', '민원 처리']} /><div className="complaint-loading"><div className="krds-spinner" role="status"><span className="sr-only">로딩 중</span>민원 정보를 불러오는 중입니다.</div></div></>
  if (error && !data) return <><PageHeader title="민원 처리" crumbs={['홈', '민원업무함', '민원 처리']} /><BackLink to="/officer/complaints" /><FeedbackBanner tone="error">{error}</FeedbackBanner></>
  if (!data) return null

  return <><PageHeader title={`민원 처리 · ${data.complaintNo}`} description={`${data.assignedDepartmentName ?? '배정 대기'} · 접수 ${formatDateTime(data.submittedAt)}`} crumbs={['홈', '민원업무함', '민원 처리']} /><BackLink to="/officer/complaints" />{success && <FeedbackBanner tone="success">{success}</FeedbackBanner>}{error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}<div className="officer-workspace"><section><h2>민원 정보</h2><p><StatusBadge status={data.currentStatus} /></p><h3>{data.title}</h3><p>{data.content}</p>{data.attachments.length > 0 && <ul>{data.attachments.map((file) => <li key={file.attachmentId}><a href={`/api/v1/complaints/${data.complaintId}/attachments/${file.attachmentId}`}>{file.originalFilename} 다운로드</a></li>)}</ul>}<section className="history-panel"><h2>처리 이력</h2><ol>{data.statusHistories.map((history) => <li key={`${history.newStatus}-${history.changedAt}`}><time>{formatDateTime(history.changedAt)}</time> {history.newStatus}</li>)}</ol></section></section><aside className="work-panel"><h2>처리 작업</h2>{data.currentStatus === 'COMPLETED' ? <FeedbackBanner tone="success">완료된 민원입니다. 상태를 더 이상 변경할 수 없습니다.</FeedbackBanner> : <form onSubmit={submit}><FormField id="change-memo" label="상태 변경 메모"><textarea id="change-memo" name="changeMemo" className="textarea" maxLength={500} rows={4} /></FormField>{data.currentStatus === 'IN_PROGRESS' && <><FormField id="official-response" label="공식 답변" required hint="민원인에게 전달할 답변을 20~3000자로 작성해 주세요."><textarea id="official-response" name="responseContent" className="textarea" minLength={20} maxLength={3000} rows={10} required defaultValue={data.response?.responseContent ?? ''} /></FormField><label className="check-line"><input type="checkbox" name="isPublic" /> 공개 답변 게시판에 공개</label></>}<Button type="submit" className="full-button" disabled={submitting}>{submitting ? '처리 중...' : actionLabel[data.currentStatus]}</Button><FeedbackBanner tone="warning">현재 상태에서 허용된 다음 단계로만 변경할 수 있습니다.</FeedbackBanner></form>}</aside></div></>
}
