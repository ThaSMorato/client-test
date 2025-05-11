import { EmailAlreadyExistsError } from 'src/client/application/errors/email-already-exists.error'
import { EditClientDataUseCase } from 'src/client/application/use-cases/edit-client-data-use-case'

import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import { mockedUserDao, userDAOfns } from '$/daos/mock/mocked-user-dao'
import { createClientInstance } from '$/factories/client/client-factories'
import {
  clientRepositoryFns,
  mockedClientRepository,
} from '$/repositories/mock/mocked-client-repository'

let sut: EditClientDataUseCase

describe('EditClientDataUseCase', () => {
  describe('UT', () => {
    beforeEach(() => {
      sut = new EditClientDataUseCase(mockedClientRepository, mockedUserDao)
    })
    it('should return a ResourceNotFoundError if the client is not found', async () => {
      clientRepositoryFns.findOneById.mockResolvedValue(null)
      const result = await sut.execute({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
    it('should return a EmailAlreadyExistsError if the email already exists', async () => {
      clientRepositoryFns.findOneById.mockResolvedValue(
        createClientInstance({
          name: 'John Doe',
          email: 'john.doe@example.com',
        }),
      )

      userDAOfns.doesUserEmailExist.mockResolvedValue(true)

      const result = await sut.execute({
        id: '1',
        name: 'Doe John',
        email: 'doe.john@example.com',
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
    })
    it('should edit the client data', async () => {
      clientRepositoryFns.findOneById.mockResolvedValue(
        createClientInstance({
          name: 'John Doe',
          email: 'john.doe@example.com',
        }),
      )

      userDAOfns.doesUserEmailExist.mockResolvedValue(false)

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
    it('should edit the client data and not change the email if it is the same', async () => {
      clientRepositoryFns.findOneById.mockResolvedValue(
        createClientInstance({
          name: 'John Doe',
          email: 'john.doe@example.com',
        }),
      )

      userDAOfns.doesUserEmailExist.mockResolvedValue(false)

      const result = await sut.execute({
        id: '1',
        name: 'Doe John',
        email: 'john.doe@example.com',
      })

      expect(result.isRight()).toBe(true)
      expect(clientRepositoryFns.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Doe John',
          email: 'john.doe@example.com',
        }),
      )
    })
  })
})
