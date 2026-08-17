import { Button } from 'krds-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../shared/ui/krds'

export function NotFoundPage() {
  return <><PageHeader title="페이지를 찾을 수 없습니다" description="주소가 변경되었거나 요청한 페이지가 존재하지 않습니다." crumbs={['홈', '오류']} /><Button as={Link} to="/my/complaints">내 민원으로 이동</Button></>
}
