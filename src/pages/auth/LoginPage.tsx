import { Button } from 'krds-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../features/auth/api'
import { authSession } from '../../features/auth/session'
import { ApiError } from '../../shared/api/contracts'
import { FeedbackBanner, FormField, PageHeader } from '../../shared/ui/krds'
import { TextInput } from '../components/FormControls'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const result = await login({ loginId, password })
      authSession.set(result)
      const requestedTarget = typeof location.state?.returnTo === 'string' ? location.state.returnTo : null
      const canReturn = requestedTarget?.startsWith('/complaints/new') && ['CITIZEN', 'ADMIN'].includes(result.user.role)
      const target = canReturn ? requestedTarget : result.user.role === 'ADMIN' ? '/admin/statistics' : result.user.role === 'OFFICER' ? '/officer/complaints' : '/my/complaints'
      navigate(target, { replace: true })
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (<>
    <PageHeader title="아이디/비밀번호 로그인" description="민원 신청 및 처리 현황을 확인하려면 로그인해 주세요." crumbs={['홈', '로그인']} />
    <form className="narrow-form" onSubmit={submit}>
      {location.state?.signupComplete && <FeedbackBanner tone="success">회원가입이 완료되었습니다. 가입한 아이디로 로그인해 주세요.</FeedbackBanner>}
      {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
      <FormField id="loginId" label="아이디" required>
        <TextInput id="loginId" autoComplete="username" placeholder="아이디를 입력하세요" value={loginId} required onChange={(event) => setLoginId(event.target.value)}/></FormField>
      <FormField id="password" label="비밀번호" required>
        <TextInput id="password" type="password" autoComplete="current-password" placeholder="비밀번호를 입력하세요" value={password} required onChange={(event) => setPassword(event.target.value)}/>
      </FormField>
      {/*<label className="check-line"><input type="checkbox" /> 아이디 저장</label>*/}
      <div className="krds-form-check">
        <input type="checkbox" name="chk_1" id="chk_1"/>
        <label className="check-line" htmlFor="chk_1">아이디 저장</label>
      </div>
      <Button type="submit" size="large" className="full-button" disabled={submitting}>{submitting ? '로그인 중...' : '로그인'}</Button>
      <p className="centered-link">처음 방문하셨나요? <Link to="/signup">회원가입</Link></p>
    </form>
  </>)
}
