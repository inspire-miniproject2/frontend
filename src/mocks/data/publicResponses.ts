import type { PublicResponseDetail, PublicResponseListItem } from '../../features/public-responses/types'

export const publicResponseDetails: PublicResponseDetail[] = [
  { responseId: 7001, caseTitle: '어린이보호구역 신호시간 조정 요청', categoryName: '도로·교통', appliedDate: '2026-08-01', departmentName: '교통정책과', completedAt: '2026-08-13', responseContent: '현장 교통량과 보행량 조사를 실시한 결과, 등교 시간대 보행 신호를 8초 연장하기로 결정했습니다. 2026년 8월 20일부터 변경된 신호체계를 적용하고 이후 교통 흐름과 안전성을 점검하겠습니다.', attachments: [{ attachmentId: 8201, originalFilename: '교통량조사결과.pdf' }] },
  { responseId: 7002, caseTitle: '공원 쓰레기 수거 일정 개선 요청', categoryName: '환경', appliedDate: '2026-08-03', departmentName: '공원관리과', completedAt: '2026-08-11', responseContent: '주말 이용객이 많은 공원의 수거 횟수를 확대하고 월요일 오전 집중 수거를 시행하겠습니다.', attachments: [] },
  { responseId: 7003, caseTitle: '청년 주거지원 신청 기준 문의', categoryName: '복지', appliedDate: '2026-08-02', departmentName: '복지정책과', completedAt: '2026-08-08', responseContent: '청년 주거지원의 소득 기준과 제출 서류는 해당 연도 사업 공고를 기준으로 적용됩니다.', attachments: [{ attachmentId: 8203, originalFilename: '청년주거지원안내.pdf' }] },
]
const meta = [{ categoryCode: 'TRAFFIC', departmentId: 10 }, { categoryCode: 'ENVIRONMENT', departmentId: 20 }, { categoryCode: 'WELFARE', departmentId: 30 }]
export const publicResponses: PublicResponseListItem[] = publicResponseDetails.map((item, index) => ({ responseId: item.responseId, categoryCode: meta[index].categoryCode, categoryName: item.categoryName, title: item.caseTitle, departmentId: meta[index].departmentId, departmentName: item.departmentName, completedAt: item.completedAt, statusLabel: '답변 완료' }))
