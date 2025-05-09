import type { Request, Response } from 'express'

import type { UserDAO } from '@/common/data/user-dao.interface'
import { diContainer } from '@/infra/container'
import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

import { unauthorizedResponse } from '../helpers/responses'

export function AdminGuard(
  _: unknown,
  __: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (request: Request, response: Response) {
    const userId = request.body.userId

    if (!userId) {
      return unauthorizedResponse(response)
    }

    try {
      const userDao = diContainer.get<UserDAO>(AUTH_SYMBOLS.UserDAO)

      const adminExists = await userDao.doesAdminExist(userId)

      if (!adminExists) {
        return unauthorizedResponse(response)
      }

      return originalMethod.apply(this, [request, response])
    } catch (error) {
      console.error('Error during admin verification:', error)
      return unauthorizedResponse(response)
    }
  }

  return descriptor
}
