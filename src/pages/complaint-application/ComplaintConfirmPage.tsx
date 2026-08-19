import { Button } from 'krds-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createComplaint } from '../../features/complaint-application/api'
import { useComplaintApplication } from '../../features/complaint-application/ComplaintApplicationContext'
import { ApiError } from '../../shared/api/contracts'
import { FeedbackBanner, PageHeader, StatusStepper } from '../../shared/ui/krds'

export function ComplaintConfirmPage() {
  const navigate = useNavigate()
  const { draft, setResult } = useComplaintApplication()
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const isValidDraft = draft.categoryId !== null && Boolean(draft.categoryCode) && draft.title.trim().length >= 5 && draft.content.trim().length >= 20

  useEffect(() => { if (!isValidDraft) navigate('/complaints/new/write', { replace: true }) }, [isValidDraft, navigate])

  const submit = async () => {
    if (!confirmed || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const created = await createComplaint(draft)
      setResult(created)
      navigate(`/complaints/new/complete/${created.complaintId}`)
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : '민원 접수 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isValidDraft) return null
  return (<>
    <PageHeader title="민원 신청" description="입력한 내용을 최종 확인해 주세요." crumbs={['홈', '민원 신청', '내용 확인']} />
    <section className="workflow-card"><StatusStepper current={1} />
      <FeedbackBanner tone="warning" title="중요">제출 후에는 내용을 수정할 수 없습니다.</FeedbackBanner>
      <div className="confirm-grid">
        <section className="summary-panel">
          <h2>신청 내용</h2>
          <dl className="definition-list">
            <div><dt>민원 분야</dt><dd>{draft.categoryName}</dd></div>
            <div><dt>민원 제목</dt><dd>{draft.title}</dd></div>
            <div><dt>민원 내용</dt><dd>{draft.content}</dd></div>
            <div><dt>첨부파일</dt><dd>{draft.attachmentFiles.length ? draft.attachmentFiles.map((file) => file.name).join(', ') : '없음'}</dd></div>
            <div><dt>알림 채널</dt><dd>인앱{draft.notifyChannels.includes('EMAIL') ? ', 이메일' : ''}</dd></div>
          </dl>
        </section>
        <aside className="confirm-panel"><h2>민원을 제출하시겠습니까?</h2><p>처리 중에는 제출 버튼이 비활성화되어 중복 접수를 방지합니다.</p>
          <div className="krds-form-check">
            <input id="submission-confirmed" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)}/>
            <label className="check-line" htmlFor="submission-confirmed">위 내용을 확인했으며 제출 후 수정할 수 없음을 확인했습니다.</label>
          </div>
          {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
          <div className="button-row"><Button variant="secondary" as={Link} to="/complaints/new/write">신청서 수정</Button>
            <Button type="button" disabled={!confirmed || submitting} onClick={submit}>{submitting ? '제출 중...' : '민원 제출'}</Button>
          </div>
        </aside>
      </div>
    </section>
  </>)
}
