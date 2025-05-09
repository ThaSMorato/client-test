import { inject, injectable } from 'inversify'

import { UserRole } from '@/auth/enterprise/entities/user'
import type { Client } from '@/client/enterprise/entities/client'
import type { ClientRepository } from '@/client/enterprise/repositories/client-repository.interface'
import { COMMON_SYMBOLS } from '@/infra/container/infra/symbols'

import { PrismaClientMapper } from '../mappers/prisma-client-mapper'
import type { PrismaService } from '../prisma-service'

@injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(
    @inject(COMMON_SYMBOLS.PrismaService) private prismaService: PrismaService,
  ) {}

  async save(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPersistence(client)

    await this.prismaService.user.update({
      where: {
        id: client.id.toString(),
      },
      data: {
        name: data.name,
        email: data.email,
        favoriteProducts: {
          create: data.favoriteProducts.create,
          delete: data.favoriteProducts.delete,
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
