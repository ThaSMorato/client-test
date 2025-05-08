import type { UseCaseError } from '@/common/errors/use-case-error.interface'

export class InvalidCredentialError extends Error implements UseCaseError {
  public code = 401

  constructor() {
    super(`Invalid credentials`)
    this.name = 'InvalidCredentialError'
  }
}
