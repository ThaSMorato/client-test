import cookie from 'cookie-parser'
import cors from 'cors'
import type { Express } from 'express'
import express from 'express'

import { diContainer } from '../container'
import { INFRA_SYMBOLS } from '../container/infra/symbols'
import type { AuthRoutes } from './routes/auth-routes'
import type { ClientRoutes } from './routes/client-routes'

export class App {
  private app: Express

  constructor() {
    this.app = express()
  }

  useConfigs() {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(cookie())

    return this
  }

  createRoutes() {
    const clientRoutes = diContainer.get<ClientRoutes>(
      INFRA_SYMBOLS.ClientRoutes,
    )
    clientRoutes.create()

    const authRoutes = diContainer.get<AuthRoutes>(INFRA_SYMBOLS.AuthRoutes)
    authRoutes.create()

    this.app.use(clientRoutes.expressRouter, authRoutes.expressRouter)
    return this
  }

  listen(port: number = 3000) {
    this.app.listen(port, () => console.log(`App listening on port: ${port}`))
    return this
  }

  get httpServerInstance() {
    return this.app
  }
}
