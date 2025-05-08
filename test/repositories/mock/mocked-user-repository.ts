import type { UserRepository } from '@/auth/enterprise/repositories/user-repository.interface'

export const userRepositoryFns = {
  findOneByEmail: vi.fn(),
  create: vi.fn(),
}

export const mockedUserRepository: UserRepository = userRepositoryFns
