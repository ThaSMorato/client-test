import type { ProductGateway } from '@/client/enterprise/gateways/product-gateway.interface'

export const productGatewayFns = {
  findById: vi.fn(),
  getProducts: vi.fn(),
}

export const mockedProductGateway: ProductGateway = productGatewayFns
