import type { User } from '../entities/user'

export interface UserRepository {
  findOneByEmail(email: string): Promise<User | null>
  create(user: User): Promise<void>
}
