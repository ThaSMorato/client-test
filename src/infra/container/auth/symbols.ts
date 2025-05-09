export const AUTH_SYMBOLS = {
  UserRepository: Symbol.for('UserRepository'),
  UserDAO: Symbol.for('UserDAO'),
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  AuthenticateUserUseCase: Symbol.for('AuthenticateUserUseCase'),
  ChangeUserPasswordUseCase: Symbol.for('ChangeUserPasswordUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
  CreateUserController: Symbol.for('CreateUserController'),
  AuthenticateUserController: Symbol.for('AuthenticateUserController'),
  ChangeUserPasswordController: Symbol.for('ChangeUserPasswordController'),
  DeleteUserController: Symbol.for('DeleteUserController'),
  DeleteClientController: Symbol.for('DeleteClientController'),
  ChangeClientPasswordController: Symbol.for('ChangeClientPasswordController'),
}
