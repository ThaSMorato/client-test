import type { UseCaseError } from '@/common/errors/use-case-error.interface'

export class ResourceNotFoundError extends Error implements UseCaseError {
  public code: number

  constructor() {
    super('Resource not found')
    this.name = 'ResourceNotFoundError'
    this.code = 404
  }
}
