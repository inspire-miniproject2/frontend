import { useEffect, useState } from 'react'
import { ApiError } from '../../shared/api/contracts'
import { getComplaintCategories } from './api'
import type { ComplaintCategory } from './types'

export function useComplaintCategories(activeOnly = true) {
  const [categories, setCategories] = useState<ComplaintCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoryError, setCategoryError] = useState('')

  useEffect(() => {
    let active = true
    setCategoriesLoading(true)
    setCategoryError('')
    getComplaintCategories(activeOnly)
      .then((result) => { if (active) setCategories(result) })
      .catch((reason) => {
        if (active) setCategoryError(reason instanceof ApiError ? reason.message : '민원 분야 목록을 불러오지 못했습니다.')
      })
      .finally(() => { if (active) setCategoriesLoading(false) })
    return () => { active = false }
  }, [activeOnly])

  return { categories, categoriesLoading, categoryError }
}