import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

import { ValueObject } from '../entities/value-object'

export interface JwtTokenProps<Data> {
  subject: string
  data: Data
  token: string
}

export interface JwtTokenCreationProps<Data> {
  subject: string
  data: Data
  expires: number
}

export class JwtToken<Data> extends ValueObject<
  Omit<JwtTokenProps<Data>, 'secret'>
> {
  public static readonly jwtCookieName = 'aiqfome-api-service-jwt'

  public static create<Dt extends object>({
    subject,
    data,
  }: JwtTokenCreationProps<Dt>) {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET is not set')
    }

    const expires = process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN)
      : 3600

    return new JwtToken<Dt>({
      subject,
      data,
      token: jwt.sign(data, secret, { subject, expiresIn: expires }),
    })
  }

  public static hydrate<Dt extends object>({
    token,
  }: Omit<JwtTokenProps<Dt>, 'data' | 'subject'>) {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET is not set')
    }

    const {
      sub,
      iat: _iat,
      ...data
    } = jwt.verify(token, secret) as JwtPayload & Dt

    return new JwtToken({
      token,
      subject: sub ?? '',
      data,
    })
  }

  public get token() {
    return this.props.token
  }

  public get subject() {
    return this.props.subject
  }

  public get data() {
    return this.props.data
  }
}
