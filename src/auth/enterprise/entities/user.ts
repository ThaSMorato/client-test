import { Entity } from '@/common/entities/entity'
import type { Optional } from '@/common/helpers/optional.type'
import { UniqueEntityID } from '@/common/value-objects/unique-entity-id'

import { Email } from '../object-values/email'
import { Password } from '../object-values/password'

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface UserInstaceProps {
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt?: Date
}

export interface UserProps {
  email: Email
  password: Password
  role: UserRole
  createdAt: Date
  updatedAt?: Date
}

export class User extends Entity<UserProps> {
  static create({
    email,
    password,
    ...props
  }: Optional<UserInstaceProps, 'createdAt'>) {
    return new User({
      ...props,
      email: Email.create({ email }),
      password: Password.create({ password }),
      createdAt: new Date(),
    })
  }

  static hydrate({ email, password, ...props }: UserInstaceProps, id: string) {
    return new User(
      {
        email: Email.hydrate({ email }),
        password: Password.hydrate({ password }),
        ...props,
      },
      new UniqueEntityID({ id }),
    )
  }

  get email() {
    return this.props.email.email
  }

  get password() {
    return this.props.password.value
  }

  get role() {
    return this.props.role
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public comparePassword(password: string) {
    return this.props.password.compare(password)
  }
}
