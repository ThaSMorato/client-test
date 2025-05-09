import { faker } from '@faker-js/faker'

import type { UserInstanceProps } from '@/auth/enterprise/entities/user'
import { User, UserRole } from '@/auth/enterprise/entities/user'

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
