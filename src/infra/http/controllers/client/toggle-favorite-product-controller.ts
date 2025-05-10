import type { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { z } from 'zod'

import type { ToggleFavoriteProductUseCase } from '@/client/application/use-cases/toggle-favorite-product-use-case'
import { CLIENT_SYMBOLS } from '@/infra/container/client/symbols'

import { ClientGuard } from '../../guards/client-guard'
import { JwtGuard } from '../../guards/jwt-guard'
import { BaseController } from '../base-controller'

const toggleFavoriteProductSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string(),
})

@injectable()
export class ToggleFavoriteProductController extends BaseController {
  constructor(
    @inject(CLIENT_SYMBOLS.ToggleFavoriteProductUseCase)
    private readonly toggleFavoriteProductUseCase: ToggleFavoriteProductUseCase,
  ) {
    super()
  }

  @JwtGuard
  @ClientGuard
  async _handle(request: Request, response: Response) {
    const { productId } = request.params
    const { userId } = request.body

    const parsedQuery = toggleFavoriteProductSchema.safeParse({
      productId,
      userId,
    })

    if (!parsedQuery.success) {
      return response.status(400).json({
        message: 'Invalid Data',
        errors: parsedQuery.error.issues.map((issue) => issue.message),
      })
    }

    const toggleFavoriteProductResponse =
      await this.toggleFavoriteProductUseCase.execute({
        clientId: parsedQuery.data.userId,
        productId: parsedQuery.data.productId,
      })

    if (toggleFavoriteProductResponse.isLeft()) {
      return response.status(toggleFavoriteProductResponse.value.code).json({
        message: toggleFavoriteProductResponse.value.message,
        error: toggleFavoriteProductResponse.value.name,
      })
    }

    return response.status(204).send()
  }
}
