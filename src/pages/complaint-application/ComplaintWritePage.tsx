import { Button } from 'krds-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getComplaintCategories } from '../../features/complaint-application/api'
import { useComplaintApplication } from '../../features/complaint-application/ComplaintApplicationContext'
import type { ComplaintCategory } from '../../features/complaint-application/types'
import { ApiError } from '../../shared/api/contracts'
import { FeedbackBanner, FormField, PageHeader, StatusStepper } from '../../shared/ui/krds'
import { SelectInput, TextInput } from '../components/FormControls'

export function ComplaintWritePage() {
  const navigate = useNavigate()
  const { draft, setDraft, setResult } = useComplaintApplication()
  const [categories, setCategories] = useState<ComplaintCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { getComplaintCategories().then(setCategories).catch((reason) => setError(reason instanceof ApiError ? reason.message : '민원 분야를 불러오지 못했습니다. 다시 시도해 주세요.')).finally(() => setLoading(false)) }, [])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setResult(null)
    navigate('/complaints/new/confirm')
  }

  return (<>
    <PageHeader title="민원 신청" description="개인정보와 민감정보는 본문에 작성하지 마세요." crumbs={['홈', '민원 신청']} />
    <section className="workflow-card"><StatusStepper current={0} />
      <FeedbackBanner>제출한 민원은 직접 수정할 수 없습니다. 변경이 필요하면 취소 후 다시 신청해야 합니다.</FeedbackBanner>
      <form className="application-form" onSubmit={submit}>
        <FormField id="complaint-category" label="민원 분야" required><SelectInput id="complaint-category"
          value={draft.categoryId ?? ''} disabled={loading} required onChange={(event) => { const category = categories.find((item) => item.categoryId === Number(event.target.value)); setDraft({ ...draft, categoryId: category?.categoryId ?? null, categoryName: category?.categoryName ?? '', categoryCode: category?.categoryCode ?? '' }) }}>
          <option value="">{loading ? '불러오는 중...' : '선택하세요'}</option>
          {categories.map((category) => <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>)}
        </SelectInput></FormField>
        {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
        <FormField id="complaint-title" label="민원 제목" required><TextInput id="complaint-title"
          value={draft.title} minLength={5} maxLength={100} required onChange={(event) => setDraft({ ...draft, title: event.target.value })}/>
          <span className="character-count">{draft.title.length}/100자</span></FormField>
        <FormField id="complaint-content" label="민원 내용" required hint="현장 위치, 발생 시간, 요청 사항을 구체적으로 작성해 주세요.">
          <textarea id="complaint-content" className="textarea" rows={8}
            value={draft.content} minLength={20} maxLength={3000} required onChange={(event) => setDraft({ ...draft, content: event.target.value })}/></FormField>
        <FormField id="attachments" label="첨부파일" hint="서버의 파일 정책이 확정되면 허용 형식과 용량을 안내합니다.">
          <div id="attachments" className="file-drop">
            <input id="attachment-input" type="file" multiple onChange={(event) => setDraft({ ...draft, attachmentFiles: Array.from(event.target.files ?? []) })}/>
            {draft.attachmentFiles.map((file) => <div className="file-item" key={`${file.name}-${file.size}`}>{file.name} <span>{(file.size / 1024 / 1024).toFixed(1)}MB</span><button type="button" onClick={() => setDraft({ ...draft, attachmentFiles: draft.attachmentFiles.filter((item) => item !== file) })}>삭제</button></div>)}
          </div>
        </FormField>
        <div className="krds-form-check">
          <input type="checkbox" name="email-notify" id="email-notify" checked={draft.notifyChannels.includes('EMAIL')} onChange={(event) => setDraft({ ...draft, notifyChannels: event.target.checked ? ['EMAIL'] : [] })}/>
          <label className="check-line" htmlFor="email-notify">이메일로 알림 받기</label>
          <span className="optional"> 선택</span>
        </div>
        <div className="button-row">
          <Button variant="secondary" as={Link} to="/my/complaints">취소</Button>
          <Button type="submit" disabled={loading || Boolean(error)}>다음: 내용 확인</Button>
        </div>
      </form>
    </section>
  </>)
}
