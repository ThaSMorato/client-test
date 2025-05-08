import type { UserRepository } from '@/auth/enterprise/repositories/user-repository.interface'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import type { Either } from '@/common/helpers/either'
import { left, right } from '@/common/helpers/either'
import { JwtToken } from '@/common/value-objects/jwt-token'

import { InvalidCredentialError } from '../errors/invalid-credential.error'

interface AuthenticateUserRequest {
  email: string
  password: string
}

interface JwtTokenData {
  userId: string
}

interface AuthenticateUserResponse {
  jwt: JwtToken<JwtTokenData>
}

export class AuthenticateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<
    Either<
      ResourceNotFoundError | InvalidCredentialError,
      AuthenticateUserResponse
    >
  > {
    const user = await this.userRepository.findOneByEmail(email)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const isPasswordValid = user.comparePassword(password)

    if (!isPasswordValid) {
      return left(new InvalidCredentialError())
    }

    const jwt = JwtToken.create<JwtTokenData>({
      subject: user.id.toString(),
      expires: 3600,
      data: { userId: user.id.toString() },
    })

    return right({ jwt })
  }
}
