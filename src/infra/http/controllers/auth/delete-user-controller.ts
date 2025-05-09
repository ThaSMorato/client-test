import type { Request, Response } from 'express'
import { injectable } from 'inversify'
import { z } from 'zod'

import type { DeleteUserUseCase } from '@/auth/application/use-cases/delete-user-use-case'

import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'

const deleteUserSchema = z.object({
  userId: z.string().uuid(),
})

@injectable()
export class DeleteUserController extends BaseController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {
    super()
  }

  @JwtGuard
  async _handle(request: Request, response: Response) {
    const parsedBody = deleteUserSchema.safeParse(request.body)

    if (!parsedBody.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedBody.error.issues.map((issue) => issue.message),
      })
    }

    const { userId } = parsedBody.data

    const userResponse = await this.deleteUserUseCase.execute(userId)

    if (userResponse.isLeft()) {
      return response.status(userResponse.value.code).json({
        message: userResponse.value.message,
        error: userResponse.value.name,
      })
    }

    return response.status(204).send()
  }
}
