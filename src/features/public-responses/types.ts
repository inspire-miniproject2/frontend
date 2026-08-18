export type PublicResponseQuery = { keyword?: string; categoryCode?: string; departmentId?: number; completedFrom?: string; completedTo?: string }
export type PublicResponseListItem = { responseId: number; categoryCode: string; categoryName: string; title: string; departmentId: number; departmentName: string; completedAt: string; statusLabel: '답변 완료' }
export type PublicResponseList = { content: PublicResponseListItem[]; totalElements: number }
export type PublicResponseDetail = { responseId: number; caseTitle: string; categoryName: string; appliedDate: string; departmentName: string; completedAt: string; responseContent: string; attachments: Array<{ attachmentId: number; originalFilename: string }> }
