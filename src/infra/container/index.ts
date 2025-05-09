import { Container } from 'inversify'

import { authDiContainer } from './auth/di'
import { clientDiContainer } from './client/di'
import { infraDiContainer } from './infra/di'

export const diContainer = new Container()

diContainer.load(authDiContainer, clientDiContainer, infraDiContainer)
