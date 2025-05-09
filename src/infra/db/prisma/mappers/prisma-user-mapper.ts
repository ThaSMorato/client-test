import type { User as PrismaUser } from '@prisma/client'

import type { UserRole } from '@/auth/enterprise/entities/user'
import { User } from '@/auth/enterprise/entities/user'

export class PrismaUserMapper {
  static toDomain(user: PrismaUser): User {
    const instance = User.hydrate(
      {
        createdAt: user.createdAt,
        updatedAt: user.updatedAt ? user.updatedAt : undefined,
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role as UserRole,
      },
      user.id,
    )

    return instance
  }

  static toPersistence(user: User): PrismaUser {
    return {
      id: user.id.toString(),
      createdAt: user.createdAt,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
      updatedAt: user.updatedAt ? user.updatedAt : null,
    }
  }
}
