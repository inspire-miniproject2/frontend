import { Button } from 'krds-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getMyComplaints } from '../../features/my-complaints/api'
import type { MyComplaintListResponse, MyComplaintQuery } from '../../features/my-complaints/types'
import { FeedbackBanner, FormField, PageHeader, StatusBadge } from '../../shared/ui/krds'
import { SelectInput, TextInput } from '../components/FormControls'

const initialQuery: MyComplaintQuery = { page: 0, size: 20 }
const summaryItems = [['total', '전체'], ['received', '접수됨'], ['assigned', '배정됨'], ['inProgress', '처리 중'], ['completed', '완료']] as const
const statusBySummary = { received: 'RECEIVED', assigned: 'ASSIGNED', inProgress: 'IN_PROGRESS', completed: 'COMPLETED' } as const

export function MyComplaintsPage() {
  const [query, setQuery] = useState(initialQuery)
  const [data, setData] = useState<MyComplaintListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    getMyComplaints(query).then((result) => { if (active) setData(result) }).catch(() => { if (active) setError('내 민원 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [query])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setQuery({ page: 0, size: 20, keyword: String(form.get('keyword') ?? ''), categoryCode: String(form.get('categoryCode') ?? '') || undefined, status: (String(form.get('status') ?? '') || undefined) as MyComplaintQuery['status'] })
  }

  return <>
    <PageHeader title="내 민원" description="신청한 민원의 배정과 처리 상태를 확인합니다." crumbs={['홈', '내 민원']} action={<Button as={Link} to="/complaints/new/write">민원 신청</Button>} />
    {data && <div className="summary-tabs" role="group" aria-label="처리 상태 요약">{summaryItems.map(([key, label]) => <button key={key} type="button" className={(key === 'total' && !query.status) || (key !== 'total' && query.status === statusBySummary[key]) ? 'active' : ''} onClick={() => setQuery({ ...initialQuery, status: key === 'total' ? undefined : statusBySummary[key] })}>{label} <strong>{data.summary[key]}</strong></button>)}</div>}
    <form className="filter-bar" onSubmit={submit}>
      <FormField id="keyword" label="민원 제목 또는 민원번호"><TextInput id="keyword" name="keyword" placeholder="검색어를 입력하세요" defaultValue={query.keyword} /></FormField>
      <FormField id="categoryCode" label="민원 분야"><SelectInput id="categoryCode" name="categoryCode" defaultValue={query.categoryCode ?? ''}><option value="">전체</option><option value="TRAFFIC">도로·교통</option><option value="ENVIRONMENT">환경</option><option value="WELFARE">복지</option></SelectInput></FormField>
      <FormField id="status" label="처리 상태"><SelectInput id="status" name="status" defaultValue={query.status ?? ''}><option value="">전체</option><option value="RECEIVED">접수됨</option><option value="ASSIGNED">배정됨</option><option value="IN_PROGRESS">처리 중</option><option value="COMPLETED">완료</option></SelectInput></FormField>
      <Button type="submit" disabled={loading}>검색</Button>
    </form>
    {loading &&
        (<div className="complaint-loading">
          <div className="krds-spinner" role="status">
              <span className="sr-only">로딩 중</span>
              Loading data..
            </div>
        </div>)}
    {/*{loading &&*/}
    {/*    <FeedbackBanner>내 민원 목록을 불러오는 중입니다.</FeedbackBanner>}*/}
    {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
    {!loading && !error && data && (<>
      <div className="result-summary"><strong>총 {data.totalElements}건</strong><span>최신 신청순</span></div>
      {data.content.length === 0 ?
          <FeedbackBanner>검색 조건에 맞는 민원이 없습니다.</FeedbackBanner> :
          <div className="table-scroll" tabIndex={0} aria-label="내 민원 목록 표, 가로로 스크롤할 수 있습니다">
            <table><caption className="sr-only">내 민원 목록</caption>
              <thead><tr><th>민원번호</th><th>분야</th><th>민원 제목</th><th>담당 부서</th><th>접수일</th><th>상태</th></tr></thead>
              <tbody>{data.content.map((item) => (
                  <tr key={item.complaintId}>
                    <td>{item.complaintNo}</td>
                    <td>{item.categoryName}</td><th scope="row"><Link to={`/my/complaints/${item.complaintId}`}>{item.title}</Link></th>
                    <td>{item.assignedDepartmentName ?? '배정 대기'}</td>
                    <td>{new Date(item.submittedAt).toLocaleDateString('ko-KR')}</td>
                    <td><StatusBadge status={item.currentStatus} /></td>
                  </tr>))}
              </tbody>
            </table></div>}
    </>)}
  </>
}
