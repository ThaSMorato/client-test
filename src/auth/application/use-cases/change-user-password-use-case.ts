import type { UserRepository } from '@/auth/enterprise/repositories/user-repository.interface'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import type { Either } from '@/common/helpers/either'
import { left, right } from '@/common/helpers/either'

export interface ChangeUserPasswordRequest {
  id: string
  password: string
}

export class ChangeUserPasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    id,
    password,
  }: ChangeUserPasswordRequest): Promise<Either<ResourceNotFoundError, null>> {
    const user = await this.userRepository.findOneById(id)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    user.updatePassword(password)

    await this.userRepository.save(user)

    return right(null)
  }
}
