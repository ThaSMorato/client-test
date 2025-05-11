import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { FindClientByIdUseCase } from '@/client/application/use-cases/find-client-by-id-use-case'
import { CLIENT_SYMBOLS } from '@/infra/container/client/symbols'

import { ClientGuard } from '../../guards/client-guard'
import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'
import { FetchClientByIdPresenter } from './presenters/fetch-client-by-id-presenter'

const fetchProfileSchema = z.object({
  userId: z.string().uuid(),
})

/**
 * @swagger
 * /profile:
 *   get:
 *     tags:
 *       - Client
 *     summary: Busca o perfil do usuário logado
 *     description: Endpoint para buscar dados do próprio perfil
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Perfil encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/Client'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
@injectable()
export class FetchProfileController extends BaseController {
  constructor(
    @inject(CLIENT_SYMBOLS.FindClientByIdUseCase)
    private readonly findClientByIdUseCase: FindClientByIdUseCase,
  ) {
    super()
  }

  @JwtGuard
  @ClientGuard
  async _handle(request: Request, response: Response) {
    const parsedQuery = fetchProfileSchema.safeParse(request.body)

    if (!parsedQuery.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedQuery.error.issues.map((issue) => issue.message),
      })
    }

    const clientResponse = await this.findClientByIdUseCase.execute(
      parsedQuery.data.userId,
    )

    if (clientResponse.isLeft()) {
      return response.status(clientResponse.value.code).json({
        message: clientResponse.value.message,
        error: clientResponse.value.name,
      })
    }

    const client = clientResponse.value

    return response
      .status(200)
      .json({ profile: FetchClientByIdPresenter.toHttp(client) })
  }
}
