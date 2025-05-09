import { ContainerModule } from 'inversify'

import { AuthenticateUserUseCase } from '@/auth/application/use-cases/authenticate-user-use-case'
import { ChangeUserPasswordUseCase } from '@/auth/application/use-cases/change-user-password-use-case'
import { CreateUserUseCase } from '@/auth/application/use-cases/create-user-use-case'
import { DeleteUserUseCase } from '@/auth/application/use-cases/delete-user-use-case'
import type { UserRepository } from '@/auth/enterprise/repositories/user-repository.interface'
import { PrismaUserRepository } from '@/infra/db/prisma/repositories/prisma-user-repository'
import { AuthenticateUserController } from '@/infra/http/controllers/auth/authenticate-user-controller'
import { ChangeClientPasswordController } from '@/infra/http/controllers/auth/change-client-password-controller'
import { ChangeUserPasswordController } from '@/infra/http/controllers/auth/change-user-password-controller'
import { CreateUserController } from '@/infra/http/controllers/auth/create-user-controller'
import { DeleteClientController } from '@/infra/http/controllers/auth/delete-client-controller'
import { DeleteUserController } from '@/infra/http/controllers/auth/delete-user-controller'

import { AUTH_SYMBOLS } from './symbols'

export const authDiContainer = new ContainerModule(({ bind }) => {
  bind(AUTH_SYMBOLS.UserRepository).to(PrismaUserRepository)
  bind(AUTH_SYMBOLS.UserDAO).to(PrismaUserRepository)

  bind(AUTH_SYMBOLS.CreateUserController).to(CreateUserController)
  bind(AUTH_SYMBOLS.AuthenticateUserController).to(AuthenticateUserController)
  bind(AUTH_SYMBOLS.ChangeUserPasswordController).to(
    ChangeUserPasswordController,
  )
  bind(AUTH_SYMBOLS.DeleteUserController).to(DeleteUserController)
  bind(AUTH_SYMBOLS.DeleteClientController).to(DeleteClientController)
  bind(AUTH_SYMBOLS.ChangeClientPasswordController).to(
    ChangeClientPasswordController,
  )

  bind(AUTH_SYMBOLS.AuthenticateUserUseCase).toDynamicValue((context) => {
    const userRepository = context.get<UserRepository>(
      AUTH_SYMBOLS.UserRepository,
    )
    return new AuthenticateUserUseCase(userRepository)
  })
  bind(AUTH_SYMBOLS.CreateUserUseCase).toDynamicValue((context) => {
    const userRepository = context.get<UserRepository>(
      AUTH_SYMBOLS.UserRepository,
    )
    return new CreateUserUseCase(userRepository)
  })
  bind(AUTH_SYMBOLS.ChangeUserPasswordUseCase).toDynamicValue((context) => {
    const userRepository = context.get<UserRepository>(
      AUTH_SYMBOLS.UserRepository,
    )
    return new ChangeUserPasswordUseCase(userRepository)
  })
  bind(AUTH_SYMBOLS.DeleteUserUseCase).toDynamicValue((context) => {
    const userRepository = context.get<UserRepository>(
      AUTH_SYMBOLS.UserRepository,
    )
    return new DeleteUserUseCase(userRepository)
  })
})
