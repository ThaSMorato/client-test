import { ContainerModule } from 'inversify'

import { PrismaService } from '@/infra/db/prisma/prisma-service'
import { EnvService } from '@/infra/env/env-service'
import { AuthRoutes } from '@/infra/http/routes/auth-routes'
import { ClientRoutes } from '@/infra/http/routes/client-routes'

import { INFRA_SYMBOLS } from './symbols'

export const infraDiContainer = new ContainerModule(({ bind }) => {
  bind(INFRA_SYMBOLS.PrismaService).to(PrismaService)
  bind(INFRA_SYMBOLS.EnvService).to(EnvService)
  bind(INFRA_SYMBOLS.AuthRoutes).to(AuthRoutes)
  bind(INFRA_SYMBOLS.ClientRoutes).to(ClientRoutes)
})
