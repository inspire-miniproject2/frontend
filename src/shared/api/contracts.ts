export type ApiSuccess<T> = {
  success: true
  data: T
  message: string
}

export type ApiFailure = {
  success: false
  error: { code: string; message: string; details: unknown | null }
  requestId: string
}

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly body: ApiFailure) {
    super(body.error.message)
  }
}
