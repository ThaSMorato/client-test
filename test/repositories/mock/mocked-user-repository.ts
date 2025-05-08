import type { UserRepository } from '@/auth/enterprise/repositories/user-repository.interface'

export const userRepositoryFns = {
  findOneById: vi.fn(),
  findOneByEmail: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
}

export const mockedUserRepository: UserRepository = userRepositoryFns
