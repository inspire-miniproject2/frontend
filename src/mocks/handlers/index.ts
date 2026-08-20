import { authHandlers } from './auth'
import { complaintHandlers } from './complaint'
import { publicResponseHandlers } from './publicResponse'
import { officerComplaintHandlers } from './officerComplaint'
import { departmentHandlers } from './department'

export const handlers = [...authHandlers, ...complaintHandlers, ...publicResponseHandlers, ...officerComplaintHandlers, ...departmentHandlers]
