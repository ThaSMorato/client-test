import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { inject, injectable } from 'inversify'

import type {
  ProductDTO,
  ProductGateway,
} from '@/client/enterprise/gateways/product-gateway.interface'
import { INFRA_SYMBOLS } from '@/infra/container/infra/symbols'
import type { EnvService } from '@/infra/env/env-service'

type ProductApiResponse = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: {
    rate: number
    count: number
  }
}

@injectable()
export class AxiosProductGateway implements ProductGateway {
  private readonly axiosInstance: AxiosInstance

  constructor(
    @inject(INFRA_SYMBOLS.EnvService) private readonly envService: EnvService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.envService.get('PRODUCT_API_URL'),
    })
  }

  async findById(id: string): Promise<ProductDTO | null> {
    const response = await this.axiosInstance.get<ProductApiResponse | ''>(
      `/${id}`,
    )

    if (response.data === '') {
      return null
    }

    return {
      id: response.data.id.toString(),
      title: response.data.title,
      price: response.data.price,
      imageUrl: response.data.image,
      reviewScore: response.data.rating?.rate,
      reviewCount: response.data.rating?.count,
    }
  }

  async getProducts(): Promise<ProductDTO[]> {
    const response = await this.axiosInstance.get<ProductApiResponse[]>('/')

    return response.data.map((product) => ({
      id: product.id.toString(),
      title: product.title,
      price: product.price,
      imageUrl: product.image,
      reviewScore: product.rating?.rate,
      reviewCount: product.rating?.count,
    }))
  }
}
