import { Button } from 'krds-react'
import { Link } from 'react-router-dom'
import { FeedbackBanner, FormField, PageHeader } from '../../shared/ui/krds'
import { TextInput } from '../components/FormControls'

export function SignupPage() {
  return <><PageHeader title="회원가입" description="시민 회원정보를 입력해 주세요." crumbs={['홈', '회원가입']} /><form className="form-card" onSubmit={(event) => event.preventDefault()}><div className="form-grid"><FormField id="signup-id" label="아이디" required hint="영문·숫자 6~20자"><TextInput id="signup-id" defaultValue="minwon2026" /></FormField><FormField id="signup-password" label="비밀번호" required hint="영문·숫자·특수문자 포함 10자 이상"><TextInput id="signup-password" type="password" /></FormField><FormField id="password-confirm" label="비밀번호 확인" required><TextInput id="password-confirm" type="password" /></FormField><FormField id="name" label="이름" required><TextInput id="name" defaultValue="김민원" /></FormField><FormField id="email" label="이메일" required><TextInput id="email" type="email" defaultValue="minwon@example.kr" /></FormField><FormField id="phone" label="휴대전화번호" required><TextInput id="phone" defaultValue="010-1234-5678" /></FormField></div><label className="check-line"><input type="checkbox" /> 이메일 알림 수신에 동의합니다. <span className="optional">선택</span></label><FeedbackBanner>공무원 계정은 승인된 행정 절차를 통해 별도 발급되며 시민 회원가입으로 만들 수 없습니다.</FeedbackBanner><div className="button-row"><Button variant="secondary" as={Link} to="/login">이전</Button><Button type="submit">가입하기</Button></div></form></>
}
