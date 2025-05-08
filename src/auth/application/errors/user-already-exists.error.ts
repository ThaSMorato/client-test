import type { UseCaseError } from '@/common/errors/use-case-error.interface'

export class UserAlreadyExistsError extends Error implements UseCaseError {
  public code = 409
  constructor() {
    super('User already exists')
    this.name = 'UserAlreadyExistsError'
  }
}
