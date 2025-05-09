export const CLIENT_SYMBOLS = {
  ProductGateway: Symbol.for('ProductGateway'),
  ClientRepository: Symbol.for('ClientRepository'),
  EditClientDataController: Symbol.for('EditClientDataController'),
  EditOwnDataController: Symbol.for('EditOwnDataController'),
  FetchProfileController: Symbol.for('FetchProfileController'),
  FetchClientByIdController: Symbol.for('FetchClientByIdController'),
  ToggleFavoriteProductController: Symbol.for(
    'ToggleFavoriteProductController',
  ),
  EditClientDataUseCase: Symbol.for('EditClientDataUseCase'),
  FindClientByIdUseCase: Symbol.for('FindClientByIdUseCase'),
  ToggleFavoriteProductUseCase: Symbol.for('ToggleFavoriteProductUseCase'),
}
