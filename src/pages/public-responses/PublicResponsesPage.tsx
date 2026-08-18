import { Button } from 'krds-react'
import { Link } from 'react-router-dom'
import { responses } from '../../data/mock'
import { FeedbackBanner, FormField, PageHeader, Pagination } from '../../shared/ui/krds'
import { SelectInput, TextInput } from '../components/FormControls'

export function PublicResponsesPage() {
  return <><PageHeader title="공개 민원 답변" description="완료된 민원의 공식 답변을 확인할 수 있습니다." crumbs={['홈', '공개 민원 답변']} /><FeedbackBanner>민원인의 개인정보 보호를 위해 민원 제목만 공개하며 민원 본문은 공개하지 않습니다.</FeedbackBanner><form className="filter-bar public-filter" onSubmit={e => e.preventDefault()}><FormField id="response-search" label="민원 제목 또는 답변 내용 검색"><TextInput id="response-search" /></FormField><FormField id="response-category" label="민원 분야"><SelectInput id="response-category"><option>전체</option><option>도로·교통</option></SelectInput></FormField><FormField id="response-dept" label="답변 부서"><SelectInput id="response-dept"><option>전체</option><option>교통정책과</option></SelectInput></FormField><Button type="submit">검색</Button></form><div className="result-summary"><strong>총 128건</strong><span>최신 답변순</span></div><ul className="response-list">{responses.map(item => <li key={item.id}><span>{item.category}</span><Link to={`/public-responses/${item.id}`}>{item.title}</Link><span>{item.department} · {item.date}</span><strong>답변 완료</strong></li>)}</ul><Pagination /></>
}
