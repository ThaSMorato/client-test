import type { Product, User as PrismaUser } from '@prisma/client'

import { Client } from '@/client/enterprise/entities/client'

import { PrismaFavoriteProductMapper } from './prisma-favorite-product-mapper'

type PrismaUserWithFavoriteProducts = PrismaUser & {
  favoriteProducts: Product[]
}

export class PrismaClientMapper {
  static toDomain(user: PrismaUserWithFavoriteProducts): Client {
    const instance = Client.hydrate(
      {
        email: user.email,
        name: user.name,
        favoriteProducts: user.favoriteProducts.map((product) =>
          PrismaFavoriteProductMapper.toDomain(product),
        ),
      },
      user.id,
    )

    return instance
  }

  static toPersistence(client: Client) {
    return {
      id: client.id.toString(),
      email: client.email,
      name: client.name,
      favoriteProducts: {
        create: client.favoriteProductList
          .getNewItems()
          .map((product) =>
            PrismaFavoriteProductMapper.toPersistence(product, client.id),
          ),
        delete: client.favoriteProductList.getRemovedItems().map((product) => ({
          id: product.id.toString(),
        })),
      },
    }
  }
}
