import { Entity } from '@/common/entities/entity'
import type { Optional } from '@/common/helpers/optional.type'
import { UniqueEntityID } from '@/common/value-objects/unique-entity-id'

export interface FavoriteProductProps {
  productId: string
  title: string
  imageUrl: string
  price: number
  reviewScore?: number
  reviewCount?: number
  createdAt: Date
  updatedAt?: Date
}

export class FavoriteProduct extends Entity<FavoriteProductProps> {
  static create(
    props: Optional<FavoriteProductProps, 'createdAt' | 'updatedAt'>,
  ) {
    return new FavoriteProduct({
      ...props,
      createdAt: new Date(),
    })
  }

  static hydrate(props: FavoriteProductProps, id: string) {
    return new FavoriteProduct(props, new UniqueEntityID({ id }))
  }

  get productId() {
    return this.props.productId
  }

  get title() {
    return this.props.title
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  get price() {
    return this.props.price
  }

  get reviewScore() {
    return this.props.reviewScore
  }

  get reviewCount() {
    return this.props.reviewCount
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
