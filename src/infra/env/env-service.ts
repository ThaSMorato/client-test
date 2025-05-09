import 'dotenv/config'

import { injectable } from 'inversify'

import type { Env } from './env'
import { envSchema } from './env'

@injectable()
export class EnvService {
  private env: Env

  constructor() {
    try {
      this.env = envSchema.parse(process.env)
    } catch (err) {
      console.error('Falha na validação .env:', err)
      process.exit(1)
    }
  }

  get<Key extends keyof Env>(key: Key) {
    return this.env[key]
  }
}
