import { faker } from '@faker-js/faker'

import type { FavoriteProductProps } from '@/client/enterprise/entities/favorite-product'
import { FavoriteProduct } from '@/client/enterprise/entities/favorite-product'

export function createFavoriteProductInstance({
  id,
  ...overrides
}: Partial<FavoriteProductProps & { id: string }> = {}) {
  return FavoriteProduct.hydrate(
    {
      productId: faker.string.uuid(),
      title: faker.commerce.productName(),
      imageUrl: faker.image.url(),
      price: faker.number.int(),
      reviewScore: faker.number.int({ min: 0, max: 5 }),
      reviewCount: faker.number.int({ min: 0, max: 100 }),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      ...overrides,
    },
    id ?? faker.string.uuid(),
  )
}
