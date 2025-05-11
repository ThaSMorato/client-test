import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { DeleteUserUseCase } from '@/auth/application/use-cases/delete-user-use-case'
import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

import { AdminGuard } from '../../guards/admin-guard'
import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'

const deleteClientSchema = z.object({
  clientId: z.string().uuid(),
})

/**
 * @swagger
 * /client/{clientId}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Deleta um cliente
 *     description: Endpoint para deletar um cliente (apenas admin)
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       204:
 *         description: Cliente deletado com sucesso
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
@injectable()
export class DeleteClientController extends BaseController {
  constructor(
    @inject(AUTH_SYMBOLS.DeleteUserUseCase)
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {
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
