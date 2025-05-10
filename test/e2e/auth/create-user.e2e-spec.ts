import request from 'supertest'

import { diContainer } from '@/infra/container'
import { INFRA_SYMBOLS } from '@/infra/container/infra/symbols'
import type { PrismaService } from '@/infra/db/prisma/prisma-service'
import { App } from '@/infra/http/app'
import { UserFactory } from '$/factories/auth/user-factories'

let app: App
let prisma: PrismaService
let userFactory: UserFactory

describe('Create User E2E', () => {
  beforeAll(() => {
    diContainer.bind(UserFactory.name).to(UserFactory)

    app = new App()

    app.useConfigs().createRoutes()

    prisma = diContainer.get<PrismaService>(INFRA_SYMBOLS.PrismaService)
    userFactory = diContainer.get<UserFactory>(UserFactory.name)
  })

  it('should return 400 if invalid data is provided', async () => {
    const response = await request(app.httpServerInstance)
      .post('/register')
      .send({ email: 'invalid_email', name: 'invalid_name' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Invalid Data',
      errors: ['Invalid email', 'Required'],
    })
  })

  it('should return 409 if user already exists', async () => {
    const user = await userFactory.makePrismaUser()

    const response = await request(app.httpServerInstance)
      .post('/register')
      .send({ email: user.email, name: user.name, password: '1234%abcdE' })

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      error: 'UserAlreadyExistsError',
      message: 'User already exists',
    })
  })

  it('should create an user and return 201 and the email and password', async () => {
    const response = await request(app.httpServerInstance)
      .post('/register')
      .send({
        email: 'jhon_doe@mail.com',
        name: 'Jhon Doe',
        password: '1234%abcdE',
      })

    const user = await prisma.user.findUnique({
      where: { email: 'jhon_doe@mail.com' },
    })

    expect(user).not.toBeNull()
    expect(user?.email).toBe('jhon_doe@mail.com')
    expect(response.status).toBe(201)
  })
})
