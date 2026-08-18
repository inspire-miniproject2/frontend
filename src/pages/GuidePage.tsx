import { PageHeader } from '../shared/ui/krds'

export function GuidePage() {
  return (<>
    <PageHeader title="이용안내" description="민원온의 민원 신청과 처리 절차를 안내합니다." crumbs={['홈', '이용안내']} />
    <section className="summary-panel">
      <h2>민원 처리 절차</h2>
      <ol><li>시민 계정으로 로그인한 후 민원을 작성합니다.</li>
        <li>제출 전 내용을 확인하고 민원을 접수합니다.</li>
        <li>자동 배정된 담당 부서가 민원을 처리합니다.</li>
        <li>처리가 완료되면 인앱 또는 선택한 이메일로 알림을 받습니다.</li>
      </ol>
    </section></>)
}
