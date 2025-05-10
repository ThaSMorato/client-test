export type ProductDTO = {
  id: string
  title: string
  imageUrl: string
  price: number
  reviewScore?: number
  reviewCount?: number
}

export interface ProductGateway {
  findById(id: string): Promise<ProductDTO | null>
}
