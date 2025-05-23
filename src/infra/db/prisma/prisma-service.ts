import { PrismaClient } from '@prisma/client'
import { injectable } from 'inversify'

@injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ['warn', 'error'],
    })
  }
}
