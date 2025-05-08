export class InvalidEmailError extends Error {
  public code: number
  constructor() {
    super('Invalid email')
    this.code = 400
    this.name = 'InvalidEmailError'
  }
}
