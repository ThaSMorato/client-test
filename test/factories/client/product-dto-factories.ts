import { faker } from '@faker-js/faker'

import type { ProductDTO } from '@/client/enterprise/gateways/product-gateway.interface'

export function createProductDtoInstance(
  override: Partial<ProductDTO> = {},
): ProductDTO {
  return {
    id: faker.string.uuid(),
    price: faker.number.int({ min: 1, max: 1000 }),
    title: faker.commerce.productDescription(),
    imageUrl: faker.image.url(),
    ...override,
  }
}
