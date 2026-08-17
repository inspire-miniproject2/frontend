import { Button } from 'krds-react'
import { Link } from 'react-router-dom'
import { PageHeader, Pagination } from '../../shared/ui/krds'
import { ComplaintFilter, ComplaintTable } from '../components/ComplaintList'

export function MyComplaintsPage() {
  return <><PageHeader title="내 민원" description="신청한 민원의 배정과 처리 상태를 확인합니다." crumbs={['홈', '내 민원']} action={<Button as={Link} to="/complaints/new/write">민원 신청</Button>} /><div className="summary-tabs" role="group" aria-label="처리 상태 요약"><button className="active">전체 <strong>24</strong></button><button>접수됨 <strong>3</strong></button><button>배정됨 <strong>4</strong></button><button>처리 중 <strong>7</strong></button><button>완료 <strong>10</strong></button></div><ComplaintFilter /><div className="result-summary"><strong>총 24건</strong><span>최신 신청순</span></div><ComplaintTable /><Pagination /></>
}
