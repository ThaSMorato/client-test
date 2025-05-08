import jwt from 'jsonwebtoken'

import { InvalidCredentialError } from '@/auth/application/errors/invalid-credential.error'
import { AuthenticateUserUseCase } from '@/auth/application/use-cases/authenticate-user-use-case'
import { User } from '@/auth/enterprise/entities/user'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import { createUserInstance } from '$/factories/auth/user-factories'
import {
  mockedUserRepository,
  userRepositoryFns,
} from '$/repositories/mock/mocked-user-repository'

let sut: AuthenticateUserUseCase
const signMock = vi.spyOn(jwt, 'sign')

const oldProcessEnv = process.env

describe('AuthenticateUserUseCase', () => {
  describe('UT', () => {
    beforeEach(() => {
      sut = new AuthenticateUserUseCase(mockedUserRepository)
      process.env.JWT_SECRET = 'secret'
    })

    afterEach(() => {
      process.env = oldProcessEnv
    })

    it('should return a ResourceNotFoundError when the user does not exist', async () => {
      userRepositoryFns.findOneByEmail.mockResolvedValue(null)

      const response = await sut.execute({
        email: 'any_email',
        password: 'any_password',
      })

      expect(response.isLeft()).toBeTruthy()
      expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    })

    it('should return a InvalidCredentialError when the password is invalid', async () => {
      userRepositoryFns.findOneByEmail.mockResolvedValue(createUserInstance())

      const comparePasswordMock = vi.spyOn(User.prototype, 'comparePassword')

      comparePasswordMock.mockReturnValue(false)

      const response = await sut.execute({
        email: 'any_email',
        password: 'any_password',
      })

      expect(response.isLeft()).toBeTruthy()
      expect(response.value).toBeInstanceOf(InvalidCredentialError)
    })

    it('should authenticate a user and return a Jwt', async () => {
      userRepositoryFns.findOneByEmail.mockResolvedValue(
        createUserInstance({
          id: '123asd',
        }),
      )

      const comparePasswordMock = vi.spyOn(User.prototype, 'comparePassword')

      signMock.mockImplementation(
        (data, _, op) => `${JSON.stringify(data)}${JSON.stringify(op)}`,
      )

      comparePasswordMock.mockReturnValue(true)

      const response = await sut.execute({
        email: 'any_email',
        password: 'any_password',
      })

      expect(response.isRight()).toBeTruthy()
      expect(response.value).toStrictEqual({
        jwt: expect.objectContaining({
          token: '{"userId":"123asd"}{"subject":"123asd","expiresIn":3600}',
          subject: '123asd',
        }),
      })
    })
  })
})
