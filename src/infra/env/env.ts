import { z } from 'zod'

export const envSchema = z.object({
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  PRODUCT_API_URL: z
    .string()
    .url()
    .default('https://fakestoreapi.com/products'),
})

export type Env = z.infer<typeof envSchema>
