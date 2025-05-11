import type { UseCaseError } from '@/common/errors/use-case-error.interface'

export class EmailAlreadyExistsError extends Error implements UseCaseError {
  public readonly code = 409

  constructor() {
    super('Email already exists')
    this.name = 'EmailAlreadyExistsError'
  }
}
