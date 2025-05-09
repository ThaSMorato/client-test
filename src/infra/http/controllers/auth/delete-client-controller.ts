import type { Request, Response } from 'express'
import { injectable } from 'inversify'
import { z } from 'zod'

import type { DeleteUserUseCase } from '@/auth/application/use-cases/delete-user-use-case'

import { AdminGuard } from '../../guards/admin-guard'
import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'

const deleteClientSchema = z.object({
  clientId: z.string().uuid(),
})

@injectable()
export class DeleteClientController extends BaseController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {
    super()
  }

  @JwtGuard
  @AdminGuard
  async _handle(request: Request, response: Response) {
    const parsedBody = deleteClientSchema.safeParse(request.params)

    if (!parsedBody.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedBody.error.issues.map((issue) => issue.message),
      })
    }

    const { clientId } = parsedBody.data

    const userResponse = await this.deleteUserUseCase.execute(clientId)

    if (userResponse.isLeft()) {
      return response.status(userResponse.value.code).json({
        message: userResponse.value.message,
        error: userResponse.value.name,
      })
    }

    return response.status(204).send()
  }
}
