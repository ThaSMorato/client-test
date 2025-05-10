import request from 'supertest'

import { Password } from '@/auth/enterprise/object-values/password'
import { JwtToken } from '@/common/value-objects/jwt-token'
import { diContainer } from '@/infra/container'
import { App } from '@/infra/http/app'
import { UserFactory } from '$/factories/auth/user-factories'

let app: App
let userFactory: UserFactory

describe('Authenticate User E2E', () => {
  beforeAll(() => {
    diContainer.bind(UserFactory.name).to(UserFactory)

    app = new App()

    app.useConfigs().createRoutes()

    userFactory = diContainer.get<UserFactory>(UserFactory.name)
  })

  it('should return 400 if invalid data is provided', async () => {
    const response = await request(app.httpServerInstance)
      .post('/login')
      .send({ email: 'invalid_email', password: 'a_password' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Invalid Data',
      errors: ['Invalid email'],
    })
  })

  it('should return 404 if user does not exists', async () => {
    const response = await request(app.httpServerInstance)
      .post('/login')
      .send({ email: 'not_a_real@mail.com', password: 'pass1234' })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: 'ResourceNotFoundError',
      message: 'Resource not found',
    })
  })

  it('should return 401 if password does not match', async () => {
    const password = Password.create({ password: 'pass1234' }).value

    const user = await userFactory.makePrismaUser({
      password,
    })

    const response = await request(app.httpServerInstance)
      .post('/login')
      .send({ email: user.email, password: `not_pass1234` })

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      error: 'InvalidCredentialError',
      message: 'Invalid credentials',
    })
  })

  it('should authenticate the user, return 202 and the jwt on header', async () => {
    const password = Password.create({ password: 'pass1234' }).value

    const user = await userFactory.makePrismaUser({ password })

    const response = await request(app.httpServerInstance)
      .post('/login')
      .send({ email: user.email, password: 'pass1234' })

    expect(response.status).toBe(202)
    expect(response.header['set-cookie'][0]).toContain(JwtToken.jwtCookieName)
  })
})
