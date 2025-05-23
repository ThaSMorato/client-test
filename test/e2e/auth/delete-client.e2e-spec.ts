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
let userFactory: UserFactory

describe('Delete Client E2E', () => {
  beforeAll(() => {
    diContainer.bind(UserFactory.name).to(UserFactory)
    diContainer.bind(JwtMotherObject.name).to(JwtMotherObject)

    app = new App()

    app.useConfigs().createRoutes()

    jwtMother = diContainer.get<JwtMotherObject>(JwtMotherObject.name)
    prisma = diContainer.get<PrismaService>(INFRA_SYMBOLS.PrismaService)
    userFactory = diContainer.get<UserFactory>(UserFactory.name)
  })

  describe('Jwt guard', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app.httpServerInstance).delete(
        '/client/a_client_id',
      )

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })

    it('should return 401 if invalid token is provided', async () => {
      const response = await request(app.httpServerInstance)
        .delete('/client/a_client_id')
        .set('Cookie', `${JwtToken.jwtCookieName}=invalid_token`)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })

    it('should return 401 if token is provided but user is not admin', async () => {
      const token = await jwtMother.createUserJwt()

      const response = await request(app.httpServerInstance)
        .delete('/client/a_client_id')
        .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })
  })

  it('should return 404 if client not found', async () => {
    const token = await jwtMother.createAdminJwt()

    const response = await request(app.httpServerInstance)
      .delete(`/client/${faker.string.uuid()}`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      message: 'Resource not found',
      error: 'ResourceNotFoundError',
    })
  })

  it('should return 204 and delete user', async () => {
    const token = await jwtMother.createAdminJwt()

    const user = await userFactory.makePrismaUser()

    const response = await request(app.httpServerInstance)
      .delete(`/client/${user.id}`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id.toString() },
    })

    expect(response.status).toBe(204)
    expect(updatedUser).toBeNull()
  })
})
