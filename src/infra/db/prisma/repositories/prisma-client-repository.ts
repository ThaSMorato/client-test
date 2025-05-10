import { inject, injectable } from 'inversify'

import { UserRole } from '@/auth/enterprise/entities/user'
import type { Client } from '@/client/enterprise/entities/client'
import type { ClientRepository } from '@/client/enterprise/repositories/client-repository.interface'
import { INFRA_SYMBOLS } from '@/infra/container/infra/symbols'

import { PrismaClientMapper } from '../mappers/prisma-client-mapper'
import type { PrismaService } from '../prisma-service'

@injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(
    @inject(INFRA_SYMBOLS.PrismaService) private prismaService: PrismaService,
  ) {}

  async save(client: Client): Promise<void> {
    const { id, favoriteProducts, ...data } =
      PrismaClientMapper.toPersistence(client)

    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        favoriteProducts: {
          create: favoriteProducts.create.map(({ userId: _, ...prod }) => prod),
          delete: favoriteProducts.delete,
        },
      },
    })
  }

  async findOneById(id: string): Promise<Client | null> {
    const client = await this.prismaService.user.findUnique({
      where: {
        id,
        role: UserRole.USER,
      },
      include: {
        favoriteProducts: true,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }
}
