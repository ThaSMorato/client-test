import type { Client } from '@/client/enterprise/entities/client'

export class FetchClientByIdPresenter {
  static toHttp(client: Client) {
    return {
      id: client.id.toString(),
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
          id: id.toString(),
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
