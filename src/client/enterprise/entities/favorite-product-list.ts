import { WatchedList } from '@/common/entities/watched-list'

import type { FavoriteProduct } from './favorite-product'

export class FavoriteProductList extends WatchedList<FavoriteProduct> {
  compareItems(a: FavoriteProduct, b: FavoriteProduct) {
    // Can't have a product in the list with the same product id
    return a.id.equals(b.id) || a.productId === b.productId
  }
}
