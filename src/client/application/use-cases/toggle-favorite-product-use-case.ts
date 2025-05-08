import type { ProductGateway } from '@/client/enterprise/gateways/product-gateway.interface'
import type { ClientRepository } from '@/client/enterprise/repositories/client-repository.interface'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import type { Either } from '@/common/helpers/either'
import { left, right } from '@/common/helpers/either'

export interface ToggleFavoriteProductRequest {
  clientId: string
  productId: string
}

export class ToggleFavoriteProductUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly productGateway: ProductGateway,
  ) {}

  async execute({
    clientId,
    productId,
  }: ToggleFavoriteProductRequest): Promise<
    Either<ResourceNotFoundError, null>
  > {
    const client = await this.clientRepository.findOneById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    const product = await this.productGateway.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    client.toggleFavoriteProduct(product)

    await this.clientRepository.save(client)

    return right(null)
  }
}
