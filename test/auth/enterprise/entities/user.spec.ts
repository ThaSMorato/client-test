import { hashSync } from 'bcrypt'
import type { Mock } from 'vitest'

import { User, UserRole } from '@/auth/enterprise/entities/user'
import { Password } from '@/auth/enterprise/object-values/password'

vi.mock('bcrypt', () => ({
  hashSync: vi.fn(),
}))

const hashSyncMock = hashSync as Mock<typeof hashSync>

describe('User', () => {
  beforeAll(() => {
    vi.useFakeTimers({
      now: new Date('2021-01-01T10:00:00Z'),
    })
  })

  describe('UT', () => {
    describe('create', () => {
      it('should create a user object with the created date as now', () => {
        hashSyncMock.mockImplementation((value) => `hashed-${value}`)

        const user = User.create({
          email: 'test@jhon.com',
          password: '123456',
          role: UserRole.USER,
        })

        expect(user.email).toEqual('test@jhon.com')
        expect(user.password).toEqual('hashed-123456')
        expect(user.createdAt).toStrictEqual(new Date('2021-01-01T10:00:00Z'))
      })
    })

    describe('hydrate', () => {
      it('should hydrate a user object', () => {
        const user = User.hydrate(
          {
            email: 'test-email',
            password: 'test-password',
            role: UserRole.USER,
            createdAt: new Date('2020-01-01T10:00:00Z'),
            updatedAt: new Date('2020-01-01T10:00:00Z'),
          },
          '1',
        )

        expect(user.email).toEqual('test-email')
        expect(user.password).toEqual('test-password')
        expect(user.role).toEqual(UserRole.USER)
        expect(user.createdAt).toStrictEqual(new Date('2020-01-01T10:00:00Z'))
        expect(user.updatedAt).toStrictEqual(new Date('2020-01-01T10:00:00Z'))
      })
    })

    describe('comparePassword', () => {
      it('should compare the given password with its own', () => {
        const compareMock = vi.spyOn(Password.prototype, 'compare')

        compareMock.mockImplementation((pass) => pass === '123456')

        const user = User.hydrate(
          {
            email: 'test-email',
            password: '123456',
            role: UserRole.USER,
            createdAt: new Date('2020-01-01T10:00:00Z'),
          },
          '1',
        )

        expect(user.comparePassword('123456')).toBeTruthy()
      })
    })

    describe('updatePassword', () => {
      it('should update the password', () => {
        const user = User.hydrate(
          {
            email: 'test-email',
            password: '123456',
            role: UserRole.USER,
            createdAt: new Date('2020-01-01T10:00:00Z'),
          },
          '1',
        )

        user.updatePassword('123456')

        expect(user.password).toEqual('hashed-123456')
      })
    })
  })
})
