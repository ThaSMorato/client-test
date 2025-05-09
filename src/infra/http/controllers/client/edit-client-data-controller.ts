import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { EditClientDataUseCase } from '@/client/application/use-cases/edit-client-data-use-case'
import { CLIENT_SYMBOLS } from '@/infra/container/client/symbols'

import { AdminGuard } from '../../guards/admin-guard'
import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'

const editClientDataSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  clientId: z.string().uuid(),
})

@injectable()
export class EditClientDataController extends BaseController {
  constructor(
    @inject(CLIENT_SYMBOLS.EditClientDataUseCase)
    private readonly editClientDataUseCase: EditClientDataUseCase,
  ) {
    super()
  }

  @JwtGuard
  @AdminGuard
  async _handle(request: Request, response: Response) {
    const { clientId } = request.params
    const { name, email } = request.body

    const parsedQuery = editClientDataSchema.safeParse({
      name,
      email,
      clientId,
    })

    if (!parsedQuery.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedQuery.error.issues.map((issue) => issue.message),
      })
    }

    const data = parsedQuery.data

    const stoqResponse = await this.editClientDataUseCase.execute({
      name: data.name,
      email: data.email,
      id: data.clientId,
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
