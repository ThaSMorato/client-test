import { ContainerModule } from 'inversify'

import { EditClientDataUseCase } from '@/client/application/use-cases/edit-client-data-use-case'
import { FindClientByIdUseCase } from '@/client/application/use-cases/find-client-by-id-use-case'
import { ToggleFavoriteProductUseCase } from '@/client/application/use-cases/toggle-favorite-product-use-case'
import type { ProductGateway } from '@/client/enterprise/gateways/product-gateway.interface'
import type { ClientRepository } from '@/client/enterprise/repositories/client-repository.interface'
import type { UserDAO } from '@/common/data/user-dao.interface'
import { PrismaClientRepository } from '@/infra/db/prisma/repositories/prisma-client-repository'
import { AxiosProductGateway } from '@/infra/gateways/axios/product/axios-product-gateway'
import { EditClientDataController } from '@/infra/http/controllers/client/edit-client-data-controller'
import { EditOwnDataController } from '@/infra/http/controllers/client/edit-own-data-controller'
import { FetchClientByIdController } from '@/infra/http/controllers/client/fetch-client-by-id-controller'
import { FetchProfileController } from '@/infra/http/controllers/client/fetch-profile-controller'
import { ToggleFavoriteProductController } from '@/infra/http/controllers/client/toggle-favorite-product-controller'

import { AUTH_SYMBOLS } from '../auth/symbols'
import { CLIENT_SYMBOLS } from './symbols'

export const clientDiContainer = new ContainerModule(({ bind }) => {
  bind(CLIENT_SYMBOLS.ProductGateway).to(AxiosProductGateway)
  bind(CLIENT_SYMBOLS.ClientRepository).to(PrismaClientRepository)

  bind(CLIENT_SYMBOLS.EditClientDataController).to(EditClientDataController)
  bind(CLIENT_SYMBOLS.EditOwnDataController).to(EditOwnDataController)
  bind(CLIENT_SYMBOLS.FetchProfileController).to(FetchProfileController)
  bind(CLIENT_SYMBOLS.FetchClientByIdController).to(FetchClientByIdController)
  bind(CLIENT_SYMBOLS.ToggleFavoriteProductController).to(
    ToggleFavoriteProductController,
  )

  bind(CLIENT_SYMBOLS.EditClientDataUseCase).toDynamicValue((context) => {
    const clientRepository = context.get<ClientRepository>(
      CLIENT_SYMBOLS.ClientRepository,
    )
    const userDAO = context.get<UserDAO>(AUTH_SYMBOLS.UserDAO)

    return new EditClientDataUseCase(clientRepository, userDAO)
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
