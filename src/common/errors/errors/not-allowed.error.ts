import type { UseCaseError } from '@/common/errors/use-case-error.interface'

export class NotAllowedError extends Error implements UseCaseError {
  public code: number
  constructor() {
    super('Not allowed')
    this.code = 401
    this.name = 'NotAllowedError'
  }
}
