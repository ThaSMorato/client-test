import type { ClientRepository } from '@/client/enterprise/repositories/client-repository.interface'
import type { UserDAO } from '@/common/data/user-dao.interface'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import type { Either } from '@/common/helpers/either'
import { left, right } from '@/common/helpers/either'

import { EmailAlreadyExistsError } from '../errors/email-already-exists.error'

interface EditClientDataRequest {
  id: string
  name?: string
  email?: string
}

export class EditClientDataUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly userDAO: UserDAO,
  ) {}

  async execute({
    id,
    ...props
  }: EditClientDataRequest): Promise<Either<ResourceNotFoundError, null>> {
    const client = await this.clientRepository.findOneById(id)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    if (props.email) {
      const emailExists = await this.userDAO.doesUserEmailExist(props.email)

      if (emailExists && props.email !== client.email) {
        return left(new EmailAlreadyExistsError())
      }
    }

    client.update(props)

    await this.clientRepository.save(client)

    return right(null)
  }
}
