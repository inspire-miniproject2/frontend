import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import type { ComplaintCreateResult, ComplaintDraft } from './types'

const initialDraft: ComplaintDraft = { categoryId: null, categoryName: '', title: '', content: '', attachmentFiles: [], notifyChannels: ['EMAIL'] }

type ComplaintApplicationState = {
  draft: ComplaintDraft
  setDraft: (draft: ComplaintDraft) => void
  result: ComplaintCreateResult | null
  setResult: (result: ComplaintCreateResult | null) => void
  reset: () => void
}

const Context = createContext<ComplaintApplicationState | null>(null)

export function ComplaintApplicationProvider({ children }: { children?: ReactNode }) {
  const [draft, setDraft] = useState(initialDraft)
  const [result, setResult] = useState<ComplaintCreateResult | null>(null)
  const value = useMemo(() => ({ draft, setDraft, result, setResult, reset: () => { setDraft(initialDraft); setResult(null) } }), [draft, result])
  return <Context.Provider value={value}>{children ?? <Outlet />}</Context.Provider>
}

export function useComplaintApplication() {
  const value = useContext(Context)
  if (!value) throw new Error('useComplaintApplication must be used within ComplaintApplicationProvider')
  return value
}
