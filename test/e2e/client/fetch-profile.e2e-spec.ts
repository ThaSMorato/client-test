import { faker } from '@faker-js/faker'
import request from 'supertest'

import { JwtToken } from '@/common/value-objects/jwt-token'
import { diContainer } from '@/infra/container'
import { INFRA_SYMBOLS } from '@/infra/container/infra/symbols'
import type { PrismaService } from '@/infra/db/prisma/prisma-service'
import { App } from '@/infra/http/app'
import { UserFactory } from '$/factories/auth/user-factories'
import { JwtMotherObject } from '$/factories/jwt/jwt-mother-object'

let app: App
let jwtMother: JwtMotherObject
let prisma: PrismaService

describe('Fetch Profile E2E', () => {
  beforeAll(() => {
    diContainer.bind(UserFactory.name).to(UserFactory)
    diContainer.bind(JwtMotherObject.name).to(JwtMotherObject)

    app = new App()

    app.useConfigs().createRoutes()

    jwtMother = diContainer.get<JwtMotherObject>(JwtMotherObject.name)
    prisma = diContainer.get<PrismaService>(INFRA_SYMBOLS.PrismaService)
  })

  describe('Jwt guard', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app.httpServerInstance).get('/profile')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })

    it('should return 401 if invalid token is provided', async () => {
      const response = await request(app.httpServerInstance)
        .get('/profile')
        .set('Cookie', `${JwtToken.jwtCookieName}=invalid_token`)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })

    it('should return 401 if token is provided but user is a admin', async () => {
      const token = await jwtMother.createAdminJwt()

      const response = await request(app.httpServerInstance)
        .get('/profile')
        .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })
  })

  it('should return 200 and fetch profile data', async () => {
    const userId = faker.string.uuid()
    const token = await jwtMother.createUserJwt({
      id: userId,
    })

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })

    const response = await request(app.httpServerInstance)
      .get('/profile')
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      profile: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        favoriteProducts: [],
      },
    })
  })
})
