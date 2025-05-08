import { hashSync } from 'bcrypt'
import type { Mock } from 'vitest'

import { ChangeUserPasswordUseCase } from '@/auth/application/use-cases/change-user-password-use-case'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import { createUserInstance } from '$/factories/auth/user-factories'
import {
  mockedUserRepository,
  userRepositoryFns,
} from '$/repositories/mock/mocked-user-repository'

vi.mock('bcrypt', () => ({
  hashSync: vi.fn(),
}))

const hashSyncMock = hashSync as Mock<typeof hashSync>

let sut: ChangeUserPasswordUseCase

describe('ChangeUserPasswordUseCase', () => {
  describe('UT', () => {
    beforeEach(() => {
      sut = new ChangeUserPasswordUseCase(mockedUserRepository)
    })

    it('should return a ResourceNotFoundError if the user is not found', async () => {
      userRepositoryFns.findOneById.mockResolvedValue(null)

      const result = await sut.execute({
        id: 'non-existent-user-id',
        password: 'new-password',
      })

      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })

    it('should update the password if the user is found', async () => {
      const user = createUserInstance()

      userRepositoryFns.findOneById.mockResolvedValue(user)
      hashSyncMock.mockReturnValue('hashed_password')

      const result = await sut.execute({
        id: user.id.toString(),
        password: 'new-password',
      })

      expect(result.isRight()).toBeTruthy()
      expect(userRepositoryFns.save).toHaveBeenCalledWith(user)
      expect(hashSyncMock).toHaveBeenCalledWith('new-password', 10)
      expect(user.password).toBe('hashed_password')
    })
  })
})
