export const AUTH_SYMBOLS = {
  UserRepository: Symbol.for('UserRepository'),
  UserDAO: Symbol.for('UserDAO'),
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  AuthenticateUserUseCase: Symbol.for('AuthenticateUserUseCase'),
  ChangeUserPasswordUseCase: Symbol.for('ChangeUserPasswordUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
}
