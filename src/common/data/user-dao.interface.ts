export interface UserDAO {
  doesUserExists(id: string): Promise<boolean>
  doesAdminExists(id: string): Promise<boolean>
}
