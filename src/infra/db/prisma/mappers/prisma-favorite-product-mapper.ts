import type { Product } from '@prisma/client'

import { FavoriteProduct } from '@/client/enterprise/entities/favorite-product'
import type { UniqueEntityID } from '@/common/value-objects/unique-entity-id'

export class PrismaFavoriteProductMapper {
  static toDomain(product: Product): FavoriteProduct {
    return FavoriteProduct.hydrate(
      {
        productId: product.productId,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        reviewScore: product.reviewScore ?? undefined,
        reviewCount: product.reviewCount ?? undefined,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt ?? undefined,
      },
      product.id,
    )
  }

  static toPersistence(
    favoriteProduct: FavoriteProduct,
    userId: UniqueEntityID,
  ): Product {
    return {
      id: favoriteProduct.id.toString(),
      userId: userId.toString(),
      productId: favoriteProduct.productId,
      title: favoriteProduct.title,
      price: favoriteProduct.price,
      imageUrl: favoriteProduct.imageUrl,
      reviewScore: favoriteProduct.reviewScore ?? null,
      reviewCount: favoriteProduct.reviewCount ?? null,
      createdAt: favoriteProduct.createdAt,
      updatedAt: favoriteProduct.updatedAt ?? null,
    }
  }
}
