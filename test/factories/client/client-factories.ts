import { faker } from '@faker-js/faker'

import type { ClientHydrateProps } from '@/client/enterprise/entities/client'
import { Client } from '@/client/enterprise/entities/client'

export function createClientInstance({
  id,
  ...props
}: Partial<ClientHydrateProps & { id: string }> = {}) {
  return Client.hydrate(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      favoriteProducts: [],
      ...props,
    },
    id ?? faker.string.uuid(),
  )
}
