import type { Client } from '@/client/enterprise/entities/client'

export interface ClientRepository {
  findOneById(id: string): Promise<Client | null>
  save(client: Client): Promise<void>
}
