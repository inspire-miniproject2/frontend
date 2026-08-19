import { Button } from 'krds-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getComplaintCategories } from '../../features/complaint-application/api'
import type { ComplaintCategory } from '../../features/complaint-application/types'
import { getMyComplaints } from '../../features/my-complaints/api'
import type { MyComplaintListResponse, MyComplaintQuery } from '../../features/my-complaints/types'
import { ApiError } from '../../shared/api/contracts'
import { FeedbackBanner, FormField, PageHeader, StatusBadge } from '../../shared/ui/krds'
import { SelectInput, TextInput } from '../components/FormControls'

const initialQuery: MyComplaintQuery = { page: 0, size: 20 }
const summaryItems = [['total', '전체'], ['received', '접수됨'], ['assigned', '배정됨'], ['inProgress', '처리 중'], ['completed', '완료']] as const
const statusBySummary = { received: 'RECEIVED', assigned: 'ASSIGNED', inProgress: 'IN_PROGRESS', completed: 'COMPLETED' } as const

export function MyComplaintsPage() {
  const [query, setQuery] = useState(initialQuery)
  const [data, setData] = useState<MyComplaintListResponse | null>(null)
  const [categories, setCategories] = useState<ComplaintCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { getComplaintCategories(true).then(setCategories).catch(() => setError('민원 분야 목록을 불러오지 못했습니다.')) }, [])
  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    getMyComplaints(query).then((result) => { if (active) setData(result) }).catch((reason) => { if (active) setError(reason instanceof ApiError ? reason.message : '내 민원 목록을 불러오지 못했습니다.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [query])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    setQuery({ ...initialQuery, keyword: String(form.get('keyword') ?? ''), categoryCode: String(form.get('categoryCode') ?? '') || undefined, status: (String(form.get('status') ?? '') || undefined) as MyComplaintQuery['status'] })
  }
  const categoryName = (code: string) => categories.find((item) => item.categoryCode === code)?.categoryName ?? code

  return <><PageHeader title="내 민원" description="신청한 민원의 배정과 처리 상태를 확인합니다." crumbs={['홈', '내 민원']} action={<Button as={Link} to="/complaints/new/write">민원 신청</Button>} />
    {data && <div className="summary-tabs" role="group" aria-label="처리 상태 요약">{summaryItems.map(([key, label]) => <button key={key} type="button" className={(key === 'total' && !query.status) || (key !== 'total' && query.status === statusBySummary[key]) ? 'active' : ''} onClick={() => setQuery({ ...initialQuery, status: key === 'total' ? undefined : statusBySummary[key] })}>{label} <strong>{data.summary[key]}</strong></button>)}</div>}
    <form className="filter-bar" onSubmit={submit}><FormField id="keyword" label="민원 제목 또는 민원번호"><TextInput id="keyword" name="keyword" maxLength={50} placeholder="검색어를 입력하세요" /></FormField><FormField id="categoryCode" label="민원 분야"><SelectInput id="categoryCode" name="categoryCode"><option value="">전체</option>{categories.map((category) => <option key={category.categoryId} value={category.categoryCode}>{category.categoryName}</option>)}</SelectInput></FormField><FormField id="status" label="처리 상태"><SelectInput id="status" name="status" defaultValue={query.status ?? ''}><option value="">전체</option><option value="RECEIVED">접수됨</option><option value="ASSIGNED">배정됨</option><option value="IN_PROGRESS">처리 중</option><option value="COMPLETED">완료</option></SelectInput></FormField><Button type="submit" disabled={loading}>검색</Button></form>
    {loading && <div className="complaint-loading"><div className="krds-spinner" role="status"><span className="sr-only">로딩 중</span>내 민원을 불러오는 중입니다.</div></div>}{error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
    {!loading && !error && data && <><div className="result-summary"><strong>총 {data.totalElements}건</strong><span>최신 신청순</span></div>{data.content.length === 0 ? <FeedbackBanner>검색 조건에 맞는 민원이 없습니다.</FeedbackBanner> : <div className="table-scroll" tabIndex={0} aria-label="내 민원 목록 표, 가로로 스크롤할 수 있습니다"><table><caption className="sr-only">내 민원 목록</caption><thead><tr><th>민원번호</th><th>분야</th><th>민원 제목</th><th>담당 부서</th><th>상태</th></tr></thead><tbody>{data.content.map((item) => <tr key={item.complaintId}><td>{item.complaintNo}</td><td>{categoryName(item.categoryCode)}</td><th scope="row"><Link to={`/my/complaints/${item.complaintId}`}>{item.title}</Link></th><td>{item.assignedDepartmentName ?? '배정 대기'}</td><td><StatusBadge status={item.currentStatus} /></td></tr>)}</tbody></table></div>}<nav className="pagination" aria-label="내 민원 페이지 탐색"><button type="button" disabled={data.page === 0} onClick={() => setQuery((current) => ({ ...current, page: Math.max(0, data.page - 1) }))}>이전</button><span>{data.page + 1} / {Math.max(data.totalPages, 1)}</span><button type="button" disabled={!data.hasNext} onClick={() => setQuery((current) => ({ ...current, page: data.page + 1 }))}>다음</button></nav></>}
  </>
}
