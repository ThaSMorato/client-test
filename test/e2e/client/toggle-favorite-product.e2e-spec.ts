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

describe('Toggle Favorite Product E2E', () => {
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
      const response = await request(app.httpServerInstance).post(
        '/product/1/favorite',
      )

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })

    it('should return 401 if invalid token is provided', async () => {
      const response = await request(app.httpServerInstance)
        .post('/product/1/favorite')
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
        .post('/product/1/favorite')
        .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })
  })

  it('should return 404 if product does not exists', async () => {
    const token = await jwtMother.createUserJwt()

    const response = await request(app.httpServerInstance)
      .post('/product/99999/favorite')
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      message: 'Resource not found',
      error: 'ResourceNotFoundError',
    })
  })

  it('should return 204 and fetch profile data', async () => {
    const userId = faker.string.uuid()
    const token = await jwtMother.createUserJwt({
      id: userId,
    })

    const response = await request(app.httpServerInstance)
      .post('/product/1/favorite')
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        favoriteProducts: true,
      },
    })

    expect(response.status).toBe(204)
    expect(user?.favoriteProducts.length).toBe(1)
    expect(user?.favoriteProducts[0].productId).toBe('1')
  })
})
