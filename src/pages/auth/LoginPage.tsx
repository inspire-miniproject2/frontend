import { Button } from 'krds-react'
import { Link } from 'react-router-dom'
import { FormField, PageHeader } from '../../shared/ui/krds'
import { TextInput } from '../components/FormControls'

export function LoginPage() {
  return (<>
    <PageHeader title="아이디/비밀번호 로그인" description="민원 신청 및 처리 현황을 확인하려면 로그인해 주세요." crumbs={['홈', '로그인']} />
    <form className="narrow-form" onSubmit={(event) => event.preventDefault()}>
      <FormField id="loginId" label="아이디" required>
        <TextInput id="loginId" autoComplete="username" placeholder="아이디를 입력하세요"/></FormField>
      <FormField id="password" label="비밀번호" required>
        <TextInput id="password" type="password" autoComplete="current-password" placeholder="비밀번호를 입력하세요"/>
      </FormField>
      {/*<label className="check-line"><input type="checkbox" /> 아이디 저장</label>*/}
      <div className="krds-form-check">
        <input type="checkbox" name="chk_1" id="chk_1"/>
        <label className="check-line">아이디 저장</label>
      </div>
      <Button type="submit" size="large" className="full-button">로그인</Button>
      <p className="centered-link">처음 방문하셨나요? <Link to="/signup">회원가입</Link></p>
    </form>
  </>)
}
