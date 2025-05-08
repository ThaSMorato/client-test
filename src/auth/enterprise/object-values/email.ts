import { z } from 'zod'

import { ValueObject } from '@/common/entities/value-object'

import { InvalidEmailError } from '../errors/invalid-email.error'

const emailSchema = z.string().email()

export interface EmailProps {
  email: string
}

export class Email extends ValueObject<EmailProps> {
  public static create({ email }: EmailProps) {
    const isAEmail = emailSchema.safeParse(email)

    if (isAEmail.error) {
      throw new InvalidEmailError()
    }

    return new Email({ email })
  }

  public static hydrate(props: EmailProps) {
    return new Email(props)
  }

  public get email() {
    return this.props.email
  }
}
