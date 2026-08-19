export type PublicResponseQuery = { keyword?: string; categoryCode?: string; completedFrom?: string; completedTo?: string }
export type PublicResponseListItem = { responseId: number; title: string; departmentName: string; completedAt: string; statusLabel: '답변 완료' }
export type PublicResponseList = { content: PublicResponseListItem[] }
export type PublicResponseDetail = { caseTitle: string; categoryName: string; appliedDate: string; departmentName: string; completedAt: string; responseContent: string; attachments: Array<{ attachmentId: number; originalFilename: string }> }
