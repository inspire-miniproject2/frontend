import { Button } from 'krds-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { getDailyStatistics } from '../../features/statistics/api'
import type { DailyStatistic, DailyStatistics, DailyStatisticsQuery } from '../../features/statistics/types'
import { ApiError } from '../../shared/api/contracts'
import { FeedbackBanner, FormField, MetricCard, PageHeader } from '../../shared/ui/krds'
import { SelectInput, TextInput } from '../components/FormControls'

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const today = new Date()
const initialQuery: DailyStatisticsQuery = {
  fromDate: toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1)),
  toDate: toDateInputValue(today),
}
const departments = [{ id: 10, name: '교통정책과' }, { id: 20, name: '도로관리과' }]
const numberFormat = new Intl.NumberFormat('ko-KR')
const dateFormat = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' })

export function AdminStatisticsPage() {
  const [query, setQuery] = useState<DailyStatisticsQuery>(initialQuery)
  const [data, setData] = useState<DailyStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getDailyStatistics(query)
      .then((result) => { if (active) setData(result) })
      .catch((reason) => { if (active) setError(reason instanceof ApiError ? reason.message : '일별 통계를 불러오지 못했습니다.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [query])

  const content = data?.content ?? []
  const summary = useMemo(() => summarize(content), [content])
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const fromDate = String(form.get('fromDate') ?? '')
    const toDate = String(form.get('toDate') ?? '')
    if (!fromDate || !toDate) {
      setValidationError('조회 시작일과 종료일을 모두 입력해 주세요.')
      return
    }
    if (fromDate > toDate) {
      setValidationError('조회 시작일은 종료일보다 늦을 수 없습니다.')
      return
    }
    const department = String(form.get('departmentId') ?? '')
    setValidationError('')
    setQuery({ fromDate, toDate, departmentId: department ? Number(department) : undefined })
  }

  const latest = summary.latest
  const maxStatusCount = latest ? Math.max(1, latest.receivedStatusCount, latest.assignedStatusCount, latest.inProgressStatusCount, latest.completedStatusCount) : 1
  const departmentLabel = query.departmentId ? departments.find((item) => item.id === query.departmentId)?.name ?? `부서 ${query.departmentId}` : '전체 부서'

  return <>
    <PageHeader title="민원처리 현황" description="Kafka 이벤트를 기반으로 집계된 일별 민원 처리 통계입니다." crumbs={['홈', '민원처리 현황']} />
    <form className="filter-bar stats-filter" onSubmit={submit}>
      <FormField id="fromDate" label="조회 시작일" required><TextInput id="fromDate" name="fromDate" type="date" defaultValue={query.fromDate} required /></FormField>
      <FormField id="toDate" label="조회 종료일" required><TextInput id="toDate" name="toDate" type="date" defaultValue={query.toDate} required /></FormField>
      <FormField id="departmentId" label="기관/부서"><SelectInput id="departmentId" name="departmentId" defaultValue={query.departmentId ?? ''}><option value="">전체 부서</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</SelectInput></FormField>
      <Button type="submit" disabled={loading}>조회</Button>
    </form>
    {validationError && <FeedbackBanner tone="error">{validationError}</FeedbackBanner>}
    {loading && <div className="complaint-loading"><div className="krds-spinner" role="status"><span className="sr-only">로딩 중</span>통계를 불러오는 중입니다.</div></div>}
    {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}
    {!loading && !error && data && content.length === 0 && <FeedbackBanner>선택한 기간과 부서에 집계된 통계가 없습니다.</FeedbackBanner>}
    {!loading && !error && latest && <>
      <p className="statistics-scope"><strong>{departmentLabel}</strong> · {formatDate(query.fromDate)}부터 {formatDate(query.toDate)}까지 · 최신 집계일 {formatDate(latest.statisticDate)}</p>
      <div className="metric-grid">
        <MetricCard label="기간 신규 접수" value={`${numberFormat.format(summary.newReceived)}건`} caption={`${content.length}일 집계 합계`} />
        <MetricCard label="기간 신규 완료" value={`${numberFormat.format(summary.newCompleted)}건`} caption={`${content.length}일 집계 합계`} />
        <MetricCard label="최신일 처리 대기·진행" value={`${numberFormat.format(summary.active)}건`} caption="접수·배정·처리 중 합계" />
        <MetricCard label="평균 처리시간" value={`${summary.averageHours.toFixed(1)}시간`} caption="완료 건수 가중 평균" />
      </div>
      <div className="chart-grid">
        <section className="chart-card"><h2>최신일 상태별 현황</h2><p>{formatDate(latest.statisticDate)} 기준이며 색상 외에 상태명과 건수를 함께 표시합니다.</p><div className="bar-chart" role="img" aria-label={statusAriaLabel(latest)}>
          <span style={{ width: percent(latest.completedStatusCount, maxStatusCount) }}>완료 {numberFormat.format(latest.completedStatusCount)}</span>
          <span style={{ width: percent(latest.inProgressStatusCount, maxStatusCount) }}>처리 중 {numberFormat.format(latest.inProgressStatusCount)}</span>
          <span style={{ width: percent(latest.assignedStatusCount, maxStatusCount) }}>배정 {numberFormat.format(latest.assignedStatusCount)}</span>
          <span style={{ width: percent(latest.receivedStatusCount, maxStatusCount) }}>접수 {numberFormat.format(latest.receivedStatusCount)}</span>
        </div></section>
        <section className="chart-card"><h2>처리기한 현황</h2><dl className="definition-list"><div><dt>기한 임박</dt><dd>{numberFormat.format(latest.deadlineApproachingCount)}건</dd></div><div><dt>기한 초과</dt><dd>{numberFormat.format(latest.overdueCount)}건</dd></div><div><dt>신규 완료</dt><dd>{numberFormat.format(latest.newCompletedCount)}건</dd></div><div><dt>평균 처리시간</dt><dd>{Number(latest.averageProcessingHours).toFixed(1)}시간</dd></div></dl></section>
      </div>
      <section className="table-section"><h2>일별 처리 현황</h2><div className="table-scroll" tabIndex={0} aria-label="일별 처리 통계 표, 가로로 스크롤할 수 있습니다"><table><caption className="sr-only">선택 기간의 일별 민원 처리 통계</caption><thead><tr><th>기준일</th><th>신규 접수</th><th>신규 완료</th><th>접수 상태</th><th>배정 상태</th><th>처리 중</th><th>완료 상태</th><th>기한 임박</th><th>기한 초과</th><th>평균 처리시간</th></tr></thead><tbody>{[...content].reverse().map((item) => <tr key={item.statisticDate}><th scope="row">{formatDate(item.statisticDate)}</th><td>{numberFormat.format(item.newReceivedCount)}</td><td>{numberFormat.format(item.newCompletedCount)}</td><td>{numberFormat.format(item.receivedStatusCount)}</td><td>{numberFormat.format(item.assignedStatusCount)}</td><td>{numberFormat.format(item.inProgressStatusCount)}</td><td>{numberFormat.format(item.completedStatusCount)}</td><td>{numberFormat.format(item.deadlineApproachingCount)}</td><td>{numberFormat.format(item.overdueCount)}</td><td>{Number(item.averageProcessingHours).toFixed(1)}시간</td></tr>)}</tbody></table></div></section>
    </>}
  </>
}

function summarize(content: DailyStatistic[]) {
  const latest = content.at(-1) ?? null
  const newReceived = content.reduce((sum, item) => sum + item.newReceivedCount, 0)
  const newCompleted = content.reduce((sum, item) => sum + item.newCompletedCount, 0)
  const processingHours = content.reduce((sum, item) => sum + Number(item.averageProcessingHours) * item.newCompletedCount, 0)
  return { latest, newReceived, newCompleted, active: latest ? latest.receivedStatusCount + latest.assignedStatusCount + latest.inProgressStatusCount : 0, averageHours: newCompleted > 0 ? processingHours / newCompleted : 0 }
}

const formatDate = (value: string) => dateFormat.format(new Date(`${value}T00:00:00`))
const percent = (value: number, max: number) => `${Math.max(18, Math.round((value / max) * 100))}%`
const statusAriaLabel = (item: DailyStatistic) => `완료 ${item.completedStatusCount}건, 처리 중 ${item.inProgressStatusCount}건, 배정 ${item.assignedStatusCount}건, 접수 ${item.receivedStatusCount}건`
