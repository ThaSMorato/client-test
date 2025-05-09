import { ContainerModule } from 'inversify'

import { PrismaService } from '@/infra/db/prisma/prisma-service'
import { EnvService } from '@/infra/env/env-service'

import { INFRA_SYMBOLS } from './symbols'

export const infraDiContainer = new ContainerModule(({ bind }) => {
  bind(INFRA_SYMBOLS.PrismaService).to(PrismaService)
  bind(INFRA_SYMBOLS.EnvService).to(EnvService)
})
