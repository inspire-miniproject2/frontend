export type NotificationType = 'ASSIGNED' | 'STATUS_CHANGED' | 'RESPONSE_REGISTERED'

export type NotificationItem = {
  notificationId: number
  complaintId: number
  complaintNo: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  readAt: string | null
}

export type NotificationList = {
  unreadCount: number
  content: NotificationItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type NotificationQuery = {
  page?: number
  size?: number
  isRead?: boolean
}
