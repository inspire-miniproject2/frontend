import type { ComplaintStatus } from '../shared/ui/krds'
export const complaints: Array<{ id: string; category: string; title: string; date: string; status: ComplaintStatus; officer: string }> = [
  { id: 'CIV-2026-000184', category: '도로·교통', title: '어린이보호구역 신호시간 조정 요청', date: '2026.08.14', status: 'RECEIVED', officer: '김담당' },
  { id: 'CIV-2026-000172', category: '환경', title: '공원 쓰레기 수거 일정 개선 요청', date: '2026.08.09', status: 'IN_PROGRESS', officer: '이담당' },
  { id: 'CIV-2026-000166', category: '복지', title: '청년 주거지원 신청 기준 문의', date: '2026.08.05', status: 'COMPLETED', officer: '박담당' },
]
export const responses = [
  { id: '184', category: '도로·교통', title: '어린이보호구역 신호시간 조정 요청 처리 결과', department: '교통정책과', date: '2026.08.13' },
  { id: '172', category: '환경', title: '공원 쓰레기 수거 일정 개선 관련 공식 답변', department: '공원관리과', date: '2026.08.11' },
  { id: '166', category: '복지', title: '청년 주거지원 신청 기준 안내', department: '복지정책과', date: '2026.08.08' },
]
