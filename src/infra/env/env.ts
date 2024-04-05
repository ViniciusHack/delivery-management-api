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
});

export type Env = z.infer<typeof envSchema>;
