import { FavoriteProductList } from '@/client/enterprise/entities/favorite-product-list'
import { createFavoriteProductInstance } from '$/factories/client/favorite-product-factories'

describe('FavoriteProductList', () => {
  describe('compareItems', () => {
    it('should return true if the items are equal', () => {
      const item1 = createFavoriteProductInstance()

      const favoriteProductList = new FavoriteProductList([])
      expect(favoriteProductList.compareItems(item1, item1)).toBe(true)
    })
    it('should return false if the items are not equal', () => {
      const item1 = createFavoriteProductInstance()
      const item2 = createFavoriteProductInstance()

      const favoriteProductList = new FavoriteProductList([])
      expect(favoriteProductList.compareItems(item1, item2)).toBe(false)
    })
    it('should return true if itens have the same productId', () => {
      const item1 = createFavoriteProductInstance({
        productId: '1',
      })
      const item2 = createFavoriteProductInstance({
        productId: '1',
      })

      const favoriteProductList = new FavoriteProductList([])
      expect(favoriteProductList.compareItems(item1, item2)).toBe(true)
    })
  })
})
