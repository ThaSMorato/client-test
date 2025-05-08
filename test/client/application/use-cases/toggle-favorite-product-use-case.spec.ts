import { ToggleFavoriteProductUseCase } from '@/client/application/use-cases/toggle-favorite-product-use-case'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import { createClientInstance } from '$/factories/client/client-factories'
import { createProductDtoInstance } from '$/factories/client/product-dto-factories'
import {
  mockedProductGateway,
  productGatewayFns,
} from '$/gateways/mock/mocked-product-gateway'
import {
  clientRepositoryFns,
  mockedClientRepository,
} from '$/repositories/mock/mocked-client-repository'

let sut: ToggleFavoriteProductUseCase

describe('ToggleFavoriteProductUseCase', () => {
  describe('UT', () => {
    beforeEach(() => {
      sut = new ToggleFavoriteProductUseCase(
        mockedClientRepository,
        mockedProductGateway,
      )
    })

    it('should return a ResourceNotFoundError when the client is not found', async () => {
      clientRepositoryFns.findOneById.mockResolvedValue(null)

      const result = await sut.execute({
        clientId: '1',
        productId: '1',
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })

    it('should return a ResourceNotFoundError when the product is not found', async () => {
      clientRepositoryFns.findOneById.mockResolvedValue(createClientInstance())
      productGatewayFns.findById.mockResolvedValue(null)

      const result = await sut.execute({
        clientId: '1',
        productId: '1',
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })

    it("should add the product to the client's favorite products", async () => {
      const client = createClientInstance()
      const product = createProductDtoInstance()

      clientRepositoryFns.findOneById.mockResolvedValue(client)
      productGatewayFns.findById.mockResolvedValue(product)

      const result = await sut.execute({
        clientId: client.id.toString(),
        productId: product.id,
      })

      expect(result.isRight()).toBe(true)
      expect(client.favoriteProducts).toHaveLength(1)
      expect(client.favoriteProducts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            productId: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
          }),
        ]),
      )
      expect(clientRepositoryFns.save).toHaveBeenCalledWith(client)
    })
  })
})
