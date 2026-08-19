export type DailyStatistic = {
  statisticDate: string
  newReceivedCount: number
  newCompletedCount: number
  receivedStatusCount: number
  assignedStatusCount: number
  inProgressStatusCount: number
  completedStatusCount: number
  deadlineApproachingCount: number
  overdueCount: number
  averageProcessingHours: number
}

export type DailyStatistics = { content: DailyStatistic[] }

export type DailyStatisticsQuery = {
  fromDate: string
  toDate: string
  departmentId?: number
}
