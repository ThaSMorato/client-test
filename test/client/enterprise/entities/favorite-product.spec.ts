import { FavoriteProduct } from '@/client/enterprise/entities/favorite-product'

describe('FavoriteProduct', () => {
  describe('create', () => {
    it('should create a favorite product', () => {
      const favoriteProduct = FavoriteProduct.create({
        productId: '1',
        title: 'Product 1',
        imageUrl: 'https://example.com/product-1.jpg',
        price: 100,
        reviewScore: 4.5,
        reviewCount: 10,
      })

      expect(favoriteProduct.productId).toBe('1')
      expect(favoriteProduct.title).toBe('Product 1')
      expect(favoriteProduct.imageUrl).toBe('https://example.com/product-1.jpg')
      expect(favoriteProduct.price).toBe(100)
      expect(favoriteProduct.reviewScore).toBe(4.5)
      expect(favoriteProduct.reviewCount).toBe(10)
      expect(favoriteProduct.createdAt).toBeDefined()
    })
  })
  describe('hydrate', () => {
    it('should hydrate a favorite product', () => {
      const favoriteProduct = FavoriteProduct.hydrate(
        {
          productId: '1',
          title: 'Product 1',
          imageUrl: 'https://example.com/product-1.jpg',
          price: 100,
          reviewScore: 4.5,
          reviewCount: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        '1',
      )

      expect(favoriteProduct.productId).toBe('1')
      expect(favoriteProduct.title).toBe('Product 1')
      expect(favoriteProduct.imageUrl).toBe('https://example.com/product-1.jpg')
      expect(favoriteProduct.price).toBe(100)
      expect(favoriteProduct.reviewScore).toBe(4.5)
      expect(favoriteProduct.reviewCount).toBe(10)
      expect(favoriteProduct.createdAt).toBeDefined()
      expect(favoriteProduct.updatedAt).toBeDefined()
    })
  })
})
