import { compareSync, hashSync } from 'bcrypt'

import { ValueObject } from '@/common/entities/value-object'

export interface PasswordProps {
  password: string
}

export class Password extends ValueObject<PasswordProps> {
  public static create({ password }: PasswordProps) {
    return new Password({
      password: hashSync(password, 10),
    })
  }

  public static hydrate(props: PasswordProps) {
    return new Password(props)
  }

  public get value() {
    return this.props.password
  }

  public compare(value: string) {
    return compareSync(value, this.props.password)
  }
}
