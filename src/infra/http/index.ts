import { diContainer } from '../container'
import { INFRA_SYMBOLS } from '../container/infra/symbols'
import type { EnvService } from '../env/env-service'
import { App } from './app'

const bootstrap = () => {
  const app = new App()

  const envService = diContainer.get<EnvService>(INFRA_SYMBOLS.EnvService)
  const port = envService.get('PORT')

  app.useConfigs().createRoutes().listen(port)
}

bootstrap()
