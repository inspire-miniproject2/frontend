import { Button } from 'krds-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getOfficerComplaints } from '../../features/officer-complaints/api'
import type { OfficerComplaintList, OfficerComplaintQuery } from '../../features/officer-complaints/types'
import { FeedbackBanner, FormField, PageHeader, StatusBadge } from '../../shared/ui/krds'
import { SelectInput, TextInput } from '../components/FormControls'

const initialQuery: OfficerComplaintQuery = { page: 0, size: 20 }
const summaryStatus = { newAssigned: 'ASSIGNED', inProgress: 'IN_PROGRESS', completed: 'COMPLETED' } as const

export function OfficerComplaintsPage() {
  const [query, setQuery] = useState(initialQuery)
  const [data, setData] = useState<OfficerComplaintList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { let active = true; setLoading(true); setError(''); getOfficerComplaints(query).then((result) => { if (active) setData(result) }).catch(() => { if (active) setError('담당 민원 목록을 불러오지 못했습니다.') }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [query])
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); setQuery({ ...initialQuery, keyword: String(form.get('keyword') ?? ''), status: (String(form.get('status') ?? '') || undefined) as OfficerComplaintQuery['status'] }) }

  return <><PageHeader title="담당 민원 업무함" description="배정된 민원의 상태를 변경하고 공식 답변을 등록합니다." crumbs={['홈', '민원업무함']} />
    {data && <div className="summary-tabs" role="group" aria-label="업무 상태 요약"><button type="button" className={!query.status ? 'active' : ''} onClick={() => setQuery(initialQuery)}>전체 <strong>{data.summary.newAssigned + data.summary.inProgress + data.summary.completed}</strong></button>{([['newAssigned', '신규 배정'], ['inProgress', '처리 중'], ['completed', '완료']] as const).map(([key, label]) => <button key={key} type="button" className={query.status === summaryStatus[key] ? 'active' : ''} onClick={() => setQuery({ ...initialQuery, status: summaryStatus[key] })}>{label} <strong>{data.summary[key]}</strong></button>)}</div>}
    <form className="filter-bar officer-filter" onSubmit={submit}><FormField id="officer-keyword" label="민원번호 또는 민원 제목"><TextInput id="officer-keyword" name="keyword" maxLength={50} placeholder="검색어를 입력하세요" /></FormField><FormField id="officer-status" label="처리 상태"><SelectInput id="officer-status" name="status" defaultValue={query.status ?? ''}><option value="">전체</option><option value="RECEIVED">접수됨</option><option value="ASSIGNED">신규 배정</option><option value="IN_PROGRESS">처리 중</option><option value="COMPLETED">완료</option></SelectInput></FormField><Button type="submit" disabled={loading}>검색</Button></form>
    {loading && <div className="complaint-loading"><div className="krds-spinner" role="status"><span className="sr-only">로딩 중</span>담당 민원을 불러오는 중입니다.</div></div>}{error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
    {!loading && !error && data && <><div className="result-summary"><strong>총 {data.totalElements}건</strong><span>최신 접수순</span></div>{data.content.length === 0 ? <FeedbackBanner>검색 조건에 맞는 담당 민원이 없습니다.</FeedbackBanner> : <div className="table-scroll" tabIndex={0} aria-label="담당 민원 목록 표, 가로로 스크롤할 수 있습니다"><table><caption className="sr-only">담당 민원 목록</caption><thead><tr><th>민원번호</th><th>분야</th><th>민원 제목</th><th>담당자</th><th>접수일</th><th>상태</th></tr></thead><tbody>{data.content.map((item) => <tr key={item.complaintId}><td>{item.complaintNo}</td><td>{item.categoryName}</td><th scope="row"><Link to={`/officer/complaints/${item.complaintId}`}>{item.title}</Link></th><td>{item.assigneeName}</td><td>{new Date(item.submittedAt).toLocaleDateString('ko-KR')}</td><td><StatusBadge status={item.status} /></td></tr>)}</tbody></table></div>}</>}
  </>
}
