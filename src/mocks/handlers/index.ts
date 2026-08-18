import { authHandlers } from './auth'
import { complaintHandlers } from './complaint'
import { publicResponseHandlers } from './publicResponse'
import { officerComplaintHandlers } from './officerComplaint'

export const handlers = [...authHandlers, ...complaintHandlers, ...publicResponseHandlers, ...officerComplaintHandlers]
