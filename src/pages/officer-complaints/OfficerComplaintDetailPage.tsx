import { Button } from 'krds-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { changeComplaintStatus, getOfficerComplaint, registerComplaintResponse } from '../../features/officer-complaints/api'
import type { MyComplaintDetail } from '../../features/my-complaints/types'
import { downloadComplaintAttachment } from '../../features/my-complaints/api'
import { ApiError } from '../../shared/api/contracts'
import { BackLink, FeedbackBanner, FormField, PageHeader, StatusBadge } from '../../shared/ui/krds'

const nextStatus = { RECEIVED: 'ASSIGNED', ASSIGNED: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' } as const
const actionLabel = { RECEIVED: '담당 부서 배정', ASSIGNED: '처리 시작', IN_PROGRESS: '답변 등록 및 처리 완료', COMPLETED: '처리 완료' } as const
const formatDateTime = (value: string) => new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

export function OfficerComplaintDetailPage() {
  const { complaintId } = useParams()
  const id = Number(complaintId)
  const [data, setData] = useState<MyComplaintDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = (clearError = true) => {
    setLoading(true)
    if (clearError) setError('')
    return getOfficerComplaint(id)
      .then(setData)
      .catch((reason) => setError(reason instanceof ApiError ? reason.message : '민원 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (Number.isInteger(id) && id > 0) void load()
    else { setError('잘못된 민원 번호입니다.'); setLoading(false) }
  }, [id])

  const downloadAttachment = async (attachmentId: number, originalFilename: string) => {
    setDownloadingId(attachmentId)
    setError('')
    try {
      const { blob, filename } = await downloadComplaintAttachment(id, attachmentId)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename ?? originalFilename
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : '첨부파일을 다운로드하지 못했습니다.')
    } finally {
      setDownloadingId(null)
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!data || data.currentStatus === 'COMPLETED') return
    const form = new FormData(event.currentTarget)
    const currentStatus = data.currentStatus
    let registeredNow = false
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (currentStatus === 'IN_PROGRESS' && !data.response) {
        await registerComplaintResponse(id, {
          responseContent: String(form.get('responseContent') ?? '').trim(),
          isPublic: form.get('isPublic') === 'on',
        })
        registeredNow = true
      }

      try {
        await changeComplaintStatus(id, {
          newStatus: nextStatus[currentStatus],
          changeMemo: String(form.get('changeMemo') ?? '').trim() || undefined,
        })
      } catch (reason) {
        if (registeredNow) {
          const message = reason instanceof ApiError ? reason.message : '완료 상태로 변경하지 못했습니다.'
          await load(false)
          setSuccess('공식 답변은 등록되었지만 완료 상태 변경에 실패했습니다. 최신 상태를 확인한 뒤 다시 완료해 주세요.')
          setError(message)
          return
        }
        throw reason
      }

      setSuccess(currentStatus === 'IN_PROGRESS' ? '공식 답변을 등록하고 처리를 완료했습니다.' : '민원 상태를 변경했습니다.')
      await load()
    } catch (reason) {
      const message = reason instanceof ApiError ? reason.message : '처리 작업을 완료하지 못했습니다.'
      if (reason instanceof ApiError && reason.status === 409) await load(false)
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <><PageHeader title="민원 처리" crumbs={['홈', '민원업무함', '민원 처리']} /><div className="complaint-loading"><div className="krds-spinner" role="status"><span className="sr-only">로딩 중</span>민원 정보를 불러오는 중입니다.</div></div></>
  if (error && !data) return <><PageHeader title="민원 처리" crumbs={['홈', '민원업무함', '민원 처리']} /><BackLink to="/officer/complaints" /><FeedbackBanner tone="error">{error}</FeedbackBanner></>
  if (!data) return null

  const responseAlreadyRegistered = data.currentStatus === 'IN_PROGRESS' && Boolean(data.response)
  const submitLabel = responseAlreadyRegistered ? '처리 완료' : actionLabel[data.currentStatus]

  return <>
    <PageHeader title={`민원 처리 · ${data.complaintNo}`} description={`${data.assignedDepartmentName ?? '배정 대기'} · 접수 ${formatDateTime(data.submittedAt)}`} crumbs={['홈', '민원업무함', '민원 처리']} />
    <BackLink to="/officer/complaints" />
    {success && <FeedbackBanner tone="success">{success}</FeedbackBanner>}
    {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
    <div className="officer-workspace">
      <section><h2>민원 정보</h2><p><StatusBadge status={data.currentStatus} /></p><h3>{data.title}</h3><p>{data.content}</p>
        {data.attachments.length > 0 && <ul>{data.attachments.map((file) => <li key={file.attachmentId}><button type="button" disabled={downloadingId === file.attachmentId} onClick={() => void downloadAttachment(file.attachmentId, file.originalFilename)}>{downloadingId === file.attachmentId ? '다운로드 중...' : `${file.originalFilename} 다운로드`}</button></li>)}</ul>}
        <section className="history-panel"><h2>처리 이력</h2><ol>{data.statusHistories.map((history) => <li key={`${history.newStatus}-${history.changedAt}`}><time>{formatDateTime(history.changedAt)}</time> {history.newStatus}{history.changeMemo ? ` · ${history.changeMemo}` : ''}</li>)}</ol></section>
      </section>
      <aside className="work-panel"><h2>처리 작업</h2>
        {data.currentStatus === 'COMPLETED' ? <FeedbackBanner tone="success">완료된 민원입니다. 상태를 더 이상 변경할 수 없습니다.</FeedbackBanner> : <form onSubmit={submit}>
          <FormField id="change-memo" label="상태 변경 메모"><textarea id="change-memo" name="changeMemo" className="textarea" maxLength={500} rows={4} /></FormField>
          {data.currentStatus === 'IN_PROGRESS' && (data.response ? <FeedbackBanner tone="success" title="공식 답변 등록 완료">{data.response.responseContent}</FeedbackBanner> : <><FormField id="official-response" label="공식 답변" required hint="민원인에게 전달할 답변을 20~3000자로 작성해 주세요."><textarea id="official-response" name="responseContent" className="textarea" minLength={20} maxLength={3000} rows={10} required /></FormField><div className="krds-form-check"><input id="public-response" type="checkbox" name="isPublic" /><label className="check-line" htmlFor="public-response">공개 답변 게시판에 공개</label></div></>)}
          <Button type="submit" className="full-button" disabled={submitting}>{submitting ? '처리 중...' : submitLabel}</Button>
          <FeedbackBanner tone="warning">현재 상태에서 허용된 다음 단계로만 변경할 수 있습니다.</FeedbackBanner>
        </form>}
      </aside>
    </div>
  </>
}
