import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { ChangeUserPasswordUseCase } from '@/auth/application/use-cases/change-user-password-use-case'
import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

import { AdminGuard } from '../../guards/admin-guard'
import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'

const changeUserPasswordSchema = z.object({
  password: z.string().min(8),
  clientId: z.string().uuid(),
})

/**
 * @swagger
 * /client/{clientId}/change-password:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Altera a senha de um cliente
 *     description: Endpoint para alteração de senha de um cliente (apenas admin)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: novaSenha123
 *     responses:
 *       204:
 *         description: Senha alterada com sucesso
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
export class ChangeClientPasswordController extends BaseController {
  constructor(
    @inject(AUTH_SYMBOLS.ChangeUserPasswordUseCase)
    private readonly changeUserPasswordUseCase: ChangeUserPasswordUseCase,
  ) {
    super()
  }

  @JwtGuard
  @AdminGuard
  async _handle(request: Request, response: Response) {
    const { clientId } = request.params
    const { password } = request.body

    const parsedBody = changeUserPasswordSchema.safeParse({
      password,
      clientId,
    })

    if (!parsedBody.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedBody.error.issues.map((issue) => issue.message),
      })
    }

    const userResponse = await this.changeUserPasswordUseCase.execute({
      password: parsedBody.data.password,
      id: parsedBody.data.clientId,
    })

    if (userResponse.isLeft()) {
      return response.status(userResponse.value.code).json({
        message: userResponse.value.message,
        error: userResponse.value.name,
      })
    }

    return response.status(204).send()
  }
}
