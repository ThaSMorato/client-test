export class ProductAlreadyInFavoriteListError extends Error {
  constructor() {
    super('Product already in favorite list')
    this.name = 'ProductAlreadyInFavoriteListError'
  }
}
