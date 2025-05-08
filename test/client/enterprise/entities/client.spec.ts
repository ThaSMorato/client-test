import { Client } from '@/client/enterprise/entities/client'
import { ProductAlreadyInFavoriteListError } from '@/client/enterprise/errors/product-already-in-favorite-list.error'
import { ProductNotInFavoriteListError } from '@/client/enterprise/errors/product-not-in-favorite-list.error'
import { createFavoriteProductInstance } from '$/factories/client/favorite-product-factories'

describe('Client', () => {
  describe('hydrate', () => {
    it('should hydrate a client', () => {
      const client = Client.hydrate(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          favoriteProducts: [],
        },
        '1',
      )
      expect(client.name).toBe('John Doe')
      expect(client.email).toBe('john.doe@example.com')
      expect(client.favoriteProducts).toEqual([])
    })
  })
  describe('createFavoriteProduct', () => {
    it('should create a favorite product', () => {
      const client = Client.hydrate(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          favoriteProducts: [],
        },
        '1',
      )

      client.createFavoriteProduct({
        id: '1',
        title: 'Product 1',
        imageUrl: 'https://example.com/product-1.jpg',
        price: 100,
        reviewScore: 4.5,
        reviewCount: 10,
      })

      expect(client.favoriteProducts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            productId: '1',
            title: 'Product 1',
          }),
        ]),
      )
    })

    it('should throw an error if the product is already in the favorite list', () => {
      const client = Client.hydrate(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          favoriteProducts: [
            createFavoriteProductInstance({
              productId: '1',
              title: 'Product 1',
            }),
          ],
        },
        '1',
      )

      expect(() =>
        client.createFavoriteProduct({
          id: '1',
          title: 'Product 1',
          imageUrl: 'https://example.com/product-1.jpg',
          price: 100,
          reviewScore: 4.5,
          reviewCount: 10,
        }),
      ).toThrow(ProductAlreadyInFavoriteListError)
    })
  })
  describe('removeFavoriteProduct', () => {
    it('should remove a favorite product', () => {
      const client = Client.hydrate(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          favoriteProducts: [
            createFavoriteProductInstance({
              productId: '1',
              title: 'Product 1',
            }),
          ],
        },
        '1',
      )

      client.removeFavoriteProduct('1')

      expect(client.favoriteProducts).toEqual([])
    })

    it('should throw an error if the product is not in the favorite list', () => {
      const client = Client.hydrate(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          favoriteProducts: [],
        },
        '1',
      )

      expect(() => client.removeFavoriteProduct('1')).toThrow(
        ProductNotInFavoriteListError,
      )
    })
  })
  describe('toggleFavoriteProduct', () => {
    it('should toggle a favorite product', () => {
      const client = Client.hydrate(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          favoriteProducts: [],
        },
        '1',
      )

      client.toggleFavoriteProduct({
        id: '1',
        title: 'Product 1',
        imageUrl: 'https://example.com/product-1.jpg',
        price: 100,
        reviewScore: 4.5,
        reviewCount: 10,
      })

      expect(client.favoriteProducts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            productId: '1',
            title: 'Product 1',
          }),
        ]),
      )
    })
  })
  describe('alreadyInFavoriteList', () => {
    it('should return true if the product is in the favorite list', () => {
      const client = Client.hydrate(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          favoriteProducts: [
            createFavoriteProductInstance({
              productId: '1',
              title: 'Product 1',
            }),
          ],
        },
        '1',
      )

      expect(client.alreadyInFavoriteList('1')).toBe(true)
    })

    it('should return false if the product is not in the favorite list', () => {
      const client = Client.hydrate(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          favoriteProducts: [],
        },
        '1',
      )

      expect(client.alreadyInFavoriteList('1')).toBe(false)
    })
  })
})
