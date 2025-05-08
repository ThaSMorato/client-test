import type { User } from '../entities/user'

export interface UserRepository {
  findOneByEmail(email: string): Promise<User | null>
  create(user: User): Promise<void>
  save(user: User): Promise<void>
  findOneById(id: string): Promise<User | null>
  delete(user: User): Promise<void>
}
