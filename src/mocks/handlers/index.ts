import { authHandlers } from './auth'
import { complaintHandlers } from './complaint'

export const handlers = [...authHandlers, ...complaintHandlers]
