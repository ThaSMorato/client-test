import { faker } from '@faker-js/faker'
import request from 'supertest'

import { JwtToken } from '@/common/value-objects/jwt-token'
import { diContainer } from '@/infra/container'
import { App } from '@/infra/http/app'
import { UserFactory } from '$/factories/auth/user-factories'
import { JwtMotherObject } from '$/factories/jwt/jwt-mother-object'

let app: App
let jwtMother: JwtMotherObject
let userFactory: UserFactory

describe('Fetch Client By Id E2E', () => {
  beforeAll(() => {
    diContainer.bind(UserFactory.name).to(UserFactory)
    diContainer.bind(JwtMotherObject.name).to(JwtMotherObject)

    userFactory = diContainer.get<UserFactory>(UserFactory.name)

    app = new App()

    app.useConfigs().createRoutes()

    jwtMother = diContainer.get<JwtMotherObject>(JwtMotherObject.name)
    userFactory = diContainer.get<UserFactory>(UserFactory.name)
  })

  describe('Jwt guard', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app.httpServerInstance).get(
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
        .get('/client/a_client_id')
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
        .get('/client/a_client_id')
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
      .get(`/client/${faker.string.uuid()}`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: 'ResourceNotFoundError',
      message: 'Resource not found',
    })
  })

  it('should return 200 and fetch client data', async () => {
    const token = await jwtMother.createAdminJwt()
    const user = await userFactory.makePrismaUser()

    const response = await request(app.httpServerInstance)
      .get(`/client/${user.id}`)
      .set('Cookie', `${JwtToken.jwtCookieName}=${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      client: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        favoriteProducts: [],
      },
    })
  })
})
