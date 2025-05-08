export class ProductNotInFavoriteListError extends Error {
  constructor() {
    super('Product not in favorite list')
    this.name = 'ProductNotInFavoriteListError'
  }
}
