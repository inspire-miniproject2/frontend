import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type ComplaintStatus = 'RECEIVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
const labels: Record<ComplaintStatus, string> = { RECEIVED: '접수됨', ASSIGNED: '배정됨', IN_PROGRESS: '처리 중', COMPLETED: '완료' }

export function PageHeader({ title, description, action, crumbs = ['홈'] }: { title: string; description?: string; action?: ReactNode; crumbs?: string[] }) {
  return (
      <header className="page-header">
        <nav className="breadcrumb" aria-label="현재 위치">{crumbs.map((crumb, i) => <span key={crumb}>{i > 0 && ' / '}{crumb}</span>)}</nav>
        <div className="page-title-row">
          <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>{action}
        </div>
      </header>)
}
export function StatusBadge({ status }: { status: ComplaintStatus }) { return <span className={`status-badge status-${status.toLowerCase()}`}>{labels[status]}</span> }
export function FeedbackBanner({ tone = 'info', title, children }: { tone?: 'info' | 'warning' | 'success' | 'error'; title?: string; children: ReactNode }) { return <div className={`feedback feedback-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{title && <strong>{title}</strong>}<div>{children}</div></div> }
export function FormField({ id, label, required, hint, error, children }: { id: string; label: string; required?: boolean; hint?: string; error?: string; children: ReactNode }) { return <div className={`form-field ${error ? 'has-error' : ''}`}><label htmlFor={id}>{label} {required ? <span className="required">* 필수</span> : <span className="optional">선택</span>}</label>{hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}{children}{error && <p id={`${id}-error`} className="field-error">{error}</p>}</div> }
export function StatusStepper({ current, mode = 'application' }: { current: number; mode?: 'application' | 'process' }) { const steps = mode === 'application' ? ['신청서 작성', '내용 확인', '접수 완료'] : ['접수', '부서 배정', '담당자 지정', '처리 중', '완료']; return <ol className="status-stepper" aria-label="진행 단계">{steps.map((step, i) => { const state = i < current ? '완료' : i === current ? '현재' : '예정'; return <li className={state === '현재' ? 'current' : state === '완료' ? 'complete' : ''} key={step}><span className="step-marker" aria-hidden="true">{i < current ? '✓' : i + 1}</span><span><small>{state}</small><strong>{step}</strong></span></li> })}</ol> }
export function Pagination() { return <nav className="pagination" aria-label="페이지 탐색"><button type="button" disabled>이전</button><a aria-current="page" href="#page-1">1</a><a href="#page-2">2</a><a href="#page-3">3</a><span>…</span><a href="#page-12">12</a><button type="button">다음</button></nav> }
export function MetricCard({ label, value, caption }: { label: string; value: string; caption: string }) { return <article className="metric-card"><h3>{label}</h3><strong>{value}</strong><p>{caption}</p></article> }
export function BackLink({ to, children = '목록으로' }: { to: string; children?: ReactNode }) { return <Link className="back-link" to={to}>← {children}</Link> }
