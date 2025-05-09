import { ContainerModule } from 'inversify'

import { EditClientDataUseCase } from '@/client/application/use-cases/edit-client-data-use-case'
import { FindClientByIdUseCase } from '@/client/application/use-cases/find-client-by-id-use-case'
import { ToggleFavoriteProductUseCase } from '@/client/application/use-cases/toggle-favorite-product-use-case'
import type { ProductGateway } from '@/client/enterprise/gateways/product-gateway.interface'
import type { ClientRepository } from '@/client/enterprise/repositories/client-repository.interface'
import { PrismaClientRepository } from '@/infra/db/prisma/repositories/prisma-client-repository'
import { AxiosProductGateway } from '@/infra/gateways/axios/product/axios-product-gateway'

import { CLIENT_SYMBOLS } from './symbols'

export const clientDiContainer = new ContainerModule(({ bind }) => {
  bind(CLIENT_SYMBOLS.ProductGateway).to(AxiosProductGateway)
  bind(CLIENT_SYMBOLS.ClientRepository).to(PrismaClientRepository)

  bind(CLIENT_SYMBOLS.EditClientDataUseCase).toDynamicValue((context) => {
    const clientRepository = context.get<ClientRepository>(
      CLIENT_SYMBOLS.ClientRepository,
    )
    return new EditClientDataUseCase(clientRepository)
  })
  bind(CLIENT_SYMBOLS.FindClientByIdUseCase).toDynamicValue((context) => {
    const clientRepository = context.get<ClientRepository>(
      CLIENT_SYMBOLS.ClientRepository,
    )
    return new FindClientByIdUseCase(clientRepository)
  })
  bind(CLIENT_SYMBOLS.ToggleFavoriteProductUseCase).toDynamicValue(
    (context) => {
      const clientRepository = context.get<ClientRepository>(
        CLIENT_SYMBOLS.ClientRepository,
      )
      const productGateway = context.get<ProductGateway>(
        CLIENT_SYMBOLS.ProductGateway,
      )
      return new ToggleFavoriteProductUseCase(clientRepository, productGateway)
    },
  )
})
