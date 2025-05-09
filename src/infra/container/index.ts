import { Container } from 'inversify'

import { authDiContainer } from './auth/di'
import { clientDiContainer } from './client/di'
import { infraDiContainer } from './infra/di'

const diContainer = new Container()

diContainer.loadSync(authDiContainer, clientDiContainer, infraDiContainer)

export { diContainer }
