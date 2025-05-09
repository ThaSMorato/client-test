import { inject, injectable } from 'inversify'

import { UserRole } from '@/auth/enterprise/entities/user'
import { JwtToken } from '@/common/value-objects/jwt-token'

import { UserFactory } from '../auth/user-factories'

interface UserProps {
  id?: string
}

@injectable()
export class JwtMotherObject {
  constructor(
    @inject(UserFactory.name)
    private readonly userFactory: UserFactory,
  ) {}

  async createUserJwt({ id }: UserProps = {}) {
    const user = await this.userFactory.makePrismaUser({}, id)

    const jwt = JwtToken.create({
      subject: user.id.toString(),
      expires: 3600,
      data: { userId: user.id.toString() },
    })

    return jwt.token
  }

  async createAdminJwt({ id }: UserProps = {}) {
    const user = await this.userFactory.makePrismaUser(
      {
        role: UserRole.ADMIN,
      },
      id,
    )

    const jwt = JwtToken.create({
      subject: user.id.toString(),
      expires: 3600,
      data: { userId: user.id.toString() },
    })

    return jwt.token
  }
}
