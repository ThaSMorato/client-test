import { Entity } from '@/common/entities/entity'
import { UniqueEntityID } from '@/common/value-objects/unique-entity-id'

import { ProductAlreadyInFavoriteListError } from '../errors/product-already-in-favorite-list.error'
import { ProductNotInFavoriteListError } from '../errors/product-not-in-favorite-list.error'
import type { ProductDTO } from '../gateways/product-gateway.interface'
import { FavoriteProduct } from './favorite-product'
import { FavoriteProductList } from './favorite-product-list'

export interface ClientProps {
  name: string
  email: string
  favoriteProductList: FavoriteProductList
}

export interface ClientHydrateProps {
  name: string
  email: string
  favoriteProducts: FavoriteProduct[]
}

export interface ClientUpdateProps {
  name?: string
  email?: string
}

export class Client extends Entity<ClientProps> {
  static hydrate(props: ClientHydrateProps, id: string) {
    return new Client(
      {
        ...props,
        favoriteProductList: new FavoriteProductList(props.favoriteProducts),
      },
      new UniqueEntityID({ id }),
    )
  }

  update({ name, email }: ClientUpdateProps) {
    this.props.name = name ?? this.props.name
    this.props.email = email ?? this.props.email
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get favoriteProducts() {
    return this.props.favoriteProductList.getItems()
  }

  get favoriteProductList() {
    return this.props.favoriteProductList
  }

  alreadyInFavoriteList(productId: string) {
    return !!this.props.favoriteProductList
      .getItems()
      .find((p) => p.productId === productId)
  }

  createFavoriteProduct(product: ProductDTO) {
    if (this.alreadyInFavoriteList(product.id)) {
      throw new ProductAlreadyInFavoriteListError()
    }

    const favoriteProduct = FavoriteProduct.create({
      productId: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      price: product.price,
      reviewScore: product.reviewScore,
      reviewCount: product.reviewCount,
    })

    this.props.favoriteProductList.add(favoriteProduct)
  }

  removeFavoriteProduct(productId: string) {
    const product = this.props.favoriteProductList
      .getItems()
      .find((p) => p.productId === productId)

    if (!product) {
      throw new ProductNotInFavoriteListError()
    }

    this.props.favoriteProductList.remove(product)
  }

  toggleFavoriteProduct(product: ProductDTO) {
    if (this.alreadyInFavoriteList(product.id)) {
      this.removeFavoriteProduct(product.id)
    } else {
      this.createFavoriteProduct(product)
    }
  }
}
