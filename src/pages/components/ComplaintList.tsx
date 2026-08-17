import { Button } from 'krds-react'
import { Link } from 'react-router-dom'
import { complaints } from '../../data/mock'
import { FormField, StatusBadge } from '../../shared/ui/krds'
import { SelectInput, TextInput } from './FormControls'

export function ComplaintFilter({ officer = false }: { officer?: boolean }) {
  return <form className="filter-bar" onSubmit={(event) => event.preventDefault()}>
    <FormField id="keyword" label={officer ? '민원번호 또는 민원 제목' : '민원 제목 또는 민원번호'}><TextInput id="keyword" placeholder="검색어를 입력하세요" /></FormField>
    <FormField id="category" label="민원 분야"><SelectInput id="category"><option>전체</option><option>도로·교통</option><option>환경</option><option>복지</option></SelectInput></FormField>
    <FormField id="status" label="처리 상태"><SelectInput id="status"><option>전체</option><option>접수됨</option><option>배정됨</option><option>처리 중</option><option>완료</option></SelectInput></FormField>
    <Button type="submit">검색</Button>
  </form>
}

export function ComplaintTable({ officer = false }: { officer?: boolean }) {
  return <div className="table-scroll" tabIndex={0} aria-label="민원 목록 표, 가로로 스크롤할 수 있습니다"><table><caption className="sr-only">민원 목록</caption><thead><tr><th scope="col">민원번호</th><th scope="col">분야</th><th scope="col">민원 제목</th>{officer && <th scope="col">담당자</th>}<th scope="col">접수일</th><th scope="col">상태</th></tr></thead><tbody>{complaints.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.category}</td><th scope="row"><Link to={officer ? `/officer/complaints/${item.id}` : `/my/complaints/${item.id}`}>{item.title}</Link></th>{officer && <td>{item.officer}</td>}<td>{item.date}</td><td><StatusBadge status={item.status} /></td></tr>)}</tbody></table></div>
}
