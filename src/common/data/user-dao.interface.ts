export interface UserDAO {
  doesUserExist(id: string): Promise<boolean>
  doesAdminExist(id: string): Promise<boolean>
}
