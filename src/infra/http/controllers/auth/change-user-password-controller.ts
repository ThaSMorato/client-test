import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { ChangeUserPasswordUseCase } from '@/auth/application/use-cases/change-user-password-use-case'
import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'

const changeUserPasswordSchema = z.object({
  password: z.string().min(8),
  userId: z.string().uuid(),
})

/**
 * @swagger
 * /change-password:
 *   patch:
 *     tags:
 *       - Auth
 *     summary: Altera a senha do usuário
 *     description: Endpoint para alteração de senha do usuário logado
 *     security:
 *       - jwt: []
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
 */
@injectable()
export class ChangeUserPasswordController extends BaseController {
  constructor(
    @inject(AUTH_SYMBOLS.ChangeUserPasswordUseCase)
    private readonly changeUserPasswordUseCase: ChangeUserPasswordUseCase,
  ) {
    super()
  }

  @JwtGuard
  async _handle(request: Request, response: Response) {
    const parsedBody = changeUserPasswordSchema.safeParse(request.body)

    if (!parsedBody.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedBody.error.issues.map((issue) => issue.message),
      })
    }

    const { password, userId } = parsedBody.data

    const userResponse = await this.changeUserPasswordUseCase.execute({
      password,
      id: userId,
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
