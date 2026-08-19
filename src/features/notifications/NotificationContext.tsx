import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuthSession } from '../auth/useAuthSession'
import { getNotifications, markNotificationAsRead } from './api'
import type { NotificationItem, NotificationList } from './types'

type NotificationContextValue = {
  notifications: NotificationItem[]
  unreadCount: number
  loading: boolean
  error: string
  refresh: () => Promise<void>
  markAsRead: (notificationId: number) => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)
const emptyList: NotificationList = { unreadCount: 0, content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 }

export function NotificationProvider({ children }: { children: ReactNode }) {
  const session = useAuthSession()
  const userId = session?.user.userId
  const [data, setData] = useState<NotificationList>(emptyList)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!userId) {
      setData(emptyList)
      setError('')
      return
    }
    setLoading(true)
    try {
      setData(await getNotifications({ page: 0, size: 20 }))
      setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '알림 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void refresh()
    if (!userId) return

    const intervalId = window.setInterval(() => void refresh(), 10_000)
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') void refresh() }
    document.addEventListener('visibilitychange', refreshWhenVisible)
    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [refresh, userId])

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const updated = await markNotificationAsRead(notificationId)
      setData((current) => ({
        ...current,
        unreadCount: Math.max(0, current.unreadCount - (current.content.some((item) => item.notificationId === notificationId && !item.read) ? 1 : 0)),
        content: current.content.map((item) => item.notificationId === notificationId ? updated : item),
      }))
      setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '알림을 읽음 처리하지 못했습니다.')
      throw reason
    }
  }, [])

  const value = useMemo(() => ({ notifications: data.content, unreadCount: data.unreadCount, loading, error, refresh, markAsRead }), [data, loading, error, refresh, markAsRead])
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within NotificationProvider')
  return context
}
