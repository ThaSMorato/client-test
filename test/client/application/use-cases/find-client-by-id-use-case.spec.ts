import { FindClientByIdUseCase } from '@/client/application/use-cases/find-client-by-id-use-case'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import { createClientInstance } from '$/factories/client/client-factories'
import {
  clientRepositoryFns,
  mockedClientRepository,
} from '$/repositories/mock/mocked-client-repository'

let sut: FindClientByIdUseCase

describe('FindClientByIdUseCase', () => {
  describe('UT', () => {
    beforeEach(() => {
      sut = new FindClientByIdUseCase(mockedClientRepository)
    })
    it('should return a ResourceNotFoundError if the client is not found', async () => {
      clientRepositoryFns.findByOneId.mockResolvedValue(null)
      const result = await sut.execute('1')

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
    it('should return a client', async () => {
      clientRepositoryFns.findByOneId.mockResolvedValue(
        createClientInstance({
          name: 'John Doe',
          email: 'john.doe@example.com',
        }),
      )
      const result = await sut.execute('1')

      expect(result.isRight()).toBe(true)
      expect(result.value).toStrictEqual(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john.doe@example.com',
        }),
      )
    })
  })
})
