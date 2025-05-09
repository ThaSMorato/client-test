import { inject, injectable } from 'inversify'

import { CLIENT_SYMBOLS } from '@/infra/container/client/symbols'

import type { EditClientDataController } from '../controllers/client/edit-client-data-controller'
import type { EditOwnDataController } from '../controllers/client/edit-own-data-controller'
import type { FetchClientByIdController } from '../controllers/client/fetch-client-by-id-controller'
import type { FetchProfileController } from '../controllers/client/fetch-profile-controller'
import type { ToggleFavoriteProductController } from '../controllers/client/toggle-favorite-product-controller'
import { Router } from './router'

@injectable()
export class ClientRoutes extends Router {
  constructor(
    @inject(CLIENT_SYMBOLS.EditClientDataController)
    private readonly editClientDataController: EditClientDataController,
    @inject(CLIENT_SYMBOLS.EditOwnDataController)
    private readonly editOwnDataController: EditOwnDataController,
    @inject(CLIENT_SYMBOLS.FetchProfileController)
    private readonly fetchProfileController: FetchProfileController,
    @inject(CLIENT_SYMBOLS.FetchClientByIdController)
    private readonly fetchClientByIdController: FetchClientByIdController,
    @inject(CLIENT_SYMBOLS.ToggleFavoriteProductController)
    private readonly toggleFavoriteProductController: ToggleFavoriteProductController,
  ) {
    super()
  }

  create() {
    this.expressRouter.put(
      '/client/:clientId',
      this.editClientDataController.handle.bind(this.editClientDataController),
    )
    this.expressRouter.put(
      '/profile',
      this.editOwnDataController.handle.bind(this.editOwnDataController),
    )
    this.expressRouter.get(
      '/profile',
      this.fetchProfileController.handle.bind(this.fetchProfileController),
    )
    this.expressRouter.get(
      '/client/:clientId',
      this.fetchClientByIdController.handle.bind(
        this.fetchClientByIdController,
      ),
    )
    this.expressRouter.post(
      '/product/:productId/favorite',
      this.toggleFavoriteProductController.handle.bind(
        this.toggleFavoriteProductController,
      ),
    )
  }
}
