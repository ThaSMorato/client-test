import request from 'supertest'

import { JwtToken } from '@/common/value-objects/jwt-token'
import { diContainer } from '@/infra/container'
import { INFRA_SYMBOLS } from '@/infra/container/infra/symbols'
import type { PrismaService } from '@/infra/db/prisma/prisma-service'
import { App } from '@/infra/http/app'
import {
  createUserInstance,
  UserFactory,
} from '$/factories/auth/user-factories'
import { JwtMotherObject } from '$/factories/jwt/jwt-mother-object'

let app: App
let jwtMother: JwtMotherObject
let prisma: PrismaService
let userFactory: UserFactory

describe('Edit Own Data E2E', () => {
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
      const response = await request(app.httpServerInstance).put('/profile')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })

    it('should return 401 if invalid token is provided', async () => {
      const response = await request(app.httpServerInstance)
        .put('/profile')
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
        .put('/profile')
        .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Unauthorized',
        error: 'UnauthorizedError',
      })
    })
  })

  it('should return 400 if invalid data is provided', async () => {
    const token = await jwtMother.createUserJwt()

    const response = await request(app.httpServerInstance)
      .put('/profile')
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)
      .send({ name: 'new_name', email: 'new_emailemail.com' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: ['Invalid email'],
      message: 'Invalid Data',
    })
  })

  it('should return 409 if email already exists', async () => {
    const token = await jwtMother.createUserJwt()
    const anotherUser = await userFactory.makePrismaUser()

    const response = await request(app.httpServerInstance)
      .put(`/profile`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)
      .send({ name: 'new_name', email: anotherUser.email })

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      error: 'EmailAlreadyExistsError',
      message: 'Email already exists',
    })
  })

  it('should return 204 and update user data', async () => {
    const userInstance = createUserInstance()
    const token = await jwtMother.createUserJwt({
      id: userInstance.id.toString(),
    })

    const user = await prisma.user.findUnique({
      where: { id: userInstance.id.toString() },
    })

    const response = await request(app.httpServerInstance)
      .put('/profile')
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)
      .send({ name: 'new_name', email: 'new_email@email.com' })

    const updatedUser = await prisma.user.findUnique({
      where: { id: userInstance.id.toString() },
    })

    expect(response.status).toBe(204)
    expect(user?.name !== updatedUser?.name).toBeTruthy()
    expect(user?.email !== updatedUser?.email).toBeTruthy()
  })
})
