import { inject, injectable } from 'inversify'

import type { User } from '@/auth/enterprise/entities/user'
import { UserRole } from '@/auth/enterprise/entities/user'
import type { UserRepository } from '@/auth/enterprise/repositories/user-repository.interface'
import type { UserDAO } from '@/common/data/user-dao.interface'
import { INFRA_SYMBOLS } from '@/infra/container/infra/symbols'

import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import type { PrismaService } from '../prisma-service'

@injectable()
export class PrismaUserRepository implements UserRepository, UserDAO {
  constructor(
    @inject(INFRA_SYMBOLS.PrismaService) private prismaService: PrismaService,
  ) {}

  async save(user: User): Promise<void> {
    const { id, ...data } = PrismaUserMapper.toPersistence(user)

    await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    })
  }

  async findOneById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async delete(user: User): Promise<void> {
    await this.prismaService.user.delete({
      where: {
        id: user.id.toString(),
      },
    })
  }

  async doesUserExist(id: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    })

    return !!user
  }

  async doesAdminExist(id: string): Promise<boolean> {
    const admin = await this.prismaService.user.findUnique({
      where: {
        id,
        role: UserRole.ADMIN,
      },
    })

    return !!admin
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistence(user)

    await this.prismaService.user.create({
      data,
    })
  }
}
