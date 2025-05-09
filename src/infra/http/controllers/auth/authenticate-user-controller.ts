import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { AuthenticateUserUseCase } from '@/auth/application/use-cases/authenticate-user-use-case'
import { JwtToken } from '@/common/value-objects/jwt-token'
import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

import { BaseController } from '../base-controller'

const authenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

@injectable()
export class AuthenticateUserController extends BaseController {
  constructor(
    @inject(AUTH_SYMBOLS.AuthenticateUserUseCase)
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {
    super()
  }

  async _handle(request: Request, response: Response) {
    const parsedBody = authenticateUserSchema.safeParse(request.body)

    if (!parsedBody.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedBody.error.issues.map((issue) => issue.message),
      })
    }

    const { email, password } = parsedBody.data

    const authResponse = await this.authenticateUserUseCase.execute({
      email,
      password,
    })

    if (authResponse.isLeft()) {
      return response.status(authResponse.value.code).json({
        message: authResponse.value.message,
        error: authResponse.value.name,
      })
    }

    const { jwt } = authResponse.value

    return response
      .cookie(JwtToken.jwtCookieName, jwt.token, {
        httpOnly: true,
        path: '/',
        expires: new Date(Date.now() + 3600 * 1000),
      })
      .status(202)
      .send()
  }
}
