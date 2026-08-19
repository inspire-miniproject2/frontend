import { Button } from 'krds-react'
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useComplaintApplication } from '../../features/complaint-application/ComplaintApplicationContext'
import { FeedbackBanner, PageHeader, StatusBadge, StatusStepper } from '../../shared/ui/krds'

export function ComplaintCompletePage() {
  const navigate = useNavigate()
  const { complaintId } = useParams()
  const { draft, result, reset } = useComplaintApplication()
  useEffect(() => { if (!result || String(result.complaintId) !== complaintId) navigate('/complaints/new/write', { replace: true }) }, [complaintId, navigate, result])
  if (!result || String(result.complaintId) !== complaintId) return null

  const assigned = result.currentStatus === 'ASSIGNED'
  const department = result.assignedDepartmentId ? `담당 부서 ID ${result.assignedDepartmentId}` : '자동 배정 대기'
  return <><PageHeader title="민원 신청" description="민원이 정상적으로 접수되었습니다." crumbs={['홈', '민원 신청', '접수 완료']} /><section className="workflow-card"><StatusStepper current={2} /><FeedbackBanner tone="success" title="접수 완료">접수번호 {result.complaintNo}</FeedbackBanner>{!assigned && <FeedbackBanner tone="warning">민원은 정상 접수되었으며 담당 부서 자동 배정을 기다리고 있습니다.</FeedbackBanner>}<section className="summary-panel"><h2>접수 결과</h2><dl className="definition-list"><div><dt>민원 제목</dt><dd>{draft.title}</dd></div><div><dt>접수일시</dt><dd>{new Date(result.submittedAt).toLocaleString('ko-KR')}</dd></div><div><dt>민원 분야</dt><dd>{draft.categoryName}</dd></div><div><dt>자동 배정 부서</dt><dd>{department}</dd></div><div><dt>현재 상태</dt><dd><StatusBadge status={result.currentStatus} /></dd></div><div><dt>알림 채널</dt><dd>인앱{draft.notifyChannels.includes('EMAIL') ? ', 이메일' : ''}</dd></div></dl></section><div className="button-row"><Button variant="secondary" as={Link} to="/complaints/new/write" onClick={reset}>새 민원 신청</Button><Button as={Link} to={`/my/complaints/${result.complaintId}`}>내 민원에서 확인</Button></div></section></>
}
