import type { ComplaintCategory } from '../../features/complaint-application/types'

export const complaintCategories: ComplaintCategory[] = [
  { categoryId: 1, categoryName: '도로·교통', categoryCode: 'TRAFFIC' },
  { categoryId: 2, categoryName: '환경', categoryCode: 'ENVIRONMENT' },
  { categoryId: 3, categoryName: '복지', categoryCode: 'WELFARE' },
  { categoryId: 4, categoryName: '건축·주택', categoryCode: 'HOUSING' },
  { categoryId: 5, categoryName: '안전', categoryCode: 'SAFETY' },
]
