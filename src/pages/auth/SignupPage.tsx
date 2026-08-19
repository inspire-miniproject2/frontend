import { Button } from 'krds-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../../features/auth/api'
import type { SignupRequest } from '../../features/auth/types'
import { ApiError } from '../../shared/api/contracts'
import { FeedbackBanner, FormField, PageHeader } from '../../shared/ui/krds'
import { TextInput } from '../components/FormControls'

export function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<SignupRequest>({ loginId: '', password: '', name: '', email: '', phone: '', emailNotifyAgreed: false })
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const update = <K extends keyof SignupRequest>(key: K, value: SignupRequest[K]) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (form.password !== passwordConfirm) { setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.'); return }
    setSubmitting(true)
    setError('')
    try {
      const result = await signup(form)
      navigate('/login', { replace: true, state: { signupComplete: true, loginId: result.loginId } })
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (<>
    <PageHeader title="회원가입" description="시민 회원정보를 입력해 주세요." crumbs={['홈', '회원가입']} />
    <form className="form-card" onSubmit={submit}>{error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
      <div className="form-grid">
        <FormField id="signup-id" label="아이디" required hint="영문·숫자 6~20자"><TextInput id="signup-id" value={form.loginId} required minLength={6} maxLength={20} onChange={(event) => update('loginId', event.target.value)} /></FormField>
        <FormField id="email" label="이메일" required hint="민원처리 알림을 받을 이메일 주소를 입력하세요"><TextInput id="email" type="email" value={form.email} required placeholder="example@email.com" onChange={(event) => update('email', event.target.value)} /></FormField>
        <FormField id="signup-password" label="비밀번호" required hint="영문·숫자·특수문자 포함 10자 이상"><TextInput id="signup-password" type="password" value={form.password} required minLength={10} onChange={(event) => update('password', event.target.value)} /></FormField>
        <FormField id="password-confirm" label="비밀번호 확인" required hint="비밀번호와 동일하게 입력하세요"><TextInput id="password-confirm" type="password" value={passwordConfirm} required onChange={(event) => setPasswordConfirm(event.target.value)} /></FormField><FormField id="name" label="이름" required><TextInput id="name" value={form.name} required minLength={2} maxLength={50} onChange={(event) => update('name', event.target.value)} /></FormField>
        <FormField id="phone" label="휴대전화번호" required><TextInput id="phone" value={form.phone} required placeholder="010-0000-0000" onChange={(event) => update('phone', event.target.value)} /></FormField>
      </div>
      <div className="krds-form-check">
        <input
          type="checkbox"
          id="emailNotifyAgreed"
          name="emailNotifyAgreed"
          checked={form.emailNotifyAgreed}
          onChange={(event) => update('emailNotifyAgreed', event.target.checked)}
        />
        <label className="check-line" htmlFor="emailNotifyAgreed">
          이메일 알림 수신에 동의합니다. <span className="optional">선택</span>
        </label>
      </div>
      <FeedbackBanner>공무원 계정은 승인된 행정 절차를 통해 별도 발급되며 시민 회원가입으로 만들 수 없습니다.</FeedbackBanner>
      <div className="button-row">
        <Button variant="secondary" as={Link} to="/login">이전</Button>
        <Button type="submit" disabled={submitting}>{submitting ? '가입 처리 중...' : '가입하기'}</Button>
      </div>
    </form></>)
}
