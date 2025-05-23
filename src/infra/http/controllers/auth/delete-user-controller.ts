import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { DeleteUserUseCase } from '@/auth/application/use-cases/delete-user-use-case'
import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'

const deleteUserSchema = z.object({
  userId: z.string().uuid(),
})

/**
 * @swagger
 * /profile:
 *   delete:
 *     tags:
 *       - Auth
 *     summary: Deleta o usuário logado
 *     description: Endpoint para deletar o próprio usuário
 *     security:
 *       - jwt: []
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
@injectable()
export class DeleteUserController extends BaseController {
  constructor(
    @inject(AUTH_SYMBOLS.DeleteUserUseCase)
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {
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
