import { compareSync, hashSync } from 'bcrypt'
import type { Mock } from 'vitest'

import { Password } from '@/auth/enterprise/object-values/password'

vi.mock('bcrypt', () => ({
  hashSync: vi.fn(),
  compareSync: vi.fn(),
}))

vi.mock('node:crypto', () => ({
  randomBytes: vi.fn(),
}))

const compareSyncMock = compareSync as Mock<typeof compareSync>
const hashSyncMock = hashSync as Mock<typeof hashSync>

describe('Password', () => {
  afterAll(() => {
    vi.clearAllMocks()
  })
  describe('UT', () => {
    describe('create', () => {
      it('should hash the password', () => {
        const password = 'a-password'

        hashSyncMock.mockImplementation((value) => `hashed-${value}`)

        const passwordObject = Password.create({ password })

        expect(passwordObject.value).toEqual('hashed-a-password')
        expect(hashSyncMock).toHaveBeenCalledWith(password, 10)
      })
    })

    describe('hydrate', () => {
      it('should hydrate a password object without hashing', () => {
        const password = 'test-hydrate'

        const passwordObject = Password.hydrate({ password })

        expect(passwordObject.value).toEqual(password)
      })
    })

    describe('compare', () => {
      it('should compare the password', () => {
        const password = 'a-password'

        hashSyncMock.mockImplementation((value) => `hashed-${value}`)

        const passwordObject = Password.create({ password })

        compareSyncMock.mockImplementation(
          (value, pass) => `hashed-${value}` === pass,
        )

        expect(passwordObject.compare(password)).toBeTruthy()
        expect(compareSyncMock).toHaveBeenCalledWith(
          password,
          passwordObject.value,
        )
      })
    })
  })
})
