import type { Request, Response } from 'express'

import type { UserDAO } from '@/common/data/user-dao.interface'
import { JwtToken } from '@/common/value-objects/jwt-token'
import { diContainer } from '@/infra/container'
import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

import { unauthorizedResponse } from '../helpers/responses'

export function JwtGuard(
  _: unknown,
  __: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (request: Request, response: Response) {
    const jwt = request.cookies[JwtToken.jwtCookieName]

    if (!jwt) {
      return unauthorizedResponse(response)
    }

    try {
      const jwtInstance = JwtToken.hydrate({ token: jwt })

      const userDao = diContainer.get<UserDAO>(AUTH_SYMBOLS.UserDAO)

      const userExists = await userDao.doesUserExist(jwtInstance.subject)

      if (!userExists) {
        return unauthorizedResponse(response)
      }

      const body = {
        ...request.body,
        userId: jwtInstance.subject,
      }

      request.body = body

      return originalMethod.apply(this, [request, response])
    } catch (error) {
      console.error('Authentication error:', error)
      return unauthorizedResponse(response)
    }
  }

  return descriptor
}
