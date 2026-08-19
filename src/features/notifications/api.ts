import { apiClient } from '../../shared/api/client'
import type { NotificationItem, NotificationList, NotificationQuery } from './types'

export function getNotifications(query: NotificationQuery = {}) {
  const params = new URLSearchParams({
    page: String(query.page ?? 0),
    size: String(query.size ?? 20),
  })
  if (query.isRead !== undefined) params.set('isRead', String(query.isRead))
  return apiClient.get<NotificationList>(`/notifications?${params}`)
}

export function markNotificationAsRead(notificationId: number) {
  return apiClient.patch<NotificationItem>(`/notifications/${notificationId}/read`, {})
}
