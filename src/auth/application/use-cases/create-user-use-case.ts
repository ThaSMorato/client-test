import { User, UserRole } from '@/auth/enterprise/entities/user'
import type { UserRepository } from '@/auth/enterprise/repositories/user-repository.interface'
import type { Either } from '@/common/helpers/either'
import { left, right } from '@/common/helpers/either'

import { UserAlreadyExistsError } from '../errors/user-already-exists.error'

interface CreateUserRequest {
  email: string
  name: string
  password: string
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    name,
    password,
  }: CreateUserRequest): Promise<Either<UserAlreadyExistsError, null>> {
    const userExists = await this.userRepository.findOneByEmail(email)

    if (userExists) {
      return left(new UserAlreadyExistsError())
    }

    const user = User.create({
      email,
      name,
      password,
      role: UserRole.USER,
    })

    await this.userRepository.create(user)

    return right(null)
  }
}
