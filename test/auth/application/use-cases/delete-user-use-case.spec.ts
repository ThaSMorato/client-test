import { DeleteUserUseCase } from '@/auth/application/use-cases/delete-user-use-case'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import { createUserInstance } from '$/factories/auth/user-factories'
import {
  mockedUserRepository,
  userRepositoryFns,
} from '$/repositories/mock/mocked-user-repository'

let sut: DeleteUserUseCase

describe('DeleteUserUseCase', () => {
  describe('UT', () => {
    beforeEach(() => {
      sut = new DeleteUserUseCase(mockedUserRepository)
    })

    it('should return a ResourceNotFoundError if the user is not found', async () => {
      userRepositoryFns.findOneById.mockResolvedValue(null)

      const result = await sut.execute('non-existent-user-id')

      expect(result.isLeft()).toBeTruthy()
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })

    it('should delete the user if the user is found', async () => {
      const user = createUserInstance()

      userRepositoryFns.findOneById.mockResolvedValue(user)

      const result = await sut.execute(user.id.toString())

      expect(result.isRight()).toBeTruthy()
      expect(userRepositoryFns.delete).toHaveBeenCalledWith(user)
    })
  })
})
