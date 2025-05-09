export interface UserDAO {
  doesUserExist(id: string): Promise<boolean>
  doesAdminExist(id: string): Promise<boolean>
  doesClientExist(id: string): Promise<boolean>
}
