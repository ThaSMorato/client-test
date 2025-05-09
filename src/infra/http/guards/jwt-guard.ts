import type { Request, Response } from 'express'

import type { UserDAO } from '@/common/data/user-dao.interface'
import { JwtToken } from '@/common/value-objects/jwt-token'
import { diContainer } from '@/infra/container'
import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

export function JwtGuard(
  _: unknown,
  __: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (request: Request, response: Response) {
    const jwt = request.cookies[JwtToken.jwtCookieName]

    if (!jwt) {
      return response.status(401).json({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    }

    try {
      const jwtInstance = JwtToken.hydrate({ token: jwt })

      const userDao = diContainer.get<UserDAO>(AUTH_SYMBOLS.UserDAO)

      const userExists = await userDao.doesUserExist(jwtInstance.subject)

      if (!userExists) {
        return response.status(401).json({
          message: 'Unauthorized',
          error: 'UnauthorizedError',
        })
      }

      request.body.userId = jwtInstance.subject

      return originalMethod.apply(this, [request, response])
    } catch (error) {
      console.error('Authentication error:', error);
      return response.status(401).json({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    }
  }

  return descriptor
}
