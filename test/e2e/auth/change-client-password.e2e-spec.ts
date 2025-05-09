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
describe('Change Client Password E2E', () => {
  beforeAll(() => {
    diContainer.bind(UserFactory.name).to(UserFactory)
    diContainer.bind(JwtMotherObject.name).to(JwtMotherObject)

    userFactory = diContainer.get<UserFactory>(UserFactory.name)

    app = new App()

    app.useConfigs().createRoutes()

    jwtMother = diContainer.get<JwtMotherObject>(JwtMotherObject.name)
    prisma = diContainer.get<PrismaService>(INFRA_SYMBOLS.PrismaService)
    userFactory = diContainer.get<UserFactory>(UserFactory.name)
  })

  describe('Jwt guard', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app.httpServerInstance).patch(
        '/client/a_client_id/change-password',
      )

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })

    it('should return 401 if invalid token is provided', async () => {
      const response = await request(app.httpServerInstance)
        .patch('/client/a_client_id/change-password')
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
        .patch('/client/a_client_id/change-password')
        .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })
  })

  it('should return 400 if invalid data is provided', async () => {
    const token = await jwtMother.createAdminJwt()

    const response = await request(app.httpServerInstance)
      .patch(`/client/${faker.string.uuid()}/change-password`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Invalid Data',
      errors: ['Required'],
    })
  })

  it('should return 404 if user does not exists', async () => {
    const token = await jwtMother.createAdminJwt()

    const response = await request(app.httpServerInstance)
      .patch(`/client/${faker.string.uuid()}/change-password`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)
      .send({ password: 'new_password' })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: 'ResourceNotFoundError',
      message: 'Resource not found',
    })
  })

  it('should return 204 and update client password', async () => {
    const token = await jwtMother.createAdminJwt()
    const user = await userFactory.makePrismaUser()

    const response = await request(app.httpServerInstance)
      .patch(`/client/${user.id}/change-password`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)
      .send({ password: 'new_password' })

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id.toString() },
    })

    expect(response.status).toBe(204)
    expect(user.comparePassword(updatedUser!.password)).toBeFalsy()
  })
})
