import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { CreateUserUseCase } from '@/auth/application/use-cases/create-user-use-case'
import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

import { BaseController } from '../base-controller'

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
})

@injectable()
export class CreateUserController extends BaseController {
  constructor(
    @inject(AUTH_SYMBOLS.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {
    super()
  }

  async _handle(request: Request, response: Response) {
    const parsedBody = createUserSchema.safeParse(request.body)

    if (!parsedBody.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedBody.error.issues.map((issue) => issue.message),
      })
    }

    const { email, password, name } = parsedBody.data

    const userResponse = await this.createUserUseCase.execute({
      email,
      password,
      name,
    })

    if (userResponse.isLeft()) {
      return response.status(userResponse.value.code).json({
        message: userResponse.value.message,
        error: userResponse.value.name,
      })
    }

    return response.status(201).send()
  }
}
