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

describe('Edit Client Data E2E', () => {
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
      const response = await request(app.httpServerInstance).put(
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
        .put('/client/a_client_id')
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
        .put('/client/a_client_id')
        .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })
  })

  it('should return 404 if user does not exists', async () => {
    const token = await jwtMother.createAdminJwt()

    const response = await request(app.httpServerInstance)
      .put(`/client/${faker.string.uuid()}`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)
      .send({ name: 'new_name' })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: 'ResourceNotFoundError',
      message: 'Resource not found',
    })
  })

  it('should return 400 if invalid data is provided', async () => {
    const token = await jwtMother.createAdminJwt()
    const user = await userFactory.makePrismaUser()

    const response = await request(app.httpServerInstance)
      .put(`/client/${user.id}`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)
      .send({ name: 'new_name', email: 'new_emailemail.com' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Invalid Data',
      errors: ['Invalid email'],
    })
  })

  it('should return 409 if email already exists', async () => {
    const token = await jwtMother.createAdminJwt()
    const user = await userFactory.makePrismaUser()
    const anotherUser = await userFactory.makePrismaUser()
    const response = await request(app.httpServerInstance)
      .put(`/client/${user.id}`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)
      .send({ name: 'new_name', email: anotherUser.email })

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      error: 'EmailAlreadyExistsError',
      message: 'Email already exists',
    })
  })

  it('should return 204 and update client data', async () => {
    const token = await jwtMother.createAdminJwt()
    const user = await userFactory.makePrismaUser()

    const response = await request(app.httpServerInstance)
      .put(`/client/${user.id}`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)
      .send({ name: 'new_name' })

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id.toString() },
    })

    expect(response.status).toBe(204)
    expect(user.name !== updatedUser!.name).toBeTruthy()
  })
})
