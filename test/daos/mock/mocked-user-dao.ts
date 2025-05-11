import type { UserDAO } from '@/common/data/user-dao.interface'

export const userDAOfns = {
  doesUserExist: vi.fn(),
  doesAdminExist: vi.fn(),
  doesUserEmailExist: vi.fn(),
  doesClientExist: vi.fn(),
}

export const mockedUserDao: UserDAO = userDAOfns
