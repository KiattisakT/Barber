import type { ErrorRequestHandler } from 'express'

type HttpError = Error & {
  statusCode?: number
  code?: string
  details?: unknown
}

export const errorHandler: ErrorRequestHandler = (error: HttpError, _request, response, _next) => {
  const statusCode = error.statusCode ?? 500
  const code = error.code ?? (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR')

  response.status(statusCode).json({
    error: {
      code,
      message: error.message || 'Unexpected server error',
      ...(error.details ? { details: error.details } : {}),
    },
  })
}
