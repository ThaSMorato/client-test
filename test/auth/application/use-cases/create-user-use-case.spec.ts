import { hashSync } from 'bcrypt'
import type { Mock } from 'vitest'

import { UserAlreadyExistsError } from '@/auth/application/errors/user-already-exists.error'
import { CreateUserUseCase } from '@/auth/application/use-cases/create-user-use-case'
import { createUserInstance } from '$/factories/auth/user-factories'
import {
  mockedUserRepository,
  userRepositoryFns,
} from '$/repositories/mock/mocked-user-repository'

vi.mock('bcrypt', () => ({
  hashSync: vi.fn(),
}))

const hashSyncMock = hashSync as Mock<typeof hashSync>

let sut: CreateUserUseCase

describe('CreateUserUseCase', () => {
  describe('UT', () => {
    beforeEach(() => {
      sut = new CreateUserUseCase(mockedUserRepository)
    })

    it('should return a UserAlreadyExistsError when the user already exists', async () => {
      userRepositoryFns.findOneByEmail.mockResolvedValue(createUserInstance())

      const response = await sut.execute({
        email: 'any_email',
        password: 'password',
      })

      expect(response.isLeft()).toBeTruthy()
      expect(response.value).toBeInstanceOf(UserAlreadyExistsError)
    })

    it('should create a user', async () => {
      userRepositoryFns.findOneByEmail.mockResolvedValue(null)

      hashSyncMock.mockReturnValue('hashed_password')

      const response = await sut.execute({
        email: 'a_email@mail.com',
        password: 'password',
      })

      expect(response.isRight()).toBeTruthy()
      expect(mockedUserRepository.create).toBeCalledTimes(1)
    })
  })
})
