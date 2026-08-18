import { PageHeader, Pagination } from '../../shared/ui/krds'
import { ComplaintFilter, ComplaintTable } from '../components/ComplaintList'

export function OfficerComplaintsPage() {
  return <><PageHeader title="담당 민원 업무함" description="배정된 민원의 상태를 변경하고 공식 답변을 등록합니다." crumbs={['홈', '민원업무함']} /><div className="summary-tabs" role="group" aria-label="업무 상태 요약"><button className="active">전체 <strong>36</strong></button><button>신규 배정 <strong>12</strong></button><button>처리 중 <strong>18</strong></button><button>완료 <strong>6</strong></button></div><ComplaintFilter officer /><div className="result-summary"><strong>총 36건</strong><span>최신 접수순</span></div><ComplaintTable officer /><Pagination /></>
}
