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
    const parsedQuery = fetchClientByIdSchema.safeParse(request.body)

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
