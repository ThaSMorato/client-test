import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { EditClientDataUseCase } from '@/client/application/use-cases/edit-client-data-use-case'
import { CLIENT_SYMBOLS } from '@/infra/container/client/symbols'

import { ClientGuard } from '../../guards/client-guard'
import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'

const editOwnDataSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  userId: z.string().uuid(),
})

@injectable()
export class EditOwnDataController extends BaseController {
  constructor(
    @inject(CLIENT_SYMBOLS.EditClientDataUseCase)
    private readonly editClientDataUseCase: EditClientDataUseCase,
  ) {
    super()
  }

  @JwtGuard
  @ClientGuard
  async _handle(request: Request, response: Response) {
    const parsedQuery = editOwnDataSchema.safeParse(request.body)

    if (!parsedQuery.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedQuery.error.issues.map((issue) => issue.message),
      })
    }

    const { name, email, userId } = parsedQuery.data

    const stoqResponse = await this.editClientDataUseCase.execute({
      name,
      email,
      id: userId,
    })

    if (stoqResponse.isLeft()) {
      return response.status(stoqResponse.value.code).json({
        message: stoqResponse.value.message,
        error: stoqResponse.value.name,
      })
    }

    return response.status(204).send()
  }
}
