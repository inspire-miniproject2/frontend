import { Button } from 'krds-react'
import { useState } from 'react'
import { useNotifications } from '../../features/notifications/NotificationContext'
import { PageHeader } from '../../shared/ui/krds'

export function NotificationsPage() {
  const { notifications, unreadCount, loading, error, refresh, markAsRead } = useNotifications()
  const [readingId, setReadingId] = useState<number | null>(null)
  const [readError, setReadError] = useState('')

  const read = async (notificationId: number) => {
    setReadingId(notificationId)
    setReadError('')
    try {
      await markAsRead(notificationId)
    } catch (reason) {
      setReadError(reason instanceof Error ? reason.message : '알림을 읽음 처리하지 못했습니다.')
    } finally {
      setReadingId(null)
    }
  }

  return (
      <>
        <PageHeader title="알림" description={`민원 처리 상태와 답변 등록 소식을 확인합니다. 미읽음 ${unreadCount}개`} crumbs={['홈', '알림']} action={<Button variant="secondary" onClick={() => void refresh()} disabled={loading}>새로고침</Button>} />
        {loading && notifications.length === 0 && <p className="notification-page-state" role="status">알림을 불러오는 중입니다.</p>}
        {error && <div className="feedback feedback-error" role="alert">{error}</div>}
        {readError && <div className="feedback feedback-error" role="alert">{readError}</div>}
        {!loading && !error && notifications.length === 0 && <p className="notification-page-state">받은 알림이 없습니다.</p>}
        {notifications.length > 0 && <ul className="notification-list">
          {notifications.map((notification) => <li key={notification.notificationId} className={notification.read ? '' : 'unread'}>
            <div><strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <p className="notification-complaint-number">민원번호 {notification.complaintNo}</p>
              <time dateTime={notification.createdAt}>{formatDateTime(notification.createdAt)}</time>
            </div>
            {!notification.read && <Button variant="secondary" size="small" disabled={readingId === notification.notificationId} onClick={() => void read(notification.notificationId)}>{readingId === notification.notificationId ? '처리 중' : '읽음 처리'}</Button>}
          </li>)}
        </ul>}
      </>)
}

const formatDateTime = (value: string) => new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
