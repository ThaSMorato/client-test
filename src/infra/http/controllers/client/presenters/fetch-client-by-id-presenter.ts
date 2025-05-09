import type { Client } from '@/client/enterprise/entities/client'

export class FetchClientByIdPresenter {
  static toHttp(client: Client) {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      favoriteProducts: client.favoriteProducts.map(
        ({
          id,
          productId,
          imageUrl,
          price,
          reviewCount,
          reviewScore,
          title,
        }) => ({
          id,
          productId,
          imageUrl,
          price,
          reviewCount,
          reviewScore,
          title,
        }),
      ),
    }
  }
}
