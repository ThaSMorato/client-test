import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { FindClientByIdUseCase } from '@/client/application/use-cases/find-client-by-id-use-case'
import { CLIENT_SYMBOLS } from '@/infra/container/client/symbols'

import { AdminGuard } from '../../guards/admin-guard'
import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'
import { FetchClientByIdPresenter } from './presenters/fetch-client-by-id-presenter'

const fetchClientByIdSchema = z.object({
  clientId: z.string().uuid(),
})

/**
 * @swagger
 * /client/{clientId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Busca um cliente por ID
 *     description: Endpoint para buscar dados de um cliente específico (apenas admin)
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
 *       200:
 *         description: Cliente encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   $ref: '#/components/schemas/Client'
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
export class FetchClientByIdController extends BaseController {
  constructor(
    @inject(CLIENT_SYMBOLS.FindClientByIdUseCase)
    private readonly findClientByIdUseCase: FindClientByIdUseCase,
  ) {
    super()
  }

  @JwtGuard
  @AdminGuard
  async _handle(request: Request, response: Response) {
    const parsedQuery = fetchClientByIdSchema.safeParse(request.params)

    if (!parsedQuery.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedQuery.error.issues.map((issue) => issue.message),
      })
    }

    const clientResponse = await this.findClientByIdUseCase.execute(
      parsedQuery.data.clientId,
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
      .json({ client: FetchClientByIdPresenter.toHttp(client) })
  }
}
