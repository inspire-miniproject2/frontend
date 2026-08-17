import { Button } from 'krds-react'
import { PageHeader } from '../../shared/ui/krds'

export function NotificationsPage() {
  return (
      <>
        <PageHeader title="알림" description="민원 처리 상태와 답변 등록 소식을 확인합니다." crumbs={['홈', '알림']} />
        <ul className="notification-list">
          <li className="unread">
            <div><strong>민원 상태가 ‘완료’로 변경되었습니다.</strong>
              <p>어린이보호구역 신호시간 조정 요청</p>
              <time>방금 전</time>
            </div>
            <Button variant="secondary" size="small">읽음 처리</Button>
          </li>
          <li className="unread">
            <div><strong>민원이 교통정책과에 배정되었습니다.</strong>
              <p>어린이보호구역 신호시간 조정 요청</p>
              <time>5분 전</time>
            </div>
            <Button variant="secondary" size="small">읽음 처리</Button>
          </li>
          <li>
            <div><strong>공식 답변이 등록되었습니다.</strong>
              <p>공원 쓰레기 수거 일정 개선 요청</p>
              <time>2026.08.11</time>
            </div>
          </li>
        </ul></>)
}
