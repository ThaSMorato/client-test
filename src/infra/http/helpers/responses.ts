import type { Response } from 'express'

export function unauthorizedResponse(response: Response) {
  return response.status(401).json({
    message: 'Unauthorized',
    error: 'UnauthorizedError',
  })
}
