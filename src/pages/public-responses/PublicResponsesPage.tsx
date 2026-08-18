import { Button } from 'krds-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getPublicResponses } from '../../features/public-responses/api'
import type { PublicResponseList, PublicResponseQuery } from '../../features/public-responses/types'
import { FeedbackBanner, FormField, PageHeader } from '../../shared/ui/krds'
import { SelectInput, TextInput } from '../components/FormControls'

export function PublicResponsesPage() {
  const [query, setQuery] = useState<PublicResponseQuery>({})
  const [data, setData] = useState<PublicResponseList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { let active = true; setLoading(true); setError(''); getPublicResponses(query).then((result) => { if (active) setData(result) }).catch(() => { if (active) setError('공개 답변 목록을 불러오지 못했습니다.') }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [query])
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); setQuery({ keyword: String(form.get('keyword') ?? ''), categoryCode: String(form.get('categoryCode') ?? '') || undefined, departmentId: Number(form.get('departmentId')) || undefined }) }

  return (<>
    <PageHeader title="공개 민원 답변" description="완료된 민원의 공식 답변을 확인할 수 있습니다." crumbs={['홈', '공개 민원 답변']} />
    <FeedbackBanner>민원인의 개인정보 보호를 위해 민원 제목만 공개하며 민원 본문은 공개하지 않습니다.</FeedbackBanner>
    <form className="filter-bar public-filter" onSubmit={submit}>
      <FormField id="response-search" label="민원 제목 또는 답변 내용 검색"><TextInput id="response-search" name="keyword" placeholder="검색어를 입력하세요" /></FormField>
      <FormField id="response-category" label="민원 분야">
        <SelectInput id="response-category" name="categoryCode">
          <option value="">전체</option><option value="TRAFFIC">도로·교통</option><option value="ENVIRONMENT">환경</option><option value="WELFARE">복지</option></SelectInput>
      </FormField>
      <FormField id="response-dept" label="답변 부서">
        <SelectInput id="response-dept" name="departmentId">
          <option value="">전체</option>
          <option value="10">교통정책과</option><option value="20">공원관리과</option><option value="30">복지정책과</option></SelectInput>
      </FormField>
      <Button type="submit" disabled={loading}>검색</Button></form>
    {loading && <div className="complaint-loading"><div className="krds-spinner" role="status"><span className="sr-only">로딩 중</span>공개 답변을 불러오는 중입니다.</div></div>}
    {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
    {!loading && !error && data && <><div className="result-summary"><strong>총 {data.totalElements}건</strong><span>최신 답변순</span></div>{data.content.length === 0 ? <FeedbackBanner>검색 조건에 맞는 공개 답변이 없습니다.</FeedbackBanner> : <ul className="response-list">{data.content.map((item) => <li key={item.responseId}><span>{item.categoryName}</span><Link to={`/public-responses/${item.responseId}`}>{item.title}</Link><span>{item.departmentName} · {item.completedAt.replaceAll('-', '.')}</span><strong>{item.statusLabel}</strong></li>)}</ul>}</>}
  </>)
}
