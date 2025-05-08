import type { ClientRepository } from '@/client/enterprise/repositories/client-repository.interface'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import type { Either } from '@/common/helpers/either'
import { left, right } from '@/common/helpers/either'

interface EditClientDataRequest {
  id: string
  name?: string
  email?: string
}

export class EditClientDataUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    id,
    ...props
  }: EditClientDataRequest): Promise<Either<ResourceNotFoundError, null>> {
    const client = await this.clientRepository.findOneById(id)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    client.update(props)

    await this.clientRepository.save(client)

    return right(null)
  }
}
