import { EditClientDataUseCase } from 'src/client/application/use-cases/edit-client-data-use-case'

import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import { createClientInstance } from '$/factories/client/client-factories'
import {
  clientRepositoryFns,
  mockedClientRepository,
} from '$/repositories/mock/mocked-client-repository'

let sut: EditClientDataUseCase

describe('EditClientDataUseCase', () => {
  describe('UT', () => {
    beforeEach(() => {
      sut = new EditClientDataUseCase(mockedClientRepository)
    })
    it('should return a ResourceNotFoundError if the client is not found', async () => {
      clientRepositoryFns.findByOneId.mockResolvedValue(null)
      const result = await sut.execute({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

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

      const result = await sut.execute({
        id: '1',
        name: 'Doe John',
        email: 'doe.john@example.com',
      })

      expect(result.isRight()).toBe(true)
      expect(clientRepositoryFns.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Doe John',
          email: 'doe.john@example.com',
        }),
      )
    })
  })
})
