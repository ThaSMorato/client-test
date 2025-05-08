import type { Client } from '../entities/client'

export interface ClientRepository {
  findByOneId(id: string): Promise<Client | null>
  save(client: Client): Promise<void>
}
