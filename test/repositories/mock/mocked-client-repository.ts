import type { ClientRepository } from '@/client/enterprise/repositories/client-repository.interface'

export const clientRepositoryFns = {
  findOneById: vi.fn(),
  save: vi.fn(),
}

export const mockedClientRepository: ClientRepository = clientRepositoryFns
