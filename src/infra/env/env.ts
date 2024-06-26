import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(8888),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  CLOUDFLARE_ACCOUNT: z.string(),
  S3_BUCKET_NAME: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  GEOAPIFY_KEY: z.string(),
  RESEND_API_KEY: z.string(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_DB: z.coerce.number().default(0),
});

export type Env = z.infer<typeof envSchema>;
