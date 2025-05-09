import { inject, injectable } from 'inversify'

import { AUTH_SYMBOLS } from '@/infra/container/auth/symbols'

import type { AuthenticateUserController } from '../controllers/auth/authenticate-user-controller'
import type { ChangeClientPasswordController } from '../controllers/auth/change-client-password-controller'
import type { ChangeUserPasswordController } from '../controllers/auth/change-user-password-controller'
import type { CreateUserController } from '../controllers/auth/create-user-controller'
import type { DeleteClientController } from '../controllers/auth/delete-client-controller'
import type { DeleteUserController } from '../controllers/auth/delete-user-controller'
import { Router } from './router'

@injectable()
export class AuthRoutes extends Router {
  constructor(
    @inject(AUTH_SYMBOLS.CreateUserController)
    private readonly createUserController: CreateUserController,
    @inject(AUTH_SYMBOLS.AuthenticateUserController)
    private readonly authenticateUserController: AuthenticateUserController,
    @inject(AUTH_SYMBOLS.ChangeUserPasswordController)
    private readonly changeUserPasswordController: ChangeUserPasswordController,
    @inject(AUTH_SYMBOLS.ChangeClientPasswordController)
    private readonly changeClientPasswordController: ChangeClientPasswordController,
    @inject(AUTH_SYMBOLS.DeleteUserController)
    private readonly deleteUserController: DeleteUserController,
    @inject(AUTH_SYMBOLS.DeleteClientController)
    private readonly deleteClientController: DeleteClientController,
  ) {
    super()
  }

  create() {
    this.expressRouter.post(
      '/register',
      this.createUserController.handle.bind(this.createUserController),
    )
    this.expressRouter.post(
      '/login',
      this.authenticateUserController.handle.bind(
        this.authenticateUserController,
      ),
    )
    this.expressRouter.post(
      '/change-password',
      this.changeUserPasswordController.handle.bind(
        this.changeUserPasswordController,
      ),
    )
    this.expressRouter.post(
      '/client/:clientId/change-password',
      this.changeClientPasswordController.handle.bind(
        this.changeClientPasswordController,
      ),
    )
    this.expressRouter.delete(
      '/client/:clientId',
      this.deleteClientController.handle.bind(this.deleteClientController),
    )
    this.expressRouter.delete(
      '/profile',
      this.deleteUserController.handle.bind(this.deleteUserController),
    )
  }
}
