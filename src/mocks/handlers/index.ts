import { authHandlers } from './auth'
import { complaintHandlers } from './complaint'
import { publicResponseHandlers } from './publicResponse'

export const handlers = [...authHandlers, ...complaintHandlers, ...publicResponseHandlers]
