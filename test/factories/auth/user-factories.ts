import { faker } from '@faker-js/faker'
import { inject, injectable } from 'inversify'

import type { UserInstanceProps } from '@/auth/enterprise/entities/user'
import { User, UserRole } from '@/auth/enterprise/entities/user'
import { INFRA_SYMBOLS } from '@/infra/container/infra/symbols'
import { PrismaUserMapper } from '@/infra/db/prisma/mappers/prisma-user-mapper'
import type { PrismaService } from '@/infra/db/prisma/prisma-service'

export function createUserInstance({
  id,
  ...overrides
}: Partial<UserInstanceProps & { id: string }> = {}): User {
  const instance = User.hydrate(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      role: UserRole.USER,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      ...overrides,
    },
    id ?? faker.string.uuid(),
  )

  return instance
}

@injectable()
export class UserFactory {
  constructor(
    @inject(INFRA_SYMBOLS.PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  async makePrismaUser(
    override: Partial<UserInstanceProps> = {},
    id?: string,
  ): Promise<User> {
    const user = createUserInstance({ ...override, id })

    await this.prismaService.user.create({
      data: PrismaUserMapper.toPersistence(user),
    })

    return user
  }
}
