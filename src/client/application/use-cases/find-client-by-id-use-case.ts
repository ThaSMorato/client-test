import type { Client } from '@/client/enterprise/entities/client'
import type { ClientRepository } from '@/client/enterprise/repositories/client-repository.interface'
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found.error'
import type { Either } from '@/common/helpers/either'
import { left, right } from '@/common/helpers/either'

export class FindClientByIdUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(id: string): Promise<Either<ResourceNotFoundError, Client>> {
    const client = await this.clientRepository.findOneById(id)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    return right(client)
  }
}
